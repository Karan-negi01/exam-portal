"use client";

import { use } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { formatDateTime } from "@/lib/ids";
import styles from "./page.module.css";

export default function ResultPage({ params }) {
  const { attemptId } = use(params);
  const { session } = useAuth();
  const { data: db, loading, error } = useAsyncData(getFullDb);

  if (loading || error || !db) {
    return (
      <div className={styles.wrap}>
        <DataState loading={loading} error={error} />
      </div>
    );
  }

  const attempt = db.attempts.find((a) => a.id === attemptId && a.studentId === session?.id);
  const exam = attempt && db.exams.find((e) => e.id === attempt.examId);
  const center = exam && db.centers.find((c) => c.id === exam.centerId);

  if (!attempt || !exam) {
    return (
      <div className={styles.wrap}>
        <Card className={styles.card}>
          <EmptyState icon="🔍" title="Result not found" action={<Button href="/student" size="sm">Back to dashboard</Button>} />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>Exam submitted</h1>
        <p className={styles.subtitle}>
          {exam.title} · Submitted {formatDateTime(attempt.submittedAt)}
        </p>

        <div className={styles.note}>
          Your answers have been sent to {center?.name || "your center"}. They&apos;ll let you know how
          you did, and share your certificate with you if you&apos;ve passed.
        </div>

        {attempt.focusViolations > 0 && (
          <div className={styles.cheatNote}>
            ⚠️ You left the exam view (switched tabs or exited fullscreen) {attempt.focusViolations}{" "}
            time{attempt.focusViolations === 1 ? "" : "s"} — this was recorded and is visible to
            your center.
          </div>
        )}

        <div className={styles.actions}>
          <Button href="/student" variant="secondary" size="lg">
            Back to dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
