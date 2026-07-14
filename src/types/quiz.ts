import type { QuestionKind } from "./profile";

interface BaseQuestion {
  wordId: string;
  kind: QuestionKind;
}

export interface MeaningToWordQuestion extends BaseQuestion {
  kind: "meaning-to-word";
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface ListenToWordQuestion extends BaseQuestion {
  kind: "listen-to-word";
  speakText: string;
  options: string[];
  correctIndex: number;
}

export interface ScrambleQuestion extends BaseQuestion {
  kind: "scramble";
  answer: string;
  meaningHint: string;
  letters: string[];
}

export type QuizQuestion = MeaningToWordQuestion | ListenToWordQuestion | ScrambleQuestion;
