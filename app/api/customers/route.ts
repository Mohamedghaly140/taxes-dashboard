import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await prisma.customer.findMany({ where: { userId: user.id } });
  return NextResponse.json(customers);
}