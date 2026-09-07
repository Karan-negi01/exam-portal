import { generateId, generatePassword, centerPrefix, normalizePhone, toCertId } from "./ids";
import { computeScore } from "./scoring";
import { PRICE_PER_SEAT, oneYearFromNow, isQuotaExpired } from "./pricing";
import { sampleArray } from "./shuffle";

const STORAGE_KEY = "examplatform:db";
const STORAGE_VERSION = 5;

const listeners = new Set();

function emit() {
  listeners.forEach((cb) => cb());
}

function tallyQuestions() {
  return [
    {
      q: "GST stands for?",
      options: [
        "Government Service Tax",
        "Goods and Services Tax",
        "General Sales Tax",
        "Gross Service Total",
      ],
      correctIndex: 1,
    },
    {
      q: "In Tally, which shortcut is used to create a new company?",
      options: ["F11", "Alt+F3", "Ctrl+N", "F2"],
      correctIndex: 1,
    },
    {
      q: "A 'Ledger' in accounting is used to record?",
      options: [
        "Only cash transactions",
        "Only bank transactions",
        "Individual account transactions",
        "Employee attendance",
      ],
      correctIndex: 2,
    },
    {
      q: "Which voucher type is used to record a cash purchase?",
      options: [
        "Receipt Voucher",
        "Journal Voucher",
        "Contra Voucher",
        "Payment Voucher",
      ],
      correctIndex: 3,
    },
    {
      q: "A typical Tally company backup file has the extension?",
      options: [".exe", ".txt", ".001", ".xls"],
      correctIndex: 2,
    },
    {
      q: "Which report shows the financial position of a business on a given date?",
      options: ["Trial Balance", "Day Book", "Sales Register", "Balance Sheet"],
      correctIndex: 3,
    },
    {
      q: "In double-entry bookkeeping, every debit must have a corresponding?",
      options: ["Discount", "Credit", "Tax", "Voucher"],
      correctIndex: 1,
    },
    {
      q: "Which key is commonly used to save a voucher entry in Tally?",
      options: ["Esc", "F5", "Ctrl+A", "Alt+D"],
      correctIndex: 2,
    },
    {
      q: "An HSN code is primarily used for classifying?",
      options: ["Employees", "Bank accounts", "Goods for taxation", "Software licenses"],
      correctIndex: 2,
    },
    {
      q: "Which of the following is a current asset?",
      options: ["Building", "Goodwill", "Machinery", "Cash in hand"],
      correctIndex: 3,
    },
  ].map((q) => ({ id: generateId("q"), text: q.q, options: q.options, correctIndex: q.correctIndex }));
}

function excelQuestions() {
  return [
    {
      q: "Which symbol must every Excel formula begin with?",
      options: ["#", "@", "=", "$"],
      correctIndex: 2,
    },
    {
      q: "What does the VLOOKUP function do?",
      options: [
        "Sorts a column alphabetically",
        "Looks up a value in the first column of a range",
        "Deletes duplicate rows",
        "Formats cells conditionally",
      ],
      correctIndex: 1,
    },
    {
      q: "Which shortcut copies a cell in Excel?",
      options: ["Ctrl+C", "Ctrl+P", "Ctrl+B", "Ctrl+K"],
      correctIndex: 0,
    },
    {
      q: "A cell reference like $A$1 is called a?",
      options: ["Relative reference", "Absolute reference", "Mixed reference", "Named range"],
      correctIndex: 1,
    },
    {
      q: "Which function adds up a range of cells?",
      options: ["AVERAGE()", "COUNT()", "SUM()", "MAX()"],
      correctIndex: 2,
    },
    {
      q: "What is a Pivot Table used for?",
      options: [
        "Summarizing and analyzing large data sets",
        "Spell-checking a sheet",
        "Password-protecting a file",
        "Printing labels",
      ],
      correctIndex: 0,
    },
    {
      q: "Which chart type is best for showing trends over time?",
      options: ["Pie chart", "Line chart", "Scatter chart", "Doughnut chart"],
      correctIndex: 1,
    },
    {
      q: "What does 'Freeze Panes' do?",
      options: [
        "Locks rows/columns in place while scrolling",
        "Protects the workbook with a password",
        "Merges selected cells",
        "Hides gridlines",
      ],
      correctIndex: 0,
    },
    {
      q: "Which function counts only numeric cells in a range?",
      options: ["COUNTA()", "COUNT()", "COUNTBLANK()", "COUNTIF()"],
      correctIndex: 1,
    },
    {
      q: "The default file extension for a modern Excel workbook is?",
      options: [".xls", ".doc", ".xlsx", ".csv"],
      correctIndex: 2,
    },
  ].map((q) => ({ id: generateId("q"), text: q.q, options: q.options, correctIndex: q.correctIndex }));
}

function buildSeed() {
  const now = Date.now();
  const daysAgo = (n) => new Date(now - n * 86400000).toISOString();

  const centers = [
    {
      id: "center_1",
      code: "BA",
      name: "Bright Academy",
      ownerName: "Rohit Sharma",
      email: "owner@brightacademy.com",
      password: "center123",
      phone: "+91 98765 43210",
      location: "Pune, Maharashtra",
      courseTypes: ["Computer Typing & Tally", "Accounting & Taxation"],
      panCardName: "pan_card.pdf",
      status: "approved",
      createdAt: daysAgo(40),
      reviewedAt: daysAgo(39),
      quota: {
        seats: 10,
        pricePerSeat: PRICE_PER_SEAT,
        purchasedAt: daysAgo(40),
        expiresAt: oneYearFromNow(daysAgo(40)),
      },
      revenueCollected: 10 * PRICE_PER_SEAT,
    },
    {
      id: "center_2",
      code: "ZI",
      name: "Zenith Institute",
      ownerName: "Neha Verma",
      email: "owner@zenithinstitute.com",
      password: "center123",
      phone: "+91 90000 11122",
      location: "Lucknow, Uttar Pradesh",
      courseTypes: ["Spoken English & Soft Skills"],
      panCardName: null,
      status: "pending",
      createdAt: daysAgo(2),
      reviewedAt: null,
      quota: {
        seats: 5,
        pricePerSeat: PRICE_PER_SEAT,
        purchasedAt: daysAgo(2),
        expiresAt: oneYearFromNow(daysAgo(2)),
      },
      revenueCollected: 5 * PRICE_PER_SEAT,
    },
    {
      id: "center_3",
      code: "SP",
      name: "Skillpoint Vocational Center",
      ownerName: "Arjun Mehta",
      email: "owner@skillpoint.in",
      password: "center123",
      phone: "+91 89999 22233",
      location: "Ahmedabad, Gujarat",
      courseTypes: ["Basic Computer Course (CCC)", "Data Entry Operator"],
      panCardName: "pan_card.jpg",
      status: "approved",
      createdAt: daysAgo(70),
      reviewedAt: daysAgo(68),
      quota: {
        seats: 5,
        pricePerSeat: PRICE_PER_SEAT,
        purchasedAt: daysAgo(70),
        expiresAt: oneYearFromNow(daysAgo(70)),
      },
      revenueCollected: 5 * PRICE_PER_SEAT,
    },
  ];

  const students = [
    {
      id: "student_1",
      centerId: "center_1",
      studentCode: "BA-1001",
      name: "Ananya Iyer",
      phone: "+91 98111 22334",
      password: "K7M2QX",
      createdAt: daysAgo(30),
    },
    {
      id: "student_2",
      centerId: "center_1",
      studentCode: "BA-1002",
      name: "Vikram Singh",
      phone: "+91 98222 33445",
      password: "P3R9TZ",
      createdAt: daysAgo(30),
    },
    {
      id: "student_3",
      centerId: "center_1",
      studentCode: "BA-1003",
      name: "Fatima Sheikh",
      phone: "+91 98333 44556",
      password: "L5N8WY",
      createdAt: daysAgo(20),
    },
    {
      id: "student_4",
      centerId: "center_3",
      studentCode: "SP-1001",
      name: "Karan Patel",
      phone: "+91 98444 55667",
      password: "Q2X6VB",
      createdAt: daysAgo(15),
    },
  ];

  const paperTally = {
    id: "paper_tally",
    title: "Tally ERP 9 Foundation",
    subject: "Accounting Software",
    durationMinutes: 30,
    passingMarks: 6,
    questionsPerExam: 10,
    questions: tallyQuestions(),
    createdAt: daysAgo(60),
  };

  const paperExcel = {
    id: "paper_excel",
    title: "Advanced MS Excel",
    subject: "MS Excel",
    durationMinutes: 45,
    passingMarks: 7,
    questionsPerExam: 10,
    questions: excelQuestions(),
    createdAt: daysAgo(55),
  };

  const questionPapers = [paperTally, paperExcel];

  const isoDate = (n) => daysAgo(n).slice(0, 10);

  const exam1 = {
    id: "exam_1",
    centerId: "center_1",
    questionPaperId: paperTally.id,
    title: paperTally.title,
    subject: paperTally.subject,
    date: isoDate(20),
    durationMinutes: paperTally.durationMinutes,
    passingMarks: paperTally.passingMarks,
    status: "published",
    assignedStudentIds: ["student_1", "student_2", "student_3"],
    questions: paperTally.questions,
    retakesGranted: [],
    createdAt: daysAgo(25),
  };

  const exam2 = {
    id: "exam_2",
    centerId: "center_1",
    questionPaperId: paperExcel.id,
    title: paperExcel.title,
    subject: paperExcel.subject,
    date: isoDate(-5),
    durationMinutes: paperExcel.durationMinutes,
    passingMarks: paperExcel.passingMarks,
    status: "draft",
    assignedStudentIds: [],
    questions: paperExcel.questions,
    retakesGranted: [],
    createdAt: daysAgo(3),
  };

  const exams = [exam1, exam2];

  const answers1 = [1, 1, 2, 3, 0, 3, 1, 2, 0, 3];
  const answers2 = [0, 0, 2, 3, 0, 1, 1, 0, 2, 1];

  const attempt1 = {
    id: "attempt_1",
    examId: "exam_1",
    studentId: "student_1",
    centerId: "center_1",
    answers: answers1,
    timeTakenSeconds: 1180,
    focusViolations: 0,
    flaggedQuestionIds: [],
    submittedAt: daysAgo(18),
    ...computeScore(exam1, answers1),
  };

  const attempt2 = {
    id: "attempt_2",
    examId: "exam_1",
    studentId: "student_2",
    centerId: "center_1",
    answers: answers2,
    timeTakenSeconds: 1690,
    focusViolations: 2,
    flaggedQuestionIds: [],
    submittedAt: daysAgo(17),
    ...computeScore(exam1, answers2),
  };

  return {
    version: STORAGE_VERSION,
    centers,
    students,
    questionPapers,
    exams,
    attempts: [attempt1, attempt2],
  };
}

function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = buildSeed();
let hydrated = false;

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const stored = loadFromStorage();
  if (stored) {
    state = stored;
  } else {
    saveToStorage(state);
  }
  emit();
}

export function resetDemoData() {
  state = buildSeed();
  saveToStorage(state);
  emit();
}

function setState(updater) {
  state = typeof updater === "function" ? updater(state) : updater;
  saveToStorage(state);
  emit();
}

export function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSnapshot() {
  return state;
}

export function getServerSnapshot() {
  return state;
}

// ---------- Centers ----------

export function applyForCenter(data) {
  const now = new Date().toISOString();
  const center = {
    id: generateId("center"),
    code: centerPrefix(data.name),
    name: data.name,
    ownerName: data.ownerName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    location: data.location,
    courseTypes: data.courseTypes || [],
    panCardName: data.panCardName || null,
    status: "pending",
    createdAt: now,
    reviewedAt: null,
    quota: {
      seats: data.seats,
      pricePerSeat: PRICE_PER_SEAT,
      purchasedAt: now,
      expiresAt: oneYearFromNow(now),
    },
    revenueCollected: (data.seats || 0) * PRICE_PER_SEAT,
  };
  setState((s) => ({ ...s, centers: [center, ...s.centers] }));
  return center;
}

export function addSeats(centerId, additionalSeats) {
  const now = new Date().toISOString();
  setState((s) => ({
    ...s,
    centers: s.centers.map((c) => {
      if (c.id !== centerId) return c;
      const prevSeats = c.quota?.seats || 0;
      return {
        ...c,
        quota: {
          seats: prevSeats + additionalSeats,
          pricePerSeat: PRICE_PER_SEAT,
          purchasedAt: now,
          expiresAt: oneYearFromNow(now),
        },
        revenueCollected: (c.revenueCollected || 0) + additionalSeats * PRICE_PER_SEAT,
      };
    }),
  }));
}

export function approveCenter(id) {
  setState((s) => ({
    ...s,
    centers: s.centers.map((c) =>
      c.id === id ? { ...c, status: "approved", reviewedAt: new Date().toISOString() } : c
    ),
  }));
}

export function rejectCenter(id) {
  setState((s) => ({
    ...s,
    centers: s.centers.map((c) =>
      c.id === id ? { ...c, status: "rejected", reviewedAt: new Date().toISOString() } : c
    ),
  }));
}

// Suspends a previously-approved center — blocks the owner and their students from
// logging in, and drops the center from the public "select your center" list, without
// losing their application/history the way rejecting a fresh application would imply.
export function suspendCenter(id) {
  setState((s) => ({
    ...s,
    centers: s.centers.map((c) => (c.id === id ? { ...c, status: "suspended" } : c)),
  }));
}

export function reinstateCenter(id) {
  setState((s) => ({
    ...s,
    centers: s.centers.map((c) => (c.id === id ? { ...c, status: "approved" } : c)),
  }));
}

export function findCenterByEmail(email) {
  return state.centers.find((c) => c.email.toLowerCase() === (email || "").toLowerCase());
}

export function getCenterById(id) {
  return state.centers.find((c) => c.id === id);
}

export function getApprovedCenters() {
  return state.centers.filter((c) => c.status === "approved");
}

export function changeCenterPassword(centerId, currentPassword, newPassword) {
  const center = getCenterById(centerId);
  if (!center) return { ok: false, error: "Center not found." };
  if (center.password !== currentPassword) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (!newPassword || newPassword.length < 4) {
    return { ok: false, error: "New password must be at least 4 characters." };
  }
  setState((s) => ({
    ...s,
    centers: s.centers.map((c) => (c.id === centerId ? { ...c, password: newPassword } : c)),
  }));
  return { ok: true };
}

// ---------- Students ----------

export function addStudent(centerId, { name, phone }) {
  const center = getCenterById(centerId);
  const existing = state.students.filter((s) => s.centerId === centerId);

  if (!phone || !normalizePhone(phone)) {
    return { ok: false, error: "A phone number is required — students log in with it." };
  }
  if (existing.some((s) => normalizePhone(s.phone) === normalizePhone(phone))) {
    return { ok: false, error: "A student with this phone number is already enrolled." };
  }
  if (isQuotaExpired(center.quota)) {
    return { ok: false, error: "Your seat quota has expired. Buy more seats to keep enrolling students." };
  }
  if (existing.length >= center.quota.seats) {
    return { ok: false, error: "You've used all your purchased seats. Buy more seats to add this student." };
  }

  const nextNumber = 1001 + existing.length;
  const student = {
    id: generateId("student"),
    centerId,
    studentCode: `${center.code}-${nextNumber}`,
    name,
    phone,
    password: generatePassword(),
    createdAt: new Date().toISOString(),
  };
  setState((s) => ({ ...s, students: [...s.students, student] }));
  return { ok: true, student };
}

export function removeStudent(id) {
  setState((s) => ({ ...s, students: s.students.filter((st) => st.id !== id) }));
}

export function getStudentsByCenter(centerId) {
  return state.students.filter((s) => s.centerId === centerId);
}

export function getStudentById(id) {
  return state.students.find((s) => s.id === id);
}

export function findStudentLogin(centerId, phone, password) {
  return state.students.find(
    (s) =>
      s.centerId === centerId &&
      normalizePhone(s.phone) === normalizePhone(phone) &&
      s.password === password
  );
}

export function changeStudentPassword(studentId, currentPassword, newPassword) {
  const student = getStudentById(studentId);
  if (!student) return { ok: false, error: "Student not found." };
  if (student.password !== currentPassword) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (!newPassword || newPassword.length < 4) {
    return { ok: false, error: "New password must be at least 4 characters." };
  }
  setState((s) => ({
    ...s,
    students: s.students.map((st) => (st.id === studentId ? { ...st, password: newPassword } : st)),
  }));
  return { ok: true };
}

// ---------- Question papers (created by the platform, not the center) ----------

export function createQuestionPaper({
  title,
  subject,
  durationMinutes,
  passingMarks,
  questionsPerExam,
  questions,
}) {
  const paper = {
    id: generateId("paper"),
    title,
    subject,
    durationMinutes,
    passingMarks,
    questionsPerExam,
    questions: questions.map((q) => ({ id: generateId("q"), ...q })),
    createdAt: new Date().toISOString(),
  };
  setState((s) => ({ ...s, questionPapers: [paper, ...s.questionPapers] }));
  return paper;
}

export function deleteQuestionPaper(id) {
  setState((s) => ({ ...s, questionPapers: s.questionPapers.filter((p) => p.id !== id) }));
}

// Edits an existing paper's bank/settings. Already-scheduled exams keep the question
// snapshot they were given at schedule time, so this only affects future scheduling.
// Existing questions keep their id (so analytics stay tied to them); new ones get one.
export function updateQuestionPaper(
  id,
  { title, subject, durationMinutes, passingMarks, questionsPerExam, questions }
) {
  setState((s) => ({
    ...s,
    questionPapers: s.questionPapers.map((p) =>
      p.id === id
        ? {
            ...p,
            title,
            subject,
            durationMinutes,
            passingMarks,
            questionsPerExam,
            questions: questions.map((q) => (q.id ? q : { id: generateId("q"), ...q })),
          }
        : p
    ),
  }));
}

export function getQuestionPapers() {
  return state.questionPapers;
}

export function getQuestionPaperById(id) {
  return state.questionPapers.find((p) => p.id === id);
}

// ---------- Exams (a center scheduling one of the platform's question papers) ----------

export function scheduleExam(centerId, { questionPaperId, date }) {
  const paper = getQuestionPaperById(questionPaperId);
  // Draw a fresh random subset from the paper's question bank every time an
  // exam is scheduled, so repeat exams on the same paper don't repeat questions.
  const exam = {
    id: generateId("exam"),
    centerId,
    questionPaperId,
    title: paper.title,
    subject: paper.subject,
    date,
    durationMinutes: paper.durationMinutes,
    passingMarks: paper.passingMarks,
    status: "draft",
    assignedStudentIds: [],
    questions: sampleArray(paper.questions, paper.questionsPerExam),
    retakesGranted: [],
    createdAt: new Date().toISOString(),
  };
  setState((s) => ({ ...s, exams: [exam, ...s.exams] }));
  return exam;
}

export function publishExam(examId, assignedStudentIds) {
  setState((s) => ({
    ...s,
    exams: s.exams.map((e) =>
      e.id === examId ? { ...e, status: "published", assignedStudentIds } : e
    ),
  }));
}

// Lets a failed (or already-attempted) student take this exam again. The
// grant is consumed the next time they submit — see submitAttempt below.
export function grantRetake(examId, studentId) {
  setState((s) => ({
    ...s,
    exams: s.exams.map((e) =>
      e.id === examId
        ? { ...e, retakesGranted: [...new Set([...(e.retakesGranted || []), studentId])] }
        : e
    ),
  }));
}

export function deleteExam(examId) {
  setState((s) => ({ ...s, exams: s.exams.filter((e) => e.id !== examId) }));
}

export function getExamsByCenter(centerId) {
  return state.exams.filter((e) => e.centerId === centerId);
}

export function getExamById(id) {
  return state.exams.find((e) => e.id === id);
}

export function getExamsForStudent(studentId) {
  return state.exams.filter(
    (e) => e.status === "published" && e.assignedStudentIds.includes(studentId)
  );
}

// ---------- Attempts ----------

export function getAttemptForStudentExam(examId, studentId) {
  return state.attempts.find((a) => a.examId === examId && a.studentId === studentId);
}

export function submitAttempt(
  examId,
  studentId,
  answers,
  timeTakenSeconds,
  focusViolations = 0,
  flaggedQuestionIds = []
) {
  const exam = getExamById(examId);
  const result = computeScore(exam, answers);
  const attempt = {
    id: generateId("attempt"),
    examId,
    studentId,
    centerId: exam.centerId,
    answers,
    timeTakenSeconds,
    focusViolations,
    flaggedQuestionIds,
    submittedAt: new Date().toISOString(),
    ...result,
  };
  setState((s) => ({
    ...s,
    attempts: [...s.attempts, attempt],
    // Submitting consumes any retake grant — the owner must grant another one for a further attempt.
    exams: s.exams.map((e) =>
      e.id === examId
        ? { ...e, retakesGranted: (e.retakesGranted || []).filter((id) => id !== studentId) }
        : e
    ),
  }));
  return attempt;
}

export function getAttemptsByExam(examId) {
  return state.attempts.filter((a) => a.examId === examId);
}

export function getAttemptsByStudent(studentId) {
  return state.attempts.filter((a) => a.studentId === studentId);
}

// A student may now have multiple attempts at the same exam (after a retake
// is granted) — this returns the most recent one.
export function getLatestAttempt(examId, studentId) {
  const attempts = state.attempts.filter((a) => a.examId === examId && a.studentId === studentId);
  if (attempts.length === 0) return undefined;
  return attempts.reduce((latest, a) =>
    new Date(a.submittedAt) > new Date(latest.submittedAt) ? a : latest
  );
}

export function getAttemptById(id) {
  return state.attempts.find((a) => a.id === id);
}

// Certificate IDs are just the attempt ID, shortened and uppercased — this
// looks them back up for the public /verify/[certId] page.
export function getAttemptByCertId(certId) {
  const normalized = (certId || "").trim().toUpperCase();
  return state.attempts.find((a) => toCertId(a.id) === normalized);
}
