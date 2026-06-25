import { GameRewardOverlay } from "../components/common/GameRewardOverlay";
import { useEffect } from "react";
import { WordArt } from "../components/common/WordArt";
import type { Theme, Word } from "../types/content";

type MatchGamePageProps = {
  theme: Theme;
  promptWord: Word;
  options: Word[];
  roundIndex: number;
  roundCount: number;
  showChinese: boolean;
  autoPlay: boolean;
  sessionStars: number;
  feedback: "idle" | "success" | "retry";
  onSpeakWord: (text: string) => void;
  onAnswer: (wordId: string) => void;
  onBack: () => void;
};

export function MatchGamePage({
  theme,
  promptWord,
  options,
  roundIndex,
  roundCount,
  showChinese,
  autoPlay,
  sessionStars,
  feedback,
  onSpeakWord,
  onAnswer,
  onBack,
}: MatchGamePageProps) {
  const feedbackText =
    feedback === "retry"
      ? "再试一次，把它送回正确的小房子。"
      : feedback === "success"
        ? "送对啦，继续前进。"
        : "看清楚目标，再点对应的小房子。";

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    onSpeakWord(promptWord.en);
  }, [autoPlay, onSpeakWord, promptWord]);

  return (
    <section className={`panel game-panel ${theme.accent}`}>
      <div className="game-panel__floaters" aria-hidden="true">
        <span className="game-panel__floater game-panel__floater--a" />
        <span className="game-panel__floater game-panel__floater--b" />
        <span className="game-panel__floater game-panel__floater--c" />
      </div>
      <GameRewardOverlay
        visible={feedback === "success"}
        title="送到家啦!"
        subtitle={`再拿 1 颗星星，现在一共有 ${sessionStars} 颗。`}
      />
      <div className="section-heading">
        <div>
          <span className="eyebrow">小游戏 2</span>
          <h2>图片配对</h2>
        </div>
        <button type="button" className="button-secondary" onClick={onBack}>
          返回首页
        </button>
      </div>

      <div className="game-panel__hero">
        <div>
          <div className="game-hero__topline">
            <p className="game-progress">第 {roundIndex + 1} / {roundCount} 题</p>
            <span className="game-score">⭐ {sessionStars}</span>
          </div>
          <div className="game-panel__promptline">
            <h3>把 {promptWord.en} 送回家</h3>
            <button type="button" className="button-secondary" onClick={() => onSpeakWord(promptWord.en)}>
              播放发音
            </button>
          </div>
          {showChinese ? <p className="game-hint">中文提示：{promptWord.zh}</p> : null}
          <p className={`game-feedback ${feedback === "retry" ? "is-retry" : ""}`}>{feedbackText}</p>
        </div>
        <WordArt word={promptWord} size="medium" />
      </div>

      <div className="match-grid">
        {options.map((word) => (
          <button
            key={word.id}
            type="button"
            className="match-target"
            onClick={() => onAnswer(word.id)}
          >
            <span className="match-target__roof" aria-hidden="true" />
            <WordArt word={word} size="medium" />
            <strong>{word.en}</strong>
            {showChinese ? <span>{word.zh}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
