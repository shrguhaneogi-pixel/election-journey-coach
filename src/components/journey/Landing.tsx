'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Landing() {
  const { state, dispatch } = useAppState();
  const currentContent = getOnboardingContent(state.context.language).landing;

  useEffect(() => {
    focusMainHeading();
  }, []);

  return (
    <StepContainer>
      <Card className="text-center bg-transparent shadow-none" ariaLabelledBy="main-heading">
        <h1 id="main-heading" className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-charcoal)] mb-6 drop-shadow-sm">
          {currentContent.title}
        </h1>
        <p className="text-xl text-gray-700 mb-12">
          {currentContent.subtitle}
        </p>
        <Button
          aria-label={currentContent.startBtn}
          onClick={() => dispatch({ type: 'START' })}
        >
          {currentContent.startBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
