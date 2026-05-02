'use client';

import React, { useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getOnboardingContent } from '@/lib/content/loader';
import { Language } from '@/types/journey';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { StepProgress } from '@/components/journey/StepProgress';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function LanguageSelect() {
  const { state, dispatch } = useAppState();
  const lang = state.context.language;
  const currentContent = getOnboardingContent(lang).languageSelect;

  useEffect(() => {
    focusMainHeading();
  }, []);

  const handleLanguageChange = (l: Language) => {
    dispatch({ type: 'SELECT_LANGUAGE', payload: l });
  };

  return (
    <StepContainer>
      <StepProgress currentStep={2} totalSteps={5} />
      <Card className="text-center" ariaLabelledBy="main-heading">
        <h1 id="main-heading" className="text-3xl font-bold text-[var(--color-brand-charcoal)] mb-10">{currentContent.title}</h1>
        
        <div className="flex flex-col gap-4 mb-12" role="group" aria-label="Language options">
          <Button 
            variant={lang === 'en' ? 'primary' : 'secondary'}
            onClick={() => handleLanguageChange('en')}
            aria-pressed={lang === 'en'}
          >
            🇺🇸 English
          </Button>
          <Button 
            variant={lang === 'es' ? 'primary' : 'secondary'}
            onClick={() => handleLanguageChange('es')}
            aria-pressed={lang === 'es'}
          >
            🇪🇸 Español
          </Button>
          <Button 
            variant={lang === 'hi' ? 'primary' : 'secondary'}
            onClick={() => handleLanguageChange('hi')}
            aria-pressed={lang === 'hi'}
          >
            🇮🇳 हिन्दी (Hindi)
          </Button>
        </div>

        <Button onClick={() => dispatch({ type: 'NEXT' })}>
          {currentContent.nextBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
