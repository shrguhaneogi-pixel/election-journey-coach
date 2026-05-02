'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { getReminderMessage } from '@/lib/notifications/local';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Result() {
  const { state, dispatch } = useAppState();
  const lang = state.context.language;
  const currentContent = getOnboardingContent(lang).result;
  const score = state.context.readinessScore;
  const reminder = getReminderMessage(state, lang);

  useEffect(() => {
    focusMainHeading();
  }, []);

  const isReady = score === 100;

  return (
    <StepContainer>
      <Card className="text-center bg-transparent shadow-none" ariaLabelledBy="main-heading">
        <h1 id="main-heading" className={`text-4xl font-extrabold mb-4 ${isReady ? 'text-[var(--color-brand-green)]' : 'text-[var(--color-brand-gold)]'}`}>
          {currentContent.title}
        </h1>
        
        <div 
          className="text-7xl font-black mb-8 drop-shadow-sm"
          style={{ color: isReady ? 'var(--color-brand-green)' : 'var(--color-brand-gold)' }}
          aria-label={`Score: ${score}%`}
        >
          {score}%
        </div>

        <p className="text-xl text-[var(--color-brand-charcoal)] mb-6 font-medium" aria-live="polite">
          {isReady ? currentContent.readyMessage : currentContent.notReadyMessage}
        </p>

        {reminder && (
          <div className="mb-10 p-4 bg-orange-50 text-orange-900 border-l-4 border-[var(--color-brand-gold)] rounded-r shadow-sm text-left font-semibold">
            🔔 {reminder}
          </div>
        )}

        <Button onClick={() => dispatch({ type: 'RESTART' })}>
          Restart Journey
        </Button>
      </Card>
    </StepContainer>
  );
}
