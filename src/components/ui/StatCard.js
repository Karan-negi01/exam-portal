import styles from "./StatCard.module.css";

export default function StatCard({ icon, value, label, tone = "indigo", compact = false }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles[tone]}`}>{icon}</div>
      <div>
        <div className={`${styles.value} ${compact ? styles.valueCompact : ""}`}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}
