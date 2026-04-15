import "server-only";

import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export type FileListItem = {
  path: string; // 루트 기준 상대경로 (POSIX, 예: "a/b.md")
  absPath: string; // 절대경로 (예: "/files/a/b.md")
  mtimeMs: number;
  size: number;
};

export type GetFileListOptions = {
  rootDir?: string; // 기본: process.env.FILES_ROOT || "/files"
  exts?: string[]; // 기본: [".md"]
  ignoreHidden?: boolean; // 기본: true
  maxFiles?: number; // 기본: 20000
};

async function walk(
  rootAbs: string,
  dirAbs: string,
  exts: string[],
  ignoreHidden: boolean,
  out: FileListItem[],
  maxFiles: number,
) {
  const entries = await readdir(dirAbs, { withFileTypes: true });

  for (const ent of entries) {
    if (ignoreHidden && ent.name.startsWith(".")) continue;

    const abs = path.join(dirAbs, ent.name);

    if (ent.isDirectory()) {
      await walk(rootAbs, abs, exts, ignoreHidden, out, maxFiles);
      if (out.length >= maxFiles) return;
      continue;
    }

    if (!ent.isFile()) continue;

    const ext = path.extname(ent.name).toLowerCase();
    if (!exts.includes(ext)) continue;

    const st = await stat(abs);

    const rel = path.relative(rootAbs, abs).split(path.sep).join("/");
    out.push({
      path: rel,
      absPath: abs,
      mtimeMs: st.mtimeMs,
      size: st.size,
    });

    if (out.length >= maxFiles) return;
  }
}

export async function getFileList(
  options: GetFileListOptions = {},
): Promise<FileListItem[]> {
  const rootDir = options.rootDir ?? process.env.FILES_ROOT ?? "/files";
  const exts = (options.exts ?? [".md"]).map((v) => v.toLowerCase());
  const ignoreHidden = options.ignoreHidden ?? true;
  const maxFiles = options.maxFiles ?? 20_000;

  const rootAbs = path.resolve(rootDir);

  const out: FileListItem[] = [];
  await walk(rootAbs, rootAbs, exts, ignoreHidden, out, maxFiles);

  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}
