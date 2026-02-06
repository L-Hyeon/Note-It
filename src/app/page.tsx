import { List } from "@/components/List/List";
import { getFileList } from "@/lib/server/getFileList";
import styles from "./page.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Page() {
  const files = await getFileList({ rootDir: "/codeserver/Note", ext: ".md" });

  const fmt = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const items = files.map((f) => ({
    path: f.path,
    mtimeMs: fmt.format(new Date(f.mtimeMs)),
    size: f.size,
  }));

  return (
    <main>
      <h2 className={styles.title}>File Editor</h2>
      <List items={items} />
    </main>
  );
}
