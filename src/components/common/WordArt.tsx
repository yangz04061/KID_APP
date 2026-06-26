import { memo } from "react";
import type { Word } from "../../types/content";

type WordArtProps = {
  word: Word;
  size?: "small" | "medium" | "large";
};

type ShapeElement =
  | { tag: "polygon"; points: string; fill: string }
  | { tag: "circle"; cx: number; cy: number; r: number; fill: string }
  | { tag: "ellipse"; cx: number; cy: number; rx: number; ry: number; fill: string }
  | { tag: "rect"; x: number; y: number; width: number; height: number; rx?: number; fill: string }
  | { tag: "path"; d: string; fill: string };

const wordShapeConfigs: Record<string, ShapeElement[]> = {
  cat: [
    { tag: "polygon", points: "26,44 42,22 50,46", fill: "#f8b84b" },
    { tag: "polygon", points: "70,46 78,22 94,44", fill: "#f8b84b" },
    { tag: "circle", cx: 60, cy: 64, r: 34, fill: "#ffc95f" },
    { tag: "circle", cx: 48, cy: 62, r: 4, fill: "#16324f" },
    { tag: "circle", cx: 72, cy: 62, r: 4, fill: "#16324f" },
    { tag: "ellipse", cx: 60, cy: 76, rx: 8, ry: 6, fill: "#ef8f72" },
  ],
  dog: [
    { tag: "ellipse", cx: 32, cy: 54, rx: 16, ry: 24, fill: "#8d5a3b" },
    { tag: "ellipse", cx: 88, cy: 54, rx: 16, ry: 24, fill: "#8d5a3b" },
    { tag: "circle", cx: 60, cy: 62, r: 32, fill: "#c98c56" },
    { tag: "circle", cx: 48, cy: 60, r: 4, fill: "#16324f" },
    { tag: "circle", cx: 72, cy: 60, r: 4, fill: "#16324f" },
    { tag: "ellipse", cx: 60, cy: 76, rx: 12, ry: 9, fill: "#f7dcc5" },
  ],
  lion: [
    { tag: "circle", cx: 60, cy: 60, r: 38, fill: "#d97706" },
    { tag: "circle", cx: 60, cy: 60, r: 26, fill: "#ffd166" },
    { tag: "circle", cx: 50, cy: 58, r: 4, fill: "#16324f" },
    { tag: "circle", cx: 70, cy: 58, r: 4, fill: "#16324f" },
    { tag: "ellipse", cx: 60, cy: 72, rx: 8, ry: 6, fill: "#ef8f72" },
  ],
  elephant: [
    { tag: "circle", cx: 38, cy: 58, r: 18, fill: "#9db7c7" },
    { tag: "circle", cx: 82, cy: 58, r: 18, fill: "#9db7c7" },
    { tag: "circle", cx: 60, cy: 58, r: 28, fill: "#b7ced9" },
    { tag: "rect", x: 52, y: 66, width: 16, height: 28, rx: 8, fill: "#9db7c7" },
    { tag: "circle", cx: 50, cy: 56, r: 3.5, fill: "#16324f" },
    { tag: "circle", cx: 70, cy: 56, r: 3.5, fill: "#16324f" },
  ],
  car: [
    { tag: "rect", x: 24, y: 54, width: 72, height: 26, rx: 13, fill: "#ff8f6b" },
    { tag: "path", d: "M38 54 L54 38 H78 L90 54 Z", fill: "#ffb39a" },
    { tag: "circle", cx: 42, cy: 82, r: 10, fill: "#16324f" },
    { tag: "circle", cx: 78, cy: 82, r: 10, fill: "#16324f" },
  ],
  bus: [
    { tag: "rect", x: 18, y: 42, width: 84, height: 38, rx: 14, fill: "#ffd166" },
    { tag: "rect", x: 28, y: 50, width: 46, height: 12, rx: 4, fill: "#ffffff" },
    { tag: "circle", cx: 38, cy: 82, r: 9, fill: "#16324f" },
    { tag: "circle", cx: 82, cy: 82, r: 9, fill: "#16324f" },
  ],
  "fire-truck": [
    { tag: "rect", x: 18, y: 48, width: 48, height: 28, rx: 10, fill: "#ef4444" },
    { tag: "rect", x: 64, y: 54, width: 30, height: 22, rx: 8, fill: "#f87171" },
    { tag: "rect", x: 34, y: 34, width: 42, height: 7, rx: 3.5, fill: "#9ca3af" },
    { tag: "circle", cx: 34, cy: 80, r: 8, fill: "#16324f" },
    { tag: "circle", cx: 80, cy: 80, r: 8, fill: "#16324f" },
  ],
  taxi: [
    { tag: "rect", x: 22, y: 54, width: 76, height: 24, rx: 12, fill: "#facc15" },
    { tag: "path", d: "M40 54 L52 42 H76 L88 54 Z", fill: "#fde68a" },
    { tag: "rect", x: 50, y: 38, width: 20, height: 7, rx: 3.5, fill: "#16324f" },
    { tag: "circle", cx: 40, cy: 80, r: 9, fill: "#16324f" },
    { tag: "circle", cx: 82, cy: 80, r: 9, fill: "#16324f" },
  ],
  excavator: [
    { tag: "rect", x: 28, y: 62, width: 44, height: 18, rx: 9, fill: "#f59e0b" },
    { tag: "rect", x: 58, y: 44, width: 20, height: 20, rx: 6, fill: "#fbbf24" },
    { tag: "path", d: "M74 48 L92 36 L98 42 L82 54 Z", fill: "#f59e0b" },
    { tag: "path", d: "M94 36 L106 44 L98 50 L88 42 Z", fill: "#fcd34d" },
    { tag: "circle", cx: 40, cy: 82, r: 7, fill: "#16324f" },
    { tag: "circle", cx: 62, cy: 82, r: 7, fill: "#16324f" },
  ],
  "dump-truck": [
    { tag: "rect", x: 22, y: 58, width: 38, height: 20, rx: 8, fill: "#fb923c" },
    { tag: "path", d: "M58 58 H92 L84 40 H58 Z", fill: "#fdba74" },
    { tag: "circle", cx: 36, cy: 82, r: 8, fill: "#16324f" },
    { tag: "circle", cx: 76, cy: 82, r: 8, fill: "#16324f" },
  ],
  crane: [
    { tag: "rect", x: 30, y: 28, width: 12, height: 56, rx: 6, fill: "#f59e0b" },
    { tag: "rect", x: 42, y: 34, width: 44, height: 8, rx: 4, fill: "#fbbf24" },
    { tag: "rect", x: 82, y: 40, width: 6, height: 26, rx: 3, fill: "#9ca3af" },
    { tag: "circle", cx: 34, cy: 88, r: 8, fill: "#16324f" },
    { tag: "circle", cx: 56, cy: 88, r: 8, fill: "#16324f" },
  ],
  roller: [
    { tag: "rect", x: 28, y: 52, width: 34, height: 24, rx: 10, fill: "#fb923c" },
    { tag: "rect", x: 52, y: 42, width: 18, height: 18, rx: 6, fill: "#fdba74" },
    { tag: "circle", cx: 82, cy: 74, r: 16, fill: "#94a3b8" },
    { tag: "circle", cx: 40, cy: 82, r: 8, fill: "#16324f" },
  ],
};

const defaultShape: ShapeElement[] = [
  { tag: "circle", cx: 60, cy: 60, r: 28, fill: "#ffd166" },
];

function renderShapeElement(el: ShapeElement, key: number) {
  switch (el.tag) {
    case "polygon":
      return <polygon key={key} points={el.points} fill={el.fill} />;
    case "circle":
      return <circle key={key} cx={el.cx} cy={el.cy} r={el.r} fill={el.fill} />;
    case "ellipse":
      return <ellipse key={key} cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry} fill={el.fill} />;
    case "rect":
      return <rect key={key} x={el.x} y={el.y} width={el.width} height={el.height} rx={el.rx} fill={el.fill} />;
    case "path":
      return <path key={key} d={el.d} fill={el.fill} />;
  }
}

export const WordArt = memo(function WordArt({ word, size = "medium" }: WordArtProps) {
  const shapes = wordShapeConfigs[word.id] ?? defaultShape;

  return (
    <span className={`word-art word-art--${size}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" role="presentation">
        <rect x="10" y="10" width="100" height="100" rx="28" fill="#fff8eb" />
        {shapes.map((el, idx) => renderShapeElement(el, idx))}
      </svg>
    </span>
  );
});
