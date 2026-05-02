'use client';

import React, { useState, useEffect } from 'react';
import { useAppState } from '@/app/journey/context';
import { getRehearsalContent, getChecklistContent } from '@/lib/content/loader';
import { focusMainHeading } from '@/lib/accessibility/aria';
import { ExplainButton } from '@/components/journey/ExplainButton';
import { StepProgress } from '@/components/journey/StepProgress';
import { StepContainer } from '@/components/journey/StepContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Rehearsal() {
  const { state, dispatch } = useAppState();
  const lang = state.context.language;
  const currentContent = getRehearsalContent(lang);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const questions = currentContent.questions;
  const currentQuestion = questions[currentQuestionIdx];
  const { rehearsalAnswers } = state.context;
  const selectedAnswer = rehearsalAnswers[currentQuestion.id];

  useEffect(() => {
    focusMainHeading();
  }, [currentQuestionIdx]); // Refocus on every new question

  const handleSelectOption = (index: number) => {
    dispatch({ 
      type: 'ANSWER_REHEARSAL', 
      payload: { questionId: currentQuestion.id, answerIndex: index } 
    });
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      const checklistContent = getChecklistContent(lang).items;
      const expectedAnswers = questions.reduce((acc: Record<string, number>, q) => {
        acc[q.id] = q.correctAnswer;
        return acc;
      }, {});

      dispatch({ 
        type: 'FINISH', 
        payload: { 
          totalQuestions: questions.length,
          totalChecklistItems: checklistContent.length,
          expectedAnswers
        }
      });
    }
  };

  return (
    <StepContainer>
      <StepProgress currentStep={5} totalSteps={5} />
      <Card ariaLabelledBy="main-heading">
        <div className="text-sm text-[var(--color-brand-indigo)] font-bold tracking-wider mb-2 uppercase text-center" aria-live="polite">
          {currentContent.title} • {currentQuestionIdx + 1} / {questions.length}
        </div>
        
        <h1 id="main-heading" className="text-2xl font-bold text-[var(--color-brand-charcoal)] mb-2 text-center min-h-[4rem]">
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

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
        >
          {currentQuestionIdx < questions.length - 1 ? 'Next Question' : currentContent.nextBtn}
        </Button>
      </Card>
    </StepContainer>
  );
}
