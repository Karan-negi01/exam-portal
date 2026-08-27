"use client";

import { use } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import CertificateDownloadButton from "@/components/certificate/CertificateDownloadButton";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { formatDate, formatDateTime } from "@/lib/ids";
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
            🏅 Congratulations! Your certificate is ready — download it below or get a copy from{" "}
            {center?.name}.
          </div>
        ) : (
          <div className={styles.note}>
            You didn&apos;t meet the passing marks this time. Reach out to {center?.name} about
            reattempting.
          </div>
        )}

        <div className={styles.actions}>
          {attempt.passed && (
            <CertificateDownloadButton
              size="lg"
              data={{
                studentName: session.name,
                examTitle: exam.title,
                subject: exam.subject,
                centerName: center?.name || "",
                score: attempt.score,
                totalMarks: attempt.totalMarks,
                dateStr: formatDate(attempt.submittedAt),
                certId: attempt.id.replace("attempt_", "").toUpperCase(),
              }}
            />
          )}
          <Button href="/student" variant="secondary" size="lg">
            Back to dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
