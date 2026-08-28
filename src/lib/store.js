import { generateId, generatePassword, centerPrefix } from "./ids";
import { computeScore } from "./scoring";
import { PRICE_PER_SEAT, oneYearFromNow, isQuotaExpired } from "./pricing";
import { sampleArray } from "./shuffle";

const STORAGE_KEY = "examplatform:db";
const STORAGE_VERSION = 3;

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

export function findCenterByEmail(email) {
  return state.centers.find((c) => c.email.toLowerCase() === (email || "").toLowerCase());
}

export function getCenterById(id) {
  return state.centers.find((c) => c.id === id);
}

export function getApprovedCenters() {
  return state.centers.filter((c) => c.status === "approved");
}

// ---------- Students ----------

export function addStudent(centerId, { name, phone }) {
  const center = getCenterById(centerId);
  const existing = state.students.filter((s) => s.centerId === centerId);

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
    phone: phone || "",
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

export function findStudentLogin(centerId, studentCode, password) {
  return state.students.find(
    (s) =>
      s.centerId === centerId &&
      s.studentCode.toLowerCase() === (studentCode || "").toLowerCase() &&
      s.password === password
  );
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

export function submitAttempt(examId, studentId, answers, timeTakenSeconds) {
  const exam = getExamById(examId);
  const result = computeScore(exam, answers);
  const attempt = {
    id: generateId("attempt"),
    examId,
    studentId,
    centerId: exam.centerId,
    answers,
    timeTakenSeconds,
    submittedAt: new Date().toISOString(),
    ...result,
  };
  setState((s) => ({ ...s, attempts: [...s.attempts, attempt] }));
  return attempt;
}

export function getAttemptsByExam(examId) {
  return state.attempts.filter((a) => a.examId === examId);
}

export function getAttemptsByStudent(studentId) {
  return state.attempts.filter((a) => a.studentId === studentId);
}

export function getAttemptById(id) {
  return state.attempts.find((a) => a.id === id);
}
