"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { formatDateOnly } from "@/lib/ids";
import styles from "./page.module.css";

export default function CenterExamsPage() {
  const { session } = useAuth();
  const { data: db, loading, error } = useAsyncData(getFullDb);
  const centerId = session?.centerId;

  if (loading || error || !db) {
    return (
      <DashboardShell
        navItems={CENTER_NAV}
        roleTag="Center owner"
        userMeta={session?.name}
        title="Exams"
        subtitle="Schedule exams from CertifyHub's question papers and assign your students."
      >
        <DataState loading={loading} error={error} />
      </DashboardShell>
    );
  }

  const exams = db.exams.filter((e) => e.centerId === centerId);

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Exams"
      subtitle="Schedule exams from CertifyHub's question papers and assign your students."
      actions={
        <Button href="/center/exams/new" size="sm">
          + Schedule exam
        </Button>
      }
    >
      {exams.length === 0 ? (
        <Card>
          <EmptyState
            icon="📝"
            title="No exams scheduled yet"
            description="Pick a question paper and a date to schedule your first exam."
            action={
              <Button size="sm" href="/center/exams/new">
                Schedule an exam
              </Button>
            }
          />
        </Card>
      ) : (
        <div className={styles.grid}>
          {exams.map((e) => {
            const attempts = db.attempts.filter((a) => a.examId === e.id);
            return (
              <Card key={e.id} className={styles.card}>
                <div className={styles.head}>
                  <div>
                    <div className={styles.title}>{e.title}</div>
                    <div className={styles.subject}>{e.subject}</div>
                  </div>
                  <Badge tone={e.status === "published" ? "success" : "neutral"}>{e.status}</Badge>
                </div>
                <div className={styles.metaRow}>
                  <span>📅 {formatDateOnly(e.date)}</span>
                  <span>❓ {e.questions.length} questions</span>
                  <span>⏱ {e.durationMinutes} min</span>
                  <span>🎯 Pass {e.passingMarks}/{e.questions.length}</span>
                </div>
                <div className={styles.footRow}>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-muted)" }}>
                    {e.status === "published" ? `${attempts.length} attempts` : "Not published"}
                  </span>
                  <Button href={`/center/exams/${e.id}`} variant="secondary" size="sm">
                    View
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
