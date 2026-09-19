import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import styles from "./LegalPage.module.css";

// Marks text that still needs a real value filled in before this is legally final.
export function Placeholder({ children }) {
  return <span className={styles.placeholder}>{children}</span>;
}

export default function LegalPage({ title, updated, intro, children }) {
  return (
    <div className="site">
      <SiteHeader />
      <main>
        <article className={styles.wrap}>
          <div className="container">
            <div className={styles.head}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.updated}>Last updated: {updated}</p>
              {intro}
            </div>
            <div className={styles.body}>{children}</div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
