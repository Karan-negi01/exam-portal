const CORRECT_LETTER_TO_INDEX = { a: 0, b: 1, c: 2, d: 3 };

// Parses one CSV line into fields, handling quoted values that may contain
// commas or escaped quotes ("" inside a quoted field).
function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

function resolveCorrectIndex(raw) {
  const value = (raw || "").trim().toLowerCase();
  if (value in CORRECT_LETTER_TO_INDEX) return CORRECT_LETTER_TO_INDEX[value];
  const asNumber = Number(value);
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= 4) return asNumber - 1;
  return -1;
}

// Expects columns: question, option A, option B, option C, option D, correct (A-D or 1-4).
// Returns { questions, errors } — errors reference 1-based row numbers (header excluded).
export function parseQuestionsCsv(text) {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { questions: [], errors: ["No rows found — paste or upload some CSV content first."] };
  }

  const firstRow = parseCsvLine(lines[0]);
  const looksLikeHeader = firstRow[0]?.trim().toLowerCase() === "question";
  const dataLines = looksLikeHeader ? lines.slice(1) : lines;

  const questions = [];
  const errors = [];

  dataLines.forEach((line, i) => {
    const rowNum = i + 1;
    const fields = parseCsvLine(line);
    if (fields.length < 6) {
      errors.push(`Row ${rowNum}: expected 6 columns (question, option A-D, correct) — found ${fields.length}.`);
      return;
    }
    const [question, optA, optB, optC, optD, correctRaw] = fields;
    if (!question) {
      errors.push(`Row ${rowNum}: missing question text.`);
      return;
    }
    const options = [optA, optB, optC, optD];
    if (options.some((o) => !o)) {
      errors.push(`Row ${rowNum}: all four options must be filled in.`);
      return;
    }
    const correctIndex = resolveCorrectIndex(correctRaw);
    if (correctIndex === -1) {
      errors.push(`Row ${rowNum}: correct answer "${correctRaw}" must be A/B/C/D or 1-4.`);
      return;
    }
    questions.push({ text: question, options, correctIndex });
  });

  return { questions, errors };
}

export function questionsToCsvTemplate() {
  const header = "question,option A,option B,option C,option D,correct";
  const sample1 = 'What does GST stand for?,Goods and Services Tax,General Sales Tax,Gross Service Tax,Government Sales Tax,A';
  const sample2 = 'Which key saves a file in most software?,Ctrl+P,Ctrl+S,Ctrl+A,Ctrl+Z,B';
  return [header, sample1, sample2].join("\n");
}
