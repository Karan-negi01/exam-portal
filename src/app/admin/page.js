"use client";

import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import CenterRequestCard from "@/components/admin/CenterRequestCard";
import { useDB } from "@/lib/useDB";
import styles from "./page.module.css";

export default function AdminOverviewPage() {
  const db = useDB();

  const pending = db.centers.filter((c) => c.status === "pending");
  const approved = db.centers.filter((c) => c.status === "approved");

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Admin overview"
      subtitle="Review center applications and keep an eye on the platform."
    >
      <div className={styles.stats}>
        <StatCard tone="amber" icon="⏳" value={pending.length} label="Pending applications" />
        <StatCard tone="green" icon="🏫" value={approved.length} label="Approved centers" />
        <StatCard tone="blue" icon="👥" value={db.students.length} label="Students enrolled" />
        <StatCard tone="indigo" icon="📝" value={db.exams.length} label="Exams created" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Pending applications</h2>
          <Link href="/admin/centers">View all centers →</Link>
        </div>

        {pending.length === 0 ? (
          <EmptyState
            icon="✅"
            title="You're all caught up"
            description="No pending center applications right now."
          />
        ) : (
          <div className={styles.list}>
            {pending.map((c) => (
              <CenterRequestCard key={c.id} center={c} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
