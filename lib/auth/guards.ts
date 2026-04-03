import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth/session";

export async function requireAdmin() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

export async function isLastAdmin(excludeId: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { role: "ADMIN", id: { not: excludeId } },
  });
  return count === 0;
}
