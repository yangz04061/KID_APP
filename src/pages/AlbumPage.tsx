import { WordArt } from "../components/common/WordArt";
import type { Theme, Word } from "../types/content";

type AlbumTheme = {
  theme: Theme;
  words: Array<{
    word: Word;
    unlocked: boolean;
  }>;
};

type AlbumPageProps = {
  totalUnlocked: number;
  totalWords: number;
  themes: AlbumTheme[];
  onOpenTheme: (themeId: string) => void;
};

export function AlbumPage({ totalUnlocked, totalWords, themes, onOpenTheme }: AlbumPageProps) {
  return (
    <section className="panel album-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">收藏册</span>
          <h2>我的单词收藏</h2>
        </div>
        <div className="album-panel__summary">
          <strong>
            {totalUnlocked} / {totalWords}
          </strong>
          <span>已点亮单词</span>
        </div>
      </div>

      <div className="album-groups">
        {themes.map(({ theme, words }) => (
          <article key={theme.id} className={`album-group ${theme.accent}`}>
            <div className="album-group__header">
              <div>
                <h3>{theme.title}</h3>
                <p>{theme.subtitle}</p>
              </div>
              <button type="button" className="button-secondary" onClick={() => onOpenTheme(theme.id)}>
                去探索
              </button>
            </div>

            <div className="album-word-grid">
              {words.map(({ word, unlocked }) => (
                <article
                  key={word.id}
                  className={unlocked ? "album-word-card is-unlocked" : "album-word-card is-locked"}
                >
                  <WordArt word={word} size="medium" />
                  <strong>{unlocked ? word.en : "???"}</strong>
                  <span>{unlocked ? word.zh : "继续探索后解锁"}</span>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
