"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getInitials } from "@/lib/ids";
import styles from "./DashboardShell.module.css";

export default function DashboardShell({ navItems, roleTag, userMeta, title, subtitle, actions, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>🎓</span>
          CertifyHub
        </div>
        <div className={styles.roleTag}>{roleTag}</div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>{getInitials(session?.name)}</div>
            <div>
              <div className={styles.userName}>{session?.name}</div>
              <div className={styles.userMeta}>{userMeta}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            ↩ Log out
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.content}>
          {(title || actions) && (
            <div className={styles.pageHeader}>
              <div>
                {title && <h1 className={styles.pageTitle}>{title}</h1>}
                {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
              </div>
              {actions}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
