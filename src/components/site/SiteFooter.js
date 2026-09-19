import Link from "next/link";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <div className={styles.brand}>
              <span className={styles.brandMark}>🎓</span>
              Skorex
            </div>
            <p className={styles.blurb}>
              The exam and certification platform for training centers — verify centers, run
              online MCQ exams, and issue certificates without the paperwork.
            </p>
          </div>

          <div>
            <div className={styles.colTitle}>Platform</div>
            <div className={styles.colLinks}>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#features">Features</Link>
              <Link href="/#faq">FAQ</Link>
              <Link href="/apply">List your center</Link>
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Login</div>
            <div className={styles.colLinks}>
              <Link href="/login">Center owner login</Link>
              <Link href="/login">Student login</Link>
              <Link href="/login">Admin login</Link>
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Contact</div>
            <div className={styles.colLinks}>
              <a href="mailto:hello@skorex.in">hello@skorex.in</a>
              <span>Mon–Sat, 10am–7pm IST</span>
            </div>
          </div>

          <div>
            <div className={styles.colTitle}>Legal</div>
            <div className={styles.colLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Conditions</Link>
              <Link href="/refund-policy">Refund &amp; Cancellation</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Skorex. All rights reserved.</span>
          <span>Built for training centers across India</span>
        </div>
      </div>
    </footer>
  );
}
