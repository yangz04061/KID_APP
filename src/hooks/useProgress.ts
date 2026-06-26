import { useState, useEffect, useMemo } from "react";
import { themes } from "../content/themes";
import { words } from "../content/words";
import type { ThemeProgress } from "../components/common/ThemeCard";

export type ProgressState = {
  version: 1;
  lastPlayedThemeId: string;
  learnedWordIds: string[];
  completedThemeIds: string[];
  totalStars: number;
};

const PROGRESS_STORAGE_KEY = "kid-app-progress";

const defaultProgress: ProgressState = {
  version: 1,
  lastPlayedThemeId: themes[0].id,
  learnedWordIds: [],
  completedThemeIds: [],
  totalStars: 0,
};

function readStorage<T>(storageKey: string, fallbackValue: T): T {
  if (typeof window === "undefined") {
    return fallbackValue;
  }
  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) {
    return fallbackValue;
  }
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallbackValue;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() =>
    readStorage<ProgressState>(PROGRESS_STORAGE_KEY, defaultProgress)
  );

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const lastPlayedThemeTitle = useMemo(
    () => themes.find((t) => t.id === progress.lastPlayedThemeId)?.title ?? themes[0].title,
    [progress.lastPlayedThemeId]
  );

  const themeProgress = useMemo<Record<string, ThemeProgress>>(() => {
    return themes.reduce<Record<string, ThemeProgress>>((acc, theme) => {
      const themeWords = words.filter((w) => w.themeId === theme.id);
      const learnedCount = themeWords.filter((w) => progress.learnedWordIds.includes(w.id)).length;
      const totalCount = themeWords.length;
      const progressPercent = totalCount === 0 ? 0 : Math.round((learnedCount / totalCount) * 100);
      const isCompleted = progress.completedThemeIds.includes(theme.id);
      acc[theme.id] = {
        learnedCount,
        totalCount,
        progressPercent,
        statusLabel: isCompleted ? "已完成" : learnedCount > 0 ? "探索中" : "待开始",
        statusTone: isCompleted ? "done" : learnedCount > 0 ? "active" : "new",
      };
      return acc;
    }, {});
  }, [progress]);

  const badgeItems = useMemo(
    () =>
      themes.map((theme) => ({
        id: theme.id,
        title: theme.title,
        statusLabel: themeProgress[theme.id].statusLabel,
        progressPercent: themeProgress[theme.id].progressPercent,
        tone: themeProgress[theme.id].statusTone,
      })),
    [themeProgress]
  );

  const parentThemeCards = useMemo(
    () =>
      themes.map((theme) => ({
        id: theme.id,
        title: theme.title,
        learnedCount: themeProgress[theme.id].learnedCount,
        totalCount: themeProgress[theme.id].totalCount,
        progressPercent: themeProgress[theme.id].progressPercent,
        statusLabel: themeProgress[theme.id].statusLabel,
      })),
    [themeProgress]
  );

  const albumThemes = useMemo(
    () =>
      themes.map((theme) => ({
        theme,
        words: words
          .filter((w) => w.themeId === theme.id)
          .map((w) => ({
            word: w,
            unlocked: progress.learnedWordIds.includes(w.id),
          })),
      })),
    [progress.learnedWordIds]
  );

  const continueTheme = useMemo(
    () => themes.find((t) => t.id === progress.lastPlayedThemeId) ?? themes[0],
    [progress.lastPlayedThemeId]
  );

  return {
    progress,
    setProgress,
    lastPlayedThemeTitle,
    themeProgress,
    badgeItems,
    parentThemeCards,
    albumThemes,
    continueTheme,
  };
}
