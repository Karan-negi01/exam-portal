import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    tag: "Center owner + Admin",
    title: "Apply & get verified",
    desc: "Submit your center's name, business proof, location and course type. Our admin team reviews and approves genuine centers before they go live on the platform.",
  },
  {
    tag: "Center owner",
    title: "Enroll students & build exams",
    desc: "Add students to get them individual login IDs and passwords. Create MCQ question papers by uploading or typing them in — set the timer and passing marks yourself.",
  },
  {
    tag: "Student",
    title: "Take the exam & get certified",
    desc: "Students log in with their center, ID and password, take the timed exam, and get instant results. Centers download a ready-made certificate for every student who passes.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.kicker}>How it works</div>
          <h2 className={styles.heading}>From application to certificate in three steps</h2>
          <p className={styles.desc}>
            Everything your center needs to run exams online — verified, timed, and auto-graded.
          </p>
        </div>

        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div className={styles.step} key={s.title}>
              <div className={styles.stepNum}>{i + 1}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
              <span className={styles.stepTag}>{s.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
