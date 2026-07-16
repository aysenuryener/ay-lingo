import { useEffect } from "react";
import confetti from "canvas-confetti";

export type CelebrationVariant = "full" | "subtle";

interface CelebrationProps {
  variant: CelebrationVariant;
  message: string;
  newlyEarnedBadgeNames?: string[];
  onContinue: () => void;
}

export default function Celebration({
  variant,
  message,
  newlyEarnedBadgeNames = [],
  onContinue,
}: CelebrationProps) {
  useEffect(() => {
    if (variant === "full") {
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 }, startVelocity: 45 });
      const timer = setTimeout(() => {
        confetti({ particleCount: 80, spread: 120, origin: { y: 0.35 }, startVelocity: 35 });
      }, 300);
      return () => clearTimeout(timer);
    }
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.4 }, scalar: 0.8 });
  }, [variant]);

  return (
    <div className={`celebration celebration--${variant}`}>
      {variant === "full" && (
        <div className="celebration__fireworks" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`firework firework--${i}`} />
          ))}
        </div>
      )}
      <div className="celebration__card">
        <div className="celebration__message">{message}</div>
        {newlyEarnedBadgeNames.length > 0 && (
          <div className="celebration__badges">
            {newlyEarnedBadgeNames.map((name) => (
              <span key={name} className="celebration__badge-pill">
                Yeni rozet: {name}
              </span>
            ))}
          </div>
        )}
        <button type="button" className="btn btn--primary" onClick={onContinue}>
          Devam Et
        </button>
      </div>
    </div>
  );
}
