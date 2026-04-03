import { prisma } from "@/lib/prisma";

export async function isLastAdmin(excludeId: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: { role: "ADMIN", id: { not: excludeId } },
  });
  return count === 0;
}
