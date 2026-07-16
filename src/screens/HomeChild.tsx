import type { LoadedLanguage } from "../types/language";
import type { Profile } from "../types/profile";
import type { Screen } from "./Home";
import { getStreak } from "../lib/progressStore";
import { getGamificationState, getLevel } from "../lib/storage";
import Mascot from "../components/Mascot";
import BadgeShowcase from "../components/BadgeShowcase";

interface HomeChildProps {
  profile: Profile;
  language: LoadedLanguage;
  onNavigate: (screen: Screen) => void;
  onChangeLanguage: () => void;
  onChangeProfile: () => void;
}

export default function HomeChild({
  profile,
  language,
  onNavigate,
  onChangeLanguage,
  onChangeProfile,
}: HomeChildProps) {
  const streak = getStreak(profile.id);
  const gamification = getGamificationState(profile.id);
  const level = getLevel(gamification.stars);

  return (
    <div className="screen">
      <header className="home-header home-header--kid">
        <Mascot mood="idle" size={64} />
        <div>
          <div className="home-header__greeting">Merhaba, {profile.name}! 👋</div>
          <div className="home-header__language">{language.meta.name} öğreniyorsun</div>
        </div>
      </header>

      <div className="kid-stat-row">
        <div className="kid-stat-chip">⭐ {gamification.stars}</div>
        <div className="kid-stat-chip">{level.labelCocuk}</div>
        <div className="kid-stat-chip">🔥 {streak.count} gün</div>
      </div>

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

      <h3 className="section-title">Rozetlerim</h3>
      <BadgeShowcase earnedBadges={gamification.earnedBadges} />

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
