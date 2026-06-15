type ParentSettings = {
  bgm: boolean;
  autoPlay: boolean;
  showChinese: boolean;
};

type ThemeProgressCard = {
  id: string;
  title: string;
  learnedCount: number;
  totalCount: number;
  progressPercent: number;
  statusLabel: string;
};

type ParentPageProps = {
  learnedWordsCount: number;
  completedThemesCount: number;
  lastPlayedThemeTitle: string;
  totalStars: number;
  themeCards: ThemeProgressCard[];
  settings: ParentSettings;
  onToggleSetting: (settingName: keyof ParentSettings) => void;
  onBack: () => void;
};

export function ParentPage({
  learnedWordsCount,
  completedThemesCount,
  lastPlayedThemeTitle,
  totalStars,
  themeCards,
  settings,
  onToggleSetting,
  onBack,
}: ParentPageProps) {
  return (
    <section className="panel parent-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">家长区</span>
          <h2>学习进度与设置</h2>
        </div>
        <button type="button" onClick={onBack}>
          返回首页
        </button>
      </div>

      <div className="parent-grid">
        <article>
          <h3>学习进度</h3>
          <p>已学单词：{learnedWordsCount}</p>
          <p>最近常玩：{lastPlayedThemeTitle}</p>
          <p>完成主题：{completedThemesCount} / 3</p>
          <p>累计星星：{totalStars}</p>
        </article>

        <article>
          <h3>使用设置</h3>
          <div className="setting-list">
            <button type="button" className="setting-row" onClick={() => onToggleSetting("bgm")}>
              <span>背景音乐</span>
              <strong>{settings.bgm ? "开" : "关"}</strong>
            </button>
            <button
              type="button"
              className="setting-row"
              onClick={() => onToggleSetting("autoPlay")}
            >
              <span>自动播放</span>
              <strong>{settings.autoPlay ? "开" : "关"}</strong>
            </button>
            <button
              type="button"
              className="setting-row"
              onClick={() => onToggleSetting("showChinese")}
            >
              <span>中文释义</span>
              <strong>{settings.showChinese ? "显示" : "隐藏"}</strong>
            </button>
          </div>
        </article>
      </div>

      <section className="parent-progress-panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">主题进度</span>
            <h3>每个主题学到了多少</h3>
          </div>
        </div>

        <div className="parent-theme-grid">
          {themeCards.map((theme) => (
            <article key={theme.id} className="parent-theme-card">
              <div className="parent-theme-card__topline">
                <strong>{theme.title}</strong>
                <span>{theme.statusLabel}</span>
              </div>
              <p>
                已学 {theme.learnedCount} / {theme.totalCount}
              </p>
              <div className="parent-theme-card__track" aria-hidden="true">
                <div
                  className="parent-theme-card__fill"
                  style={{ width: `${theme.progressPercent}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
