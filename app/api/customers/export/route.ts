import { validateRequest } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user } = await validateRequest();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const customers = await prisma.customer.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const HEADERS = [
    "ID",
    "Name",
    "Email",
    "Email Password",
    "Username",
    "Portal Password",
    "File Number",
    "Tax Registration Number",
    "National ID",
    "Created At",
    "Updated At",
  ];

  function escapeCell(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  const rows = customers.map((c) =>
    [
      c.id,
      c.name,
      c.email,
      c.emailPassword,
      c.username,
      c.portalPassword,
      c.fileNumber,
      c.taxRegistrationNumber,
      c.nationalId,
      c.createdAt.toISOString(),
      c.updatedAt.toISOString(),
    ]
      .map(escapeCell)
      .join(",")
  );

  const csv = [HEADERS.join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="customers.csv"',
    },
  });
}
