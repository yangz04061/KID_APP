import { useState, useEffect, useCallback } from "react";

export type Settings = {
  bgm: boolean;
  autoPlay: boolean;
  showChinese: boolean;
};

const SETTINGS_STORAGE_KEY = "kid-app-settings";

const defaultSettings: Settings = {
  bgm: true,
  autoPlay: true,
  showChinese: true,
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

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    readStorage<Settings>(SETTINGS_STORAGE_KEY, defaultSettings)
  );

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = useCallback((settingName: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [settingName]: !prev[settingName],
    }));
  }, []);

  return { settings, toggleSetting };
}
