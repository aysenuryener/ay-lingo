import type { Badge, BadgeEvaluationContext, GamificationState } from "../types/gamification";

export const BADGES: Badge[] = [
  {
    id: "ilk-10-kelime",
    name: "İlk 10 Kelime",
    description: "10 kelimeyi doğru bildin",
    icon: "🔤",
  },
  {
    id: "hatasiz-sinav",
    name: "Hatasız Sınav",
    description: "Bir sınavı hiç yanlış yapmadan bitirdin",
    icon: "🎯",
  },
  {
    id: "3-gun-serisi",
    name: "3 Gün Serisi",
    description: "3 gün üst üste giriş yaptın",
    icon: "🔥",
  },
  {
    id: "50-yildiz",
    name: "50 Yıldız",
    description: "50 yıldız topladın",
    icon: "⭐",
  },
  {
    id: "100-yildiz",
    name: "100 Yıldız",
    description: "100 yıldız topladın",
    icon: "🌟",
  },
];

/** Returns the ids of badges newly earned as of this state + context (idempotent). */
export function evaluateBadges(
  state: GamificationState,
  context: BadgeEvaluationContext
): string[] {
  const already = new Set(state.earnedBadges.map((b) => b.badgeId));
  const newlyEarned: string[] = [];

  function earn(id: string, condition: boolean) {
    if (condition && !already.has(id)) newlyEarned.push(id);
  }

  const distinctLearned = Object.keys(state.learnedWords).length;

  earn("ilk-10-kelime", distinctLearned >= 10);
  earn("hatasiz-sinav", context.flawlessQuizJustFinished);
  earn("3-gun-serisi", context.streakCount >= 3);
  earn("50-yildiz", state.stars >= 50);
  earn("100-yildiz", state.stars >= 100);

  return newlyEarned;
}
