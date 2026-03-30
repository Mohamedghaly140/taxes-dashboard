"use server";

import { hash, verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, invalidateSession, validateRequest } from "@/lib/auth/session";
import { registerSchema, loginSchema } from "@/lib/validations/auth.schema";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/shared/form/utils/to-action-state";

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function register(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return fromErrorToActionState(parsed.error, formData);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return toActionState("ERROR", "Email already in use", formData);
    }

    const passwordHash = await hash(password, ARGON2_OPTIONS);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    await createSession(user.id);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect("/dashboard");
}

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return fromErrorToActionState(parsed.error, formData);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return toActionState("ERROR", "Invalid email or password", formData);
    }

    const validPassword = await verify(user.passwordHash, password, ARGON2_OPTIONS);
    if (!validPassword) {
      return toActionState("ERROR", "Invalid email or password", formData);
    }

    await createSession(user.id);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect("/dashboard");
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");

  await invalidateSession(session.id);
  redirect("/login");
}
