import { speak } from "../lib/tts";

interface SpeakerButtonProps {
  text: string;
  langCode: string;
  size?: "normal" | "large";
}

export default function SpeakerButton({ text, langCode, size = "normal" }: SpeakerButtonProps) {
  return (
    <button
      type="button"
      className={`speaker-button ${size === "large" ? "speaker-button--large" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, langCode);
      }}
      aria-label={`${text} kelimesini seslendir`}
    >
      🔊
    </button>
  );
}
