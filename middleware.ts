import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function verify(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length < 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const sig = parts.slice(2).join(".");
  return sign(payload, secret) === sig;
}

export function middleware(req: NextRequest) {
  const secret = process.env.SESSION_SECRET ?? "";
  const token = req.cookies.get("session")?.value ?? "";

  const authed = secret && token && verify(token, secret);

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/list/:path*", "/edit/:path*", "/api/file/:path*"],
};
