import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.glow2} />
      <div className={`container ${styles.grid}`}>
        <div>
          <span className={styles.eyebrow}>✦ Built for offline training centers</span>
          <h1 className={styles.title}>
            Run exams. Issue certificates.
            <br />
            <span className={styles.titleAccent}>All without the paperwork.</span>
          </h1>
          <p className={styles.subtitle}>
            CertifyHub is where verified training centers enroll students, run timed MCQ exams
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
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span />
                <span />
                <span />
              </div>
              <span className={styles.mockBadge}>Exam closed</span>
            </div>

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

          <div className={styles.floatCert}>
            <div className={styles.floatCertTop}>🏅 CERTIFICATE</div>
            <div className={styles.floatCertName}>Ananya Iyer</div>
            <div className={styles.floatCertSub}>Tally ERP 9 Foundation · Bright Academy</div>
          </div>
        </div>
      </div>
    </section>
  );
}
