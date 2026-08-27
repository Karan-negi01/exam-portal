import styles from "./FAQSection.module.css";

const FAQS = [
  {
    q: "Is my center verified before it goes live?",
    a: "Yes. Every application is reviewed by our admin team — we check your business proof, location and course type before your center is published and can enroll students.",
  },
  {
    q: "How do students log in?",
    a: "Once you add a student, the platform generates a unique student ID and password. Students log in by selecting your center and entering that ID and password.",
  },
  {
    q: "Can I upload questions or type them in myself?",
    a: "Both. You can type MCQ questions directly into the exam builder, organised by subject, with four options and a marked correct answer for each.",
  },
  {
    q: "Who sets the exam timer and passing marks?",
    a: "You do. When creating an exam, you choose the duration in minutes and the minimum marks needed to pass — the platform grades every attempt against that automatically.",
  },
  {
    q: "How are certificates generated?",
    a: "The moment a student passes, a certificate carrying the platform name, your center's name and the student's name is ready to download from your dashboard.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.kicker}>FAQ</div>
          <h2 className={styles.heading}>Common questions</h2>
        </div>

        <div className={styles.list}>
          {FAQS.map((f) => (
            <details className={styles.item} key={f.q}>
              <summary>
                {f.q}
                <span className={styles.plus}>+</span>
              </summary>
              <p className={styles.answer}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
