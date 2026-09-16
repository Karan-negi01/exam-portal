"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import DataState from "@/components/ui/DataState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/lib/auth";
import { useAsyncData } from "@/lib/useAsyncData";
import { getFullDb } from "@/actions/db";
import { submitAttempt } from "@/actions/attempts";
import { notifyCenterOfResult } from "@/lib/notify";
import styles from "./page.module.css";

const LETTERS = ["A", "B", "C", "D"];
const MAX_VIOLATIONS = 3;

function requestFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
}

function exitFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

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
  const { data: db, loading, error: loadError } = useAsyncData(getFullDb);
  const router = useRouter();

  const studentId = session?.id;
  const exam = db?.exams.find((e) => e.id === examId);
  const studentAttempts = exam
    ? db.attempts.filter((a) => a.examId === exam.id && a.studentId === studentId)
    : [];
  const retakeGranted = Boolean(exam?.retakesGranted?.includes(studentId));
  const alreadyAttempted = studentAttempts.length > 0 && !retakeGranted;
  const isAssigned = exam && exam.assignedStudentIds.includes(studentId);
  const canTake = Boolean(exam && exam.status === "published" && isAssigned && !alreadyAttempted);

  const [initialized, setInitialized] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(true);

  const submittedRef = useRef(false);
  const answersRef = useRef([]);
  const secondsLeftRef = useRef(0);
  const violationsRef = useRef(0);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  function startExam() {
    if (!exam) return;
    setAnswers(new Array(exam.questions.length).fill(null));
    setSecondsLeft(exam.durationMinutes * 60);
    setInitialized(true);
    requestFullscreen();
  }

  async function doSubmit(timeTakenSeconds) {
    if (submittedRef.current || !exam) return;
    submittedRef.current = true;
    exitFullscreen();
    const attempt = await submitAttempt(
      exam.id,
      studentId,
      answersRef.current,
      timeTakenSeconds,
      violationsRef.current
    );
    const student = db.students.find((s) => s.id === studentId);
    const center = db.centers.find((c) => c.id === exam.centerId);
    if (student && center) notifyCenterOfResult(center, student, exam, attempt);
    router.replace(`/student/result/${attempt.id}`);
  }

  function flagViolation() {
    if (submittedRef.current) return;
    violationsRef.current += 1;
    setViolations(violationsRef.current);
    if (violationsRef.current >= MAX_VIOLATIONS) {
      doSubmit(exam.durationMinutes * 60 - secondsLeftRef.current);
    }
  }

  // Anti-cheat: flag every time the student leaves this tab, or drops out of
  // fullscreen, during the exam. After too many violations, the exam is
  // auto-submitted with whatever was answered.
  useEffect(() => {
    if (!canTake || !initialized) return;
    function handleVisibilityChange() {
      if (document.hidden) flagViolation();
    }
    function handleFullscreenChange() {
      const inFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(inFullscreen);
      if (!inFullscreen) flagViolation();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canTake, initialized]);

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

  if (loading || loadError || !db) {
    return (
      <div className={styles.shell}>
        <div className="container" style={{ paddingTop: 60 }}>
          <DataState loading={loading} error={loadError} />
        </div>
      </div>
    );
  }

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

  if (!initialized) {
    return (
      <div className={styles.shell}>
        <div className="container" style={{ paddingTop: 60 }}>
          <Card className={styles.gateCard}>
            <div className={styles.gateIcon}>🖥️</div>
            <h1 className={styles.gateTitle}>{exam.title}</h1>
            <p className={styles.gateSub}>{exam.subject}</p>
            <div className={styles.gateMeta}>
              <span>❓ {exam.questions.length} questions</span>
              <span>⏱ {exam.durationMinutes} min</span>
              <span>🎯 Pass {exam.passingMarks}/{exam.questions.length}</span>
            </div>
            <ul className={styles.gateRules}>
              <li>This exam runs in fullscreen — leaving it or switching tabs is recorded.</li>
              <li>
                After {MAX_VIOLATIONS} such violations, your exam auto-submits with whatever you&apos;ve
                answered.
              </li>
              <li>The timer starts the moment you click below and can&apos;t be paused.</li>
            </ul>
            <Button size="lg" onClick={startExam}>
              Start exam (fullscreen)
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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
        {violations > 0 && (
          <div className={styles.cheatWarning}>
            ⚠️ Exam focus lost ({violations}/{MAX_VIOLATIONS}). Switching tabs or leaving fullscreen
            is recorded — your exam will auto-submit if this happens {MAX_VIOLATIONS} times.
          </div>
        )}
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

      {!isFullscreen && (
        <div className={styles.fullscreenGate}>
          <Card className={styles.fullscreenGateCard}>
            <div className={styles.gateIcon}>🖥️</div>
            <h2 className={styles.gateTitle}>You left fullscreen</h2>
            <p className={styles.gateSub}>
              This was recorded ({violations}/{MAX_VIOLATIONS}). Click below to continue your exam.
            </p>
            <Button size="lg" onClick={requestFullscreen}>
              Resume exam
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
