import Link from "next/link";
import styles from "./RolesSection.module.css";

const ROLES = [
  {
    badge: "Admin",
    tone: "badgeAdmin",
    title: "Platform admin",
    points: [
      "Review new center applications and PAN card details",
      "Approve or reject centers before they go live",
      "Build the official MCQ question papers centers schedule from",
    ],
    link: "/login",
    linkLabel: "Admin login →",
  },
  {
    badge: "Center owner",
    tone: "badgeCenter",
    title: "Training center",
    points: [
      "List your center, choose a Seat Pack, and get verified",
      "Enroll students — each gets their own ID and password",
      "Schedule exams from Skorex's ready-made question papers",
      "Download certificates for every student who passes",
    ],
    link: "/apply",
    linkLabel: "List your center →",
  },
  {
    badge: "Student",
    tone: "badgeStudent",
    title: "Enrolled student",
    points: [
      "Log in with your center, phone number and password",
      "Take timed exams from your dashboard",
      "See your score and pass/fail result instantly",
    ],
    link: "/login",
    linkLabel: "Student login →",
  },
];

export default function RolesSection() {
  return (
    <section id="roles" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div className={styles.kicker}>Who it&apos;s for</div>
          <h2 className={styles.heading}>One platform, three roles, zero paperwork</h2>
          <p className={styles.desc}>Each role gets a dashboard built for exactly what they need to do.</p>
        </div>

        <div className={styles.grid}>
          {ROLES.map((r) => (
            <div className={styles.card} key={r.title}>
              <span className={`${styles.badge} ${styles[r.tone]}`}>{r.badge}</span>
              <h3 className={styles.title}>{r.title}</h3>
              <div className={styles.list}>
                {r.points.map((p) => (
                  <div className={styles.listItem} key={p}>
                    <span className={styles.tick}>✓</span>
                    {p}
                  </div>
                ))}
              </div>
              <Link href={r.link} className={styles.link}>
                {r.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
