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
  ext?: string; // 기본: ".md"
  ignoreHidden?: boolean; // 기본: true (".git" 같은 숨김 폴더 스킵)
  maxFiles?: number; // 기본: 20000 (안전장치)
};

async function walk(
  rootAbs: string,
  dirAbs: string,
  ext: string,
  ignoreHidden: boolean,
  out: FileListItem[],
  maxFiles: number,
) {
  const entries = await readdir(dirAbs, { withFileTypes: true });

  for (const ent of entries) {
    if (ignoreHidden && ent.name.startsWith(".")) continue;

    const abs = path.join(dirAbs, ent.name);

    if (ent.isDirectory()) {
      await walk(rootAbs, abs, ext, ignoreHidden, out, maxFiles);
      continue;
    }

    if (!ent.isFile()) continue;
    if (!ent.name.endsWith(ext)) continue;

    const st = await stat(abs);

    const rel = path.relative(rootAbs, abs).split(path.sep).join("/"); // Windows 구분자 방지
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
  const ext = options.ext ?? ".md";
  const ignoreHidden = options.ignoreHidden ?? true;
  const maxFiles = options.maxFiles ?? 20_000;

  const rootAbs = path.resolve(rootDir);

  const out: FileListItem[] = [];
  await walk(rootAbs, rootAbs, ext, ignoreHidden, out, maxFiles);

  out.sort((a, b) => a.path.localeCompare(b.path));
  return out;
}
