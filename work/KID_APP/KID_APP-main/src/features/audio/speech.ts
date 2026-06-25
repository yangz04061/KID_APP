export function speakEnglishWord(text: string) {
  if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (typeof window === "undefined" || typeof window.speechSynthesis === "undefined") {
    return;
  }

  window.speechSynthesis.cancel();
}