import { describe, expect, it } from "vitest";
import { calculateMastery, recordAnswer } from "../src/domain/mastery";
import { EMPTY_PROGRESS } from "../src/persistence/progress";

describe("mastery", () => {
  it("grows with accuracy and repeated evidence", () => {
    expect(calculateMastery(0, 0)).toBe(0);
    expect(calculateMastery(1, 1)).toBe(20);
    expect(calculateMastery(5, 4)).toBe(80);
  });

  it("records attempts without mutating prior progress", () => {
    const timestamp = "2026-08-26T00:00:00.000Z";
    const next = recordAnswer(EMPTY_PROGRESS, "quiz-1", "major-01-magician", true, timestamp);
    expect(EMPTY_PROGRESS.attempts).toHaveLength(0);
    expect(next.attempts).toHaveLength(1);
    expect(next.cards["major-01-magician"]).toMatchObject({ attempts: 1, correct: 1, mastery: 20 });
  });
});
