'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getTimelineContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';

export function Timeline() {
  const { state, dispatch } = useAppState();
  const currentContent = getTimelineContent(state.context.language);

  useEffect(() => {
    focusMainHeading();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <section className="max-w-md w-full" aria-labelledby="main-heading">
        <h1 id="main-heading" className="text-3xl font-bold text-gray-800 mb-10 text-center">{currentContent.title}</h1>
        
        <div className="relative border-l-4 border-blue-200 ml-4 mb-12" role="list" aria-label="Timeline events">
          {currentContent.events.map((evt, idx) => (
            <article key={idx} className="mb-8 ml-6 relative" role="listitem">
              <span className="absolute -left-[35px] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow" aria-hidden="true"></span>
              <h2 className="text-sm font-bold text-blue-600 mb-1 uppercase tracking-wider">{evt.date}</h2>
              <p className="text-lg text-gray-800 font-medium">{evt.event}</p>
            </article>
          ))}
        </div>

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
