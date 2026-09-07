"use client";

import { use } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { formatDateTime } from "@/lib/ids";
import styles from "./page.module.css";

export default function ResultPage({ params }) {
  const { attemptId } = use(params);
  const { session } = useAuth();
  const db = useDB();

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
        <div className={`${styles.icon} ${attempt.passed ? styles.iconPass : styles.iconFail}`}>
          {attempt.passed ? "🎉" : "😕"}
        </div>
        <h1 className={styles.title}>{attempt.passed ? "You passed!" : "Not quite there"}</h1>
        <p className={styles.subtitle}>
          {exam.title} · Submitted {formatDateTime(attempt.submittedAt)}
        </p>

        <div className={styles.scoreRow}>
          <div className={styles.scoreItem}>
            <div className={styles.scoreValue}>
              {attempt.score}/{attempt.totalMarks}
            </div>
            <div className={styles.scoreLabel}>Score</div>
          </div>
          <div className={styles.scoreItem}>
            <div className={styles.scoreValue}>{exam.passingMarks}</div>
            <div className={styles.scoreLabel}>Passing marks</div>
          </div>
        </div>

        {attempt.passed ? (
          <div className={styles.note}>
            🏅 Congratulations, you passed! Contact {center?.name} to get your certificate.
          </div>
        ) : (
          <div className={styles.note}>
            You didn&apos;t meet the passing marks this time. Reach out to {center?.name} about
            reattempting.
          </div>
        )}

        <div className={styles.note}>📩 A copy of this result was sent to your phone.</div>

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
