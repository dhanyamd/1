import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { cache } from 'react';

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
  // transformer: superjson,
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