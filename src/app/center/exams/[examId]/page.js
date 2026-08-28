"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import CertificateDownloadButton from "@/components/certificate/CertificateDownloadButton";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { publishExam, deleteExam } from "@/lib/store";
import { formatDate, formatDateOnly, formatDateTime, getInitials } from "@/lib/ids";
import styles from "./page.module.css";

export default function ExamDetailPage({ params }) {
  const { examId } = use(params);
  const { session } = useAuth();
  const db = useDB();
  const router = useRouter();

  const exam = db.exams.find((e) => e.id === examId && e.centerId === session?.centerId);
  const students = db.students.filter((s) => s.centerId === session?.centerId);

  const [selectedIds, setSelectedIds] = useState([]);
  const [publishError, setPublishError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!exam) {
    return (
      <DashboardShell navItems={CENTER_NAV} roleTag="Center owner" userMeta={session?.name} title="Exam not found">
        <Card>
          <EmptyState icon="🔍" title="This exam doesn't exist" description="It may have been deleted." action={<Button href="/center/exams" size="sm">Back to exams</Button>} />
        </Card>
      </DashboardShell>
    );
  }

  function toggleSelected(id) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  function handlePublish() {
    if (selectedIds.length === 0) {
      setPublishError("Select at least one student to assign this exam to.");
      return;
    }
    setPublishError("");
    publishExam(exam.id, selectedIds);
  }

  function handleDelete() {
    deleteExam(exam.id);
    router.push("/center/exams");
  }

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title={exam.title}
      subtitle={exam.subject}
      actions={<Badge tone={exam.status === "published" ? "success" : "neutral"}>{exam.status}</Badge>}
    >
      <div className={styles.metaGrid}>
        <StatCard tone="indigo" icon="❓" value={exam.questions.length} label="Questions" />
        <StatCard tone="blue" icon="⏱️" value={`${exam.durationMinutes} min`} label="Timer" compact />
        <StatCard
          tone="amber"
          icon="🎯"
          value={`${exam.passingMarks}/${exam.questions.length}`}
          label="Passing marks"
          compact
        />
        <StatCard tone="teal" icon="📅" value={formatDateOnly(exam.date)} label="Scheduled date" compact />
      </div>

      {exam.status === "draft" ? (
        <div className={styles.section}>
          <Card>
            <h2 className={styles.sectionTitle}>Assign students & publish</h2>
            <p style={{ color: "var(--color-ink-soft)", fontSize: "0.9rem", marginTop: "6px" }}>
              Select which students can take this exam. Once published, they&apos;ll see it on their
              dashboard.
            </p>

            {students.length === 0 ? (
              <EmptyState
                icon="👥"
                title="No students to assign"
                description="Add students first before publishing an exam."
                action={<Button href="/center/students" size="sm">Add students</Button>}
              />
            ) : (
              <>
                <div className={styles.studentList}>
                  {students.map((s) => (
                    <label
                      className={`${styles.studentCheck} ${
                        selectedIds.includes(s.id) ? styles.studentCheckActive : ""
                      }`}
                      key={s.id}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s.id)}
                        onChange={() => toggleSelected(s.id)}
                      />
                      {s.name} <span style={{ color: "var(--color-muted)" }}>· {s.studentCode}</span>
                    </label>
                  ))}
                </div>
                {publishError && (
                  <p style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginBottom: 12 }}>
                    {publishError}
                  </p>
                )}
                <Button onClick={handlePublish}>Publish exam to {selectedIds.length || ""} student{selectedIds.length === 1 ? "" : "s"}</Button>
              </>
            )}
          </Card>

          <div className={styles.dangerZone} style={{ marginTop: 16 }}>
            <Button variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
              Delete draft
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Results</h2>
          </div>
          <Card padding="none">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Score</th>
                    <th>Result</th>
                    <th>Submitted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {exam.assignedStudentIds.map((studentId) => {
                    const student = students.find((s) => s.id === studentId);
                    if (!student) return null;
                    const attempt = db.attempts.find(
                      (a) => a.examId === exam.id && a.studentId === studentId
                    );
                    return (
                      <tr key={studentId}>
                        <td>
                          <div className={styles.nameWrap}>
                            <span className={styles.avatar}>{getInitials(student.name)}</span>
                            <span>
                              <strong>{student.name}</strong>{" "}
                              <span style={{ color: "var(--color-muted)" }}>· {student.studentCode}</span>
                            </span>
                          </div>
                        </td>
                        <td>{attempt ? `${attempt.score}/${attempt.totalMarks}` : "—"}</td>
                        <td>
                          {attempt ? (
                            <Badge tone={attempt.passed ? "success" : "danger"}>
                              {attempt.passed ? "Pass" : "Fail"}
                            </Badge>
                          ) : (
                            <Badge tone="neutral">Not attempted</Badge>
                          )}
                        </td>
                        <td>{attempt ? formatDateTime(attempt.submittedAt) : "—"}</td>
                        <td>
                          {attempt?.passed && (
                            <CertificateDownloadButton
                              data={{
                                studentName: student.name,
                                examTitle: exam.title,
                                subject: exam.subject,
                                centerName: session?.name,
                                score: attempt.score,
                                totalMarks: attempt.totalMarks,
                                dateStr: formatDate(attempt.submittedAt),
                                certId: attempt.id.replace("attempt_", "").toUpperCase(),
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete draft exam"
          message={`Delete "${exam.title}"? This can't be undone.`}
          confirmLabel="Delete"
          tone="danger"
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </DashboardShell>
  );
}
