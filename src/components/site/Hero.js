import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.blobPrimary} />
      <div className={styles.blobAccent} />
      <div className={`container ${styles.grid}`}>
        <div>
          <span className={styles.eyebrow}>✦ Built for offline training centers</span>
          <h1 className={styles.title}>
            Run exams. Issue certificates.{" "}
            <span className={styles.titleAccent}>Without the paperwork.</span>
          </h1>
          <p className={styles.subtitle}>
            Skorex is where verified training centers enroll students, run timed MCQ exams
            online, and generate professional certificates — every result auto-graded, every
            certificate ready in seconds.
          </p>
          <div className={styles.ctaRow}>
            <Button href="/apply" size="lg">
              List your center →
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>●</span> Admin-verified centers only
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>●</span> Individual student logins
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>●</span> Instant certificate generation
            </span>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.mockCard}>
            <div className={styles.mockCardBar}>
              <div className={styles.mockDots}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.mockBadge}>Exam closed</span>
            </div>

            <div className={styles.mockBody}>
              <div className={styles.mockRow}>
                <span className={styles.mockRowLabel}>
                  <span className={styles.mockAvatar}>AI</span>
                  Ananya Iyer
                </span>
                <span className={`${styles.mockScore} ${styles.pass}`}>8/10 · Pass</span>
              </div>
              <div className={styles.mockRow}>
                <span className={styles.mockRowLabel}>
                  <span className={styles.mockAvatar}>VS</span>
                  Vikram Singh
                </span>
                <span className={`${styles.mockScore} ${styles.fail}`}>4/10 · Fail</span>
              </div>
              <div className={styles.mockRow}>
                <span className={styles.mockRowLabel}>
                  <span className={styles.mockAvatar}>FS</span>
                  Fatima Sheikh
                </span>
                <span className={styles.mockScore} style={{ color: "var(--color-muted)" }}>
                  Not attempted
                </span>
              </div>
            </div>
          </div>

          <div className={styles.chipCert}>
            <span className={styles.chipEmoji}>🏅</span>
            <div>
              <div className={styles.chipTitle}>Certificate ready</div>
              <div className={styles.chipSub}>Ananya Iyer · Tally ERP 9</div>
            </div>
          </div>

          <div className={styles.chipVerified}>
            <span className={styles.chipDot} />
            Center verified by admin
          </div>
        </div>
      </div>
    </section>
  );
}
