/**
 * FCM push notification stub.
 *
 * Full implementation requires:
 * - A VAPID key in .env.local (NEXT_PUBLIC_FIREBASE_VAPID_KEY)
 * - A service worker (public/firebase-messaging-sw.js)
 * - A backend push server
 *
 * Until those are configured, all notification features degrade gracefully
 * via the local.ts reminder messages instead.
 */
export async function getFCMToken(): Promise<string | null> {
  // Not yet configured. Returns null so callers fall back to local reminders.
  return null;
}
