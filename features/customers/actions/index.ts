"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth/session";
import { customerSchema } from "@/lib/validations/customer.schema";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/shared/form/utils/to-action-state";

async function getAuthenticatedUser() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  return user;
}

const DUPLICATE_MSG =
  "A customer with that file number, tax registration number, or national ID already exists";

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

export async function createCustomer(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await getAuthenticatedUser();
    const parsed = customerSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) return fromErrorToActionState(parsed.error, formData);

    const data = parsed.data;

    const duplicate = await prisma.customer.findFirst({
      where: {
        OR: [
          { fileNumber: data.fileNumber },
          { taxRegistrationNumber: data.taxRegistrationNumber },
          { nationalId: data.nationalId },
        ],
      },
    });

    if (duplicate) return toActionState("ERROR", DUPLICATE_MSG, formData);

    await prisma.customer.create({ data: { ...data, userId: user.id } });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Customer added");
}

export async function updateCustomer(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id") as string;

  try {
    const user = await getAuthenticatedUser();

    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return toActionState("ERROR", "Customer not found");
    }

    const parsed = customerSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fromErrorToActionState(parsed.error, formData);

    const data = parsed.data;

    const duplicate = await prisma.customer.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { fileNumber: data.fileNumber },
              { taxRegistrationNumber: data.taxRegistrationNumber },
              { nationalId: data.nationalId },
            ],
          },
        ],
      },
    });

    if (duplicate) return toActionState("ERROR", DUPLICATE_MSG, formData);

    await prisma.customer.update({ where: { id }, data });
    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${id}`);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Customer updated");
}

export async function getCustomer(id: string) {
  const user = await getAuthenticatedUser();
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer || customer.userId !== user.id) return null;
  return customer;
}

export async function deleteCustomer(id: string): Promise<ActionState> {
  try {
    const user = await getAuthenticatedUser();

    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return toActionState("ERROR", "Customer not found");
    }

    await prisma.customer.delete({ where: { id } });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "Customer deleted");
}
