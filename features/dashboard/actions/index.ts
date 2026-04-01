"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth/session";

async function getAuthenticatedUser() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  return user;
}

export async function getDashboardStats() {
  const user = await getAuthenticatedUser();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const [total, newThisMonth, newThisWeek, latest] = await Promise.all([
    prisma.customer.count({ where: { userId: user.id } }),
    prisma.customer.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.customer.count({
      where: { userId: user.id, createdAt: { gte: startOfWeek } },
    }),
    prisma.customer.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { name: true, createdAt: true },
    }),
  ]);

  return { total, newThisMonth, newThisWeek, latest };
}
