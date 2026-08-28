"use client";

import { Input } from "@/components/ui/Field";
import styles from "./QuestionCard.module.css";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({ index, question, onChange, onRemove, removable }) {
  function updateText(text) {
    onChange({ ...question, text });
  }

  function updateOption(i, value) {
    const options = [...question.options];
    options[i] = value;
    onChange({ ...question, options });
  }

  function setCorrect(i) {
    onChange({ ...question, correctIndex: i });
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.num}>Question {index + 1}</span>
        {removable && (
          <button type="button" className={styles.removeBtn} onClick={onRemove}>
            Remove
          </button>
        )}
      </div>

      <Input
        value={question.text}
        onChange={(e) => updateText(e.target.value)}
        placeholder="Type the question..."
      />

      <div className={styles.options}>
        {question.options.map((opt, i) => (
          <label
            key={i}
            className={`${styles.option} ${question.correctIndex === i ? styles.optionCorrect : ""}`}
          >
            <input
              type="radio"
              className={styles.correctRadio}
              checked={question.correctIndex === i}
              onChange={() => setCorrect(i)}
              name={`correct-${index}`}
            />
            <span className={styles.optionLetter}>{LETTERS[i]}</span>
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${LETTERS[i]}`}
            />
          </label>
        ))}
      </div>
      <div className={styles.hint}>Select the radio button next to the correct option.</div>
    </div>
  );
}
