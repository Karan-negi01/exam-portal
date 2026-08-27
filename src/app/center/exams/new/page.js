"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { CENTER_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import QuestionCard from "@/components/center/QuestionCard";
import { useAuth } from "@/lib/auth";
import { createExam } from "@/lib/store";
import styles from "./page.module.css";

function emptyQuestion() {
  return { text: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function NewExamPage() {
  const { session } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingMarks, setPassingMarks] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState("");

  function updateQuestion(i, next) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? next : q)));
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, emptyQuestion()]);
  }

  function removeQuestion(i) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  }

  function validate() {
    if (!title.trim()) return "Give the exam a title.";
    if (!subject.trim()) return "Enter a subject for the exam.";
    if (!durationMinutes || durationMinutes < 1) return "Set a valid timer duration.";
    const passing = Number(passingMarks);
    if (!passingMarks || passing < 1) return "Enter the passing marks.";
    if (passing > questions.length) return "Passing marks can't exceed the number of questions.";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return `Question ${i + 1} needs question text.`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} needs all four options filled in.`;
    }
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const exam = createExam(session.centerId, {
      title: title.trim(),
      subject: subject.trim(),
      durationMinutes: Number(durationMinutes),
      passingMarks: Number(passingMarks),
      questions,
    });
    router.push(`/center/exams/${exam.id}`);
  }

  return (
    <DashboardShell
      navItems={CENTER_NAV}
      roleTag="Center owner"
      userMeta={session?.name}
      title="Create a new exam"
      subtitle="Type in your MCQ questions, set the timer and passing marks."
    >
      <form onSubmit={handleSubmit}>
        {error && <div className={styles.formError}>{error}</div>}

        <Card className={styles.section}>
          <div className={styles.grid}>
            <Field label="Exam title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tally ERP 9 Foundation" />
            </Field>
            <Field label="Subject">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Accounting Software" />
            </Field>
          </div>
          <div className={styles.grid}>
            <Field label="Timer (minutes)">
              <Input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </Field>
            <Field label="Passing marks" hint={`Out of ${questions.length} question${questions.length === 1 ? "" : "s"}`}>
              <Input
                type="number"
                min="1"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
                placeholder="e.g. 6"
              />
            </Field>
          </div>
        </Card>

        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Questions ({questions.length})</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
              + Add question
            </Button>
          </div>

          <div className={styles.questions}>
            {questions.map((q, i) => (
              <QuestionCard
                key={i}
                index={i}
                question={q}
                onChange={(next) => updateQuestion(i, next)}
                onRemove={() => removeQuestion(i)}
                removable={questions.length > 1}
              />
            ))}
          </div>
        </div>

        <div className={styles.submitRow}>
          <Button type="button" variant="secondary" onClick={() => router.push("/center/exams")}>
            Cancel
          </Button>
          <Button type="submit">Save exam</Button>
        </div>
      </form>
    </DashboardShell>
  );
}
