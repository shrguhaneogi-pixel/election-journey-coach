'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';

export function Landing() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).landing;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-6 drop-shadow-sm">
        {currentContent.title}
      </h1>
      <p className="text-xl text-gray-700 mb-12 max-w-2xl">
        {currentContent.subtitle}
      </p>
      <button
        onClick={() => dispatch({ type: 'START' })}
        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
      >
        {currentContent.startBtn}
      </button>
    </div>
  );
}
