import LoginClient from "../components/LoginClient/LoginClient";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.title}>Note‑It</div>
        <div className={styles.subtitle}>비밀번호를 입력해 주세요.</div>
        <LoginClient />
      </div>
    </main>
  );
}
