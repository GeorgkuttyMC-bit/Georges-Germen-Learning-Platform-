let currentUtterance: SpeechSynthesisUtterance | null = null;

export function playGermanAudio(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.error("Speech synthesis not supported");
    if(onEnd) onEnd();
    return;
  }
  
  window.speechSynthesis.cancel(); // Stop any current speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85; // Slightly slower for learners
  utterance.pitch = 1.0;
  
  // Try to find a specific German voice
  const voices = window.speechSynthesis.getVoices();
  const germanVoice = voices.find(voice => voice.lang.startsWith('de'));
  if (germanVoice) {
    utterance.voice = germanVoice;
  }
  
  currentUtterance = utterance; // Prevent garbage collection
  
  utterance.onerror = (e) => {
    console.error("Speech synthesis error", e);
    if(onEnd) onEnd();
  };

  utterance.onend = () => {
    if(onEnd) onEnd();
  };
  
  window.speechSynthesis.speak(utterance);
}

export function stopAudio() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
