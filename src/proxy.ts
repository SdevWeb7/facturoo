import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secureCookieName = "__Secure-authjs.session-token";
const devCookieName = "authjs.session-token";

export async function proxy(req: NextRequest) {
  const isSecure = req.nextUrl.protocol === "https:";
  const cookieName = isSecure ? secureCookieName : devCookieName;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  });
  const isLoggedIn = !!token;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-request");

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/devis") ||
    pathname.startsWith("/factures") ||
    pathname.startsWith("/settings");

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if ((isAuthPage || pathname === "/") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
