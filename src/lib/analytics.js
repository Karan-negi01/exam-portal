export function computeAnalytics(db) {
  const totalRevenue = db.centers.reduce(
    (sum, c) => sum + (c.revenueCollected ?? (c.quota?.seats || 0) * (c.quota?.pricePerSeat || 0)),
    0
  );

  const totalAttempts = db.attempts.length;
  const totalPassed = db.attempts.filter((a) => a.passed).length;
  const passRate = totalAttempts ? Math.round((totalPassed / totalAttempts) * 100) : 0;

  const flaggedAttempts = db.attempts.filter((a) => (a.focusViolations || 0) > 0).length;

  const scheduleCounts = new Map();
  db.exams.forEach((e) => {
    scheduleCounts.set(e.questionPaperId, (scheduleCounts.get(e.questionPaperId) || 0) + 1);
  });
  const popularPapers = db.questionPapers
    .map((p) => ({
      id: p.id,
      title: p.title,
      subject: p.subject,
      bankSize: p.questions.length,
      timesScheduled: scheduleCounts.get(p.id) || 0,
    }))
    .sort((a, b) => b.timesScheduled - a.timesScheduled);

  const centerStats = db.centers
    .map((c) => {
      const students = db.students.filter((s) => s.centerId === c.id);
      const exams = db.exams.filter((e) => e.centerId === c.id);
      const examIds = new Set(exams.map((e) => e.id));
      const attempts = db.attempts.filter((a) => examIds.has(a.examId));
      const passed = attempts.filter((a) => a.passed).length;
      return {
        id: c.id,
        name: c.name,
        status: c.status,
        studentsEnrolled: students.length,
        seatsTotal: c.quota?.seats || 0,
        examsScheduled: exams.length,
        attempts: attempts.length,
        passRate: attempts.length ? Math.round((passed / attempts.length) * 100) : null,
        revenue: c.revenueCollected ?? (c.quota?.seats || 0) * (c.quota?.pricePerSeat || 0),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const questionStats = new Map();
  db.attempts.forEach((attempt) => {
    const exam = db.exams.find((e) => e.id === attempt.examId);
    if (!exam) return;
    const flagged = new Set(attempt.flaggedQuestionIds || []);
    exam.questions.forEach((q, i) => {
      const entry = questionStats.get(q.id) || {
        questionId: q.id,
        text: q.text,
        paperId: exam.questionPaperId,
        correct: 0,
        total: 0,
        flagCount: 0,
      };
      entry.total += 1;
      if (attempt.answers[i] === q.correctIndex) entry.correct += 1;
      if (flagged.has(q.id)) entry.flagCount += 1;
      questionStats.set(q.id, entry);
    });
  });
  const withPaperTitle = (entry) => ({
    ...entry,
    paperTitle: db.questionPapers.find((p) => p.id === entry.paperId)?.title || "—",
  });
  const topMissedQuestions = Array.from(questionStats.values())
    .map((entry) => ({
      ...withPaperTitle(entry),
      missRate: entry.total ? Math.round(((entry.total - entry.correct) / entry.total) * 100) : 0,
    }))
    .filter((entry) => entry.missRate > 0)
    .sort((a, b) => b.missRate - a.missRate)
    .slice(0, 8);
  const topFlaggedQuestions = Array.from(questionStats.values())
    .map(withPaperTitle)
    .filter((entry) => entry.flagCount > 0)
    .sort((a, b) => b.flagCount - a.flagCount)
    .slice(0, 8);

  return {
    totalRevenue,
    totalAttempts,
    totalPassed,
    passRate,
    flaggedAttempts,
    popularPapers,
    centerStats,
    topMissedQuestions,
    topFlaggedQuestions,
  };
}
