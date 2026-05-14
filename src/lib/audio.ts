export function playGermanAudio(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // Stop any current speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85; // Slightly slower for learners
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

export function stopAudio() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
