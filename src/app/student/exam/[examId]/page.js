"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth";
import { useDB } from "@/lib/useDB";
import { submitAttempt } from "@/lib/store";
import styles from "./page.module.css";

const LETTERS = ["A", "B", "C", "D"];

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function TakeExamPage({ params }) {
  const { examId } = use(params);
  const { session } = useAuth();
  const db = useDB();
  const router = useRouter();

  const studentId = session?.id;
  const exam = db.exams.find((e) => e.id === examId);
  const alreadyAttempted =
    exam && db.attempts.some((a) => a.examId === exam.id && a.studentId === studentId);
  const isAssigned = exam && exam.assignedStudentIds.includes(studentId);
  const canTake = Boolean(exam && exam.status === "published" && isAssigned && !alreadyAttempted);

  const [initialized, setInitialized] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  const submittedRef = useRef(false);
  const answersRef = useRef([]);

  // Exam data (and whether this student may take it) comes from the localStorage-backed
  // store, which only finishes hydrating after mount — so this syncs local exam state to
  // that external source once it becomes available, rather than being derivable up front.
  useEffect(() => {
    if (exam && canTake && !initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(new Array(exam.questions.length).fill(null));
      setSecondsLeft(exam.durationMinutes * 60);
      setInitialized(true);
    }
  }, [exam, canTake, initialized]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  function doSubmit(timeTakenSeconds) {
    if (submittedRef.current || !exam) return;
    submittedRef.current = true;
    const attempt = submitAttempt(exam.id, studentId, answersRef.current, timeTakenSeconds);
    router.replace(`/student/result/${attempt.id}`);
  }

  useEffect(() => {
    if (!canTake || !initialized) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          doSubmit(exam.durationMinutes * 60);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canTake, initialized]);

  useEffect(() => {
    if (!canTake) return;
    function handleBeforeUnload(e) {
      if (!submittedRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [canTake]);

  if (!exam) {
    return (
      <div className={styles.shell}>
        <div className="container" style={{ paddingTop: 60 }}>
          <Card>
            <EmptyState icon="🔍" title="Exam not found" action={<Button href="/student" size="sm">Back to dashboard</Button>} />
          </Card>
        </div>
      </div>
    );
  }

  if (alreadyAttempted) {
    return (
      <div className={styles.shell}>
        <div className="container" style={{ paddingTop: 60 }}>
          <Card>
            <EmptyState
              icon="✅"
              title="You've already attempted this exam"
              description="Check your dashboard for the result."
              action={<Button href="/student" size="sm">Back to dashboard</Button>}
            />
          </Card>
        </div>
      </div>
    );
  }

  if (!isAssigned || exam.status !== "published") {
    return (
      <div className={styles.shell}>
        <div className="container" style={{ paddingTop: 60 }}>
          <Card>
            <EmptyState
              icon="🚫"
              title="This exam isn't available to you"
              action={<Button href="/student" size="sm">Back to dashboard</Button>}
            />
          </Card>
        </div>
      </div>
    );
  }

  if (!initialized) return null;

  const question = exam.questions[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;

  const unanswered = exam.questions.length - answeredCount;
  const confirmMessage =
    unanswered > 0
      ? `You have ${unanswered} unanswered question${unanswered === 1 ? "" : "s"}. Submit anyway?`
      : "Submit your exam now?";

  function confirmSubmit() {
    setConfirmingSubmit(false);
    doSubmit(exam.durationMinutes * 60 - secondsLeft);
  }

  return (
    <div className={styles.shell}>
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <div>
            <div className={styles.examTitle}>{exam.title}</div>
            <div className={styles.examSubject}>{exam.subject}</div>
          </div>
          <div className={`${styles.timer} ${secondsLeft <= 60 ? styles.timerLow : ""}`}>
            ⏱ {formatClock(secondsLeft)}
          </div>
        </div>
      </div>

      <div className={`container ${styles.body}`}>
        <Card className={styles.questionCard}>
          <div className={styles.qLabel}>
            Question {currentIndex + 1} of {exam.questions.length}
          </div>
          <div className={styles.qText}>{question.text}</div>

          <div className={styles.options}>
            {question.options.map((opt, i) => (
              <label
                key={i}
                className={`${styles.option} ${answers[currentIndex] === i ? styles.optionSelected : ""}`}
              >
                <input
                  type="radio"
                  hidden
                  checked={answers[currentIndex] === i}
                  onChange={() => {
                    setAnswers((a) => {
                      const next = [...a];
                      next[currentIndex] = i;
                      return next;
                    });
                  }}
                />
                <span className={styles.optionLetter}>{LETTERS[i]}</span>
                <span className={styles.optionText}>{opt}</span>
              </label>
            ))}
          </div>

          <div className={styles.navButtons}>
            <Button
              variant="secondary"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            >
              ← Previous
            </Button>
            {currentIndex < exam.questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))}>
                Next →
              </Button>
            ) : (
              <Button variant="accent" onClick={() => setConfirmingSubmit(true)}>
                Submit exam
              </Button>
            )}
          </div>
        </Card>

        <div className={styles.sidebar}>
          <Card>
            <div className={styles.sidebarTitle}>Question overview</div>
            <div className={styles.progressText}>
              {answeredCount} of {exam.questions.length} answered
            </div>
            <div className={styles.qGrid}>
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.qDot} ${answers[i] !== null ? styles.qDotAnswered : ""} ${
                    i === currentIndex ? styles.qDotCurrent : ""
                  }`}
                  onClick={() => setCurrentIndex(i)}
                  type="button"
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button block variant="accent" onClick={() => setConfirmingSubmit(true)}>
              Submit exam
            </Button>
          </Card>
        </div>
      </div>

      {confirmingSubmit && (
        <ConfirmDialog
          title="Submit exam?"
          message={confirmMessage}
          confirmLabel="Submit"
          tone="accent"
          onConfirm={confirmSubmit}
          onCancel={() => setConfirmingSubmit(false)}
        />
      )}
    </div>
  );
}
