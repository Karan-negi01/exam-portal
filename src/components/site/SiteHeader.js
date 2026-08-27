"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import styles from "./SiteHeader.module.css";

const LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#roles", label: "Who it's for" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>🎓</span>
          CertifyHub
        </Link>

        <nav className={styles.nav}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button href="/login" variant="ghost" size="sm" className={styles.desktopOnly}>
            Log in
          </Button>
          <Button href="/apply" variant="primary" size="sm" className={styles.desktopOnly}>
            List your center
          </Button>
          <button className={styles.menuBtn} onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <div className={`container ${styles.mobilePanel}`}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={styles.navLink} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" className={styles.navLink} onClick={() => setOpen(false)}>
            Log in
          </Link>
          <Button href="/apply" variant="primary" size="sm" onClick={() => setOpen(false)}>
            List your center
          </Button>
        </div>
      )}
    </header>
  );
}
