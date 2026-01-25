import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * Requires authentication for a page or route.
 * If the user is not authenticated, redirects them to the auth modal page.
 * 
 * @returns The session object if authenticated
 * @throws Redirects to "/" if not authenticated
 */
export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/");
  }

  return session;
}
