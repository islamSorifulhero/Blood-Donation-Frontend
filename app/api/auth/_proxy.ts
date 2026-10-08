import { NextResponse } from "next/server";
import { extractCookieValue } from "@/lib/cookie-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
const REFRESH_COOKIE = "rakto_refresh";

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
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  return response;
}

export { API_BASE_URL, REFRESH_COOKIE };
