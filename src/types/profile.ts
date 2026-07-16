export type AppMode = "cocuk" | "yetiskin";

export interface Profile {
  id: string;
  name: string;
  age: number;
  mode: AppMode;
  createdAt: string;
}

export type SrsResult = "correct" | "wrong";

export interface SrsCardState {
  interval: number;
  ease: number;
  repetitions: number;
  dueDate: string;
  lastResult: SrsResult | null;
}

/** wordId -> SRS state, for one profile + one language */
export type ProgressMap = Record<string, SrsCardState>;

export interface StreakState {
  count: number;
  lastActiveDate: string;
}

export type QuestionKind = "meaning-to-word" | "listen-to-word" | "scramble";

export interface QuizResultEntry {
  wordId: string;
  kind: QuestionKind;
  correct: boolean;
}
