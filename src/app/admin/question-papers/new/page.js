"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ADMIN_NAV } from "@/components/dashboard/navConfig";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import QuestionCard from "@/components/shared/QuestionCard";
import { createQuestionPaper } from "@/lib/store";
import styles from "./page.module.css";

function emptyQuestion() {
  return { text: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function NewQuestionPaperPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questionsPerExam, setQuestionsPerExam] = useState("");
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
    if (!title.trim()) return "Give the paper a title.";
    if (!subject.trim()) return "Enter a subject for the paper.";
    if (!durationMinutes || durationMinutes < 1) return "Set a valid timer duration.";
    const perExam = Number(questionsPerExam);
    if (!questionsPerExam || perExam < 1) return "Enter how many questions each exam should draw.";
    if (perExam > questions.length) {
      return "Questions per exam can't exceed the number of questions in the bank.";
    }
    const passing = Number(passingMarks);
    if (!passingMarks || passing < 1) return "Enter the passing marks.";
    if (passing > perExam) return "Passing marks can't exceed the questions drawn per exam.";
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
    createQuestionPaper({
      title: title.trim(),
      subject: subject.trim(),
      durationMinutes: Number(durationMinutes),
      questionsPerExam: Number(questionsPerExam),
      passingMarks: Number(passingMarks),
      questions,
    });
    router.push("/admin/question-papers");
  }

  return (
    <DashboardShell
      navItems={ADMIN_NAV}
      roleTag="Platform admin"
      userMeta="Full platform access"
      title="Create a question paper"
      subtitle="This becomes available for every center to schedule for their students."
    >
      <form onSubmit={handleSubmit}>
        {error && <div className={styles.formError}>{error}</div>}

        <Card className={styles.section}>
          <div className={styles.grid}>
            <Field label="Paper title">
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
            <Field
              label="Questions per exam"
              hint={`Randomly drawn from your ${questions.length}-question bank each time this is scheduled`}
            >
              <Input
                type="number"
                min="1"
                value={questionsPerExam}
                onChange={(e) => setQuestionsPerExam(e.target.value)}
                placeholder="e.g. 50"
              />
            </Field>
            <Field
              label="Passing marks"
              hint={`Out of ${questionsPerExam || "?"} question${Number(questionsPerExam) === 1 ? "" : "s"}`}
            >
              <Input
                type="number"
                min="1"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
                placeholder="e.g. 30"
              />
            </Field>
          </div>
        </Card>

        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Question bank ({questions.length})</h2>
              <p className={styles.sectionSub}>
                Add as many as you like — e.g. 200-300. Each exam only draws{" "}
                {questionsPerExam || "a set number of"} of them at random.
              </p>
            </div>
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
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/question-papers")}>
            Cancel
          </Button>
          <Button type="submit">Save question paper</Button>
        </div>
      </form>
    </DashboardShell>
  );
}
