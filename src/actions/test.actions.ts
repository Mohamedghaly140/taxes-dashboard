"use server";

import { prisma } from "@/src/lib/db";

export async function testDatabaseConnection() {
  const count = await prisma.user.count();
  return { success: true, userCount: count };
}
