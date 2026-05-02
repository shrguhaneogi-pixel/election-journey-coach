'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { getDictionary } from '@/lib/i18n/dictionary';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const { state } = useAppState();
  const dict = getDictionary(state.context.language);

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col items-center mb-6" aria-live="polite">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
        {dict.progress?.step || 'Step'} {currentStep} {dict.progress?.of || 'of'} {totalSteps}
      </div>
      
      <div className="flex items-center justify-center gap-2 w-full max-w-xs" aria-hidden="true">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          
          return (
            <React.Fragment key={step}>
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-[var(--color-brand-green)] scale-100' :
                  isActive ? 'bg-[var(--color-brand-gold)] scale-125 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
                  'bg-gray-200 scale-100'
                }`}
              />
              {index < totalSteps - 1 && (
                <div 
                  className={`flex-1 h-0.5 rounded transition-all duration-500 ${
                    isCompleted ? 'bg-[var(--color-brand-green)]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
