type NavScreen = "home" | "album" | "parent";

type AppNavigationProps = {
  activeScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
};

const navItems: Array<{ id: NavScreen; label: string }> = [
  { id: "home", label: "首页" },
  { id: "album", label: "收藏册" },
  { id: "parent", label: "家长区" },
];

export function AppNavigation({ activeScreen, onNavigate }: AppNavigationProps) {
  return (
    <nav className="app-nav" aria-label="主导航">
      <div className="app-nav__brand">
        <span className="eyebrow">Kid App</span>
        <strong>英语探索乐园</strong>
      </div>
      <div className="app-nav__tabs">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activeScreen ? "app-nav__tab is-active" : "app-nav__tab"}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
