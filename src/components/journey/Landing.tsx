'use client';

import React, { useEffect, useCallback } from 'react';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useJourneyActions } from '@/hooks/useJourneyActions';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Landing() {
  const { onboarding } = useJourneyContent();
  const { startJourney } = useJourneyActions();
  const content = onboarding.landing;

  useEffect(() => {
    focusMainHeading();
  }, []);

  const handleStart = useCallback(() => {
    startJourney();
  }, [startJourney]);

  return (
    <StepContainer>
      <Card className="text-center bg-transparent shadow-none" ariaLabelledBy="main-heading">
        <h1
          id="main-heading"
          className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-charcoal)] mb-6 drop-shadow-sm"
        >
          {content.title}
        </h1>
        <p className="text-xl text-gray-700 mb-12">{content.subtitle}</p>
        <Button aria-label={content.startBtn} onClick={handleStart}>
          {content.startBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
