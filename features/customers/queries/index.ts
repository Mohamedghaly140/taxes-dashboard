import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function getCustomers({
  search = "",
  page = 1,
  limit = 5,
}: { search?: string; page?: number; limit?: number } = {}) {
  const user = await getAuthenticatedUser();

  const where = {
    userId: user.id,
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ]);

  return { customers, total, pageCount: Math.ceil(total / limit) };
}

export async function getCustomer(id: string) {
  const user = await getAuthenticatedUser();
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer || customer.userId !== user.id) return null;
  return customer;
}
