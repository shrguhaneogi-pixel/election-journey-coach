'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';

export function Result() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).result;
  const score = state.context.readinessScore;

  useEffect(() => {
    focusMainHeading();
  }, []);

  const isReady = score === 100;

  return (
    <main className={`flex flex-col items-center justify-center min-h-screen p-8 text-center transition-colors ${isReady ? 'bg-green-50' : 'bg-orange-50'}`}>
      <section className="max-w-md w-full" aria-labelledby="main-heading">
        <h1 id="main-heading" className={`text-4xl font-extrabold mb-4 ${isReady ? 'text-green-800' : 'text-orange-800'}`}>
          {currentContent.title}
        </h1>
        
        <div 
          className="text-7xl font-black mb-8 drop-shadow-sm"
          style={{ color: isReady ? '#22c55e' : '#f97316' }}
          aria-label={`Score: ${score}%`}
        >
          {score}%
        </div>

        <p className="text-xl text-gray-700 mb-12 font-medium" aria-live="polite">
          {isReady ? currentContent.readyMessage : currentContent.notReadyMessage}
        </p>

        <button
          onClick={() => dispatch({ type: 'RESTART' })}
          className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full shadow hover:bg-black transition-transform transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-gray-300"
        >
          {currentContent.restartBtn}
        </button>
      </section>
    </main>
  );
}
