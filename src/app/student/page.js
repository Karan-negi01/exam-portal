"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { STUDENT_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { formatDateTime } from "@/lib/ids";
import styles from "./page.module.css";

export default function StudentDashboardPage() {
  const { session } = useAuth();
  const db = useDB();
  const studentId = session?.id;

  const assignedExams = db.exams.filter(
    (e) => e.status === "published" && e.assignedStudentIds.includes(studentId)
  );
  const attempts = db.attempts.filter((a) => a.studentId === studentId);
  const attemptedExamIds = new Set(attempts.map((a) => a.examId));
  const pendingExams = assignedExams.filter((e) => !attemptedExamIds.has(e.id));
  const passed = attempts.filter((a) => a.passed).length;

  return (
    <DashboardShell
      navItems={STUDENT_NAV}
      roleTag="Student"
      userMeta={session?.centerName}
      title={`Welcome, ${session?.name?.split(" ")[0]}`}
      subtitle="Here are your exams and results."
    >
      <div className={styles.stats}>
        <StatCard tone="indigo" icon="📝" value={pendingExams.length} label="Exams pending" />
        <StatCard tone="blue" icon="🧾" value={attempts.length} label="Exams completed" />
        <StatCard tone="amber" icon="🏅" value={passed} label="Certificates earned" />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Available exams</h2>
        {pendingExams.length === 0 ? (
          <Card>
            <EmptyState icon="🎉" title="You're all caught up" description="No pending exams right now — check back later." />
          </Card>
        ) : (
          <div className={styles.grid}>
            {pendingExams.map((e) => (
              <Card key={e.id} className={styles.card}>
                <div className={styles.cardTitle}>{e.title}</div>
                <div className={styles.cardSub}>{e.subject}</div>
                <div className={styles.metaRow}>
                  <span>❓ {e.questions.length} questions</span>
                  <span>⏱ {e.durationMinutes} min</span>
                  <span>🎯 Pass {e.passingMarks}/{e.questions.length}</span>
                </div>
                <Button href={`/student/exam/${e.id}`}>Start exam</Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your results</h2>
        <Card padding="none">
          {attempts.length === 0 ? (
            <EmptyState icon="📊" title="No results yet" description="Results appear here once you complete an exam." />
          ) : (
            attempts
              .slice()
              .reverse()
              .map((a) => {
                const exam = db.exams.find((e) => e.id === a.examId);
                if (!exam) return null;
                return (
                  <div className={styles.resultRow} key={a.id}>
                    <div>
                      <div className={styles.resultTitle}>{exam.title}</div>
                      <div className={styles.resultSub}>Submitted {formatDateTime(a.submittedAt)}</div>
                    </div>
                    <div className={styles.resultRight}>
                      <span>{a.score}/{a.totalMarks}</span>
                      <Badge tone={a.passed ? "success" : "danger"}>{a.passed ? "Pass" : "Fail"}</Badge>
                      <Button href={`/student/result/${a.id}`} variant="secondary" size="sm">
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
