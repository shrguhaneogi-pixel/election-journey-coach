import { 
  LocalizedContent, 
  OnboardingContent, 
  TimelineContent, 
  ChecklistContent, 
  RehearsalContent
} from '@/types/content';
import { Language } from '@/types/journey';

import onboardingData from '../../../content/journey/onboarding.json';
import timelineData from '../../../content/journey/timeline.json';
import checklistData from '../../../content/journey/checklist.json';
import rehearsalData from '../../../content/journey/rehearsal.json';

export function getOnboardingContent(lang: Language): OnboardingContent {
  const data = onboardingData as unknown as LocalizedContent<OnboardingContent>;
  return data[lang];
}

export function getTimelineContent(lang: Language): TimelineContent {
  const data = timelineData as unknown as LocalizedContent<TimelineContent>;
  return data[lang];
}

export function getChecklistContent(lang: Language): ChecklistContent {
  const data = checklistData as unknown as LocalizedContent<ChecklistContent>;
  return data[lang];
}

export function getRehearsalContent(lang: Language): RehearsalContent {
  const data = rehearsalData as unknown as LocalizedContent<RehearsalContent>;
  return data[lang];
}
