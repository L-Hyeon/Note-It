import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";

export const runtime = "nodejs";

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}) as any);

  const correct = process.env.APP_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";

  if (!correct || !secret) {
    return NextResponse.json(
      { ok: false, error: "Server not configured" },
      { status: 500 },
    );
  }

  if (typeof password !== "string" || password !== correct) {
    return NextResponse.json(
      { ok: false, error: "Invalid password" },
      { status: 401 },
    );
  }

  const payload = `ok.${Date.now()}`;
  const token = `${payload}.${sign(payload, secret)}`;

  const cookieStore = await cookies(); // ✅ await
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
