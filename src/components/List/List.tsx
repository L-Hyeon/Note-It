"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import styles from "./List.module.css";

export type ListItem = {
  path: string;
  mtimeMs?: string;
  size?: number;
};

type Props = {
  items: ListItem[];
  selectedPath?: string;
  onSelect?: (path: string) => void;
};

function toEditHref(filePath: string) {
  const encoded = filePath.split("/").map(encodeURIComponent).join("/");
  return `/edit/${encoded}`;
}

const itemVariants = {
  hidden: { opacity: 0, y: -8, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      type: "spring" as const,
      stiffness: 520,
      damping: 38,
    },
  }),
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.12 },
  },
} satisfies Variants;

export function List({ items, selectedPath, onSelect }: Props) {
  return (
    <motion.ul layout className={styles.list}>
      <AnimatePresence>
        {items.map((it, index) => {
          const selected = it.path === selectedPath;

          const hasMeta =
            typeof it.size === "number" || typeof it.mtimeMs === "string";

          return (
            <motion.li
              key={it.path}
              layout
              className={styles.item}
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="show"
              exit="exit">
              <Link
                href={toEditHref(it.path)}
                onClick={() => onSelect?.(it.path)}
                className={[
                  styles.button,
                  selected ? styles.buttonSelected : "",
                ].join(" ")}>
                <div className={styles.path}>{it.path}</div>

                {hasMeta && (
                  <div className={styles.meta}>
                    {typeof it.size === "number" ? `${it.size} bytes` : ""}
                    {typeof it.size === "number" &&
                    typeof it.mtimeMs === "string"
                      ? " · "
                      : ""}
                    {typeof it.mtimeMs === "string" ? it.mtimeMs : ""}
                  </div>
                )}
              </Link>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}
