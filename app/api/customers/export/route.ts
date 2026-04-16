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

  const FORMULA_CHARS = /^[=+\-@\t\r]/;

  function escapeCell(value: string): string {
    // Prefix formula-starting values to prevent CSV injection in spreadsheet apps
    const safe = FORMULA_CHARS.test(value) ? `'${value}` : value;
    if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
      return `"${safe.replace(/"/g, '""')}"`;
    }
    return safe;
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
