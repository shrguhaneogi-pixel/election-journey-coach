'use client';

import React, { useState, useCallback } from 'react';
import { useAppState } from '@/app/journey/context';
import { logExplanationRequested } from '@/lib/firebase/analytics';

interface ExplainButtonProps {
  context: string;
}

/**
 * ExplainButton — fetches an AI explanation for a checklist item or question.
 * `handleExplain` is memoized with useCallback so it doesn't cause a new function
 * reference on every parent re-render (prevents label re-mounts in Checklist).
 */
export function ExplainButton({ context }: ExplainButtonProps) {
  const { state } = useAppState();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (explanation) {
      setExplanation(null);
      return;
    }

    setIsLoading(true);
    void logExplanationRequested(context);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, language: state.context.language }),
      });
      const data = await res.json() as { explanation: string };
      setExplanation(data.explanation);
    } catch (err) {
      console.error('Failed to fetch explanation', err);
      setExplanation('Unable to get explanation right now.');
    } finally {
      setIsLoading(false);
    }
  }, [context, explanation, state.context.language]);

  return (
    <div className="mt-3 w-full">
      <button
        type="button"
        onClick={handleExplain}
        className="text-sm font-bold text-[var(--color-brand-indigo)] hover:text-indigo-800 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50"
        aria-expanded={!!explanation}
        aria-label={explanation ? 'Hide AI explanation' : 'Explain this with AI'}
      >
        <span aria-hidden="true">✨</span>
        {isLoading ? 'Thinking…' : explanation ? 'Hide explanation' : 'Explain this'}
      </button>

      {explanation && (
        <div
          className="mt-3 p-5 bg-white border border-gray-100 shadow-md rounded-xl text-sm text-gray-800 leading-relaxed relative animate-in fade-in slide-in-from-top-2"
          role="region"
          aria-live="polite"
          aria-label="AI explanation"
        >
          <div className="absolute top-0 left-4 -mt-2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45" />
          {explanation}
        </div>
      )}
    </div>
  );
}
