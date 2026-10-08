import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, REFRESH_COOKIE } from "../_proxy";
import { extractCookieValue } from "@/lib/cookie-utils";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false, message: "No refresh token", errors: [] }, { status: 401 });
  }

  const upstream = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await upstream.json().catch(() => ({ success: false, message: "Invalid response from API", errors: [] }));
  const response = NextResponse.json(payload, { status: upstream.status });

  const setCookie = upstream.headers.get("set-cookie");
  const newRefreshToken = extractCookieValue(setCookie, "refreshToken");
  if (newRefreshToken) {
    response.cookies.set(REFRESH_COOKIE, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
  } else if (upstream.status === 401) {
    response.cookies.delete(REFRESH_COOKIE);
  }

  return response;
}