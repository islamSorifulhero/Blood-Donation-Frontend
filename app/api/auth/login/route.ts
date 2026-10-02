import { NextRequest } from "next/server";
import { proxyAuthRequest } from "../_proxy";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return proxyAuthRequest("/auth/login", body);
}
