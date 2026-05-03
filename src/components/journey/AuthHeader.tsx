'use client';

import React, { useState, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useAppState } from '@/app/journey/context';
import { getDictionary } from '@/lib/i18n/dictionary';
import { useEffect } from 'react';

/** Auth error codes that indicate the browser blocked the popup */
const POPUP_BLOCKED_CODES = new Set<string>([
  'auth/popup-blocked',
  'auth/popup-closed-by-user',
]);

export function AuthHeader() {
  const { state, user, loadingAuth } = useAppState();
  const dict = getDictionary(state.context.language);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // ── Handle redirect result on page load ──────────────────────────────────
  // This fires after the user returns from the Google auth redirect page.
  // On popup-capable browsers it resolves immediately with null.
  useEffect(() => {
    getRedirectResult(auth).catch((err: Error & { code?: string }) => {
      // auth/no-current-user is expected when there's no pending redirect
      if (err?.code !== 'auth/no-current-user') {
        console.error('[Auth] Redirect result error:', err);
        setAuthError('Sign-in failed. Please try again.');
      }
    });
  }, []);

  const handleSignIn = useCallback(async () => {
    setAuthError(null);
    setSigningIn(true);
    const provider = new GoogleAuthProvider();

    // Request email and profile scopes explicitly — required for production
    provider.addScope('email');
    provider.addScope('profile');

    try {
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;

      if (code && POPUP_BLOCKED_CODES.has(code)) {
        // Browser blocked the popup — fall back to redirect flow
        console.info('[Auth] Popup blocked, falling back to redirect sign-in');
        try {
          await signInWithRedirect(auth, provider);
          // Page will reload; getRedirectResult() handles the result on return
        } catch (redirectErr) {
          console.error('[Auth] Redirect sign-in failed:', redirectErr);
          setAuthError('Sign-in failed. Please try again.');
        }
      } else {
        console.error('[Auth] Sign-in failed:', err);
        setAuthError('Sign-in failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('[Auth] Sign-out failed:', err);
      setAuthError('Sign-out failed. Please try again.');
    }
  }, []);

  // ── Loading state — show a neutral placeholder during auth check ─────────
  if (loadingAuth) {
    return (
      <div className="absolute top-4 right-4 z-50" aria-hidden="true">
        <div className="w-32 h-9 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
      {user ? (
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 px-4 rounded-full shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
            {user.displayName ?? user.email}
          </span>
          <button
            onClick={handleSignOut}
            aria-label={dict.auth?.signOut ?? 'Sign out'}
            className="text-sm text-red-500 hover:text-red-700 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
          >
            {dict.auth?.signOut ?? 'Sign out'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          disabled={signingIn}
          aria-label={dict.auth?.signIn ?? 'Sign in with Google'}
          aria-busy={signingIn}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold py-2 px-4 rounded-full shadow border border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-wait"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {signingIn ? 'Signing in…' : (dict.auth?.signIn ?? 'Sign in with Google')}
        </button>
      )}

      {authError && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full border border-red-200 shadow-sm max-w-[220px] text-center"
        >
          {authError}
        </p>
      )}
    </div>
  );
}
