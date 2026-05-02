'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getChecklistContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { onKeyboardClick } from '@/lib/accessibility/keyboard';
import { ExplainButton } from '@/components/journey/ExplainButton';
import { StepProgress } from '@/components/journey/StepProgress';

export function Checklist() {
  const { state, dispatch } = useAppState();
  const currentContent = getChecklistContent(state.context.language);
  const { checklistState } = state.context;

  useEffect(() => {
    focusMainHeading();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <section className="max-w-md w-full" aria-labelledby="main-heading">
        <StepProgress currentStep={4} totalSteps={5} />
        <h1 id="main-heading" className="text-3xl font-bold text-gray-800 mb-8 text-center">{currentContent.title}</h1>
        
        <div className="space-y-4 mb-12" role="group" aria-label="Required Documents">
          {currentContent.items.map((item) => {
            const isChecked = !!checklistState[item.id];
            return (
              <label 
                key={item.id} 
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
                  isChecked ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div 
                  aria-hidden="true"
                  className={`w-6 h-6 rounded flex items-center justify-center mr-4 shrink-0 transition-colors ${
                  isChecked ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {isChecked && <span className="text-white text-sm">✓</span>}
                </div>
                <div className="flex flex-col flex-1">
                  <span className={`text-lg font-medium ${isChecked ? 'text-green-800 line-through opacity-75' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                  <ExplainButton context={`Checklist item: ${item.label}`} />
                </div>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isChecked}
                  aria-checked={isChecked}
                  onChange={() => dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: item.id })}
                />
              </label>
            );
          })}
        </div>

        <button
          aria-label={currentContent.nextBtn}
          onClick={() => dispatch({ type: 'NEXT' })}
          className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300"
        >
          {currentContent.nextBtn}
        </button>
      </section>
    </main>
  );
}
