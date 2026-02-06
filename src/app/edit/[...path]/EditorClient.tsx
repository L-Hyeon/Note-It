"use client";

import * as React from "react";
import Link from "next/link";
import { Editor } from "@/components/Editor/Editor";
import styles from "./page.module.css";

type Props = {
  filePath: string;
  initialValue: string;
};

function toApiHref(filePath: string) {
  const encoded = filePath.split("/").map(encodeURIComponent).join("/");
  return `/api/file/${encoded}`;
}

export function EditorClient({ filePath, initialValue }: Props) {
  const [value, setValue] = React.useState(initialValue);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const savedRef = React.useRef(initialValue);
  const dirty = value !== savedRef.current;

  const clearTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    };
  }, []);

  async function onSave() {
    try {
      setSaving(true);
      setMsg("");

      const r = await fetch(toApiHref(filePath), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value }),
      });

      const j = await r.json();
      if (!j.ok) throw new Error(j.error ?? "Save failed");

      savedRef.current = value;
      setMsg("저장되었습니다.");

      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = window.setTimeout(() => setMsg(""), 900);
    } catch (e: any) {
      setMsg(`저장 실패: ${String(e?.message ?? e)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.left}>
          <Link href="/" className={[styles.action, styles.backLink].join(" ")}>
            ← Back
          </Link>
        </div>

        <div className={styles.center}>
          <div className={styles.title}>
            {filePath}
            {dirty ? " *" : ""}
          </div>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={[
              styles.action,
              styles.saveButton,
              dirty ? styles.saveEnabled : "",
            ].join(" ")}
            onClick={onSave}
            disabled={saving || !dirty}>
            {saving ? "Saving..." : "✓ Save"}
          </button>
        </div>
      </div>

      {msg ? (
        <div className={styles.saveMsg} aria-live="polite">
          {msg}
        </div>
      ) : null}

      <div className={styles.editorWrap}>
        <Editor value={value} toolbar={true} onChange={setValue} />
      </div>
    </section>
  );
}
