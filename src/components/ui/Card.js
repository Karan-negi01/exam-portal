import styles from "./Card.module.css";

export default function Card({ padding = "padded", className = "", children, ...rest }) {
  return (
    <div className={`${styles.card} ${styles[padding] || ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}
