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
  const emailVerified = token?.emailVerified === true;
  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-request");

  const isVerificationPage =
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/verification-pending");

  const isDashboard =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/devis") ||
    pathname.startsWith("/factures") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/aide") ||
    pathname.startsWith("/export");

  // Not logged in trying to access dashboard -> redirect to login
  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Logged in but email not verified trying to access dashboard -> redirect to verification pending
  if (isDashboard && isLoggedIn && !emailVerified) {
    return NextResponse.redirect(new URL("/verification-pending", req.nextUrl));
  }

  // Logged in with unverified email on auth pages -> redirect to verification pending
  if (isAuthPage && isLoggedIn && !emailVerified) {
    return NextResponse.redirect(new URL("/verification-pending", req.nextUrl));
  }

  // Logged in with verified email trying to access verification page -> redirect to dashboard
  if (isVerificationPage && isLoggedIn && emailVerified) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Logged in with verified email trying to access auth pages -> redirect to dashboard
  if ((isAuthPage || pathname === "/") && isLoggedIn && emailVerified) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
