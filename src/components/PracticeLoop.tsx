import { useState } from "react";
import { cardsById } from "../content/cards";
import { quizzes } from "../content/quizzes";
import { recordAnswer } from "../domain/mastery";
import type { UserProgress } from "../domain/types";
import { CardArtwork } from "./CardArtwork";

export function PracticeLoop({ progress, onChange }: { progress: UserProgress; onChange: (next: UserProgress) => void }) {
  const [cursor, setCursor] = useState(() => progress.attempts.length % quizzes.length);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const quiz = quizzes[cursor % quizzes.length];
  const card = cardsById[quiz.cardId];

  function submitAnswer(index: number) {
    if (submitted) return;
    setSelected(index);
    setSubmitted(true);
    onChange(recordAnswer(progress, quiz.id, quiz.cardId, index === quiz.correctIndex));
  }

  function nextQuestion() {
    setCursor((value) => (value + 1) % quizzes.length);
    setSelected(null);
    setSubmitted(false);
  }

  const isCorrect = selected === quiz.correctIndex;

  return (
    <section className="practice-shell" aria-labelledby="practice-title">
      <div className="practice-card"><CardArtwork card={card} eager /></div>
      <div className="practice-copy">
        <p className="eyebrow">Мини-практика · {cursor + 1}/{quizzes.length}</p>
        <h2 id="practice-title">{quiz.prompt}</h2>
        <div className="answers" aria-label="Варианты ответа">
          {quiz.answers.map((answer, index) => {
            const state = submitted
              ? index === quiz.correctIndex
                ? "correct"
                : selected === index
                  ? "wrong"
                  : "muted"
              : "";
            return (
              <button key={answer} type="button" className={`answer ${state}`} onClick={() => submitAnswer(index)} disabled={submitted}>
                <span>{String.fromCharCode(65 + index)}</span>{answer}
              </button>
            );
          })}
        </div>
        {submitted && (
          <div className={`feedback ${isCorrect ? "success" : "retry"}`} role="status">
            <p className="feedback-title">{isCorrect ? "Точно." : "Разберём логику."}</p>
            <p>{quiz.explanation}</p>
            <button className="primary-button" type="button" onClick={nextQuestion}>Следующий вопрос <span>→</span></button>
          </div>
        )}
      </div>
    </section>
  );
}
