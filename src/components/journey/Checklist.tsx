'use client';

import React, { useEffect, useCallback } from 'react';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { onKeyboardClick } from '@/lib/accessibility/keyboard';
import { useAppState } from '@/app/journey/context';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useJourneyActions } from '@/hooks/useJourneyActions';
import { ExplainButton } from '@/components/journey/ExplainButton';
import { StepProgress } from '@/components/journey/StepProgress';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JOURNEY_STEP_COUNT } from '@/lib/config';

export function Checklist() {
  const { state } = useAppState();
  const { checklist } = useJourneyContent();
  const { toggleChecklistItem, advanceStep } = useJourneyActions();
  const { checklistState } = state.context;

  useEffect(() => {
    focusMainHeading();
  }, []);

  const handleAdvance = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  return (
    <StepContainer>
      <StepProgress currentStep={4} totalSteps={JOURNEY_STEP_COUNT} />
      <Card ariaLabelledBy="main-heading">
        <h1
          id="main-heading"
          className="text-3xl font-bold text-[var(--color-brand-charcoal)] mb-8 text-center"
        >
          {checklist.title}
        </h1>

        <div className="space-y-4 mb-12" role="group" aria-label="Required Documents">
          {checklist.items.map((item) => {
            const isChecked = checklistState[item.id] ?? false;
            return (
              <label
                key={item.id}
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-[var(--color-brand-indigo)] ${
                  isChecked
                    ? 'border-[var(--color-brand-green)] bg-green-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onKeyDown={onKeyboardClick(() => toggleChecklistItem(item.id))}
              >
                <div
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 mr-4 flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[var(--color-brand-green)] border-[var(--color-brand-green)]'
                      : 'border-gray-300'
                  }`}
                >
                  {isChecked && <span className="text-white text-sm">✓</span>}
                </div>
                <div className="flex flex-col flex-1">
                  <span
                    className={`text-lg font-medium ${
                      isChecked ? 'text-green-800 line-through opacity-75' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </span>
                  <ExplainButton context={`Checklist item: ${item.label}`} />
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  aria-checked={isChecked}
                  onChange={() => toggleChecklistItem(item.id)}
                />
              </label>
            );
          })}
        </div>

        <Button onClick={handleAdvance}>{checklist.nextBtn}</Button>
      </Card>
    </StepContainer>
  );
}
