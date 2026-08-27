import styles from "./Field.module.css";

export function Field({ label, hint, error, children, htmlFor }) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export function Input({ error, className = "", ...rest }) {
  return (
    <input
      className={`${styles.control} ${error ? styles.controlError : ""} ${className}`}
      {...rest}
    />
  );
}

export function Textarea({ error, className = "", ...rest }) {
  return (
    <textarea
      className={`${styles.control} ${error ? styles.controlError : ""} ${className}`}
      {...rest}
    />
  );
}

export function Select({ error, className = "", children, ...rest }) {
  return (
    <select
      className={`${styles.control} ${error ? styles.controlError : ""} ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
