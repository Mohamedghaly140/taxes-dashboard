"use server";

import { flattenError } from "zod";
import { hash, verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, invalidateSession, validateRequest } from "@/lib/auth/session";
import { registerSchema, loginSchema } from "@/lib/validations/auth.schema";

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: flattenError(parsed.error).fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: { email: ["Email already in use"] } };
  }

  const passwordHash = await hash(password, ARGON2_OPTIONS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: flattenError(parsed.error).fieldErrors };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: { email: ["Invalid email or password"] } };
  }

  const validPassword = await verify(user.passwordHash, password, ARGON2_OPTIONS);
  if (!validPassword) {
    return { error: { email: ["Invalid email or password"] } };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  const { session } = await validateRequest();
  if (!session) redirect("/login");

  await invalidateSession(session.id);
  redirect("/login");
}
