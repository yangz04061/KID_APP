import { useState, useCallback } from "react";
import type { Word } from "../types/content";

export type Screen = "welcome" | "home" | "album" | "theme" | "challenge" | "completion" | "parent";
export type ChallengeStage = "listen" | "match" | "find";
export type GameFeedback = "idle" | "success" | "retry";

const challengeStages: ChallengeStage[] = ["listen", "match", "find"];

export function useGameFlow() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("animals");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [challengeStageIndex, setChallengeStageIndex] = useState(0);
  const [gameRoundIndex, setGameRoundIndex] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<GameFeedback>("idle");

  const currentChallengeStage = challengeStages[challengeStageIndex] ?? challengeStages[0];

  const resetGameState = useCallback(() => {
    setChallengeStageIndex(0);
    setGameRoundIndex(0);
    setSessionStars(0);
    setGameFeedback("idle");
  }, []);

  const openHome = useCallback(() => setScreen("home"), []);
  const openParent = useCallback(() => setScreen("parent"), []);
  const openAlbum = useCallback(() => setScreen("album"), []);

  const openTheme = useCallback(
    (themeId: string) => {
      setSelectedThemeId(themeId);
      setPreviewIndex(0);
      resetGameState();
      setScreen("theme");
    },
    [resetGameState]
  );

  const goToNextWord = useCallback(
    (totalWords: number) => {
      const isLastWord = previewIndex >= totalWords - 1;
      if (isLastWord) {
        resetGameState();
        setScreen("challenge");
      } else {
        setPreviewIndex((i) => i + 1);
      }
    },
    [previewIndex, resetGameState]
  );

  const restartPreview = useCallback(() => setPreviewIndex(0), []);

  /** Advances to the next round or stage after a correct answer. Returns true if challenge is complete. */
  const advanceChallenge = useCallback(
    (roundCount: number): boolean => {
      const isLastRound = gameRoundIndex >= roundCount - 1;
      const isLastStage = challengeStageIndex >= challengeStages.length - 1;

      if (isLastRound && isLastStage) {
        setGameFeedback("idle");
        return true;
      }

      if (isLastRound) {
        setChallengeStageIndex((i) => i + 1);
        setGameRoundIndex(0);
      } else {
        setGameRoundIndex((i) => i + 1);
      }
      setGameFeedback("idle");
      return false;
    },
    [gameRoundIndex, challengeStageIndex]
  );

  const buildRoundOptions = useCallback(
    (words: Word[], roundIndex: number, stageIndex: number): Word[] => {
      const total = words.length;
      const optionCount = Math.min(3, total);
      const promptIndex = (stageIndex + roundIndex) % total;
      const baseOptions = Array.from({ length: optionCount }, (_, offset) => {
        return words[(promptIndex + offset) % total];
      });
      const rotation = (stageIndex + roundIndex) % optionCount;
      return Array.from({ length: optionCount }, (_, index) => {
        return baseOptions[(index + rotation) % optionCount];
      });
    },
    []
  );

  const getPromptWord = useCallback(
    (words: Word[], roundIndex: number, stageIndex: number): Word => {
      return words[(stageIndex + roundIndex) % words.length];
    },
    []
  );

  const replayTheme = useCallback(() => {
    setPreviewIndex(0);
    resetGameState();
    setScreen("theme");
  }, [resetGameState]);

  return {
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
    setPreviewIndex,
    advanceChallenge,
    openHome,
    openParent,
    openAlbum,
    openTheme,
    goToNextWord,
    restartPreview,
    buildRoundOptions,
    getPromptWord,
    replayTheme,
    resetGameState,
  };
}
