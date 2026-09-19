import Link from "next/link";
import { LogoMark } from "./Logo";
import styles from "./FormShell.module.css";

const POINTS = [
  { icon: "🛡️", text: "Every center is verified by our admin team before going live" },
  { icon: "🔑", text: "Students get individual login credentials, issued instantly" },
  { icon: "🏅", text: "Certificates generate automatically the moment a student passes" },
];

export default function FormShell({ title, subtitle, maxWidth, children }) {
  return (
    <div className={styles.page}>
      <aside className={styles.side}>
        <span className={styles.sideGlow1} />
        <span className={styles.sideGlow2} />

        <Link href="/" className={styles.brand}>
          <LogoMark size={32} />
          Skorex
        </Link>

        <div className={styles.sideBody}>
          <h2 className={styles.sideHeading}>Run exams. Issue certificates. Without the paperwork.</h2>
          <p className={styles.sideText}>
            The exam and certification platform built for training centers.
          </p>
          <div className={styles.sidePoints}>
            {POINTS.map((p) => (
              <div className={styles.sidePoint} key={p.text}>
                <span className={styles.sidePointIcon}>{p.icon}</span>
                {p.text}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sideFoot}>© {new Date().getFullYear()} Skorex</div>
      </aside>

      <div className={styles.wrap}>
        <div className={styles.card} style={maxWidth ? { "--card-max": maxWidth } : undefined}>
          <Link href="/" className={styles.mobileBrand}>
            <LogoMark size={28} />
            Skorex
          </Link>

          {(title || subtitle) && (
            <div className={styles.head}>
              {title && <h1 className={styles.title}>{title}</h1>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
