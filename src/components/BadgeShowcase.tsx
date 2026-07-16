import { BADGES } from "../lib/badges";
import type { EarnedBadge } from "../types/gamification";

interface BadgeShowcaseProps {
  earnedBadges: EarnedBadge[];
}

export default function BadgeShowcase({ earnedBadges }: BadgeShowcaseProps) {
  const earnedIds = new Set(earnedBadges.map((b) => b.badgeId));

  return (
    <div className="badge-showcase">
      {BADGES.map((badge) => {
        const earned = earnedIds.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`badge-chip ${earned ? "badge-chip--earned" : "badge-chip--locked"}`}
            title={badge.description}
          >
            <span className="badge-chip__icon">{earned ? badge.icon : "🔒"}</span>
            <span className="badge-chip__name">{badge.name}</span>
          </div>
        );
      })}
    </div>
  );
}
