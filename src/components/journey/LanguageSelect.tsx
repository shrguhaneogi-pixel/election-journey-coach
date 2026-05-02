'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { Language } from '@/types/journey';

export function LanguageSelect() {
  const { state, dispatch } = useAppState();
  const lang = state.context.language;
  const currentContent = getOnboardingContent(lang).languageSelect;

  const handleLanguageChange = (l: Language) => {
    dispatch({ type: 'SELECT_LANGUAGE', payload: l });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">{currentContent.title}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              lang === 'en' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-md' 
                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">🇺🇸</div>
            English
          </button>
          <button
            onClick={() => handleLanguageChange('es')}
            className={`p-6 rounded-2xl border-2 transition-all ${
              lang === 'es' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-md' 
                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">🇪🇸</div>
            Español
          </button>
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
