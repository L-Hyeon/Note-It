import styles from "./Footer.module.css";

type FooterProps = {
  filesRoot?: string;
  repoUrl?: string;
};

export function Footer({
  filesRoot = process.env.FILES_ROOT ?? "/files",
  repoUrl = "https://github.com/L-Hyeon/Note-It",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div>Note-It By L-Hyeon</div>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}>
        GitHub
      </a>
    </footer>
  );
}
