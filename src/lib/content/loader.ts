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

/** Shared cast helper — JSON files are untyped imports, this centralises the escape hatch */
function getLocalized<T>(data: unknown, lang: Language): T {
  return (data as LocalizedContent<T>)[lang];
}

export function getOnboardingContent(lang: Language): OnboardingContent {
  return getLocalized<OnboardingContent>(onboardingData, lang);
}

export function getTimelineContent(lang: Language): TimelineContent {
  return getLocalized<TimelineContent>(timelineData, lang);
}

export function getChecklistContent(lang: Language): ChecklistContent {
  return getLocalized<ChecklistContent>(checklistData, lang);
}

export function getRehearsalContent(lang: Language): RehearsalContent {
  return getLocalized<RehearsalContent>(rehearsalData, lang);
}
