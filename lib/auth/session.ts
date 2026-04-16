import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { lucia } from "./lucia";
import type { Session, User } from "lucia";

type ValidateRequestResult =
  | { user: User; session: Session }
  | { user: null; session: null };

export const validateRequest = cache(async (): Promise<ValidateRequestResult> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) return { user: null, session: null };

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session?.fresh) {
      const cookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(cookie.name, cookie.value, cookie.attributes);
    }
    if (!result.session) {
      const cookie = lucia.createBlankSessionCookie();
      cookieStore.set(cookie.name, cookie.value, cookie.attributes);
    }
  } catch {
    // cookies().set() throws during RSC rendering — safe to ignore
  }

  return result;
});

export async function getAuthenticatedUser() {
  const { user } = await validateRequest();
  if (!user) redirect("/login");
  return user;
}

export async function createSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const cookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, cookie.value, cookie.attributes);
  return session;
}

export async function invalidateSession(sessionId: string) {
  await lucia.invalidateSession(sessionId);
  const cookie = lucia.createBlankSessionCookie();
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, cookie.value, cookie.attributes);
}
