"use client";

import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import DataState from "@/components/ui/DataState";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { seatsRemaining, isQuotaExpired, daysUntilExpiry } from "@/lib/pricing";
import styles from "./page.module.css";

export default function CenterOverviewPage() {
  const { session } = useAuth();
  const { data: db, loading, error } = useAsyncData(getFullDb);
  const centerId = session?.centerId;

  if (loading || error || !db) {
    return (
      <DashboardShell
        navItems={CENTER_NAV}
        roleTag="Center owner"
        userMeta={session?.name}
        title="Center overview"
        subtitle="Track your students, exams and results at a glance."
      >
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

  const center = db.centers.find((c) => c.id === centerId);
  const students = db.students.filter((s) => s.centerId === centerId);
  const exams = db.exams.filter((e) => e.centerId === centerId);
  const examIds = new Set(exams.map((e) => e.id));
  const attempts = db.attempts.filter((a) => examIds.has(a.examId));
  const passed = attempts.filter((a) => a.passed).length;
  const passRate = attempts.length ? Math.round((passed / attempts.length) * 100) : 0;
  const remaining = center ? seatsRemaining(center.quota, students.length) : 0;
  const quotaExpired = center ? isQuotaExpired(center.quota) : false;
  const daysLeft = center ? daysUntilExpiry(center.quota) : null;
  const lowSeats = !quotaExpired && remaining > 0 && remaining <= 2;
  const expiringSoon = !quotaExpired && daysLeft !== null && daysLeft <= 30;

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Center overview"
      subtitle="Track your students, exams and results at a glance."
      actions={
        <Button href="/center/exams/new" size="sm">
          + Schedule exam
        </Button>
      }
    >
      {quotaExpired && (
        <div className={`${styles.alertBanner} ${styles.alertDanger}`}>
          ⚠️ Your seat quota has expired.{" "}
          <Link href="/center/students">Buy a new Seat Pack →</Link>
        </div>
      )}
      {!quotaExpired && lowSeats && (
        <div className={`${styles.alertBanner} ${styles.alertWarning}`}>
          🎟️ Only {remaining} seat{remaining === 1 ? "" : "s"} left in your quota.{" "}
          <Link href="/center/students">Buy more →</Link>
        </div>
      )}
      {!quotaExpired && !lowSeats && expiringSoon && (
        <div className={`${styles.alertBanner} ${styles.alertWarning}`}>
          ⏳ Your seat quota expires in {daysLeft} day{daysLeft === 1 ? "" : "s"}.{" "}
          <Link href="/center/students">Manage seats →</Link>
        </div>
      )}

      <div className={styles.stats}>
        <StatCard tone="blue" icon="👥" value={`${students.length}/${center?.quota?.seats ?? 0}`} label="Seats used" />
        <StatCard tone="green" icon="🎟️" value={remaining} label="Seats remaining" />
        <StatCard tone="indigo" icon="📝" value={exams.length} label="Exams scheduled" />
        <StatCard tone="amber" icon="🏅" value={`${passRate}%`} label="Pass rate" />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Your exams</h2>
          <Link href="/center/exams">Manage exams →</Link>
        </div>

        <Card padding="none">
          {exams.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No exams scheduled yet"
              description="Pick a question paper and a date to schedule your first exam."
              action={
                <Button href="/center/exams/new" size="sm">
                  Schedule an exam
                </Button>
              }
            />
          ) : (
            exams.slice(0, 5).map((e) => {
              const examAttempts = db.attempts.filter((a) => a.examId === e.id);
              return (
                <div className={styles.examRow} key={e.id}>
                  <div>
                    <div className={styles.examName}>{e.title}</div>
                    <div className={styles.examMeta}>
                      {e.subject} · {e.questions.length} questions · {e.durationMinutes} min
                    </div>
                  </div>
                  <div className={styles.examRight}>
                    <Badge tone={e.status === "published" ? "success" : "neutral"}>
                      {e.status === "published" ? `${examAttempts.length} attempts` : "Draft"}
                    </Badge>
                    <Button href={`/center/exams/${e.id}`} variant="secondary" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
