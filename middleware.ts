import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIXES: Record<string, string> = {
  "/admin": "ADMIN",
  "/donor": "DONOR",
  "/hospital": "HOSPITAL",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((p) => pathname.startsWith(p));

  if (matchedPrefix) {
    if (!role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== ROLE_PREFIXES[matchedPrefix]) {
      // Logged in, but wrong role for this area — send them to their own dashboard.
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
    }
  }

  // Already logged in and visiting /login or /register — bounce to their dashboard.
  if ((pathname === "/login" || pathname === "/register") && role) {
    return NextResponse.redirect(new URL(`/${role.toLowerCase()}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/donor/:path*", "/hospital/:path*", "/login", "/register"],
};
