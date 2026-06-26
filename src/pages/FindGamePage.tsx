import { memo } from "react";
import { GameRewardOverlay } from "../components/common/GameRewardOverlay";
import { useEffect } from "react";
import { WordArt } from "../components/common/WordArt";
import type { Theme, Word } from "../types/content";

type FindGamePageProps = {
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

export const FindGamePage = memo(function FindGamePage({
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
}: FindGamePageProps) {
  const feedbackText =
    feedback === "retry"
      ? "还没找到，看看场景里的其他位置。"
      : feedback === "success"
        ? "找到了，继续去探险。"
        : "在场景里找到目标，轻轻点一下。";

  useEffect(() => {
    if (!autoPlay) return;
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
        title="找到啦"
        subtitle={`你已经收集了 ${sessionStars} 颗星星。`}
      />
      <div className="section-heading">
        <div>
          <span className="eyebrow">小游戏 3</span>
          <h2>场景找一找</h2>
        </div>
        <button type="button" className="button-secondary" onClick={onBack}>
          返回首页
        </button>
      </div>

      <div className="game-panel__hero">
        <div>
          <div className="game-hero__topline">
            <p className="game-progress">第 {roundIndex + 1} / {roundCount} 题</p>
            <span className="game-score">{sessionStars}</span>
          </div>
          <div className="game-panel__promptline">
            <h3>Find the {promptWord.en}</h3>
            <button type="button" className="button-secondary" onClick={() => onSpeakWord(promptWord.en)}>
              播放发音
            </button>
          </div>
          {showChinese ? <p className="game-hint">中文提示：找到 {promptWord.zh}</p> : null}
          <p className={`game-feedback ${feedback === "retry" ? "is-retry" : ""}`}>{feedbackText}</p>
        </div>
        <WordArt word={promptWord} size="medium" />
      </div>

      <div className="scene-board" role="group" aria-label="场景热区">
        {options.map((word, index) => (
          <button
            key={word.id}
            type="button"
            className={`scene-hotspot scene-hotspot--${index}`}
            onClick={() => onAnswer(word.id)}
          >
            <WordArt word={word} size="small" />
            <strong>{word.en}</strong>
            {showChinese ? <span>{word.zh}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
});
