import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Sidebar } from "@/features/dashboard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
