"use client";

import * as React from "react";
import OverType from "overtype";
import styles from "./Editor.module.css";

type Mode = "normal" | "plain" | "preview";

type OvertypeInstance = {
  getValue?: () => string;
  setValue?: (v: string) => void;
  destroy?: () => void;
  showPlainTextarea?: (visible: boolean) => void;
  showPreviewMode?: (visible: boolean) => void;
  setTheme?: (
    theme: string | { name: string; colors: Record<string, string> },
  ) => void;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  toolbar?: boolean;
  defaultMode?: Mode;
};

function getAppTheme(): "light" | "dark" {
  const t = document.documentElement.dataset.theme;
  return t === "dark" ? "dark" : "light";
}

/**
 * OverType 커스텀 테마(프로젝트 팔레트 반영)
 * - light: white + #6D5B7B
 * - dark : near-black + #E6D9FF
 */
const otLightTheme = {
  name: "planit-light",
  colors: {
    bgPrimary: "#ffffff",
    bgSecondary: "#f7f7fb",
    text: "#14121a",
    h1: "#6d5b7b",
    h2: "#6d5b7b",
    h3: "#6d5b7b",
    link: "#6d5b7b",
  },
};

const otDarkTheme = {
  name: "planit-dark",
  colors: {
    bgPrimary: "#141414",
    bgSecondary: "#0a0a0a",
    text: "#f3f0ff",
    h1: "#e6d9ff",
    h2: "#e6d9ff",
    h3: "#e6d9ff",
    link: "#e6d9ff",
  },
};

function pickOvertypeTheme() {
  return getAppTheme() === "dark" ? otDarkTheme : otLightTheme;
}

export function Editor({
  value,
  onChange,
  toolbar = true,
  defaultMode = "plain",
}: Props) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const instRef = React.useRef<OvertypeInstance | null>(null);

  React.useEffect(() => {
    if (!hostRef.current) return;

    const [instance] = OverType.init(hostRef.current, {
      value,
      toolbar,
      onChange: (v: string) => onChange(v),
      theme: pickOvertypeTheme(),
    });

    const editor = instance as unknown as OvertypeInstance;
    instRef.current = editor;

    // 초기 모드
    if (defaultMode === "plain") {
      editor.showPreviewMode?.(false);
      editor.showPlainTextarea?.(true);
    } else if (defaultMode === "preview") {
      editor.showPlainTextarea?.(false);
      editor.showPreviewMode?.(true);
    } else {
      editor.showPlainTextarea?.(false);
      editor.showPreviewMode?.(false);
    }

    // 테마 토글 감지: html[data-theme] 변경 시 OverType 테마 갱신
    const applyTheme = () => {
      instRef.current?.setTheme?.(pickOvertypeTheme());
    };

    const obs = new MutationObserver(applyTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      obs.disconnect();
      instRef.current?.destroy?.();
      instRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const inst = instRef.current;
    if (!inst?.getValue || !inst?.setValue) return;

    const cur = inst.getValue() ?? "";
    if (cur !== value) inst.setValue(value);
  }, [value]);

  return <div ref={hostRef} className={styles.editor} />;
}
