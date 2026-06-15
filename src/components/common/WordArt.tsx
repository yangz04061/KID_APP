import type { Word } from "../../types/content";

type WordArtProps = {
  word: Word;
  size?: "small" | "medium" | "large";
};

function renderWordShape(wordId: string) {
  switch (wordId) {
    case "cat":
      return (
        <>
          <polygon points="26,44 42,22 50,46" fill="#f8b84b" />
          <polygon points="70,46 78,22 94,44" fill="#f8b84b" />
          <circle cx="60" cy="64" r="34" fill="#ffc95f" />
          <circle cx="48" cy="62" r="4" fill="#16324f" />
          <circle cx="72" cy="62" r="4" fill="#16324f" />
          <ellipse cx="60" cy="76" rx="8" ry="6" fill="#ef8f72" />
        </>
      );
    case "dog":
      return (
        <>
          <ellipse cx="32" cy="54" rx="16" ry="24" fill="#8d5a3b" />
          <ellipse cx="88" cy="54" rx="16" ry="24" fill="#8d5a3b" />
          <circle cx="60" cy="62" r="32" fill="#c98c56" />
          <circle cx="48" cy="60" r="4" fill="#16324f" />
          <circle cx="72" cy="60" r="4" fill="#16324f" />
          <ellipse cx="60" cy="76" rx="12" ry="9" fill="#f7dcc5" />
        </>
      );
    case "lion":
      return (
        <>
          <circle cx="60" cy="60" r="38" fill="#d97706" />
          <circle cx="60" cy="60" r="26" fill="#ffd166" />
          <circle cx="50" cy="58" r="4" fill="#16324f" />
          <circle cx="70" cy="58" r="4" fill="#16324f" />
          <ellipse cx="60" cy="72" rx="8" ry="6" fill="#ef8f72" />
        </>
      );
    case "elephant":
      return (
        <>
          <circle cx="38" cy="58" r="18" fill="#9db7c7" />
          <circle cx="82" cy="58" r="18" fill="#9db7c7" />
          <circle cx="60" cy="58" r="28" fill="#b7ced9" />
          <rect x="52" y="66" width="16" height="28" rx="8" fill="#9db7c7" />
          <circle cx="50" cy="56" r="3.5" fill="#16324f" />
          <circle cx="70" cy="56" r="3.5" fill="#16324f" />
        </>
      );
    case "car":
      return (
        <>
          <rect x="24" y="54" width="72" height="26" rx="13" fill="#ff8f6b" />
          <path d="M38 54 L54 38 H78 L90 54 Z" fill="#ffb39a" />
          <circle cx="42" cy="82" r="10" fill="#16324f" />
          <circle cx="78" cy="82" r="10" fill="#16324f" />
        </>
      );
    case "bus":
      return (
        <>
          <rect x="18" y="42" width="84" height="38" rx="14" fill="#ffd166" />
          <rect x="28" y="50" width="46" height="12" rx="4" fill="#ffffff" />
          <circle cx="38" cy="82" r="9" fill="#16324f" />
          <circle cx="82" cy="82" r="9" fill="#16324f" />
        </>
      );
    case "fire-truck":
      return (
        <>
          <rect x="18" y="48" width="48" height="28" rx="10" fill="#ef4444" />
          <rect x="64" y="54" width="30" height="22" rx="8" fill="#f87171" />
          <rect x="34" y="34" width="42" height="7" rx="3.5" fill="#9ca3af" />
          <circle cx="34" cy="80" r="8" fill="#16324f" />
          <circle cx="80" cy="80" r="8" fill="#16324f" />
        </>
      );
    case "taxi":
      return (
        <>
          <rect x="22" y="54" width="76" height="24" rx="12" fill="#facc15" />
          <path d="M40 54 L52 42 H76 L88 54 Z" fill="#fde68a" />
          <rect x="50" y="38" width="20" height="7" rx="3.5" fill="#16324f" />
          <circle cx="40" cy="80" r="9" fill="#16324f" />
          <circle cx="82" cy="80" r="9" fill="#16324f" />
        </>
      );
    case "excavator":
      return (
        <>
          <rect x="28" y="62" width="44" height="18" rx="9" fill="#f59e0b" />
          <rect x="58" y="44" width="20" height="20" rx="6" fill="#fbbf24" />
          <path d="M74 48 L92 36 L98 42 L82 54 Z" fill="#f59e0b" />
          <path d="M94 36 L106 44 L98 50 L88 42 Z" fill="#fcd34d" />
          <circle cx="40" cy="82" r="7" fill="#16324f" />
          <circle cx="62" cy="82" r="7" fill="#16324f" />
        </>
      );
    case "dump-truck":
      return (
        <>
          <rect x="22" y="58" width="38" height="20" rx="8" fill="#fb923c" />
          <path d="M58 58 H92 L84 40 H58 Z" fill="#fdba74" />
          <circle cx="36" cy="82" r="8" fill="#16324f" />
          <circle cx="76" cy="82" r="8" fill="#16324f" />
        </>
      );
    case "crane":
      return (
        <>
          <rect x="30" y="28" width="12" height="56" rx="6" fill="#f59e0b" />
          <rect x="42" y="34" width="44" height="8" rx="4" fill="#fbbf24" />
          <rect x="82" y="40" width="6" height="26" rx="3" fill="#9ca3af" />
          <circle cx="34" cy="88" r="8" fill="#16324f" />
          <circle cx="56" cy="88" r="8" fill="#16324f" />
        </>
      );
    case "roller":
      return (
        <>
          <rect x="28" y="52" width="34" height="24" rx="10" fill="#fb923c" />
          <rect x="52" y="42" width="18" height="18" rx="6" fill="#fdba74" />
          <circle cx="82" cy="74" r="16" fill="#94a3b8" />
          <circle cx="40" cy="82" r="8" fill="#16324f" />
        </>
      );
    default:
      return <circle cx="60" cy="60" r="28" fill="#ffd166" />;
  }
}

export function WordArt({ word, size = "medium" }: WordArtProps) {
  return (
    <span className={`word-art word-art--${size}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" role="presentation">
        <rect x="10" y="10" width="100" height="100" rx="28" fill="#fff8eb" />
        {renderWordShape(word.id)}
      </svg>
    </span>
  );
}
