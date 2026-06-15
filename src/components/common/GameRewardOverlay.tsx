type GameRewardOverlayProps = {
  visible: boolean;
  title: string;
  subtitle: string;
};

export function GameRewardOverlay({ visible, title, subtitle }: GameRewardOverlayProps) {
  return (
    <div className={visible ? "reward-overlay is-visible" : "reward-overlay"} aria-hidden={!visible}>
      <div className="reward-overlay__card">
        <div className="reward-overlay__stars">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <strong>{title}</strong>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
