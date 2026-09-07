"use client";

import { use } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { formatDate, formatDateTime, getInitials } from "@/lib/ids";
import styles from "./page.module.css";

export default function StudentDetailPage({ params }) {
  const { studentId } = use(params);
  const { session } = useAuth();
  const db = useDB();

  const student = db.students.find((s) => s.id === studentId && s.centerId === session?.centerId);

  if (!student) {
    return (
      <DashboardShell navItems={CENTER_NAV} roleTag="Center owner" userMeta={session?.name} title="Student not found">
        <Card>
          <EmptyState
            icon="🔍"
            title="This student doesn't exist"
            description="They may have been removed."
            action={<Button href="/center/students" size="sm">Back to students</Button>}
          />
        </Card>
      </DashboardShell>
    );
  }

  const attempts = db.attempts
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const passed = attempts.filter((a) => a.passed).length;
  const passRate = attempts.length ? Math.round((passed / attempts.length) * 100) : 0;

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title={student.name}
      subtitle={`${student.studentCode} · ${student.phone}`}
      actions={<Button href="/center/students" variant="secondary" size="sm">← Back to students</Button>}
    >
      <div className={styles.stats}>
        <StatCard tone="indigo" icon="📝" value={attempts.length} label="Exams attempted" />
        <StatCard tone="green" icon="🏅" value={passed} label="Exams passed" />
        <StatCard tone="amber" icon="🎯" value={`${passRate}%`} label="Pass rate" />
        <StatCard tone="blue" icon="📅" value={formatDate(student.createdAt)} label="Enrolled since" compact />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Exam history</h2>
        {attempts.length === 0 ? (
          <Card>
            <EmptyState icon="📊" title="No exams attempted yet" />
          </Card>
        ) : (
          <Card padding="none">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Result</th>
                    <th>Submitted</th>
                    <th>Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => {
                    const exam = db.exams.find((e) => e.id === a.examId);
                    return (
                      <tr key={a.id}>
                        <td>
                          <div className={styles.nameWrap}>
                            <span className={styles.avatar}>{getInitials(exam?.title || "?")}</span>
                            <span>
                              <strong>{exam?.title || "Deleted exam"}</strong>{" "}
                              <span style={{ color: "var(--color-muted)" }}>· {exam?.subject}</span>
                            </span>
                          </div>
                        </td>
                        <td>{a.score}/{a.totalMarks}</td>
                        <td>
                          <Badge tone={a.passed ? "success" : "danger"}>{a.passed ? "Pass" : "Fail"}</Badge>
                        </td>
                        <td>{formatDateTime(a.submittedAt)}</td>
                        <td>
                          {a.focusViolations > 0 ? (
                            <Badge tone="danger">⚠️ {a.focusViolations}</Badge>
                          ) : (
                            <span style={{ color: "var(--color-muted)" }}>0</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
