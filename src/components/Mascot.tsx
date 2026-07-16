export type MascotMood = "idle" | "happy" | "soft-sad";

interface MascotProps {
  mood?: MascotMood;
  size?: number;
}

/** Hand-drawn SVG owl mascot — no external image asset. */
export default function Mascot({ mood = "idle", size = 88 }: MascotProps) {
  return (
    <div className={`mascot mascot--${mood}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="50" cy="58" rx="34" ry="32" fill="#caa06c" />
        <ellipse cx="50" cy="58" rx="24" ry="24" fill="#f2dcb8" />
        <path d="M18 34 Q26 6 40 26 Z" fill="#caa06c" />
        <path d="M82 34 Q74 6 60 26 Z" fill="#caa06c" />
        <circle cx="37" cy="52" r="13" fill="white" />
        <circle cx="63" cy="52" r="13" fill="white" />
        <circle className="mascot__pupil" cx="38" cy="53" r="6" fill="#2b2a33" />
        <circle className="mascot__pupil" cx="62" cy="53" r="6" fill="#2b2a33" />
        <path d="M45 64 L50 71 L55 64 Z" fill="#e0a458" />
        <path className="mascot__wing mascot__wing--left" d="M20 60 Q10 78 26 88 Q22 70 30 62 Z" fill="#b98a54" />
        <path className="mascot__wing mascot__wing--right" d="M80 60 Q90 78 74 88 Q78 70 70 62 Z" fill="#b98a54" />
        {mood === "soft-sad" ? (
          <path d="M32 78 Q50 72 68 78" stroke="#8a6a3f" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M32 76 Q50 88 68 76" stroke="#8a6a3f" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}
