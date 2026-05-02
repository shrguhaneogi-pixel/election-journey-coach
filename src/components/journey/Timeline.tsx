'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getTimelineContent } from '@/lib/content/loader';

export function Timeline() {
  const { state, dispatch } = useAppState();
  const currentContent = getTimelineContent(state.context.language);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">{currentContent.title}</h2>
        
        <div className="relative border-l-4 border-blue-200 ml-4 mb-12">
          {currentContent.events.map((evt, idx) => (
            <div key={idx} className="mb-8 ml-6 relative">
              <span className="absolute -left-[35px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow"></span>
              <h3 className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wider">{evt.date}</h3>
              <p className="text-lg text-gray-800 font-medium">{evt.event}</p>
            </div>
          ))}
        </div>

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
