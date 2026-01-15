import { AuthWidget } from "@/components/auth-widget";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <AuthWidget />
    </div>
  );
}