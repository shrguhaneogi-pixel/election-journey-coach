'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getTimelineContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { StepProgress } from '@/components/journey/StepProgress';
import { generateGoogleCalendarUrl } from '@/lib/calendar/google-calendar';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Timeline() {
  const { state, dispatch } = useAppState();
  const currentContent = getTimelineContent(state.context.language);

  useEffect(() => {
    focusMainHeading();
  }, []);

  return (
    <StepContainer>
      <StepProgress currentStep={3} totalSteps={5} />
      <Card ariaLabelledBy="main-heading">
        <h1 id="main-heading" className="text-3xl font-bold text-[var(--color-brand-charcoal)] mb-10 text-center">{currentContent.title}</h1>
        
        <div className="relative border-l-4 border-indigo-200 ml-4 mb-12" role="list" aria-label="Timeline events">
          {currentContent.events.map((evt, idx) => (
            <article key={idx} className="mb-8 ml-6 relative" role="listitem">
              <span className="absolute -left-[35px] top-1 w-4 h-4 bg-[var(--color-brand-indigo)] rounded-full border-4 border-white shadow" aria-hidden="true"></span>
              <h2 className="text-sm font-bold text-[var(--color-brand-indigo)] mb-1 uppercase tracking-wider">{evt.date}</h2>
              <p className="text-lg text-[var(--color-brand-charcoal)] font-medium mb-1">{evt.event}</p>
              <a 
                href={generateGoogleCalendarUrl(evt.event, "Election Deadline Reminder", evt.date)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-brand-indigo)] hover:text-indigo-700 hover:underline flex items-center gap-1"
              >
                📅 Add to Calendar
              </a>
            </article>
          ))}
        </div>

        <Button onClick={() => dispatch({ type: 'NEXT' })}>
          {currentContent.nextBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
