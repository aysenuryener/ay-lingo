import type { ProgressMap, SrsResult, StreakState } from "../types/profile";
import { createInitialCardState, reviewCard } from "./srs";

function progressKey(profileId: string, languageCode: string): string {
  return `ay-lingo:progress:${profileId}:${languageCode}`;
}

function streakKey(profileId: string): string {
  return `ay-lingo:streak:${profileId}`;
}

export function getProgress(profileId: string, languageCode: string): ProgressMap {
  try {
    const raw = localStorage.getItem(progressKey(profileId, languageCode));
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(profileId: string, languageCode: string, progress: ProgressMap): void {
  localStorage.setItem(progressKey(profileId, languageCode), JSON.stringify(progress));
}

export function recordAnswer(
  profileId: string,
  languageCode: string,
  wordId: string,
  result: SrsResult
): ProgressMap {
  const progress = getProgress(profileId, languageCode);
  const current = progress[wordId] ?? createInitialCardState();
  progress[wordId] = reviewCard(current, result);
  saveProgress(profileId, languageCode, progress);
  bumpStreak(profileId);
  return progress;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getStreak(profileId: string): StreakState {
  try {
    const raw = localStorage.getItem(streakKey(profileId));
    return raw ? (JSON.parse(raw) as StreakState) : { count: 0, lastActiveDate: "" };
  } catch {
    return { count: 0, lastActiveDate: "" };
  }
}

function bumpStreak(profileId: string): void {
  const streak = getStreak(profileId);
  const today = todayIso();
  if (streak.lastActiveDate === today) return;
  const isConsecutive = streak.lastActiveDate === yesterdayIso();
  const next: StreakState = {
    count: isConsecutive ? streak.count + 1 : 1,
    lastActiveDate: today,
  };
  localStorage.setItem(streakKey(profileId), JSON.stringify(next));
}
