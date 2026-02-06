import { NextResponse } from "next/server";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILES_ROOT = process.env.FILES_ROOT ?? "/files";

function toFsPath(segments: string[]) {
  const rel = segments.join("/");

  if (!rel.endsWith(".md")) {
    return { ok: false as const, status: 400, error: "Only .md is allowed" };
  }

  const base = path.resolve(FILES_ROOT);
  const resolved = path.resolve(base, ...segments);

  // 디렉토리 트래버설 방지: resolved가 base 하위인지 검사
  const prefix = base.endsWith(path.sep) ? base : base + path.sep;
  if (!(resolved + path.sep).startsWith(prefix)) {
    return { ok: false as const, status: 403, error: "Forbidden path" };
  }

  return { ok: true as const, rel, resolved };
}

type Ctx = { params: Promise<{ path?: string[] }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { path: segments = [] } = await ctx.params;
    const r = toFsPath(segments);

    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: r.error },
        { status: r.status },
      );
    }

    const content = await readFile(r.resolved, "utf8");
    return NextResponse.json({ ok: true, path: r.rel, content });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { path: segments = [] } = await ctx.params;
    const r = toFsPath(segments);

    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: r.error },
        { status: r.status },
      );
    }

    const body = (await req.json()) as { content?: string };
    if (typeof body.content !== "string") {
      return NextResponse.json(
        { ok: false, error: "content(string) is required" },
        { status: 400 },
      );
    }

    await writeFile(r.resolved, body.content, "utf8");
    return NextResponse.json({ ok: true, path: r.rel });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: String(e?.message ?? e) },
      { status: 500 },
    );
  }
}
