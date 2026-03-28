"use server";

import { prisma } from "@/lib/prisma";

export async function testDatabaseConnection() {
  const count = await prisma.user.count();
  return { success: true, userCount: count };
}
