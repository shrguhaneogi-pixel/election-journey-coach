'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { Language } from '@/types/journey';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { StepProgress } from '@/components/journey/StepProgress';

export function LanguageSelect() {
  const { state, dispatch } = useAppState();
  const lang = state.context.language;
  const currentContent = getOnboardingContent(lang).languageSelect;

  useEffect(() => {
    focusMainHeading();
  }, []);

  const handleLanguageChange = (l: Language) => {
    dispatch({ type: 'SELECT_LANGUAGE', payload: l });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <section className="max-w-md w-full text-center" aria-labelledby="main-heading">
        <StepProgress currentStep={2} totalSteps={5} />
        <h1 id="main-heading" className="text-3xl font-bold text-gray-800 mb-10">{currentContent.title}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-12" role="group" aria-label="Language options">
          <button
            aria-pressed={lang === 'en'}
            onClick={() => handleLanguageChange('en')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              lang === 'en' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-md' 
                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2" aria-hidden="true">🇺🇸</div>
            English
          </button>
          <button
            aria-pressed={lang === 'es'}
            onClick={() => handleLanguageChange('es')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              lang === 'es' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-md' 
                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2" aria-hidden="true">🇪🇸</div>
            Español
          </button>
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
