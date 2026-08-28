// No SMS gateway is wired up yet — this simulates a successful delivery for the demo.
export function sendStudentCredentialsSms(student) {
  return { ok: true, sentTo: student.phone };
}
