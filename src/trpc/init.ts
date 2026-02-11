import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { polarClient } from '@/lib/polar';
import superjson from "superjson"
export async function createTRPCContext(opts: { req: Request } | { req: any; res: any } | undefined = undefined) {
  // For API routes (fetch adapter)
  if (opts && 'req' in opts && opts.req && !(opts as any).res) {
    // Fetch adapter case - req is a Request object
    const session = await auth.api.getSession({
      headers: opts.req.headers
    });

    return {
      user: session?.user,
      session,
    };
  }

  // For Next.js API routes or server components
  if (opts && 'req' in opts && 'res' in opts) {
    // Next.js API route case
    const session = await auth.api.getSession({
      headers: opts.req.headers
    });

    return {
      user: session?.user,
      session,
    };
  }

  // For server components (pages) - no opts provided
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return {
    user: session?.user,
    session,
  };
}

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
    transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Public procedure - no authentication required
export const baseProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Now we know user is defined
    },
  });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {

    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.user.id,
      });

      if (
        !customer.activeSubscriptions ||
        customer.activeSubscriptions.length === 0
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Active subscription required',
        });
      }

      return next({ ctx: { ...ctx, customer } });
    } catch (error: any) {
      // If the Polar customer does not exist yet, treat it as "no active subscription"
      const isNotFound =
        error?.body?.error === 'ResourceNotFound' ||
        error?.error === 'ResourceNotFound' ||
        error?.status === 404;

      if (isNotFound) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Active subscription required',
        });
      }

      // Re-throw other unexpected errors as INTERNAL_SERVER_ERROR
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify subscription status',
        cause: error,
      });
    }
  }
)