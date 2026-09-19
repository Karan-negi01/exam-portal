// Converts Supabase rows (snake_case) back into the exact camelCase shapes
// every page already consumes -- this is what keeps the page-level diff small:
// pages keep filtering/finding over these objects exactly as they did against
// the old localStorage snapshot.

export function mapCenter(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    courseTypes: row.course_types || [],
    panCardName: row.pan_card_name,
    panCardPath: row.pan_card_path,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    quota: {
      seats: row.seats,
      pricePerSeat: row.price_per_seat,
      purchasedAt: row.purchased_at,
      expiresAt: row.expires_at,
    },
    revenueCollected: row.revenue_collected,
  };
}

export function mapStudent(row) {
  return {
    id: row.id,
    centerId: row.center_id,
    studentCode: row.student_code,
    name: row.name,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export function mapQuestion(row) {
  return { id: row.id, text: row.text, options: row.options, correctIndex: row.correct_index };
}

export function mapQuestionPaper(row, questionRows) {
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    durationMinutes: row.duration_minutes,
    passingMarks: row.passing_marks,
    questionsPerExam: row.questions_per_exam,
    questions: questionRows.map(mapQuestion),
    createdAt: row.created_at,
  };
}

export function mapExam(row, examQuestionRows, assignedStudentIds, retakesGranted) {
  return {
    id: row.id,
    centerId: row.center_id,
    questionPaperId: row.question_paper_id,
    title: row.title,
    subject: row.subject,
    date: row.date,
    durationMinutes: row.duration_minutes,
    passingMarks: row.passing_marks,
    status: row.status,
    assignedStudentIds,
    retakesGranted,
    questions: examQuestionRows.map((q) => ({
      id: q.question_id,
      text: q.text,
      options: q.options,
      correctIndex: q.correct_index,
    })),
    createdAt: row.created_at,
  };
}

export function mapAttempt(row) {
  return {
    id: row.id,
    examId: row.exam_id,
    studentId: row.student_id,
    centerId: row.center_id,
    answers: row.answers,
    timeTakenSeconds: row.time_taken_seconds,
    focusViolations: row.focus_violations,
    score: row.score,
    totalMarks: row.total_marks,
    passed: row.passed,
    submittedAt: row.submitted_at,
  };
}
