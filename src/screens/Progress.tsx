import { useMemo } from "react";
import type { LoadedLanguage } from "../types/language";
import type { Profile } from "../types/profile";
import { getProgress, getStreak } from "../lib/progressStore";
import { isLearned } from "../lib/srs";
import { formatCategory } from "../lib/format";

interface ProgressScreenProps {
  profile: Profile;
  language: LoadedLanguage;
  onBack: () => void;
}

export default function ProgressScreen({ profile, language, onBack }: ProgressScreenProps) {
  const progress = getProgress(profile.id, language.meta.code);
  const streak = getStreak(profile.id);

  const totalLearned = language.words.filter((w) => isLearned(progress[w.id])).length;
  const totalWords = language.words.length;

  const categoryStats = useMemo(() => {
    const map = new Map<string, { total: number; learned: number }>();
    for (const w of language.words) {
      const entry = map.get(w.category) ?? { total: 0, learned: 0 };
      entry.total += 1;
      if (isLearned(progress[w.id])) entry.learned += 1;
      map.set(w.category, entry);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "tr"));
  }, [language, progress]);

  return (
    <div className="screen">
      <div className="screen-header">
        <button type="button" className="back-button" onClick={onBack} aria-label="Geri">
          ←
        </button>
        <h2>İlerleme</h2>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__value">{totalLearned}</div>
          <div className="stat-card__label">öğrenilen kelime</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">🔥 {streak.count}</div>
          <div className="stat-card__label">günlük seri</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{totalWords}</div>
          <div className="stat-card__label">toplam kelime</div>
        </div>
      </div>

      <h3 className="section-title">Kategoriye göre ilerleme</h3>
      <div className="category-progress-list">
        {categoryStats.map(([category, stat]) => {
          const pct = stat.total > 0 ? Math.round((stat.learned / stat.total) * 100) : 0;
          return (
            <div key={category} className="category-progress">
              <div className="category-progress__label">
                <span>{formatCategory(category)}</span>
                <span>
                  {stat.learned}/{stat.total}
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
