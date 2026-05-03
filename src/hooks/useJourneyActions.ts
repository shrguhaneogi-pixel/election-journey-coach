'use client';

/**
 * useJourneyActions
 *
 * Exposes typed, memoized action creators that wrap `dispatch`.
 * Components import named helpers instead of writing inline action objects —
 * this eliminates repeated `{ type: 'TOGGLE_CHECKLIST_ITEM', payload: ... }`
 * literals and centralizes the dispatch API behind a stable interface.
 */

import { useCallback } from 'react';
import { useAppState } from '@/app/journey/context';
import { getRehearsalContent, getChecklistContent } from '@/lib/content/loader';

export function useJourneyActions() {
  const { dispatch, state } = useAppState();

  const startJourney = useCallback(() => {
    dispatch({ type: 'START' });
  }, [dispatch]);

  const selectLanguage = useCallback(
    (language: string) => {
      const ALLOWED = ['en', 'es', 'hi'] as const;
      type AllowedLang = typeof ALLOWED[number];
      const isAllowed = (v: string): v is AllowedLang =>
        (ALLOWED as readonly string[]).includes(v);
      if (isAllowed(language)) {
        dispatch({ type: 'SELECT_LANGUAGE', payload: language });
      }
    },
    [dispatch],
  );

  const advanceStep = useCallback(() => {
    dispatch({ type: 'NEXT' });
  }, [dispatch]);

  const toggleChecklistItem = useCallback(
    (itemId: string) => {
      dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: itemId });
    },
    [dispatch],
  );

  const answerRehearsal = useCallback(
    (questionId: string, answerIndex: number) => {
      dispatch({ type: 'ANSWER_REHEARSAL', payload: { questionId, answerIndex } });
    },
    [dispatch],
  );

  /**
   * Finishes the rehearsal step and calculates readiness.
   * Reads content from the loader to avoid coupling Rehearsal.tsx to loader internals.
   */
  const finishRehearsal = useCallback(() => {
    const lang = state.context.language;
    const questions = getRehearsalContent(lang).questions;
    const checklistItems = getChecklistContent(lang).items;

    const expectedAnswers = questions.reduce<Record<string, number>>((acc, q) => {
      acc[q.id] = q.correctAnswer;
      return acc;
    }, {});

    dispatch({
      type: 'FINISH',
      payload: {
        totalQuestions: questions.length,
        totalChecklistItems: checklistItems.length,
        expectedAnswers,
      },
    });
  }, [dispatch, state.context.language]);

  const restartJourney = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, [dispatch]);

  return {
    startJourney,
    selectLanguage,
    advanceStep,
    toggleChecklistItem,
    answerRehearsal,
    finishRehearsal,
    restartJourney,
  };
}
