import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/list/:path*", "/edit/:path*", "/api/file/:path*"],
};

export function proxy(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const authed = Boolean(token);

  if (!authed) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return Response.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
