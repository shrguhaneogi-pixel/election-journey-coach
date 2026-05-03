'use client';

/**
 * useJourneyContent
 *
 * Returns all localized content objects for the current language in one call.
 * Components no longer repeat `getXContent(state.context.language)` —
 * they destructure what they need from this single hook.
 *
 * The returned objects are referentially stable as long as `language` is stable
 * (content is loaded from static JSON, not network).
 */

import { useMemo } from 'react';
import { useAppState } from '@/app/journey/context';
import {
  getOnboardingContent,
  getChecklistContent,
  getRehearsalContent,
  getTimelineContent,
} from '@/lib/content/loader';
import { getDictionary } from '@/lib/i18n/dictionary';

export function useJourneyContent() {
  const { state } = useAppState();
  const lang = state.context.language;

  const onboarding = useMemo(() => getOnboardingContent(lang), [lang]);
  const checklist = useMemo(() => getChecklistContent(lang), [lang]);
  const rehearsal = useMemo(() => getRehearsalContent(lang), [lang]);
  const timeline = useMemo(() => getTimelineContent(lang), [lang]);
  const dict = useMemo(() => getDictionary(lang), [lang]);

  return { lang, onboarding, checklist, rehearsal, timeline, dict };
}
