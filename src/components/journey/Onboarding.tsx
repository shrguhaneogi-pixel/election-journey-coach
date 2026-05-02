'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';

export function Onboarding() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).onboarding;

  useEffect(() => {
    focusMainHeading();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <section className="max-w-md w-full" aria-labelledby="main-heading">
        <h1 id="main-heading" className="text-3xl font-bold text-gray-800 mb-8 text-center">{currentContent.title}</h1>
        <ul className="space-y-4 mb-12" aria-label="Onboarding steps">
          {currentContent.steps.map((step, idx) => (
            <li key={idx} className="flex items-center text-lg text-gray-700 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 font-bold rounded-full mr-4 shrink-0" aria-hidden="true">
                {idx + 1}
              </span>
              {step.replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ul>
        <button
          aria-label={currentContent.nextBtn}
          onClick={() => dispatch({ type: 'NEXT' })}
          className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition-colors"
        >
          {currentContent.nextBtn}
        </button>
      </section>
    </main>
  );
}
