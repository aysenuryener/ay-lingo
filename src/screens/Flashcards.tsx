import { useMemo, useState } from "react";
import type { LoadedLanguage } from "../types/language";
import type { WordLevel } from "../types/language";
import WordCard from "../components/WordCard";
import { formatCategory } from "../lib/format";

interface FlashcardsProps {
  language: LoadedLanguage;
  onBack: () => void;
}

const LEVEL_LABELS: Record<WordLevel, string> = {
  baslangic: "Başlangıç",
  orta: "Orta",
  ileri: "İleri",
};

export default function Flashcards({ language, onBack }: FlashcardsProps) {
  const categories = useMemo(
    () => Array.from(new Set(language.words.map((w) => w.category))).sort(),
    [language]
  );

  const [category, setCategory] = useState<string>("hepsi");
  const [level, setLevel] = useState<string>("hepsi");

  const filtered = language.words.filter(
    (w) => (category === "hepsi" || w.category === category) && (level === "hepsi" || w.level === level)
  );

  return (
    <div className="screen">
      <div className="screen-header">
        <button type="button" className="back-button" onClick={onBack} aria-label="Geri">
          ←
        </button>
        <h2>Kelime Kartları</h2>
      </div>

      <div className="filters">
        <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="hepsi">Tüm seviyeler</option>
          {(Object.keys(LEVEL_LABELS) as WordLevel[]).map((lvl) => (
            <option key={lvl} value={lvl}>
              {LEVEL_LABELS[lvl]}
            </option>
          ))}
        </select>
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="hepsi">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {formatCategory(c)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-message">Bu filtrede kelime bulunamadı.</p>
      ) : (
        <div className="card-grid">
          {filtered.map((w) => (
            <WordCard key={w.id} word={w} speechLang={language.meta.speechLang} />
          ))}
        </div>
      )}
    </div>
  );
}
