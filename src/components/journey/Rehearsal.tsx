'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { useJourneyContent } from '@/hooks/useJourneyContent';
import { useJourneyActions } from '@/hooks/useJourneyActions';
import { useAppState } from '@/app/journey/context';
import { ExplainButton } from '@/components/journey/ExplainButton';
import { StepProgress } from '@/components/journey/StepProgress';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JOURNEY_STEP_COUNT } from '@/lib/config';

export function Rehearsal() {
  const { state } = useAppState();
  const { rehearsal } = useJourneyContent();
  const { answerRehearsal, finishRehearsal } = useJourneyActions();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const questions = rehearsal.questions;
  const currentQuestion = questions[currentQuestionIdx];
  const { rehearsalAnswers } = state.context;
  const selectedAnswer = rehearsalAnswers[currentQuestion.id];

  useEffect(() => {
    focusMainHeading();
  }, [currentQuestionIdx]);

  const handleSelectOption = useCallback(
    (index: number) => {
      answerRehearsal(currentQuestion.id, index);
    },
    [answerRehearsal, currentQuestion.id],
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      finishRehearsal();
    }
  }, [currentQuestionIdx, questions.length, finishRehearsal]);

  return (
    <StepContainer>
      <StepProgress currentStep={JOURNEY_STEP_COUNT} totalSteps={JOURNEY_STEP_COUNT} />
      <Card ariaLabelledBy="main-heading">
        <div
          className="text-sm text-[var(--color-brand-indigo)] font-bold tracking-wider mb-2 uppercase text-center"
          aria-live="polite"
        >
          {rehearsal.title} • {currentQuestionIdx + 1} / {questions.length}
        </div>

        <h1
          id="main-heading"
          className="text-2xl font-bold text-[var(--color-brand-charcoal)] mb-2 text-center min-h-[4rem]"
        >
          {currentQuestion.text}
        </h1>
        <div className="flex justify-center mb-8">
          <ExplainButton context={`Question: ${currentQuestion.text}`} />
        </div>

        <div className="space-y-4 mb-12" role="radiogroup" aria-labelledby="main-heading">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              role="radio"
              aria-checked={selectedAnswer === idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-indigo)] ${
                selectedAnswer === idx
                  ? 'border-[var(--color-brand-indigo)] bg-indigo-50 text-indigo-800 font-bold'
                  : 'border-gray-200 text-gray-700 hover:border-indigo-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <Button onClick={handleNext} disabled={selectedAnswer === undefined}>
          {currentQuestionIdx < questions.length - 1 ? 'Next Question' : rehearsal.nextBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
