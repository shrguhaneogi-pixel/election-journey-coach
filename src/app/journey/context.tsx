'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { loadJourneyState, saveJourneyState } from '@/lib/firebase/journey-store';
import { appReducer, initialState } from '@/lib/journey/state-machine';
import { MachineState, Action } from '@/types/journey';

/** Map our internal lang codes to BCP-47 for the HTML lang attribute */
const LANG_TO_BCP47: Record<string, string> = { en: 'en', es: 'es', hi: 'hi' };

/** Debounce delay for Firestore writes — batches rapid dispatches into one save */
const SAVE_DEBOUNCE_MS = 1_500;

interface StateContextType {
  state: MachineState;
  dispatch: React.Dispatch<Action>;
  user: User | null;
  loadingAuth: boolean;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Dynamic document.lang for correct screen-reader pronunciation ─────────
  useEffect(() => {
    const bcp47 = LANG_TO_BCP47[state.context.language] ?? 'en';
    document.documentElement.lang = bcp47;
  }, [state.context.language]);

  // ── Authentication & Hydration ────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const savedState = await loadJourneyState(currentUser.uid);
          if (savedState) {
            dispatch({ type: 'HYDRATE', payload: savedState });
          }
        } catch (error) {
          console.error('Error loading journey state', error);
        }
      } else {
        dispatch({ type: 'HYDRATE', payload: initialState });
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Debounced Persistence ─────────────────────────────────────────────────
  // Rapid dispatches (e.g. toggling checklist items) are batched into a single
  // Firestore write after SAVE_DEBOUNCE_MS of inactivity.
  const debouncedSave = useCallback(
    (uid: string, currentState: MachineState) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveJourneyState(uid, currentState).catch(err =>
          console.error('Error saving state', err),
        );
      }, SAVE_DEBOUNCE_MS);
    },
    [],
  );

  useEffect(() => {
    if (user && !loadingAuth) {
      debouncedSave(user.uid, state);
    }
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, user, loadingAuth, debouncedSave]);

  return (
    <StateContext.Provider value={{ state, dispatch, user, loadingAuth }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a JourneyProvider');
  }
  return context;
}
