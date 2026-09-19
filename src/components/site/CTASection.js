import Button from "@/components/ui/Button";
import Reveal from "./Reveal";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal as="div" className={styles.panel}>
          <div className={styles.text}>
            <h2 className={styles.title}>Ready to take your center online?</h2>
            <p className={styles.desc}>
              Apply in a few minutes. Once our admin verifies your center, you can start enrolling
              students and running exams the same day.
            </p>
          </div>
          <div className={styles.actions}>
            <Button href="/apply" size="lg" className={styles.whiteBtn}>
              List your center →
            </Button>
            <Button href="/login" size="lg" variant="secondary" className={styles.outlineBtn}>
              I already have an account
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
