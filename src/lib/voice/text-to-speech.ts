'use client';

/**
 * Optional Text-to-Speech enhancement using the native browser SpeechSynthesis API.
 */
export function speak(text: string, lang: string = 'en-US') {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map our internal lang codes to BCP 47 tags for speech synthesis
    const voiceLangMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      hi: 'hi-IN'
    };
    
    utterance.lang = voiceLangMap[lang] || 'en-US';
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis is not supported in this browser.");
  }
}
