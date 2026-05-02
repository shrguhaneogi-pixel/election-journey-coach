'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';

export function Result() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).result;
  const { readinessScore } = state.context;

  const isReady = readinessScore >= 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentContent.title}</h2>
      
      <div className="my-10 relative">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96" cy="96" r="80"
            stroke="currentColor" strokeWidth="12" fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="96" cy="96" r="80"
            stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={80 * 2 * Math.PI}
            strokeDashoffset={(80 * 2 * Math.PI) - ((readinessScore / 100) * (80 * 2 * Math.PI))}
            className={`transition-all duration-1000 ease-out ${isReady ? 'text-green-500' : 'text-blue-500'}`}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <span className="text-5xl font-extrabold text-gray-800">
            {Math.round(readinessScore)}%
          </span>
        </div>
      </div>

      <p className={`text-xl font-medium mb-12 max-w-lg ${isReady ? 'text-green-600' : 'text-gray-600'}`}>
        {isReady ? currentContent.readyMessage : currentContent.notReadyMessage}
      </p>

      <button
        onClick={() => dispatch({ type: 'RESTART' })}
        className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
      >
        {currentContent.restartBtn}
      </button>
    </div>
  );
}
