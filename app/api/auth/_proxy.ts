import { NextResponse } from "next/server";
import { extractCookieValue } from "@/lib/cookie-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const REFRESH_COOKIE = "rakto_refresh"; // first-party cookie name on THIS (frontend) domain

/**
 * Calls an Express auth endpoint server-to-server (no CORS involved), and if it sets a
 * refresh-token cookie, re-issues it as our own first-party httpOnly cookie. Returns
 * the backend's JSON body as-is so the client gets the same {success,message,data}
 * shape it would from calling the backend directly.
 */
export async function proxyAuthRequest(backendPath: string, body: unknown) {
  const upstream = await fetch(`${API_BASE_URL}${backendPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  const payload = await upstream.json().catch(() => ({ success: false, message: "Invalid response from API", errors: [] }));

  const setCookie = upstream.headers.get("set-cookie");
  const refreshToken = extractCookieValue(setCookie, "refreshToken");

  const response = NextResponse.json(payload, { status: upstream.status });

  if (refreshToken) {
    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days — matches backend JWT_REFRESH_EXPIRES_IN default
    });
  }

  return response;
}

export { API_BASE_URL, REFRESH_COOKIE };
