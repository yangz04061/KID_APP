export type Theme = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  spotlight: string;
};

export type Word = {
  id: string;
  themeId: string;
  en: string;
  zh: string;
  emoji: string;
};
