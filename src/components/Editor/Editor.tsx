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
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  toolbar?: boolean;
  defaultMode?: Mode;
};

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
    });

    const editor = instance as unknown as OvertypeInstance;
    instRef.current = editor;

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

    return () => {
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
