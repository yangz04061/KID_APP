import { memo } from "react";
import { BadgeWall } from "../components/common/BadgeWall";

type CompletionPageProps = {
  themeTitle: string;
  starsEarned: number;
  learnedWordsCount: number;
  totalStars: number;
  badgeItems: Array<{
    id: string;
    title: string;
    statusLabel: string;
    progressPercent: number;
    tone: "new" | "active" | "done";
  }>;
  onReplay: () => void;
  onGoHome: () => void;
};

export const CompletionPage = memo(function CompletionPage({
  themeTitle,
  starsEarned,
  learnedWordsCount,
  totalStars,
  badgeItems,
  onReplay,
  onGoHome,
}: CompletionPageProps) {
  return (
    <section className="panel completion-panel">
      <span className="eyebrow">完成啦</span>
      <h2>{themeTitle} 探索完成</h2>
      <p className="completion-panel__lead">这次一共拿到了 {starsEarned} 颗星星。</p>

      <div className="completion-stats">
        <article>
          <strong>{learnedWordsCount}</strong>
          <span>本主题单词</span>
        </article>
        <article>
          <strong>{starsEarned}</strong>
          <span>本轮星星</span>
        </article>
        <article>
          <strong>{totalStars}</strong>
          <span>累计星星</span>
        </article>
      </div>

      <div className="completion-panel__actions">
        <button type="button" onClick={onReplay}>
          再玩一次
        </button>
        <button type="button" className="button-secondary" onClick={onGoHome}>
          返回首页
        </button>
      </div>

      <BadgeWall title="你的主题徽章" badges={badgeItems} />
    </section>
  );
});
