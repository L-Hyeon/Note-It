import styles from "./Footer.module.css";

type FooterProps = {
  filesRoot?: string;
  repoUrl?: string;
  version?: string;
};

export function Footer({
  repoUrl = "https://github.com/L-Hyeon/Note-It",
  version = "v0.1.0",
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.brand}>Note-It</div>
        <div className={styles.desc}>MD·TXT 에디터</div>
      </div>

      <div className={styles.right}>
        <div className={styles.line}>
          <span className={styles.meta}>{version}</span>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}>
            GitHub
          </a>
        </div>
        <span className={styles.meta}>Dev By LHyeon</span>
      </div>
    </footer>
  );
}
