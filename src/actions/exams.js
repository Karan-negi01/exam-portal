"use server";

import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { sampleArray } from "@/lib/shuffle";
import { mapExam } from "./mappers";

// Draws a fresh random subset from the paper's question bank every time an
// exam is scheduled, so repeat exams on the same paper don't repeat questions,
// and copies the drawn content into exam_questions so later edits to the
// paper never change an already-scheduled exam.
export async function scheduleExam(centerId, { questionPaperId, date }) {
  const supabase = getSupabaseServerClient();

  const { data: paper, error: paperError } = await supabase
    .from("question_papers")
    .select("*, questions(*)")
    .eq("id", questionPaperId)
    .single();
  if (paperError) throw new Error(paperError.message);

  const drawn = sampleArray(paper.questions, paper.questions_per_exam);

  const { data: examRow, error } = await supabase
    .from("exams")
    .insert({
      center_id: centerId,
      question_paper_id: questionPaperId,
      title: paper.title,
      subject: paper.subject,
      date,
      duration_minutes: paper.duration_minutes,
      passing_marks: paper.passing_marks,
      status: "draft",
    })
    .select()
    .single();
  if (error) throw new Error(error.message);

  const { data: examQuestionRows, error: eqError } = await supabase
    .from("exam_questions")
    .insert(
      drawn.map((q, i) => ({
        exam_id: examRow.id,
        question_id: q.id,
        order_index: i,
        text: q.text,
        options: q.options,
        correct_index: q.correct_index,
      }))
    )
    .select();
  if (eqError) throw new Error(eqError.message);

  return mapExam(examRow, examQuestionRows, [], []);
}

export async function publishExam(examId, assignedStudentIds) {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.from("exams").update({ status: "published" }).eq("id", examId);
  if (error) throw new Error(error.message);

  const { error: deleteError } = await supabase
    .from("exam_assigned_students")
    .delete()
    .eq("exam_id", examId);
  if (deleteError) throw new Error(deleteError.message);

  if (assignedStudentIds.length) {
    const { error: insertError } = await supabase
      .from("exam_assigned_students")
      .insert(assignedStudentIds.map((studentId) => ({ exam_id: examId, student_id: studentId })));
    if (insertError) throw new Error(insertError.message);
  }
}

// Lets a failed (or already-attempted) student take this exam again. The
// grant is consumed the next time they submit — see attempts.js.
export async function grantRetake(examId, studentId) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("exam_retakes_granted")
    .upsert({ exam_id: examId, student_id: studentId }, { onConflict: "exam_id,student_id" });
  if (error) throw new Error(error.message);
}

export async function deleteExam(examId) {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("exams").delete().eq("id", examId);
  if (error) throw new Error(error.message);
}
