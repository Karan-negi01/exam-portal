"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import { Field, Input } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { scheduleExam } from "@/actions/exams";
import styles from "./page.module.css";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewExamPage() {
  const { session } = useAuth();
  const { data: db, loading, error: loadError } = useAsyncData(getFullDb);
  const router = useRouter();

  const [questionPaperId, setQuestionPaperId] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading || loadError || !db) {
    return (
      <DashboardShell
        navItems={CENTER_NAV}
        roleTag="Center owner"
        userMeta={session?.name}
        title="Schedule an exam"
        subtitle="Question papers are prepared by Skorex — just pick one, set a date, and assign your students."
      >
        <DataState loading={loading} error={loadError} />
      </DashboardShell>
    );
  }

  const papers = db.questionPapers;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!questionPaperId) return setError("Choose a question paper for this exam.");
    if (!date) return setError("Pick a date for the exam.");
    setError("");
    setSubmitting(true);
    const exam = await scheduleExam(session.centerId, { questionPaperId, date });
    router.push(`/center/exams/${exam.id}`);
  }

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Schedule an exam"
      subtitle="Question papers are prepared by Skorex — just pick one, set a date, and assign your students."
    >
      <form onSubmit={handleSubmit}>
        {error && <div className={styles.formError}>{error}</div>}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Choose a question paper</h2>
          <p className={styles.sectionSub}>
            These are built and maintained by the Skorex team. Each time you schedule a paper,
            a fresh random set of questions is drawn from its question bank.
          </p>

          {papers.length === 0 ? (
            <Card>
              <EmptyState
                icon="📚"
                title="No question papers available yet"
                description="Ask Skorex to publish a paper for your subject, then come back here."
              />
            </Card>
          ) : (
            <div className={styles.paperGrid}>
              {papers.map((p) => (
                <label
                  key={p.id}
                  className={`${styles.paperCard} ${questionPaperId === p.id ? styles.paperCardActive : ""}`}
                >
                  <input
                    type="radio"
                    name="paper"
                    value={p.id}
                    checked={questionPaperId === p.id}
                    onChange={() => setQuestionPaperId(p.id)}
                    hidden
                  />
                  <div className={styles.paperTitle}>{p.title}</div>
                  <div className={styles.paperSubject}>{p.subject}</div>
                  <div className={styles.paperMeta}>
                    <span>🎲 {p.questionsPerExam} of {p.questions.length} questions</span>
                    <span>⏱ {p.durationMinutes} min</span>
                    <span>🎯 Pass {p.passingMarks}/{p.questionsPerExam}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Pick an exam date</h2>
          <p className={styles.sectionSub}>When should students take this exam?</p>
          <Card className={styles.dateCard}>
            <Field label="Exam date">
              <Input type="date" min={today()} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </Card>
        </div>

        <div className={styles.submitRow}>
          <Button type="button" variant="secondary" onClick={() => router.push("/center/exams")}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Scheduling…" : "Continue → assign students"}
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
