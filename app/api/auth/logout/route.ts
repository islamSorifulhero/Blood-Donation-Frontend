import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, REFRESH_COOKIE } from "../_proxy";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  }).catch(() => undefined);

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
