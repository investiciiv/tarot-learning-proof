import { describe, expect, it } from "vitest";
import { createLocalProgressStore, EMPTY_PROGRESS, STORAGE_KEY } from "../src/persistence/progress";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("local progress store", () => {
  it("survives a new store instance", () => {
    const storage = new MemoryStorage();
    const first = createLocalProgressStore(storage);
    const progress = { ...structuredClone(EMPTY_PROGRESS), attempts: [{ id: "1", quizId: "q", cardId: "c", correct: true, answeredAt: "now" }] };
    first.save(progress);
    const second = createLocalProgressStore(storage);
    expect(second.load().attempts).toHaveLength(1);
  });

  it("falls back safely when stored JSON is invalid", () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, "not-json");
    expect(createLocalProgressStore(storage).load()).toEqual(EMPTY_PROGRESS);
  });
});
