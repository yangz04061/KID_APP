import { memo } from "react";

type BadgeItem = {
  id: string;
  title: string;
  statusLabel: string;
  progressPercent: number;
  tone: "new" | "active" | "done";
};

type BadgeWallProps = {
  title: string;
  badges: BadgeItem[];
  compact?: boolean;
};

function toneColor(tone: BadgeItem["tone"]) {
  switch (tone) {
    case "done":
      return "#22c55e";
    case "active":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}

export const BadgeWall = memo(function BadgeWall({ title, badges, compact = false }: BadgeWallProps) {
  return (
    <section className={`badge-wall ${compact ? "badge-wall--compact" : ""}`}>
      <div className="badge-wall__header">
        <span className="eyebrow">»ÕÕÂÇ½</span>
        <h3>{title}</h3>
      </div>
      <div className="badge-wall__grid">
        {badges.map((badge) => (
          <article key={badge.id} className={`badge-wall__card badge-wall__card--${badge.tone}`}>
            <svg viewBox="0 0 96 96" className="badge-wall__icon" aria-hidden="true">
              <circle cx="48" cy="40" r="24" fill={toneColor(badge.tone)} opacity="0.2" />
              <circle cx="48" cy="40" r="18" fill={toneColor(badge.tone)} />
              <path d="M38 62 L30 86 L48 74 L66 86 L58 62" fill={toneColor(badge.tone)} opacity="0.85" />
            </svg>
            <strong>{badge.title}</strong>
            <span>{badge.statusLabel}</span>
            <small>{badge.progressPercent}%</small>
          </article>
        ))}
      </div>
    </section>
  );
});
