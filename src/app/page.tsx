import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthWidget } from "@/components/auth-widget";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If authenticated, redirect to workflows
  if (session) {
    redirect("/workflows");
  }

  // Show auth widget for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AuthWidget />
    </div>
  );
}
