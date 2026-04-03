import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";

export async function getUsers({
  search = "",
  page = 1,
  limit = 5,
}: { search?: string; page?: number; limit?: number } = {}) {
  await requireAdmin();

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        _count: { select: { customers: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, pageCount: Math.ceil(total / limit) };
}
