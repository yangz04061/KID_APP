import { useEffect, useState } from "react";
import { AppNavigation } from "./components/common/AppNavigation";
import type { ThemeProgress } from "./components/common/ThemeCard";
import { speakEnglishWord, stopSpeech } from "./features/audio/speech";
import { AlbumPage } from "./pages/AlbumPage";
import { themes } from "./content/themes";
import { words } from "./content/words";
import { HomePage } from "./pages/HomePage";
import { FindGamePage } from "./pages/FindGamePage";
import { ListenPickGamePage } from "./pages/ListenPickGamePage";
import { MatchGamePage } from "./pages/MatchGamePage";
import { ParentPage } from "./pages/ParentPage";
import { CompletionPage } from "./pages/CompletionPage";
import { ThemePage } from "./pages/ThemePage";
import { WelcomePage } from "./pages/WelcomePage";

type Screen = "welcome" | "home" | "album" | "theme" | "challenge" | "completion" | "parent";
type ChallengeStage = "listen" | "match" | "find";

type Settings = {
  bgm: boolean;
  autoPlay: boolean;
  showChinese: boolean;
};

type ProgressState = {
  version: 1;
  lastPlayedThemeId: string;
  learnedWordIds: string[];
  completedThemeIds: string[];
  totalStars: number;
};

const SETTINGS_STORAGE_KEY = "kid-app-settings";
const PROGRESS_STORAGE_KEY = "kid-app-progress";

const defaultSettings: Settings = {
  bgm: true,
  autoPlay: true,
  showChinese: true,
};

const defaultProgress: ProgressState = {
  version: 1,
  lastPlayedThemeId: themes[0].id,
  learnedWordIds: [],
  completedThemeIds: [],
  totalStars: 0,
};

type GameFeedback = "idle" | "success" | "retry";

const challengeStages: ChallengeStage[] = ["listen", "match", "find"];

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

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedThemeId, setSelectedThemeId] = useState<string>(defaultProgress.lastPlayedThemeId);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [challengeStageIndex, setChallengeStageIndex] = useState(0);
  const [gameRoundIndex, setGameRoundIndex] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<GameFeedback>("idle");
  const [settings, setSettings] = useState<Settings>(() =>
    readStorage<Settings>(SETTINGS_STORAGE_KEY, defaultSettings)
  );
  const [progress, setProgress] = useState<ProgressState>(() =>
    readStorage<ProgressState>(PROGRESS_STORAGE_KEY, defaultProgress)
  );

  const selectedTheme = themes.find((theme) => theme.id === selectedThemeId) ?? themes[0];
  const previewWords = words.filter((word) => word.themeId === selectedTheme.id);
  const roundCount = Math.min(3, previewWords.length);
  const currentChallengeStage = challengeStages[challengeStageIndex] ?? challengeStages[0];
  const lastPlayedThemeTitle =
    themes.find((theme) => theme.id === progress.lastPlayedThemeId)?.title ?? themes[0].title;
  const themeProgress = themes.reduce<Record<string, ThemeProgress>>((accumulator, theme) => {
    const themeWords = words.filter((word) => word.themeId === theme.id);
    const learnedCount = themeWords.filter((word) => progress.learnedWordIds.includes(word.id)).length;
    const totalCount = themeWords.length;
    const progressPercent = totalCount === 0 ? 0 : Math.round((learnedCount / totalCount) * 100);
    const isCompleted = progress.completedThemeIds.includes(theme.id);
    const statusLabel = isCompleted ? "已完成" : learnedCount > 0 ? "探索中" : "待开始";
    const statusTone = isCompleted ? "done" : learnedCount > 0 ? "active" : "new";

    accumulator[theme.id] = {
      learnedCount,
      totalCount,
      progressPercent,
      statusLabel,
      statusTone,
    };

    return accumulator;
  }, {});
  const parentThemeCards = themes.map((theme) => ({
    id: theme.id,
    title: theme.title,
    learnedCount: themeProgress[theme.id].learnedCount,
    totalCount: themeProgress[theme.id].totalCount,
    progressPercent: themeProgress[theme.id].progressPercent,
    statusLabel: themeProgress[theme.id].statusLabel,
  }));
  const badgeItems = themes.map((theme) => ({
    id: theme.id,
    title: theme.title,
    statusLabel: themeProgress[theme.id].statusLabel,
    progressPercent: themeProgress[theme.id].progressPercent,
    tone: themeProgress[theme.id].statusTone,
  }));
  const continueTheme = themes.find((theme) => theme.id === progress.lastPlayedThemeId) ?? themes[0];
  const continueThemeProgress = themeProgress[continueTheme.id];
  const albumThemes = themes.map((theme) => ({
    theme,
    words: words
      .filter((word) => word.themeId === theme.id)
      .map((word) => ({
        word,
        unlocked: progress.learnedWordIds.includes(word.id),
      })),
  }));

  function navigatePrimaryScreen(target: "home" | "album" | "parent") {
    stopSpeech();
    setScreen(target);
  }

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (screen !== "theme") {
      return;
    }

    const currentWord = previewWords[previewIndex] ?? previewWords[0];

    if (!currentWord) {
      return;
    }

    setProgress((previousProgress) => {
      if (previousProgress.learnedWordIds.includes(currentWord.id)) {
        return previousProgress;
      }

      return {
        ...previousProgress,
        learnedWordIds: [...previousProgress.learnedWordIds, currentWord.id],
      };
    });
  }, [previewIndex, previewWords, screen]);

  useEffect(() => {
    if (screen !== "challenge" || gameFeedback !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const isLastRound = gameRoundIndex >= roundCount - 1;
      const isLastStage = challengeStageIndex >= challengeStages.length - 1;

      if (isLastRound && isLastStage) {
        setGameFeedback("idle");
        setScreen("completion");
        return;
      }

      if (isLastRound) {
        setChallengeStageIndex((currentIndex) => currentIndex + 1);
        setGameRoundIndex(0);
        setGameFeedback("idle");
        return;
      }

      setGameRoundIndex((currentIndex) => currentIndex + 1);
      setGameFeedback("idle");
    }, 850);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [challengeStageIndex, gameFeedback, gameRoundIndex, roundCount, screen]);

  function openHome() {
    stopSpeech();
    setScreen("home");
  }

  function openParent() {
    stopSpeech();
    setScreen("parent");
  }

  function openTheme(themeId: string) {
    stopSpeech();
    setSelectedThemeId(themeId);
    setPreviewIndex(0);
    setChallengeStageIndex(0);
    setGameRoundIndex(0);
    setSessionStars(0);
    setGameFeedback("idle");
    setScreen("theme");
    setProgress((previousProgress) => ({
      ...previousProgress,
      lastPlayedThemeId: themeId,
    }));
  }

  function goToNextWord() {
    const isLastWord = previewIndex >= previewWords.length - 1;

    if (isLastWord) {
      stopSpeech();
      setChallengeStageIndex(0);
      setGameRoundIndex(0);
      setSessionStars(0);
      setGameFeedback("idle");
      setScreen("challenge");
      return;
    }

    setPreviewIndex((currentIndex) => currentIndex + 1);
  }

  function restartPreview() {
    stopSpeech();
    setPreviewIndex(0);
  }

  function buildRoundOptions(roundIndex: number) {
    const total = previewWords.length;
    const optionCount = Math.min(3, total);
    const promptIndex = (challengeStageIndex + roundIndex) % total;
    const baseOptions = Array.from({ length: optionCount }, (_, offset) => {
      const index = (promptIndex + offset) % total;
      return previewWords[index];
    });
    const rotation = (challengeStageIndex + roundIndex) % optionCount;

    return Array.from({ length: optionCount }, (_, index) => {
      return baseOptions[(index + rotation) % optionCount];
    });
  }

  function getPromptWord(roundIndex: number) {
    return previewWords[(challengeStageIndex + roundIndex) % previewWords.length];
  }

  function handleChallengeAnswer(wordId: string) {
    const promptWord = getPromptWord(gameRoundIndex);

    if (wordId !== promptWord.id) {
      setGameFeedback("retry");
      return;
    }

    const nextSessionStars = sessionStars + 1;
    const isLastRound = gameRoundIndex >= roundCount - 1;
    const isLastStage = challengeStageIndex >= challengeStages.length - 1;

    setSessionStars(nextSessionStars);
    setGameFeedback("success");
    setProgress((previousProgress) => {
      const baseProgress = {
        ...previousProgress,
        totalStars: previousProgress.totalStars + 1,
      };

      if (!isLastRound || !isLastStage) {
        return baseProgress;
      }

      return {
        ...baseProgress,
        completedThemeIds: baseProgress.completedThemeIds.includes(selectedTheme.id)
          ? baseProgress.completedThemeIds
          : [...baseProgress.completedThemeIds, selectedTheme.id],
      };
    });
  }

  function replayTheme() {
    stopSpeech();
    setPreviewIndex(0);
    setChallengeStageIndex(0);
    setGameRoundIndex(0);
    setSessionStars(0);
    setGameFeedback("idle");
    setScreen("theme");
  }

  function toggleSetting(settingName: keyof Settings) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [settingName]: !previousSettings[settingName],
    }));
  }

  return (
    <div className="app-shell">
      {screen !== "welcome" && screen !== "challenge" ? (
        <AppNavigation
          activeScreen={screen === "album" ? "album" : screen === "parent" ? "parent" : "home"}
          onNavigate={navigatePrimaryScreen}
        />
      ) : null}
      {screen === "welcome" ? <WelcomePage onStart={openHome} onOpenParent={openParent} /> : null}
      {screen === "home" ? (
        <HomePage
          themes={themes}
          themeProgress={themeProgress}
          badgeItems={badgeItems}
          continueThemeTitle={continueTheme.title}
          continueThemeSubtitle={continueTheme.subtitle}
          continueProgressPercent={continueThemeProgress.progressPercent}
          onResumeTheme={() => openTheme(continueTheme.id)}
          lastPlayedThemeTitle={lastPlayedThemeTitle}
          learnedWordsCount={progress.learnedWordIds.length}
          totalStars={progress.totalStars}
          onOpenParent={openParent}
          onSelectTheme={openTheme}
        />
      ) : null}
      {screen === "album" ? (
        <AlbumPage
          totalUnlocked={progress.learnedWordIds.length}
          totalWords={words.length}
          themes={albumThemes}
          onOpenTheme={openTheme}
        />
      ) : null}
      {screen === "theme" ? (
        <ThemePage
          theme={selectedTheme}
          previewWords={previewWords}
          previewIndex={previewIndex}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          onSpeakWord={speakEnglishWord}
          onBack={openHome}
          onNextWord={goToNextWord}
          onRestartPreview={restartPreview}
          onOpenParent={openParent}
        />
      ) : null}
      {screen === "challenge" && currentChallengeStage === "listen" ? (
        <ListenPickGamePage
          theme={selectedTheme}
          promptWord={getPromptWord(gameRoundIndex)}
          options={buildRoundOptions(gameRoundIndex)}
          roundIndex={gameRoundIndex}
          roundCount={roundCount}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          sessionStars={sessionStars}
          feedback={gameFeedback}
          onSpeakWord={speakEnglishWord}
          onAnswer={handleChallengeAnswer}
          onBack={openHome}
        />
      ) : null}
      {screen === "challenge" && currentChallengeStage === "match" ? (
        <MatchGamePage
          theme={selectedTheme}
          promptWord={getPromptWord(gameRoundIndex)}
          options={buildRoundOptions(gameRoundIndex)}
          roundIndex={gameRoundIndex}
          roundCount={roundCount}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          sessionStars={sessionStars}
          feedback={gameFeedback}
          onSpeakWord={speakEnglishWord}
          onAnswer={handleChallengeAnswer}
          onBack={openHome}
        />
      ) : null}
      {screen === "challenge" && currentChallengeStage === "find" ? (
        <FindGamePage
          theme={selectedTheme}
          promptWord={getPromptWord(gameRoundIndex)}
          options={buildRoundOptions(gameRoundIndex)}
          roundIndex={gameRoundIndex}
          roundCount={roundCount}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          sessionStars={sessionStars}
          feedback={gameFeedback}
          onSpeakWord={speakEnglishWord}
          onAnswer={handleChallengeAnswer}
          onBack={openHome}
        />
      ) : null}
      {screen === "completion" ? (
        <CompletionPage
          themeTitle={selectedTheme.title}
          starsEarned={sessionStars}
          learnedWordsCount={previewWords.length}
          totalStars={progress.totalStars}
          badgeItems={badgeItems}
          onReplay={replayTheme}
          onGoHome={openHome}
        />
      ) : null}
      {screen === "parent" ? (
        <ParentPage
          learnedWordsCount={progress.learnedWordIds.length}
          completedThemesCount={progress.completedThemeIds.length}
          lastPlayedThemeTitle={lastPlayedThemeTitle}
          totalStars={progress.totalStars}
          themeCards={parentThemeCards}
          settings={settings}
          onToggleSetting={toggleSetting}
          onBack={openHome}
        />
      ) : null}
    </div>
  );
}

