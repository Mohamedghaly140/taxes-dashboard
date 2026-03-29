"use server";

import { flattenError } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth/session";
import { customerSchema } from "@/lib/validations/customer.schema";

async function getAuthenticatedUser() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  return user;
}

export async function getCustomers() {
  const user = await getAuthenticatedUser();
  return prisma.customer.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCustomer(formData: FormData) {
  const user = await getAuthenticatedUser();

  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    emailPassword: formData.get("emailPassword"),
    username: formData.get("username"),
    fileNumber: formData.get("fileNumber"),
    taxRegistrationNumber: formData.get("taxRegistrationNumber"),
    nationalId: formData.get("nationalId"),
  });

  if (!parsed.success) {
    return { error: flattenError(parsed.error).fieldErrors };
  }

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

  if (duplicate) {
    return { error: { form: ["A customer with that file number, tax registration number, or national ID already exists"] } };
  }

  const customer = await prisma.customer.create({
    data: { ...data, userId: user.id },
  });

  return { success: true, customer };
}

export async function updateCustomer(id: string, formData: FormData) {
  const user = await getAuthenticatedUser();

  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return { error: { form: ["Customer not found"] } };
  }

  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    emailPassword: formData.get("emailPassword"),
    username: formData.get("username"),
    fileNumber: formData.get("fileNumber"),
    taxRegistrationNumber: formData.get("taxRegistrationNumber"),
    nationalId: formData.get("nationalId"),
  });

  if (!parsed.success) {
    return { error: flattenError(parsed.error).fieldErrors };
  }

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

  if (duplicate) {
    return { error: { form: ["A customer with that file number, tax registration number, or national ID already exists"] } };
  }

  const customer = await prisma.customer.update({ where: { id }, data });

  return { success: true, customer };
}

export async function deleteCustomer(id: string) {
  const user = await getAuthenticatedUser();

  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return { error: { form: ["Customer not found"] } };
  }

  await prisma.customer.delete({ where: { id } });

  return { success: true };
}
