import type { GamificationState, LevelInfo, StatsSummary } from "../types/gamification";
import { evaluateBadges } from "./badges";
import { getStreak } from "./progressStore";

/**
 * Single typed read/write layer for all V2 gamification data (profile progress
 * beyond SRS/streak, which already live in profiles.ts / progressStore.ts).
 * Everything here is namespaced under localStorage today; swapping the bodies
 * of these functions for API calls is the intended path to a future backend
 * (e.g. Supabase) without touching call sites.
 */

const DEFAULT_DAILY_GOAL = 10;

export const LEVELS: LevelInfo[] = [
  { id: 0, minStars: 0, labelCocuk: "Çaylak", labelYetiskin: "Seviye 1" },
  { id: 1, minStars: 50, labelCocuk: "Kaşif", labelYetiskin: "Seviye 2" },
  { id: 2, minStars: 150, labelCocuk: "Usta", labelYetiskin: "Seviye 3" },
  { id: 3, minStars: 300, labelCocuk: "Şampiyon", labelYetiskin: "Seviye 4" },
];

export function getLevel(stars: number): LevelInfo {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (stars >= level.minStars) current = level;
  }
  return current;
}

function defaultGamificationState(): GamificationState {
  return {
    stars: 0,
    totalQuizzes: 0,
    totalCorrectAnswers: 0,
    totalAnsweredQuestions: 0,
    earnedBadges: [],
    dailyGoalTarget: DEFAULT_DAILY_GOAL,
    learnedWords: {},
  };
}

function gamificationKey(profileId: string): string {
  return `ay-lingo:gamification:${profileId}`;
}

export function getGamificationState(profileId: string): GamificationState {
  const defaults = defaultGamificationState();
  try {
    const raw = localStorage.getItem(gamificationKey(profileId));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<GamificationState>;
    return {
      ...defaults,
      ...parsed,
      earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : [],
      learnedWords: parsed.learnedWords && typeof parsed.learnedWords === "object" ? parsed.learnedWords : {},
    };
  } catch {
    return defaults;
  }
}

function saveGamificationState(profileId: string, state: GamificationState): void {
  localStorage.setItem(gamificationKey(profileId), JSON.stringify(state));
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface QuizCompletionResult {
  state: GamificationState;
  starsGained: number;
  newlyEarnedBadgeIds: string[];
  leveledUp: boolean;
}

export function recordQuizCompletion(
  profileId: string,
  languageCode: string,
  results: { wordId: string; correct: boolean }[]
): QuizCompletionResult {
  const state = getGamificationState(profileId);
  const levelBefore = getLevel(state.stars);

  let starsGained = 0;
  const today = todayIso();

  for (const r of results) {
    state.totalAnsweredQuestions += 1;
    if (r.correct) {
      state.totalCorrectAnswers += 1;
      starsGained += 1;
      const key = `${languageCode}:${r.wordId}`;
      if (!state.learnedWords[key]) {
        state.learnedWords[key] = today;
      }
    }
  }

  state.stars += starsGained;
  state.totalQuizzes += 1;

  const flawlessQuizJustFinished = results.length > 0 && results.every((r) => r.correct);
  const { count: streakCount } = getStreak(profileId);
  const newlyEarnedBadgeIds = evaluateBadges(state, { flawlessQuizJustFinished, streakCount });
  for (const badgeId of newlyEarnedBadgeIds) {
    state.earnedBadges.push({ badgeId, earnedAt: new Date().toISOString() });
  }

  saveGamificationState(profileId, state);

  const levelAfter = getLevel(state.stars);

  return {
    state,
    starsGained,
    newlyEarnedBadgeIds,
    leveledUp: levelAfter.id > levelBefore.id,
  };
}

export function getDailyGoalTarget(profileId: string): number {
  return getGamificationState(profileId).dailyGoalTarget;
}

export function setDailyGoalTarget(profileId: string, target: number): void {
  const state = getGamificationState(profileId);
  state.dailyGoalTarget = Math.max(1, Math.round(target));
  saveGamificationState(profileId, state);
}

export function getStatsSummary(profileId: string): StatsSummary {
  const state = getGamificationState(profileId);
  const today = todayIso();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoIso = weekAgo.toISOString().slice(0, 10);

  const dates = Object.values(state.learnedWords);
  const weeklyWordsLearned = dates.filter((d) => d >= weekAgoIso).length;
  const todayWordsLearned = dates.filter((d) => d === today).length;
  const accuracyPct =
    state.totalAnsweredQuestions > 0
      ? Math.round((state.totalCorrectAnswers / state.totalAnsweredQuestions) * 100)
      : 0;

  return {
    weeklyWordsLearned,
    accuracyPct,
    totalQuizzes: state.totalQuizzes,
    todayWordsLearned,
  };
}
