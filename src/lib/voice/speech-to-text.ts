'use client';

/**
 * Optional Speech-to-Text enhancement using the native browser Web Speech API.
 */
export function startListening(onResult: (text: string) => void, onError?: (err: any) => void) {
  if (typeof window !== 'undefined') {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      if (onError) onError(new Error("Not supported"));
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    if (onError) {
      recognition.onerror = (event: any) => onError(event.error);
    }

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      if (onError) onError(e);
    }

    return () => {
      recognition.stop();
    };
  }
  return null;
}
