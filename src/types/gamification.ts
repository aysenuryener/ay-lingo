export interface LevelInfo {
  id: number;
  minStars: number;
  labelCocuk: string;
  labelYetiskin: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

/** All gamification data for one profile, shared across languages. */
export interface GamificationState {
  stars: number;
  totalQuizzes: number;
  totalCorrectAnswers: number;
  totalAnsweredQuestions: number;
  earnedBadges: EarnedBadge[];
  dailyGoalTarget: number;
  /** `${languageCode}:${wordId}` -> ISO date of first correct answer. */
  learnedWords: Record<string, string>;
}

export interface StatsSummary {
  weeklyWordsLearned: number;
  accuracyPct: number;
  totalQuizzes: number;
  todayWordsLearned: number;
}

export interface BadgeEvaluationContext {
  flawlessQuizJustFinished: boolean;
  streakCount: number;
}
