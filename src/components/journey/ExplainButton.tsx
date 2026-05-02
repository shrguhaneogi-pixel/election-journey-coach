'use client';

import React, { useState } from 'react';
import { useAppState } from '@/app/journey/context';

interface ExplainButtonProps {
  context: string;
}

export function ExplainButton({ context }: ExplainButtonProps) {
  const { state } = useAppState();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    // If we already have the explanation, just close it
    if (explanation) {
      setExplanation(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, language: state.context.language }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error("Failed to fetch explanation", err);
      // Hard fallback if network completely fails
      setExplanation("Unable to get explanation right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button 
        type="button" // Important to not submit forms
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Don't trigger parent clicks (like checklist toggles)
          handleExplain();
        }}
        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        aria-expanded={!!explanation}
      >
        <span aria-hidden="true">✨</span> 
        {isLoading ? 'Thinking...' : explanation ? 'Hide explanation' : 'Explain this'}
      </button>

      {explanation && (
        <div 
          className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 animate-in fade-in slide-in-from-top-2"
          role="region"
          aria-live="polite"
        >
          {explanation}
        </div>
      )}
    </div>
  );
}
