'use client';

/**
 * Optional Speech-to-Text enhancement using the native browser Web Speech API.
 * The Web Speech API is not in the standard TypeScript DOM lib, so we define
 * a minimal interface to avoid `any` while keeping types accurate.
 */

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror?: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
}

type VendorWindow = typeof window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function startListening(
  onResult: (text: string) => void,
  onError?: (err: Error | string) => void,
): (() => void) | null {
  if (typeof window !== 'undefined') {
    const vendorWindow = window as VendorWindow;
    const SpeechRecognition = vendorWindow.SpeechRecognition ?? vendorWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      if (onError) onError(new Error("Not supported"));
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    if (onError) {
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => onError(event.error);
    }

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition", e);
      if (onError) onError(e instanceof Error ? e : new Error(String(e)));
    }

    return () => { recognition.stop(); };
  }
  return null;
}

