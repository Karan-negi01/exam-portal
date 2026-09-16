// Seeds a fresh Supabase project with the same demo data the old
// localStorage build shipped with, so the app works out of the box.
//
// Run once, after applying supabase/schema.sql:
//   npm run db:seed
//
// Reads SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY from .env.local (via
// Node's built-in --env-file flag, wired up in package.json).

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.local.example to .env.local first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const PRICE_PER_SEAT = 200;

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString();
}
function isoDate(n) {
  return daysAgo(n).slice(0, 10);
}
function oneYearFrom(dateStr) {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}
function hash(password) {
  return bcrypt.hash(password, 10);
}

function tallyQuestions() {
  return [
    { text: "GST stands for?", options: ["Government Service Tax", "Goods and Services Tax", "General Sales Tax", "Gross Service Total"], correctIndex: 1 },
    { text: "In Tally, which shortcut is used to create a new company?", options: ["F11", "Alt+F3", "Ctrl+N", "F2"], correctIndex: 1 },
    { text: "A 'Ledger' in accounting is used to record?", options: ["Only cash transactions", "Only bank transactions", "Individual account transactions", "Employee attendance"], correctIndex: 2 },
    { text: "Which voucher type is used to record a cash purchase?", options: ["Receipt Voucher", "Journal Voucher", "Contra Voucher", "Payment Voucher"], correctIndex: 3 },
    { text: "A typical Tally company backup file has the extension?", options: [".exe", ".txt", ".001", ".xls"], correctIndex: 2 },
    { text: "Which report shows the financial position of a business on a given date?", options: ["Trial Balance", "Day Book", "Sales Register", "Balance Sheet"], correctIndex: 3 },
    { text: "In double-entry bookkeeping, every debit must have a corresponding?", options: ["Discount", "Credit", "Tax", "Voucher"], correctIndex: 1 },
    { text: "Which key is commonly used to save a voucher entry in Tally?", options: ["Esc", "F5", "Ctrl+A", "Alt+D"], correctIndex: 2 },
    { text: "An HSN code is primarily used for classifying?", options: ["Employees", "Bank accounts", "Goods for taxation", "Software licenses"], correctIndex: 2 },
    { text: "Which of the following is a current asset?", options: ["Building", "Goodwill", "Machinery", "Cash in hand"], correctIndex: 3 },
  ];
}

function excelQuestions() {
  return [
    { text: "Which symbol must every Excel formula begin with?", options: ["#", "@", "=", "$"], correctIndex: 2 },
    { text: "What does the VLOOKUP function do?", options: ["Sorts a column alphabetically", "Looks up a value in the first column of a range", "Deletes duplicate rows", "Formats cells conditionally"], correctIndex: 1 },
    { text: "Which shortcut copies a cell in Excel?", options: ["Ctrl+C", "Ctrl+P", "Ctrl+B", "Ctrl+K"], correctIndex: 0 },
    { text: "A cell reference like $A$1 is called a?", options: ["Relative reference", "Absolute reference", "Mixed reference", "Named range"], correctIndex: 1 },
    { text: "Which function adds up a range of cells?", options: ["AVERAGE()", "COUNT()", "SUM()", "MAX()"], correctIndex: 2 },
    { text: "What is a Pivot Table used for?", options: ["Summarizing and analyzing large data sets", "Spell-checking a sheet", "Password-protecting a file", "Printing labels"], correctIndex: 0 },
    { text: "Which chart type is best for showing trends over time?", options: ["Pie chart", "Line chart", "Scatter chart", "Doughnut chart"], correctIndex: 1 },
    { text: "What does 'Freeze Panes' do?", options: ["Locks rows/columns in place while scrolling", "Protects the workbook with a password", "Merges selected cells", "Hides gridlines"], correctIndex: 0 },
    { text: "Which function counts only numeric cells in a range?", options: ["COUNTA()", "COUNT()", "COUNTBLANK()", "COUNTIF()"], correctIndex: 1 },
    { text: "The default file extension for a modern Excel workbook is?", options: [".xls", ".doc", ".xlsx", ".csv"], correctIndex: 2 },
  ];
}

async function main() {
  const { count, error: countError } = await supabase.from("centers").select("id", { count: "exact", head: true });
  if (countError) throw countError;
  if (count > 0) {
    console.log(`centers already has ${count} row(s) — skipping seed. Delete the rows first if you want to reseed.`);
    return;
  }

  console.log("Seeding centers...");
  const centerSeeds = [
    {
      code: "BA",
      name: "Bright Academy",
      owner_name: "Rohit Sharma",
      email: "owner@brightacademy.com",
      password: "center123",
      phone: "+91 98765 43210",
      location: "Pune, Maharashtra",
      course_types: ["Computer Typing & Tally", "Accounting & Taxation"],
      pan_card_name: "pan_card.pdf",
      status: "approved",
      created_at: daysAgo(40),
      reviewed_at: daysAgo(39),
      seats: 10,
    },
    {
      code: "ZI",
      name: "Zenith Institute",
      owner_name: "Neha Verma",
      email: "owner@zenithinstitute.com",
      password: "center123",
      phone: "+91 90000 11122",
      location: "Lucknow, Uttar Pradesh",
      course_types: ["Spoken English & Soft Skills"],
      pan_card_name: null,
      status: "pending",
      created_at: daysAgo(2),
      reviewed_at: null,
      seats: 5,
    },
    {
      code: "SP",
      name: "Skillpoint Vocational Center",
      owner_name: "Arjun Mehta",
      email: "owner@skillpoint.in",
      password: "center123",
      phone: "+91 89999 22233",
      location: "Ahmedabad, Gujarat",
      course_types: ["Basic Computer Course (CCC)", "Data Entry Operator"],
      pan_card_name: "pan_card.jpg",
      status: "approved",
      created_at: daysAgo(70),
      reviewed_at: daysAgo(68),
      seats: 5,
    },
  ];

  const centerRows = await Promise.all(
    centerSeeds.map(async (c) => ({
      code: c.code,
      name: c.name,
      owner_name: c.owner_name,
      email: c.email,
      password_hash: await hash(c.password),
      phone: c.phone,
      location: c.location,
      course_types: c.course_types,
      pan_card_name: c.pan_card_name,
      status: c.status,
      created_at: c.created_at,
      reviewed_at: c.reviewed_at,
      seats: c.seats,
      price_per_seat: PRICE_PER_SEAT,
      purchased_at: c.created_at,
      expires_at: oneYearFrom(c.created_at),
      revenue_collected: c.seats * PRICE_PER_SEAT,
    }))
  );
  const { data: centers, error: centersError } = await supabase.from("centers").insert(centerRows).select();
  if (centersError) throw centersError;
  const brightAcademy = centers.find((c) => c.code === "BA");
  const skillpoint = centers.find((c) => c.code === "SP");

  console.log("Seeding students...");
  const studentSeeds = [
    { centerId: brightAcademy.id, code: "BA-1001", name: "Ananya Iyer", phone: "+91 98111 22334", password: "K7M2QX", createdAt: daysAgo(30) },
    { centerId: brightAcademy.id, code: "BA-1002", name: "Vikram Singh", phone: "+91 98222 33445", password: "P3R9TZ", createdAt: daysAgo(30) },
    { centerId: brightAcademy.id, code: "BA-1003", name: "Fatima Sheikh", phone: "+91 98333 44556", password: "L5N8WY", createdAt: daysAgo(20) },
    { centerId: skillpoint.id, code: "SP-1001", name: "Karan Patel", phone: "+91 98444 55667", password: "Q2X6VB", createdAt: daysAgo(15) },
  ];
  const studentRows = await Promise.all(
    studentSeeds.map(async (s) => ({
      center_id: s.centerId,
      student_code: s.code,
      name: s.name,
      phone: s.phone,
      password_hash: await hash(s.password),
      created_at: s.createdAt,
    }))
  );
  const { data: students, error: studentsError } = await supabase.from("students").insert(studentRows).select();
  if (studentsError) throw studentsError;
  const ananya = students.find((s) => s.student_code === "BA-1001");
  const vikram = students.find((s) => s.student_code === "BA-1002");
  const fatima = students.find((s) => s.student_code === "BA-1003");

  console.log("Seeding question papers...");
  const { data: paperTally, error: paperTallyError } = await supabase
    .from("question_papers")
    .insert({
      title: "Tally ERP 9 Foundation",
      subject: "Accounting Software",
      duration_minutes: 30,
      passing_marks: 6,
      questions_per_exam: 10,
      created_at: daysAgo(60),
    })
    .select()
    .single();
  if (paperTallyError) throw paperTallyError;

  const { data: paperExcel, error: paperExcelError } = await supabase
    .from("question_papers")
    .insert({
      title: "Advanced MS Excel",
      subject: "MS Excel",
      duration_minutes: 45,
      passing_marks: 7,
      questions_per_exam: 10,
      created_at: daysAgo(55),
    })
    .select()
    .single();
  if (paperExcelError) throw paperExcelError;

  const { data: tallyQuestionRows, error: tallyQError } = await supabase
    .from("questions")
    .insert(tallyQuestions().map((q) => ({ paper_id: paperTally.id, text: q.text, options: q.options, correct_index: q.correctIndex })))
    .select();
  if (tallyQError) throw tallyQError;

  const { data: excelQuestionRows, error: excelQError } = await supabase
    .from("questions")
    .insert(excelQuestions().map((q) => ({ paper_id: paperExcel.id, text: q.text, options: q.options, correct_index: q.correctIndex })))
    .select();
  if (excelQError) throw excelQError;

  console.log("Seeding exams...");
  const { data: exam1, error: exam1Error } = await supabase
    .from("exams")
    .insert({
      center_id: brightAcademy.id,
      question_paper_id: paperTally.id,
      title: paperTally.title,
      subject: paperTally.subject,
      date: isoDate(20),
      duration_minutes: paperTally.duration_minutes,
      passing_marks: paperTally.passing_marks,
      status: "published",
      created_at: daysAgo(25),
    })
    .select()
    .single();
  if (exam1Error) throw exam1Error;

  const { data: exam2, error: exam2Error } = await supabase
    .from("exams")
    .insert({
      center_id: brightAcademy.id,
      question_paper_id: paperExcel.id,
      title: paperExcel.title,
      subject: paperExcel.subject,
      date: isoDate(-5),
      duration_minutes: paperExcel.duration_minutes,
      passing_marks: paperExcel.passing_marks,
      status: "draft",
      created_at: daysAgo(3),
    })
    .select()
    .single();
  if (exam2Error) throw exam2Error;

  const { error: eq1Error } = await supabase.from("exam_questions").insert(
    tallyQuestionRows.map((q, i) => ({
      exam_id: exam1.id,
      question_id: q.id,
      order_index: i,
      text: q.text,
      options: q.options,
      correct_index: q.correct_index,
    }))
  );
  if (eq1Error) throw eq1Error;

  const { error: eq2Error } = await supabase.from("exam_questions").insert(
    excelQuestionRows.map((q, i) => ({
      exam_id: exam2.id,
      question_id: q.id,
      order_index: i,
      text: q.text,
      options: q.options,
      correct_index: q.correct_index,
    }))
  );
  if (eq2Error) throw eq2Error;

  const { error: assignedError } = await supabase.from("exam_assigned_students").insert(
    [ananya.id, vikram.id, fatima.id].map((studentId) => ({ exam_id: exam1.id, student_id: studentId }))
  );
  if (assignedError) throw assignedError;

  console.log("Seeding attempts...");
  // Authored against tallyQuestions()'s fixed order (also the order exam_questions
  // was inserted in above), so scoring against it directly here is safe.
  const answers1 = [1, 1, 2, 3, 0, 3, 1, 2, 0, 3];
  const answers2 = [0, 0, 2, 3, 0, 1, 1, 0, 2, 1];
  const correctIndexes = tallyQuestions().map((q) => q.correctIndex);

  function score(answers) {
    let s = 0;
    answers.forEach((a, i) => {
      if (a === correctIndexes[i]) s += 1;
    });
    return s;
  }

  const score1 = score(answers1);
  const score2 = score(answers2);

  const { error: attemptsError } = await supabase.from("attempts").insert([
    {
      exam_id: exam1.id,
      student_id: ananya.id,
      center_id: brightAcademy.id,
      answers: answers1,
      time_taken_seconds: 1180,
      focus_violations: 0,
      score: score1,
      total_marks: 10,
      passed: score1 >= 6,
      submitted_at: daysAgo(18),
    },
    {
      exam_id: exam1.id,
      student_id: vikram.id,
      center_id: brightAcademy.id,
      answers: answers2,
      time_taken_seconds: 1690,
      focus_violations: 2,
      score: score2,
      total_marks: 10,
      passed: score2 >= 6,
      submitted_at: daysAgo(17),
    },
  ]);
  if (attemptsError) throw attemptsError;

  console.log("Done. Demo logins:");
  console.log("  Admin:  admin@examplatform.com / admin123 (from .env.local)");
  console.log("  Center: owner@brightacademy.com / center123");
  console.log("  Student: Bright Academy · +91 98111 22334 / K7M2QX");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
