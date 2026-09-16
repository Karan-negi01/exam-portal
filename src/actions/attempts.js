"use server";

import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { computeScore } from "@/lib/scoring";
import { mapAttempt } from "./mappers";

export async function submitAttempt(examId, studentId, answers, timeTakenSeconds, focusViolations = 0) {
  const supabase = getSupabaseServerClient();

  const { data: examRow, error: examError } = await supabase
    .from("exams")
    .select("center_id, passing_marks")
    .eq("id", examId)
    .single();
  if (examError) throw new Error(examError.message);

  const { data: examQuestionRows, error: eqError } = await supabase
    .from("exam_questions")
    .select("correct_index")
    .eq("exam_id", examId)
    .order("order_index", { ascending: true });
  if (eqError) throw new Error(eqError.message);

  const result = computeScore(
    {
      questions: examQuestionRows.map((q) => ({ correctIndex: q.correct_index })),
      passingMarks: examRow.passing_marks,
    },
    answers
  );

  const { data: attemptRow, error } = await supabase
    .from("attempts")
    .insert({
      exam_id: examId,
      student_id: studentId,
      center_id: examRow.center_id,
      answers,
      time_taken_seconds: timeTakenSeconds,
      focus_violations: focusViolations,
      score: result.score,
      total_marks: result.totalMarks,
      passed: result.passed,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  // Submitting consumes any retake grant — the owner must grant another one for a further attempt.
  const { error: retakeError } = await supabase
    .from("exam_retakes_granted")
    .delete()
    .eq("exam_id", examId)
    .eq("student_id", studentId);
  if (retakeError) throw new Error(retakeError.message);

  return mapAttempt(attemptRow);
}
