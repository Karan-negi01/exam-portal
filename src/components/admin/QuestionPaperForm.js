"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import QuestionCard from "@/components/shared/QuestionCard";
import { parseQuestionsCsv, questionsToCsvTemplate } from "@/lib/csv";
import styles from "./QuestionPaperForm.module.css";

function emptyQuestion() {
  return { text: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function QuestionPaperForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes ?? 30);
  const [questionsPerExam, setQuestionsPerExam] = useState(initialData?.questionsPerExam ?? "");
  const [passingMarks, setPassingMarks] = useState(initialData?.passingMarks ?? "");
  const [questions, setQuestions] = useState(initialData?.questions?.length ? initialData.questions : [emptyQuestion()]);
  const [error, setError] = useState("");

  const [bulkText, setBulkText] = useState("");
  const [bulkErrors, setBulkErrors] = useState([]);
  const [bulkSuccess, setBulkSuccess] = useState("");

  function handleBulkFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBulkText(String(reader.result || ""));
    reader.readAsText(file);
    e.target.value = "";
  }

  function downloadTemplate() {
    const blob = new Blob([questionsToCsvTemplate()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question-paper-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleBulkImport() {
    setBulkErrors([]);
    setBulkSuccess("");
    const { questions: parsed, errors } = parseQuestionsCsv(bulkText);
    if (errors.length) {
      setBulkErrors(errors);
      return;
    }
    if (!parsed.length) {
      setBulkErrors(["No valid questions found in the pasted CSV."]);
      return;
    }
    setQuestions((qs) => {
      const isSingleBlank = qs.length === 1 && !qs[0].text.trim() && qs[0].options.every((o) => !o.trim());
      return isSingleBlank ? parsed : [...qs, ...parsed];
    });
    setBulkSuccess(`Added ${parsed.length} question${parsed.length === 1 ? "" : "s"} from CSV.`);
    setBulkText("");
  }

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
    onSubmit({
      title: title.trim(),
      subject: subject.trim(),
      durationMinutes: Number(durationMinutes),
      questionsPerExam: Number(questionsPerExam),
      passingMarks: Number(passingMarks),
      questions,
    });
  }

  return (
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

      <Card className={styles.section}>
        <div className={styles.bulkHead}>
          <div>
            <h2 className={styles.sectionTitle}>Bulk upload</h2>
            <p className={styles.sectionSub}>
              Paste CSV rows or upload a .csv file — much faster than adding questions one by one.
            </p>
          </div>
          <div className={styles.bulkActions}>
            <button type="button" className={styles.templateLink} onClick={downloadTemplate}>
              Download template
            </button>
            <Button type="button" variant="secondary" size="sm" as="label">
              Upload .csv
              <input type="file" accept=".csv,text/csv" hidden onChange={handleBulkFile} />
            </Button>
          </div>
        </div>

        <textarea
          className={styles.bulkTextarea}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={"question,option A,option B,option C,option D,correct\nWhat does GST stand for?,Goods and Services Tax,General Sales Tax,Gross Service Tax,Government Sales Tax,A"}
        />

        <div className={styles.bulkFooter}>
          <span className={styles.sectionSub}>
            Columns: question, option A, option B, option C, option D, correct (A-D or 1-4).
          </span>
          <Button type="button" variant="secondary" size="sm" onClick={handleBulkImport} disabled={!bulkText.trim()}>
            Add to question bank
          </Button>
        </div>

        {bulkErrors.length > 0 && (
          <div className={styles.bulkErrors}>
            Couldn&apos;t import — fix these rows and try again:
            <ul>
              {bulkErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        {bulkSuccess && <div className={styles.bulkSuccess}>{bulkSuccess}</div>}
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
              key={q.id || i}
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
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel || "Save question paper"}</Button>
      </div>
    </form>
  );
}
