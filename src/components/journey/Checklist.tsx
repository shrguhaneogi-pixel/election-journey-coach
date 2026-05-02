'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getChecklistContent } from '@/lib/content/loader';

export function Checklist() {
  const { state, dispatch } = useAppState();
  const currentContent = getChecklistContent(state.context.language);
  const { checklistState } = state.context;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{currentContent.title}</h2>
        
        <div className="space-y-4 mb-12">
          {currentContent.items.map((item) => {
            const isChecked = !!checklistState[item.id];
            return (
              <label 
                key={item.id} 
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isChecked ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center mr-4 shrink-0 transition-colors ${
                  isChecked ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {isChecked && <span className="text-white text-sm">✓</span>}
                </div>
                <span className={`text-lg font-medium ${isChecked ? 'text-green-800 line-through opacity-75' : 'text-gray-700'}`}>
                  {item.label}
                </span>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isChecked}
                  onChange={() => dispatch({ type: 'TOGGLE_CHECKLIST_ITEM', payload: item.id })}
                />
              </label>
            );
          })}
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
