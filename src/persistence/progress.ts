import type { UserProgress } from "../domain/types";

export const STORAGE_KEY = "tarot-learning-proof:user-progress:v1";

export const EMPTY_PROGRESS: UserProgress = {
  schemaVersion: 1,
  attempts: [],
  cards: {},
  preferences: {
    reduceMotion: false,
  },
};

export interface ProgressStore {
  load(): UserProgress;
  save(progress: UserProgress): void;
}

function isProgress(value: unknown): value is UserProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UserProgress>;
  return (
    candidate.schemaVersion === 1 &&
    Array.isArray(candidate.attempts) &&
    typeof candidate.cards === "object" &&
    candidate.cards !== null
  );
}

export function createLocalProgressStore(storage: Storage): ProgressStore {
  return {
    load() {
      try {
        const raw = storage.getItem(STORAGE_KEY);
        if (!raw) return structuredClone(EMPTY_PROGRESS);
        const parsed: unknown = JSON.parse(raw);
        return isProgress(parsed) ? parsed : structuredClone(EMPTY_PROGRESS);
      } catch {
        return structuredClone(EMPTY_PROGRESS);
      }
    },
    save(progress) {
      storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    },
  };
}

// Future sync belongs behind this boundary. No remote implementation in Proof 001.
export interface ProgressSyncAdapter {
  push(progress: UserProgress): Promise<void>;
  pull(): Promise<UserProgress | null>;
}
