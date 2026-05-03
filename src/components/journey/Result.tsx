'use client';

import React, { useEffect, useCallback } from 'react';
import { useAppState } from '@/app/journey/context';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { getReminderMessage } from '@/lib/notifications/local';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useJourneyActions } from '@/hooks/useJourneyActions';
import { logJourneyComplete } from '@/lib/firebase/analytics';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { READINESS_THRESHOLD } from '@/lib/config';

export function Result() {
  const { state } = useAppState();
  const { onboarding, lang } = useJourneyContent();
  const { restartJourney } = useJourneyActions();
  const content = onboarding.result;
  const score = state.context.readinessScore;
  const reminder = getReminderMessage(state, lang);
  const isReady = score >= READINESS_THRESHOLD;

  useEffect(() => {
    focusMainHeading();
    void logJourneyComplete(score);
  }, [score]);

  const handleRestart = useCallback(() => {
    restartJourney();
  }, [restartJourney]);

  return (
    <StepContainer>
      <Card
        className="text-center bg-transparent shadow-none"
        ariaLabelledBy="main-heading"
      >
        <h1
          id="main-heading"
          className={`text-4xl font-extrabold mb-4 ${
            isReady ? 'text-[var(--color-brand-green)]' : 'text-[var(--color-brand-gold)]'
          }`}
        >
          {content.title}
        </h1>

        <div
          className="text-7xl font-black mb-8 drop-shadow-sm"
          style={{ color: isReady ? 'var(--color-brand-green)' : 'var(--color-brand-gold)' }}
          aria-label={`Readiness score: ${score} percent`}
        >
          {score}%
        </div>

        <p
          className="text-xl text-[var(--color-brand-charcoal)] mb-6 font-medium"
          aria-live="polite"
        >
          {isReady ? content.readyMessage : content.notReadyMessage}
        </p>

        {reminder && (
          <div
            className="mb-10 p-4 bg-orange-50 text-orange-900 border-l-4 border-[var(--color-brand-gold)] rounded-r shadow-sm text-left font-semibold"
            role="note"
          >
            🔔 {reminder}
          </div>
        )}

        <Button onClick={handleRestart}>{content.restartBtn}</Button>
      </Card>
    </StepContainer>
  );
}
