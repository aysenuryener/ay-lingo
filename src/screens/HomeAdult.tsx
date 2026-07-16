import { useState } from "react";
import type { LoadedLanguage } from "../types/language";
import type { Profile } from "../types/profile";
import type { Screen } from "./Home";
import { getStreak } from "../lib/progressStore";
import { getGamificationState, getLevel, getStatsSummary, setDailyGoalTarget } from "../lib/storage";
import ProgressRing from "../components/ProgressRing";

interface HomeAdultProps {
  profile: Profile;
  language: LoadedLanguage;
  onNavigate: (screen: Screen) => void;
  onChangeLanguage: () => void;
  onChangeProfile: () => void;
}

export default function HomeAdult({
  profile,
  language,
  onNavigate,
  onChangeLanguage,
  onChangeProfile,
}: HomeAdultProps) {
  const streak = getStreak(profile.id);
  const stats = getStatsSummary(profile.id);
  const gamification = getGamificationState(profile.id);
  const level = getLevel(gamification.stars);
  const [goal, setGoal] = useState(gamification.dailyGoalTarget);

  function adjustGoal(delta: number) {
    const next = Math.max(1, goal + delta);
    setGoal(next);
    setDailyGoalTarget(profile.id, next);
  }

  return (
    <div className="screen">
      <header className="home-header">
        <div>
          <div className="home-header__greeting">Merhaba, {profile.name}</div>
          <div className="home-header__language">{language.meta.name} öğreniyorsun</div>
        </div>
        <div className="streak-badge" title="Günlük seri">
          🔥 {streak.count}
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__value">{stats.weeklyWordsLearned}</div>
          <div className="stat-card__label">bu hafta öğrenilen</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">%{stats.accuracyPct}</div>
          <div className="stat-card__label">doğruluk</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.totalQuizzes}</div>
          <div className="stat-card__label">çözülen sınav</div>
        </div>
      </div>

      <div className="daily-goal-row">
        <ProgressRing value={stats.todayWordsLearned} target={goal} size={72} />
        <div className="daily-goal-info">
          <div className="daily-goal-info__title">Günlük hedef</div>
          <div className="daily-goal-info__stepper">
            <button type="button" className="stepper-btn" onClick={() => adjustGoal(-1)} aria-label="Hedefi azalt">
              −
            </button>
            <span>{goal} kelime</span>
            <button type="button" className="stepper-btn" onClick={() => adjustGoal(1)} aria-label="Hedefi artır">
              +
            </button>
          </div>
        </div>
      </div>

      <div className="level-badge">{level.labelYetiskin}</div>

      <div className="home-menu">
        <button type="button" className="home-tile" onClick={() => onNavigate("flashcards")}>
          <span className="home-tile__emoji">🗂️</span>
          <span>Kelime Kartları</span>
        </button>
        <button type="button" className="home-tile" onClick={() => onNavigate("quiz")}>
          <span className="home-tile__emoji">🧩</span>
          <span>Quiz</span>
        </button>
        <button type="button" className="home-tile" onClick={() => onNavigate("progress")}>
          <span className="home-tile__emoji">📈</span>
          <span>İlerleme</span>
        </button>
      </div>

      <div className="home-footer">
        <button type="button" className="btn btn--ghost" onClick={onChangeLanguage}>
          Dil Değiştir
        </button>
        <button type="button" className="btn btn--ghost" onClick={onChangeProfile}>
          Profil Değiştir
        </button>
      </div>
    </div>
  );
}
