import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    num: "01",
    tag: "Center owner + Admin",
    title: "Apply, choose a Seat Pack & get verified",
    desc: "Submit your center's details and PAN card, pick how many student seats you need, and our admin team reviews your application before you go live.",
  },
  {
    num: "02",
    tag: "Center owner",
    title: "Schedule exams & enroll students",
    desc: "Add students to get them individual login IDs and passwords. Pick one of CertifyHub's ready-made question papers, set a date, and assign it to your students.",
  },
  {
    num: "03",
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
          {STEPS.map((s) => (
            <div className={styles.step} key={s.title}>
              <div className={styles.stepNum}>{s.num}</div>
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
