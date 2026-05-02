export interface TimelineEvent {
  date: string;
  event: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface RehearsalQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface LocalizedContent<T> {
  en: T;
  es: T;
  hi: T;
}

export interface OnboardingContent {
  landing: {
    title: string;
    subtitle: string;
    startBtn: string;
  };
  onboarding: {
    title: string;
    steps: string[];
    nextBtn: string;
  };
  languageSelect: {
    title: string;
    nextBtn: string;
  };
  result: {
    title: string;
    readyMessage: string;
    notReadyMessage: string;
    restartBtn: string;
  };
}

export interface TimelineContent {
  title: string;
  events: TimelineEvent[];
  nextBtn: string;
}

export interface ChecklistContent {
  title: string;
  items: ChecklistItem[];
  nextBtn: string;
}

export interface RehearsalContent {
  title: string;
  questions: RehearsalQuestion[];
  nextBtn: string;
}
