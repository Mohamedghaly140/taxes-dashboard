"use server";

import { cookies } from "next/headers";

export const setCookieByKey = async (name: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
};

export const getCookieByKey = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

export const deleteCookieByKey = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
