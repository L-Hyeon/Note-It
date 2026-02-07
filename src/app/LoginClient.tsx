"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [pw, setPw] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => null);
        setPw("");
        setMsg(j?.error ?? "로그인에 실패했습니다.");
        return;
      }

      const next = sp.get("next") || "/list";
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setMsg(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.label} htmlFor="password">
        Password
      </label>

      <input
        id="password"
        className={styles.input}
        type="password"
        autoComplete="current-password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Enter password"
      />

      <button className={styles.button} type="submit" disabled={loading || !pw}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {msg ? (
        <div className={styles.msg} aria-live="polite">
          {msg}
        </div>
      ) : null}
    </form>
  );
}
