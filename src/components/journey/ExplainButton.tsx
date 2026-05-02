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
    <div className="mt-3 w-full">
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleExplain();
        }}
        className="text-sm font-bold text-[var(--color-brand-indigo)] hover:text-indigo-800 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50"
        aria-expanded={!!explanation}
      >
        <span aria-hidden="true">✨</span> 
        {isLoading ? 'Thinking...' : explanation ? 'Hide explanation' : 'Explain this'}
      </button>

      {explanation && (
        <div 
          className="mt-3 p-5 bg-white border border-gray-100 shadow-md rounded-xl text-sm text-gray-800 leading-relaxed relative animate-in fade-in slide-in-from-top-2"
          role="region"
          aria-live="polite"
        >
          <div className="absolute top-0 left-4 -mt-2 w-4 h-4 bg-white border-t border-l border-gray-100 rotate-45"></div>
          {explanation}
        </div>
      )}
    </div>
  );
}
