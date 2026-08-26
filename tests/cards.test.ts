import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { cards, majorArcana, minorArcana } from "../src/content/cards";

describe("canonical Tarot content", () => {
  it("contains the complete 78-card RWS structure", () => {
    expect(cards).toHaveLength(78);
    expect(majorArcana).toHaveLength(22);
    expect(minorArcana).toHaveLength(56);
    for (const suit of ["wands", "cups", "swords", "pentacles"]) {
      expect(minorArcana.filter((card) => card.suit === suit)).toHaveLength(14);
    }
  });

  it("has unique ids and S01 plate provenance for every card", () => {
    expect(new Set(cards.map((card) => card.id)).size).toBe(78);
    expect(new Set(cards.map((card) => card.pdfPage)).size).toBe(78);
    for (const card of cards) {
      expect(card.source.citation).toContain("S01 plate");
      expect(card.symbols.length).toBeGreaterThan(0);
      expect(existsSync(resolve("public", card.image))).toBe(true);
    }
  });
});
