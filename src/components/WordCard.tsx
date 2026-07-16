import { useState } from "react";
import type { WordWithId } from "../types/language";
import { speak } from "../lib/tts";
import SpeakerButton from "./SpeakerButton";

interface WordCardProps {
  word: WordWithId;
  speechLang: string;
}

export default function WordCard({ word, speechLang }: WordCardProps) {
  const [revealed, setRevealed] = useState(false);

  function toggle() {
    setRevealed((r) => !r);
    speak(word.word, speechLang);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`word-card ${revealed ? "word-card--revealed" : ""}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div className="word-card__emoji">{word.emoji || "🔤"}</div>
      <div className="word-card__word">{word.word}</div>
      <div className="word-card__reading">{word.reading}</div>
      {revealed && <div className="word-card__meaning">{word.meaning}</div>}
      <div className="word-card__speaker">
        <SpeakerButton text={word.word} langCode={speechLang} size="large" />
      </div>
    </div>
  );
}
