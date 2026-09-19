import Reveal from "./Reveal";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: "🛡️",
    tone: "iconIndigo",
    title: "Verified centers only",
    text: "Every center is reviewed by our admin team — PAN card, location and course types checked before going live.",
  },
  {
    icon: "🔑",
    tone: "iconAmber",
    title: "Phone-based student logins",
    text: "Each enrolled student logs in with their own phone number and an auto-generated password, sent to them the moment they're added.",
  },
  {
    icon: "📚",
    tone: "iconGreen",
    title: "Ready-made question papers",
    text: "Skorex prepares the MCQ question papers for every subject — centers just pick one, set a date, and assign students.",
  },
  {
    icon: "⏱️",
    tone: "iconIndigo",
    title: "Timed, auto-submitted exams",
    text: "Set the exact duration for each exam. A live countdown keeps students on track and auto-submits when time's up.",
  },
  {
    icon: "✅",
    tone: "iconAmber",
    title: "Auto-graded, instant results",
    text: "Set your own passing marks. Scores are calculated the moment a student submits — no manual checking required.",
  },
  {
    icon: "🏅",
    tone: "iconGreen",
    title: "Instant certificates",
    text: "Every passing result generates a downloadable certificate with your center's name, the student's name and the course.",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.kicker}>Features</div>
          <h2 className={styles.heading}>Everything a center needs to go digital</h2>
          <p className={styles.desc}>
            No more manual paperwork, spreadsheets, or handwritten certificates.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <Reveal as="div" className={styles.card} key={f.title} delay={(i % 3) * 100}>
              <div className={`${styles.icon} ${styles[f.tone]}`}>{f.icon}</div>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.text}>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
