import Reveal from "./Reveal";
import styles from "./FAQSection.module.css";

const FAQS = [
  {
    q: "Is my center verified before it goes live?",
    a: "Yes. Every application is reviewed by our admin team — we check your PAN card, location and course types before your center is published and can enroll students.",
  },
  {
    q: "How does the Seat Pack pricing work?",
    a: "You pay ₹200 per student when you list your center, choosing how many seats you need. That Seat Pack is valid for 1 year — unused seats expire after that, but you can buy another Seat Pack anytime to keep enrolling students.",
  },
  {
    q: "How do students log in?",
    a: "Once you add a student, the platform generates a password and sends it to their phone via SMS. Students log in by selecting your center and entering their phone number and that password.",
  },
  {
    q: "Who creates the question papers?",
    a: "Skorex does. Our team prepares MCQ question papers for every subject, each with its own timer and passing marks already set. Centers simply pick a paper, choose an exam date, and assign it to their students.",
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
        <Reveal className={styles.head}>
          <div className={styles.kicker}>FAQ</div>
          <h2 className={styles.heading}>Common questions</h2>
        </Reveal>

        <div className={styles.list}>
          {FAQS.map((f, i) => (
            <Reveal as="details" className={styles.item} key={f.q} delay={i * 60}>
              <summary>
                {f.q}
                <span className={styles.plus}>+</span>
              </summary>
              <p className={styles.answer}>{f.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
