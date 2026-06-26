import { useEffect, useCallback, useMemo } from "react";
import { AppNavigation } from "./components/common/AppNavigation";
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
import { useSettings } from "./hooks/useSettings";
import { useProgress } from "./hooks/useProgress";
import { useGameFlow } from "./hooks/useGameFlow";

export default function App() {
  const { settings, toggleSetting } = useSettings();
  const {
    progress,
    setProgress,
    lastPlayedThemeTitle,
    themeProgress,
    badgeItems,
    parentThemeCards,
    albumThemes,
    continueTheme,
  } = useProgress();

  const {
    screen,
    selectedThemeId,
    previewIndex,
    challengeStageIndex,
    gameRoundIndex,
    sessionStars,
    gameFeedback,
    currentChallengeStage,
    setScreen,
    setGameFeedback,
    setSessionStars,
    advanceChallenge,
    openHome,
    openParent,
    openTheme,
    goToNextWord,
    restartPreview,
    buildRoundOptions,
    getPromptWord,
    replayTheme,
  } = useGameFlow();

  const selectedTheme = themes.find((t) => t.id === selectedThemeId) ?? themes[0];
  const previewWords = words.filter((w) => w.themeId === selectedTheme.id);
  const roundCount = Math.min(3, previewWords.length);
  const continueThemeProgress = themeProgress[continueTheme.id];

  // Mark word as learned when previewed
  useEffect(() => {
    if (screen !== "theme") return;
    const currentWord = previewWords[previewIndex] ?? previewWords[0];
    if (!currentWord) return;
    setProgress((prev) => {
      if (prev.learnedWordIds.includes(currentWord.id)) return prev;
      return {
        ...prev,
        learnedWordIds: [...prev.learnedWordIds, currentWord.id],
      };
    });
  }, [previewIndex, previewWords, screen, setProgress]);

  // Auto-advance after success feedback
  useEffect(() => {
    if (screen !== "challenge" || gameFeedback !== "success") return;
    const timeoutId = window.setTimeout(() => {
      const challengeDone = advanceChallenge(roundCount);
      if (challengeDone) setScreen("completion");
    }, 850);
    return () => window.clearTimeout(timeoutId);
  }, [screen, gameFeedback, advanceChallenge, roundCount, setScreen]);

  // Navigation wrappers that also stop speech
  const navigateHome = useCallback(() => { stopSpeech(); openHome(); }, [openHome]);
  const navigateParent = useCallback(() => { stopSpeech(); openParent(); }, [openParent]);
  const navigatePrimary = useCallback(
    (target: "home" | "album" | "parent") => {
      stopSpeech();
      if (target === "home") openHome();
      else if (target === "album") setScreen("album");
      else openParent();
    },
    [openHome, openParent, setScreen]
  );

  const handleOpenTheme = useCallback(
    (themeId: string) => {
      stopSpeech();
      openTheme(themeId);
      setProgress((prev) => ({ ...prev, lastPlayedThemeId: themeId }));
    },
    [openTheme, setProgress]
  );

  const handleAnswer = useCallback(
    (wordId: string) => {
      const promptWord = getPromptWord(previewWords, gameRoundIndex, challengeStageIndex);
      if (wordId !== promptWord.id) {
        setGameFeedback("retry");
        return;
      }
      setSessionStars((s) => s + 1);
      setGameFeedback("success");
      setProgress((prev) => {
        const next = { ...prev, totalStars: prev.totalStars + 1 };
        const isLastRound = gameRoundIndex >= roundCount - 1;
        const isLastStage = challengeStageIndex >= 2;
        if (isLastRound && isLastStage && !next.completedThemeIds.includes(selectedTheme.id)) {
          next.completedThemeIds = [...next.completedThemeIds, selectedTheme.id];
        }
        return next;
      });
    },
    [getPromptWord, previewWords, gameRoundIndex, challengeStageIndex,
     setGameFeedback, setSessionStars, setProgress, roundCount, selectedTheme.id]
  );

  // Memoized round options and prompt word for game pages
  const roundOptions = useMemo(
    () => buildRoundOptions(previewWords, gameRoundIndex, challengeStageIndex),
    [buildRoundOptions, previewWords, gameRoundIndex, challengeStageIndex]
  );
  const promptWord = useMemo(
    () => getPromptWord(previewWords, gameRoundIndex, challengeStageIndex),
    [getPromptWord, previewWords, gameRoundIndex, challengeStageIndex]
  );

  return (
    <div className="app-shell">
      {screen !== "welcome" && screen !== "challenge" && (
        <AppNavigation
          activeScreen={screen === "album" ? "album" : screen === "parent" ? "parent" : "home"}
          onNavigate={navigatePrimary}
        />
      )}

      {screen === "welcome" && <WelcomePage onStart={navigateHome} onOpenParent={navigateParent} />}

      {screen === "home" && (
        <HomePage
          themes={themes}
          themeProgress={themeProgress}
          badgeItems={badgeItems}
          continueThemeTitle={continueTheme.title}
          continueThemeSubtitle={continueTheme.subtitle}
          continueProgressPercent={continueThemeProgress.progressPercent}
          onResumeTheme={() => handleOpenTheme(continueTheme.id)}
          lastPlayedThemeTitle={lastPlayedThemeTitle}
          learnedWordsCount={progress.learnedWordIds.length}
          totalStars={progress.totalStars}
          onOpenParent={navigateParent}
          onSelectTheme={handleOpenTheme}
        />
      )}

      {screen === "album" && (
        <AlbumPage
          totalUnlocked={progress.learnedWordIds.length}
          totalWords={words.length}
          themes={albumThemes}
          onOpenTheme={handleOpenTheme}
        />
      )}

      {screen === "theme" && (
        <ThemePage
          theme={selectedTheme}
          previewWords={previewWords}
          previewIndex={previewIndex}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          onSpeakWord={speakEnglishWord}
          onBack={navigateHome}
          onNextWord={() => goToNextWord(previewWords.length)}
          onRestartPreview={restartPreview}
          onOpenParent={navigateParent}
        />
      )}

      {screen === "challenge" && currentChallengeStage === "listen" && (
        <ListenPickGamePage
          theme={selectedTheme}
          promptWord={promptWord}
          options={roundOptions}
          roundIndex={gameRoundIndex}
          roundCount={roundCount}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          sessionStars={sessionStars}
          feedback={gameFeedback}
          onSpeakWord={speakEnglishWord}
          onAnswer={handleAnswer}
          onBack={navigateHome}
        />
      )}

      {screen === "challenge" && currentChallengeStage === "match" && (
        <MatchGamePage
          theme={selectedTheme}
          promptWord={promptWord}
          options={roundOptions}
          roundIndex={gameRoundIndex}
          roundCount={roundCount}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          sessionStars={sessionStars}
          feedback={gameFeedback}
          onSpeakWord={speakEnglishWord}
          onAnswer={handleAnswer}
          onBack={navigateHome}
        />
      )}

      {screen === "challenge" && currentChallengeStage === "find" && (
        <FindGamePage
          theme={selectedTheme}
          promptWord={promptWord}
          options={roundOptions}
          roundIndex={gameRoundIndex}
          roundCount={roundCount}
          showChinese={settings.showChinese}
          autoPlay={settings.autoPlay}
          sessionStars={sessionStars}
          feedback={gameFeedback}
          onSpeakWord={speakEnglishWord}
          onAnswer={handleAnswer}
          onBack={navigateHome}
        />
      )}

      {screen === "completion" && (
        <CompletionPage
          themeTitle={selectedTheme.title}
          starsEarned={sessionStars}
          learnedWordsCount={previewWords.length}
          totalStars={progress.totalStars}
          badgeItems={badgeItems}
          onReplay={replayTheme}
          onGoHome={navigateHome}
        />
      )}

      {screen === "parent" && (
        <ParentPage
          learnedWordsCount={progress.learnedWordIds.length}
          completedThemesCount={progress.completedThemeIds.length}
          lastPlayedThemeTitle={lastPlayedThemeTitle}
          totalStars={progress.totalStars}
          themeCards={parentThemeCards}
          settings={settings}
          onToggleSetting={toggleSetting}
          onBack={navigateHome}
        />
      )}
    </div>
  );
}
