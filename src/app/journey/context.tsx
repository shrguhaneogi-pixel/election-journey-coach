'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { loadJourneyState, saveJourneyState } from '@/lib/firebase/journey-store';
import { appReducer, initialState } from '@/lib/journey/state-machine';
import { MachineState, Action } from '@/types/journey';

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

  // Handle Authentication & Hydration
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
          console.error("Error loading journey state", error);
        }
      } else {
        // If logged out, reset to initial state
        dispatch({ type: 'HYDRATE', payload: initialState });
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Persistence on State Change
  useEffect(() => {
    if (user && !loadingAuth) {
      saveJourneyState(user.uid, state).catch(err => {
        console.error("Error saving state", err);
      });
    }
  }, [state, user, loadingAuth]);

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
