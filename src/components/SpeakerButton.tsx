import { useState } from "react";
import { speak } from "../lib/tts";

interface SpeakerButtonProps {
  text: string;
  langCode: string;
  size?: "normal" | "large";
}

export default function SpeakerButton({ text, langCode, size = "normal" }: SpeakerButtonProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <button
      type="button"
      className={`speaker-button ${size === "large" ? "speaker-button--large" : ""} ${
        playing ? "speaker-button--playing" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setPlaying(true);
        speak(text, langCode, {
          onStart: () => setPlaying(true),
          onEnd: () => setPlaying(false),
        });
      }}
      aria-label={`${text} kelimesini seslendir`}
    >
      🔊
    </button>
  );
}
