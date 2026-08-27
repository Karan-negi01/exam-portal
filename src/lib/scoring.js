export function computeScore(exam, answers) {
  const totalMarks = exam.questions.length;
  let score = 0;
  exam.questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) score += 1;
  });
  const passed = score >= exam.passingMarks;
  return { score, totalMarks, passed };
}
