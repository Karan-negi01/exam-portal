"use server";

import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapQuestionPaper } from "./mappers";

export async function createQuestionPaper({
  title,
  subject,
  durationMinutes,
  passingMarks,
  questionsPerExam,
  questions,
}) {
  const supabase = getSupabaseServerClient();

  const { data: paperRow, error } = await supabase
    .from("question_papers")
    .insert({
      title,
      subject,
      duration_minutes: durationMinutes,
      passing_marks: passingMarks,
      questions_per_exam: questionsPerExam,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  const { data: questionRows, error: qError } = await supabase
    .from("questions")
    .insert(
      questions.map((q) => ({
        paper_id: paperRow.id,
        text: q.text,
        options: q.options,
        correct_index: q.correctIndex,
      }))
    )
    .select();
  if (qError) throw new Error(qError.message);

  return mapQuestionPaper(paperRow, questionRows);
}

export async function deleteQuestionPaper(id) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("question_papers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Existing questions keep their id (so analytics stay tied to them); new ones
// (no id yet) are inserted fresh, and any removed from the list are deleted.
// Already-scheduled exams hold their own content snapshot in exam_questions,
// so editing a paper here never touches an exam that already drew from it.
export async function updateQuestionPaper(
  id,
  { title, subject, durationMinutes, passingMarks, questionsPerExam, questions }
) {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("question_papers")
    .update({
      title,
      subject,
      duration_minutes: durationMinutes,
      passing_marks: passingMarks,
      questions_per_exam: questionsPerExam,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  const { data: currentRows, error: currentError } = await supabase
    .from("questions")
    .select("id")
    .eq("paper_id", id);
  if (currentError) throw new Error(currentError.message);

  const keepIds = new Set(questions.filter((q) => q.id).map((q) => q.id));
  const idsToDelete = currentRows.filter((r) => !keepIds.has(r.id)).map((r) => r.id);
  if (idsToDelete.length) {
    const { error: deleteError } = await supabase.from("questions").delete().in("id", idsToDelete);
    if (deleteError) throw new Error(deleteError.message);
  }

  const toUpdate = questions.filter((q) => q.id);
  const toInsert = questions
    .filter((q) => !q.id)
    .map((q) => ({ paper_id: id, text: q.text, options: q.options, correct_index: q.correctIndex }));

  const updateResults = await Promise.all(
    toUpdate.map((q) =>
      supabase
        .from("questions")
        .update({ text: q.text, options: q.options, correct_index: q.correctIndex })
        .eq("id", q.id)
    )
  );
  const updateError = updateResults.find((r) => r.error);
  if (updateError) throw new Error(updateError.error.message);

  if (toInsert.length) {
    const { error: insertError } = await supabase.from("questions").insert(toInsert);
    if (insertError) throw new Error(insertError.message);
  }
}
