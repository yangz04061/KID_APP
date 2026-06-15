import type { Theme } from "../../types/content";

export type ThemeProgress = {
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
  statusLabel: string;
  statusTone: "new" | "active" | "done";
};

type ThemeCardProps = {
  theme: Theme;
  progress: ThemeProgress;
  onOpen: (themeId: string) => void;
};

export function ThemeCard({ theme, progress, onOpen }: ThemeCardProps) {
  return (
    <article className={`theme-card ${theme.accent}`}>
      <div className="theme-card__topline">
        <span className="theme-card__eyebrow">主题探索</span>
        <span className={`theme-card__status theme-card__status--${progress.statusTone}`}>
          {progress.statusLabel}
        </span>
      </div>
      <h3>{theme.title}</h3>
      <p>{theme.subtitle}</p>
      <strong>{theme.spotlight}</strong>
      <div className="theme-card__progress">
        <div className="theme-card__progress-meta">
          <span>
            已学 {progress.learnedCount} / {progress.totalCount}
          </span>
          <span>{progress.progressPercent}%</span>
        </div>
        <div className="theme-card__progress-track" aria-hidden="true">
          <div
            className="theme-card__progress-fill"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>
      <button type="button" onClick={() => onOpen(theme.id)}>
        开始玩
      </button>
    </article>
  );
}
