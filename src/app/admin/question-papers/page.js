"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { useDB } from "@/lib/useDB";
import { deleteQuestionPaper } from "@/lib/store";
import { formatDate } from "@/lib/ids";
import { useState } from "react";
import styles from "./page.module.css";

export default function AdminQuestionPapersPage() {
  const db = useDB();
  const [deleting, setDeleting] = useState(null);
  const papers = db.questionPapers;

  const usedPaperIds = new Set(db.exams.map((e) => e.questionPaperId));

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Question papers"
      subtitle="Build the official MCQ papers that centers can schedule for their students."
      actions={
        <Button href="/admin/question-papers/new" size="sm">
          + Create question paper
        </Button>
      }
    >
      {papers.length === 0 ? (
        <Card>
          <EmptyState
            icon="📚"
            title="No question papers yet"
            description="Create your first paper so centers can start scheduling exams."
            action={
              <Button size="sm" href="/admin/question-papers/new">
                Create a question paper
              </Button>
            }
          />
        </Card>
      ) : (
        <div className={styles.grid}>
          {papers.map((p) => (
            <Card key={p.id} className={styles.card}>
              <div className={styles.head}>
                <div>
                  <div className={styles.title}>{p.title}</div>
                  <div className={styles.subject}>{p.subject}</div>
                </div>
              </div>
              <div className={styles.metaRow}>
                <span>
                  🎲 {p.questionsPerExam} of {p.questions.length} per exam
                </span>
                <span>⏱ {p.durationMinutes} min</span>
                <span>
                  🎯 Pass {p.passingMarks}/{p.questionsPerExam}
                </span>
              </div>
              <div className={styles.footRow}>
                <span style={{ fontSize: "0.82rem", color: "var(--color-muted)" }}>
                  Added {formatDate(p.createdAt)}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button size="sm" variant="secondary" href={`/admin/question-papers/${p.id}/edit`}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleting(p)}
                    disabled={usedPaperIds.has(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete question paper"
          message={`Delete "${deleting.title}"? Centers won't be able to schedule it anymore.`}
          confirmLabel="Delete"
          tone="danger"
          onConfirm={() => {
            deleteQuestionPaper(deleting.id);
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </DashboardShell>
  );
}
