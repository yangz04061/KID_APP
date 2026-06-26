import { memo } from "react";
import { GameRewardOverlay } from "../components/common/GameRewardOverlay";
import { useEffect } from "react";
import { WordArt } from "../components/common/WordArt";
import type { Theme, Word } from "../types/content";

type ListenPickGamePageProps = {
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

export const ListenPickGamePage = memo(function ListenPickGamePage({
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
}: ListenPickGamePageProps) {
  const feedbackText =
    feedback === "retry"
      ? "再试一次，轻轻点你听到的图片。"
      : feedback === "success"
        ? "太棒啦，答对了。"
        : "听一听，然后选出正确图片。";

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
        title="太棒啦"
        subtitle={`你又收集了 1 颗星星，现在有 ${sessionStars} 颗。`}
      />
      <div className="section-heading">
        <div>
          <span className="eyebrow">小游戏 1</span>
          <h2>听声音选图片</h2>
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
            <h3>请找出：{promptWord.en}</h3>
            <button type="button" className="button-secondary" onClick={() => onSpeakWord(promptWord.en)}>
              播放发音
            </button>
          </div>
          {showChinese ? <p className="game-hint">中文提示：{promptWord.zh}</p> : null}
          <p className={`game-feedback ${feedback === "retry" ? "is-retry" : ""}`}>{feedbackText}</p>
        </div>
        <WordArt word={promptWord} size="medium" />
      </div>

      <div className="game-options">
        {options.map((word) => (
          <button
            key={word.id}
            type="button"
            className="game-option"
            onClick={() => onAnswer(word.id)}
          >
            <WordArt word={word} size="medium" />
            <strong>{word.en}</strong>
            {showChinese ? <span>{word.zh}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
});
