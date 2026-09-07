// No SMS gateway is wired up yet — this simulates a successful delivery for the demo.
export function sendStudentCredentialsSms(student) {
  return { ok: true, sentTo: student.phone };
}

// No SMS/WhatsApp gateway is wired up yet — this simulates a successful delivery for the demo.
export function sendResultNotification(student, exam, attempt) {
  const message = attempt.passed
    ? `Congrats ${student.name}! You passed ${exam.title} with ${attempt.score}/${attempt.totalMarks}. Contact your center to collect your certificate.`
    : `Your result for ${exam.title} is ready: ${attempt.score}/${attempt.totalMarks} (not passed). Contact your center for next steps.`;
  return { ok: true, sentTo: student.phone, message };
}
