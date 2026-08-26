import type { CardMastery, UserProgress } from "./types";

export const EMPTY_CARD_MASTERY: CardMastery = {
  attempts: 0,
  correct: 0,
  mastery: 0,
};

export function calculateMastery(attempts: number, correct: number): number {
  if (attempts === 0) return 0;
  const accuracy = correct / attempts;
  const confidence = Math.min(attempts / 5, 1);
  return Math.round(accuracy * confidence * 100);
}

export function recordAnswer(
  progress: UserProgress,
  quizId: string,
  cardId: string,
  isCorrect: boolean,
  answeredAt = new Date().toISOString(),
): UserProgress {
  const previous = progress.cards[cardId] ?? EMPTY_CARD_MASTERY;
  const attempts = previous.attempts + 1;
  const correct = previous.correct + (isCorrect ? 1 : 0);

  return {
    ...progress,
    attempts: [
      ...progress.attempts,
      {
        id: `${quizId}-${answeredAt}`,
        quizId,
        cardId,
        correct: isCorrect,
        answeredAt,
      },
    ].slice(-250),
    cards: {
      ...progress.cards,
      [cardId]: {
        attempts,
        correct,
        mastery: calculateMastery(attempts, correct),
        lastSeenAt: answeredAt,
      },
    },
  };
}

export function progressSummary(progress: UserProgress) {
  const attempts = progress.attempts.length;
  const correct = progress.attempts.filter((attempt) => attempt.correct).length;
  const studied = Object.values(progress.cards).filter((card) => card.attempts > 0).length;
  const mastered = Object.values(progress.cards).filter((card) => card.mastery >= 70).length;

  return {
    attempts,
    correct,
    studied,
    mastered,
    accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
  };
}
