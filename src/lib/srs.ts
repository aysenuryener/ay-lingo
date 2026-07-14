import type { ProgressMap, SrsCardState, SrsResult } from "../types/profile";

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

export function createInitialCardState(): SrsCardState {
  return { interval: 0, ease: DEFAULT_EASE, repetitions: 0, dueDate: todayIso(), lastResult: null };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Simplified SM-2: on correct answers the interval grows (spaced further
 * apart); on a wrong answer it resets so the word comes back soon. */
export function reviewCard(state: SrsCardState, result: SrsResult): SrsCardState {
  let { interval, ease, repetitions } = state;

  if (result === "correct") {
    repetitions += 1;
    ease = Math.max(MIN_EASE, ease + 0.1);
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * ease);
  } else {
    repetitions = 0;
    ease = Math.max(MIN_EASE, ease - 0.2);
    interval = 1;
  }

  return { interval, ease, repetitions, dueDate: addDays(interval), lastResult: result };
}

export function isDue(state: SrsCardState | undefined): boolean {
  if (!state) return true;
  return state.dueDate <= todayIso();
}

export function isLearned(state: SrsCardState | undefined): boolean {
  return !!state && state.repetitions >= 2;
}

/** Orders word ids so due/weak words surface first, for quiz + flashcard picking. */
export function rankByPriority(wordIds: string[], progress: ProgressMap): string[] {
  return [...wordIds].sort((a, b) => {
    const sa = progress[a];
    const sb = progress[b];
    const dueA = isDue(sa) ? 0 : 1;
    const dueB = isDue(sb) ? 0 : 1;
    if (dueA !== dueB) return dueA - dueB;
    const easeA = sa?.ease ?? DEFAULT_EASE;
    const easeB = sb?.ease ?? DEFAULT_EASE;
    return easeA - easeB;
  });
}
