"use server";

import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapCenter, mapStudent, mapQuestionPaper, mapExam, mapAttempt } from "./mappers";

function groupBy(rows, key) {
  const map = {};
  for (const row of rows) {
    (map[row[key]] ||= []).push(row);
  }
  return map;
}

// The single read path every page uses: fetches every table and reassembles
// the exact {centers, students, questionPapers, exams, attempts} shape the
// old localStorage snapshot produced, so existing page-level .filter()/.find()
// logic keeps working untouched. Simpler and lower-risk than bespoke per-page
// queries; splitting into targeted queries is a natural follow-up once real
// usage patterns are known, not a concern at this data volume.
export async function getFullDb() {
  const supabase = getSupabaseServerClient();

  const [centers, students, papers, questions, exams, examQuestions, assigned, retakes, attempts] =
    await Promise.all([
      supabase.from("centers").select("*").order("created_at", { ascending: false }),
      supabase.from("students").select("*").order("created_at", { ascending: true }),
      supabase.from("question_papers").select("*").order("created_at", { ascending: false }),
      supabase.from("questions").select("*"),
      supabase.from("exams").select("*").order("created_at", { ascending: false }),
      supabase.from("exam_questions").select("*").order("order_index", { ascending: true }),
      supabase.from("exam_assigned_students").select("*"),
      supabase.from("exam_retakes_granted").select("*"),
      supabase.from("attempts").select("*").order("submitted_at", { ascending: true }),
    ]);

  for (const result of [centers, students, papers, questions, exams, examQuestions, assigned, retakes, attempts]) {
    if (result.error) throw new Error(result.error.message);
  }

  const questionsByPaper = groupBy(questions.data, "paper_id");
  const examQuestionsByExam = groupBy(examQuestions.data, "exam_id");
  const assignedByExam = groupBy(assigned.data, "exam_id");
  const retakesByExam = groupBy(retakes.data, "exam_id");

  return {
    centers: centers.data.map(mapCenter),
    students: students.data.map(mapStudent),
    questionPapers: papers.data.map((p) => mapQuestionPaper(p, questionsByPaper[p.id] || [])),
    exams: exams.data.map((e) =>
      mapExam(
        e,
        examQuestionsByExam[e.id] || [],
        (assignedByExam[e.id] || []).map((r) => r.student_id),
        (retakesByExam[e.id] || []).map((r) => r.student_id)
      )
    ),
    attempts: attempts.data.map(mapAttempt),
  };
}
