import { NextRequest, NextResponse } from "next/server";

// Middleware runs on the Edge runtime — cannot import Prisma or Lucia here.
// We only check for the session cookie's presence; full DB validation happens
// in the dashboard layout via validateRequest().
const SESSION_COOKIE_NAME = "auth_session";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
