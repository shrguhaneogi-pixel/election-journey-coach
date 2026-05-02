'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { StepProgress } from '@/components/journey/StepProgress';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Onboarding() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).onboarding;

  useEffect(() => {
    focusMainHeading();
  }, []);

  return (
    <StepContainer>
      <StepProgress currentStep={1} totalSteps={5} />
      <Card ariaLabelledBy="main-heading">
        <h1 id="main-heading" className="text-3xl font-bold text-[var(--color-brand-charcoal)] mb-8 text-center">{currentContent.title}</h1>
        <ul className="space-y-4 mb-12" aria-label="Onboarding steps">
          {currentContent.steps.map((step, idx) => (
            <li key={idx} className="flex items-center text-lg text-gray-700 font-medium">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-[var(--color-brand-indigo)] rounded-full mr-4" aria-hidden="true">
                {idx + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
        <Button onClick={() => dispatch({ type: 'NEXT' })}>
          {currentContent.nextBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
