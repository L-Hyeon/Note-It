"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ThemeChanger.module.css";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  // 최초 1회: 저장값 → 없으면 시스템 설정
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const initial = saved ?? getSystemTheme();
    setTheme(initial);
    setMounted(true);
  }, []);

  // theme 변경 시: html[data-theme] + localStorage 반영
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const isDark = useMemo(() => theme === "dark", [theme]);

  if (!mounted) return null;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="테마 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={styles.switch}>
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  );
}
