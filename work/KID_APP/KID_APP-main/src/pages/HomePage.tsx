import { BadgeWall } from "../components/common/BadgeWall";
import { ThemeCard, type ThemeProgress } from "../components/common/ThemeCard";
import type { Theme } from "../types/content";

type HomePageProps = {
  themes: Theme[];
  themeProgress: Record<string, ThemeProgress>;
  badgeItems: Array<{
    id: string;
    title: string;
    statusLabel: string;
    progressPercent: number;
    tone: "new" | "active" | "done";
  }>;
  continueThemeTitle: string;
  continueThemeSubtitle: string;
  continueProgressPercent: number;
  onResumeTheme: () => void;
  lastPlayedThemeTitle: string;
  learnedWordsCount: number;
  totalStars: number;
  onOpenParent: () => void;
  onSelectTheme: (themeId: string) => void;
};

export function HomePage({
  themes,
  themeProgress,
  badgeItems,
  continueThemeTitle,
  continueThemeSubtitle,
  continueProgressPercent,
  onResumeTheme,
  lastPlayedThemeTitle,
  learnedWordsCount,
  totalStars,
  onOpenParent,
  onSelectTheme,
}: HomePageProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">首页</span>
          <h2>今天想玩什么？</h2>
        </div>
        <button type="button" className="button-secondary" onClick={onOpenParent}>
          家长入口
        </button>
      </div>

      <div className="home-summary">
        <p className="home-meta">最近常玩：{lastPlayedThemeTitle}</p>
        <p className="home-meta">已学单词：{learnedWordsCount}</p>
        <p className="home-meta">累计星星：{totalStars}</p>
      </div>

      <section className="continue-card">
        <div>
          <span className="eyebrow">继续学习</span>
          <h3>{continueThemeTitle}</h3>
          <p>{continueThemeSubtitle}</p>
        </div>
        <div className="continue-card__aside">
          <div className="continue-card__progress">
            <span>当前进度</span>
            <strong>{continueProgressPercent}%</strong>
          </div>
          <button type="button" onClick={onResumeTheme}>
            继续挑战
          </button>
        </div>
      </section>

      <BadgeWall title="今天已经点亮了哪些主题" badges={badgeItems} compact />

      <div className="theme-grid">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            progress={themeProgress[theme.id]}
            onOpen={onSelectTheme}
          />
        ))}
      </div>
    </section>
  );
}
