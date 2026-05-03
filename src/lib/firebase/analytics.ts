'use client';

/**
 * Firebase Analytics event helpers.
 *
 * All functions are safe to call unconditionally — they are no-ops when
 * Analytics is unavailable (e.g. ad-blocker, SSR, missing measurementId).
 *
 * Events logged here appear in Firebase Console → Analytics → Events.
 */

import type { Analytics } from 'firebase/analytics';
import type { MachineState, Language } from '@/types/journey';

/** Lazily resolved Analytics instance — avoids importing the heavy SDK until needed. */
let analyticsInstance: Analytics | null = null;

async function getAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (typeof window === 'undefined') return null; // SSR guard

  try {
    const { getAnalytics: _getAnalytics, isSupported } = await import('firebase/analytics');
    const { app } = await import('@/lib/firebase/client');

    const supported = await isSupported();
    if (!supported) return null;

    analyticsInstance = _getAnalytics(app);
    return analyticsInstance;
  } catch {
    // Blocked by ad-blocker or missing measurementId — silently ignore
    return null;
  }
}

/** Log when a user enters a journey step */
export async function logStepView(step: MachineState['currentState']): Promise<void> {
  try {
    const { logEvent } = await import('firebase/analytics');
    const analytics = await getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'journey_step_view', { step });
  } catch { /* non-fatal */ }
}

/** Log when a user completes the full journey */
export async function logJourneyComplete(score: number): Promise<void> {
  try {
    const { logEvent } = await import('firebase/analytics');
    const analytics = await getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'journey_complete', { readiness_score: score });
  } catch { /* non-fatal */ }
}

/** Log when a user switches the interface language */
export async function logLanguageChange(language: Language): Promise<void> {
  try {
    const { logEvent } = await import('firebase/analytics');
    const analytics = await getAnalytics();
    if (!analytics) return;
    logEvent(analytics, 'language_change', { language });
  } catch { /* non-fatal */ }
}

/** Log when the user requests an AI explanation */
export async function logExplanationRequested(context: string): Promise<void> {
  try {
    const { logEvent } = await import('firebase/analytics');
    const analytics = await getAnalytics();
    if (!analytics) return;
    // Only log that it was requested — never log the actual content
    logEvent(analytics, 'ai_explanation_requested', {
      context_length: context.length,
    });
  } catch { /* non-fatal */ }
}
