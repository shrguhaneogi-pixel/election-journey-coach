/**
 * Centralized application constants.
 * All magic numbers and tunable values live here — never inline.
 */

/** Total number of visible journey steps shown in the progress bar */
export const JOURNEY_STEP_COUNT = 5;

/** Maximum characters accepted for the AI explanation context input */
export const MAX_CONTEXT_CHARS = 300;

/** In-process rate limit window for /api/explain (ms between calls per IP) */
export const RATE_LIMIT_MS = 3_000;

/** Debounce delay before persisting journey state to Firestore (ms) */
export const SAVE_DEBOUNCE_MS = 1_500;

/** Supported language codes */
export const SUPPORTED_LANGUAGES = ['en', 'es', 'hi'] as const;

/** Score threshold to consider a user "ready to vote" */
export const READINESS_THRESHOLD = 100;
