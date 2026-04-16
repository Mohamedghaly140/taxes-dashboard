"use server";

import { hash } from "@node-rs/argon2";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isLastAdmin } from "@/lib/auth/guards";
import { ARGON2_OPTIONS } from "@/lib/auth/constants";
import { createUserSchema, updateUserSchema, updateProfileSchema } from "@/lib/validations/user.schema";
import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/shared/form/utils/to-action-state";

export async function createUser(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  try {
    const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fromErrorToActionState(parsed.error, formData);

    const { name, email, password, role, status } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return toActionState("ERROR", "Email already in use", formData);

    const passwordHash = await hash(password, ARGON2_OPTIONS);
    await prisma.user.create({ data: { name, email, passwordHash, role, status } });

    revalidatePath("/dashboard/users");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "User created");
}

export async function updateUser(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    const id = formData.get("id");
    if (!id || typeof id !== "string") return toActionState("ERROR", "User not found");

    if (id === admin.id) {
      return toActionState("ERROR", "Cannot edit your own account here. Use the Profile page.");
    }

    const parsed = updateUserSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fromErrorToActionState(parsed.error, formData);

    const { name, email, password, role, status } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return toActionState("ERROR", "User not found");

    if (existing.role === "ADMIN" && role === "CLIENT") {
      if (await isLastAdmin(id)) {
        return toActionState("ERROR", "Cannot demote the last admin account");
      }
    }

    const emailTaken = await prisma.user.findFirst({
      where: { email, id: { not: id } },
    });
    if (emailTaken) return toActionState("ERROR", "Email already in use", formData);

    const updateData: Parameters<typeof prisma.user.update>[0]["data"] = {
      name,
      email,
      role,
      status,
    };

    if (password) {
      updateData.passwordHash = await hash(password, ARGON2_OPTIONS);
    }

    await prisma.user.update({ where: { id }, data: updateData });
    revalidatePath("/dashboard/users");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "User updated");
}

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  try {
    const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fromErrorToActionState(parsed.error, formData);

    const { name, email, password } = parsed.data;

    const emailTaken = await prisma.user.findFirst({
      where: { email, id: { not: user.id } },
    });
    if (emailTaken) return toActionState("ERROR", "Email already in use", formData);

    const updateData: Parameters<typeof prisma.user.update>[0]["data"] = { name, email };

    if (password) {
      updateData.passwordHash = await hash(password, ARGON2_OPTIONS);
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });
    revalidatePath("/dashboard/profile");
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Profile updated");
}

export async function deleteUser(id: string): Promise<ActionState> {
  const admin = await requireAdmin();

  try {
    if (id === admin.id) {
      return toActionState("ERROR", "Cannot delete your own account");
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return toActionState("ERROR", "User not found");

    if (existing.role === "ADMIN" && (await isLastAdmin(id))) {
      return toActionState("ERROR", "Cannot delete the last admin account");
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/users");
  } catch (error) {
    return fromErrorToActionState(error);
  }

  return toActionState("SUCCESS", "User deleted");
}
