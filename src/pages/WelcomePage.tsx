type WelcomePageProps = {
  onStart: () => void;
  onOpenParent: () => void;
};

export function WelcomePage({ onStart, onOpenParent }: WelcomePageProps) {
  return (
    <section className="panel hero-panel">
      <div className="hero-panel__copy">
        <span className="eyebrow">欢迎来到</span>
        <h1>幼儿英语启蒙小游戏</h1>
        <p>围绕动物、汽车和工程车主题，用轻交互帮孩子认识英文单词。</p>
        <div className="hero-panel__actions">
          <button type="button" onClick={onStart}>
            开始探索
          </button>
          <button type="button" className="button-secondary" onClick={onOpenParent}>
            家长看看
          </button>
        </div>
      </div>
      <div className="hero-panel__art" aria-hidden="true">
        <div className="art-bubble art-bubble--large">cat</div>
        <div className="art-bubble art-bubble--medium">bus</div>
        <div className="art-bubble art-bubble--small">crane</div>
      </div>
    </section>
  );
}
