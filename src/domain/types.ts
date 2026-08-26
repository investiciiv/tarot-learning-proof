export type ArcanaType = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type ClaimType =
  | "HISTORY"
  | "PRIMARY_AUTHOR_VIEW"
  | "OCCULT_TRADITION"
  | "PRACTICE"
  | "UNVERIFIED_BELIEF";

export interface SourceRef {
  sourceId: "S01" | "LEARNING_STATE";
  claimType: ClaimType;
  label: string;
  citation: string;
}

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  numeral: string;
  arcana: ArcanaType;
  suit?: Suit;
  rank: string;
  core: string;
  shadow: string;
  symbols: string[];
  correspondence?: string;
  image: string;
  pdfPage: number;
  source: SourceRef;
}

export interface QuizItem {
  id: string;
  cardId: string;
  prompt: string;
  answers: [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
  claimType: ClaimType;
}

export interface CardMastery {
  attempts: number;
  correct: number;
  mastery: number;
  lastSeenAt?: string;
}

export interface AttemptRecord {
  id: string;
  quizId: string;
  cardId: string;
  correct: boolean;
  answeredAt: string;
}

export interface UserProgress {
  schemaVersion: 1;
  attempts: AttemptRecord[];
  cards: Record<string, CardMastery>;
  preferences: {
    reduceMotion: boolean;
  };
}
