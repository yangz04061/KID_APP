import { useEffect } from "react";
import { WordArt } from "../components/common/WordArt";
import type { Theme, Word } from "../types/content";

type ThemePageProps = {
  theme: Theme;
  previewWords: Word[];
  previewIndex: number;
  showChinese: boolean;
  autoPlay: boolean;
  onSpeakWord: (text: string) => void;
  onBack: () => void;
  onNextWord: () => void;
  onRestartPreview: () => void;
  onOpenParent: () => void;
};

export function ThemePage({
  theme,
  previewWords,
  previewIndex,
  showChinese,
  autoPlay,
  onSpeakWord,
  onBack,
  onNextWord,
  onRestartPreview,
  onOpenParent,
}: ThemePageProps) {
  const currentWord = previewWords[previewIndex] ?? previewWords[0];
  const isLastWord = previewIndex >= previewWords.length - 1;

  useEffect(() => {
    if (!autoPlay || !currentWord) {
      return;
    }

    onSpeakWord(currentWord.en);
  }, [autoPlay, currentWord, onSpeakWord]);

  return (
    <section className={`panel story-panel ${theme.accent}`}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">主题页</span>
          <h2>{theme.title}</h2>
        </div>
        <div className="section-actions">
          <button type="button" className="button-secondary" onClick={onOpenParent}>
            家长区
          </button>
          <button type="button" className="button-secondary" onClick={onBack}>
            返回首页
          </button>
        </div>
      </div>

      <div className="story-panel__layout">
        <div className="story-panel__scene">
          <h3>主题场景</h3>
          <p>{theme.spotlight}</p>
          <div className="story-panel__actions">
            <button type="button" onClick={onNextWord}>
              {previewIndex === 0 ? "开始探索" : "继续看单词"}
            </button>
            <button type="button" className="button-secondary" onClick={onRestartPreview}>
              重新预览
            </button>
          </div>

          <div className="game-strip" aria-label="后续游戏预告">
            <span className="game-pill">听声音选图片</span>
            <span className="game-pill">图片配对</span>
            <span className="game-pill">场景找一找</span>
          </div>
        </div>

        <div className="word-preview">
          <h3>单词预览</h3>
          <div className="word-preview__card">
            <span className="word-preview__progress">
              第 {previewIndex + 1} / {previewWords.length} 个
            </span>
            <div className="word-preview__illustration">
              <WordArt word={currentWord} size="large" />
            </div>
            <strong>{currentWord.en}</strong>
            {showChinese ? <span>{currentWord.zh}</span> : <span>中文释义已隐藏</span>}
            <div className="word-preview__actions">
              <button
                type="button"
                className="button-secondary"
                onClick={() => onSpeakWord(currentWord.en)}
              >
                播放发音
              </button>
              <button type="button" onClick={onNextWord}>
                {isLastWord ? "完成预览" : "下一个"}
              </button>
              <button type="button" className="button-secondary" onClick={onRestartPreview}>
                从头开始
              </button>
            </div>
          </div>

          <ul className="word-preview__list">
            {previewWords.map((word) => (
              <li key={word.id} className={word.id === currentWord.id ? "is-active" : undefined}>
                <strong>
                  <span className="word-inline-art">
                    <WordArt word={word} size="small" />
                  </span>
                  {word.en}
                </strong>
                {showChinese ? <span>{word.zh}</span> : <span>中文隐藏</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
