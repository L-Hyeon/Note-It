import LoginClient from "./LoginClient";
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
      <div className={styles.hint}>
        내부망/개인용 게이트입니다. 외부 공개 시 인증을 강화해 주세요.
      </div>
    </main>
  );
}
