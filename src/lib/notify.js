// No SMS gateway is wired up yet — this simulates a successful delivery for the demo.
export function sendStudentCredentialsSms(student) {
  return { ok: true, sentTo: student.phone };
}

// No SMS/email gateway is wired up yet — this simulates notifying the center the
// moment a student's result comes in. Students are never sent their own result —
// only the center sees it, and decides when to share it (and the certificate).
export function notifyCenterOfResult(center, student, exam, attempt) {
  const message = attempt.passed
    ? `${student.name} passed ${exam.title} (${attempt.score}/${attempt.totalMarks}). Certificate is ready to download.`
    : `${student.name} did not pass ${exam.title} (${attempt.score}/${attempt.totalMarks}).`;
  return { ok: true, sentTo: center.email, message };
}
