import type { WordWithId } from "../types/language";
import type { ProgressMap } from "../types/profile";
import type { QuizQuestion } from "../types/quiz";
import { rankByPriority } from "./srs";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(all: WordWithId[], correct: WordWithId, count: number): string[] {
  const sameCategory = all.filter((w) => w.id !== correct.id && w.category === correct.category);
  const sameLevel = all.filter((w) => w.id !== correct.id && w.level === correct.level);
  const rest = all.filter((w) => w.id !== correct.id);

  const seenText = new Set([correct.word]);
  const result: string[] = [];

  for (const pool of [shuffle(sameCategory), shuffle(sameLevel), shuffle(rest)]) {
    for (const w of pool) {
      if (result.length >= count) break;
      if (seenText.has(w.word)) continue;
      seenText.add(w.word);
      result.push(w.word);
    }
    if (result.length >= count) break;
  }
  return result;
}

function buildMeaningToWord(word: WordWithId, all: WordWithId[]): QuizQuestion {
  const distractors = pickDistractors(all, word, 3);
  const options = shuffle([word.word, ...distractors]);
  return {
    kind: "meaning-to-word",
    wordId: word.id,
    prompt: word.meaning,
    options,
    correctIndex: options.indexOf(word.word),
  };
}

function buildListenToWord(word: WordWithId, all: WordWithId[]): QuizQuestion {
  const distractors = pickDistractors(all, word, 3);
  const options = shuffle([word.word, ...distractors]);
  return {
    kind: "listen-to-word",
    wordId: word.id,
    speakText: word.word,
    options,
    correctIndex: options.indexOf(word.word),
  };
}

function buildScramble(word: WordWithId): QuizQuestion {
  const letters = shuffle(word.word.split(""));
  return {
    kind: "scramble",
    wordId: word.id,
    answer: word.word,
    meaningHint: word.meaning,
    letters,
  };
}

export function buildQuiz(
  words: WordWithId[],
  progress: ProgressMap,
  count = 10
): QuizQuestion[] {
  return buildQuizFrom(words, rankByPriority(words.map((w) => w.id), progress), count);
}

/** Same as buildQuiz but for a caller-supplied ordered list of word ids
 * (e.g. rebuilding a quiz from only the words that were answered wrong). */
export function buildQuizFrom(
  allWords: WordWithId[],
  orderedIds: string[],
  count: number
): QuizQuestion[] {
  const byId = new Map(allWords.map((w) => [w.id, w]));
  const uniqueIds: string[] = [];
  for (const id of orderedIds) {
    if (!uniqueIds.includes(id)) uniqueIds.push(id);
    if (uniqueIds.length >= count) break;
  }
  // Pad with random words if the prioritized pool is smaller than requested.
  if (uniqueIds.length < count) {
    for (const w of shuffle(allWords)) {
      if (uniqueIds.length >= count) break;
      if (!uniqueIds.includes(w.id)) uniqueIds.push(w.id);
    }
  }

  return uniqueIds.map((id) => {
    const word = byId.get(id)!;
    const canScramble = !word.word.includes(" ");
    const kinds = canScramble
      ? (["meaning-to-word", "listen-to-word", "scramble"] as const)
      : (["meaning-to-word", "listen-to-word"] as const);
    const kind = kinds[Math.floor(Math.random() * kinds.length)];

    if (kind === "scramble") return buildScramble(word);
    if (kind === "listen-to-word") return buildListenToWord(word, allWords);
    return buildMeaningToWord(word, allWords);
  });
}
