import path from "node:path";
import { readFile } from "node:fs/promises";
import styles from "./page.module.css";
import { EditorClient } from "./EditorClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ path?: string[] }>;
};

const FILES_ROOT = process.env.FILES_ROOT ?? "/files";

function resolveUnderRoot(rootAbs: string, segments: string[]) {
  const resolved = path.resolve(rootAbs, ...segments);
  const prefix = rootAbs.endsWith(path.sep) ? rootAbs : rootAbs + path.sep;
  if (!(resolved + path.sep).startsWith(prefix))
    throw new Error("Forbidden path");
  return resolved;
}

export default async function EditPage({ params }: Props) {
  const { path: segments = [] } = await params;
  const relPath = segments.join("/");

  if (!relPath.endsWith(".md")) {
    return (
      <main className={styles.main}>
        <div className={styles.notice}>MarkDown 파일만 열 수 있습니다.</div>
      </main>
    );
  }

  const rootAbs = path.resolve(FILES_ROOT);
  const absPath = resolveUnderRoot(rootAbs, segments);
  const content = await readFile(absPath, "utf8");

  return (
    <main className={styles.main}>
      <EditorClient filePath={relPath} initialValue={content} />
    </main>
  );
}
