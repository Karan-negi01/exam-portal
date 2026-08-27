import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: "🛡️",
    tone: "iconIndigo",
    title: "Verified centers only",
    text: "Every center is reviewed by our admin team — business proof, location and course type checked before going live.",
  },
  {
    icon: "🔑",
    tone: "iconAmber",
    title: "Individual student logins",
    text: "Each enrolled student gets a unique student ID and password issued automatically the moment they're added.",
  },
  {
    icon: "📝",
    tone: "iconGreen",
    title: "Type or upload MCQs",
    text: "Build question papers by typing them directly into the platform, organised by subject — no separate software needed.",
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
        <div className={styles.head}>
          <div className={styles.kicker}>Features</div>
          <h2 className={styles.heading}>Everything a center needs to go digital</h2>
          <p className={styles.desc}>
            No more manual paperwork, spreadsheets, or handwritten certificates.
          </p>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <div className={styles.card} key={f.title}>
              <div className={`${styles.icon} ${styles[f.tone]}`}>{f.icon}</div>
              <h3 className={styles.title}>{f.title}</h3>
              <p className={styles.text}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
