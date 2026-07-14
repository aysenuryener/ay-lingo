import type { LoadedLanguage } from "../types/language";
import type { Profile } from "../types/profile";
import { getStreak } from "../lib/progressStore";

export type Screen = "flashcards" | "quiz" | "progress";

interface HomeProps {
  profile: Profile;
  language: LoadedLanguage;
  onNavigate: (screen: Screen) => void;
  onChangeLanguage: () => void;
  onChangeProfile: () => void;
}

export default function Home({
  profile,
  language,
  onNavigate,
  onChangeLanguage,
  onChangeProfile,
}: HomeProps) {
  const streak = getStreak(profile.id);

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
