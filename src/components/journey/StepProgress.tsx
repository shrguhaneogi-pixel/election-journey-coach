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

  return (
    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2 text-center" aria-live="polite">
      {dict.progress?.step || 'Step'} {currentStep} {dict.progress?.of || 'of'} {totalSteps}
    </div>
  );
}
