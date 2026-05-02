'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';

export function Onboarding() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).onboarding;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{currentContent.title}</h2>
        <ul className="space-y-4 mb-12">
          {currentContent.steps.map((step, idx) => (
            <li key={idx} className="flex items-center text-lg text-gray-700 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 font-bold rounded-full mr-4 shrink-0">
                {idx + 1}
              </span>
              {step.replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ul>
        <button
          onClick={() => dispatch({ type: 'NEXT' })}
          className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition-colors"
        >
          {currentContent.nextBtn}
        </button>
      </div>
    </div>
  );
}
