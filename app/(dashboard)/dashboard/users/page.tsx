import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { UsersView } from "@/features/users";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { user } = await validateRequest();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return <UsersView searchParams={searchParams} />;
}
