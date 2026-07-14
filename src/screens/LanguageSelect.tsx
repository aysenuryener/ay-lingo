import type { LoadedLanguage } from "../types/language";
import { getLanguageErrors, getLanguages } from "../lib/languages";

interface LanguageSelectProps {
  profileName: string;
  onSelect: (language: LoadedLanguage) => void;
}

export default function LanguageSelect({ profileName, onSelect }: LanguageSelectProps) {
  const languages = getLanguages();
  const errors = getLanguageErrors();

  return (
    <div className="screen screen--center">
      <h1 className="app-title">AY Lingo</h1>
      <p className="subtitle">
        Merhaba {profileName}! Hangi dili öğrenmek istersin?
      </p>

      <div className="language-list">
        {languages.map((lang) => (
          <button
            key={lang.meta.code}
            type="button"
            className="language-card"
            onClick={() => onSelect(lang)}
          >
            <div className="language-card__name">{lang.meta.name}</div>
            <div className="language-card__native">{lang.meta.nativeName}</div>
            <div className="language-card__count">{lang.words.length} kelime</div>
          </button>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="language-errors">
          <p>Bazı dil dosyaları yüklenemedi:</p>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
