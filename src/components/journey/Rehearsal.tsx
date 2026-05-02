'use client';

import React, { useState } from 'react';
import { useAppState } from '@/app/journey/context';
import { getRehearsalContent, getChecklistContent } from '@/lib/content/loader';

export function Rehearsal() {
  const { state, dispatch } = useAppState();
  const lang = state.context.language;
  const currentContent = getRehearsalContent(lang);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const questions = currentContent.questions;
  const currentQuestion = questions[currentQuestionIdx];
  const { rehearsalAnswers } = state.context;
  const selectedAnswer = rehearsalAnswers[currentQuestion.id];

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <div className="max-w-md w-full">
        <div className="text-sm text-blue-500 font-bold tracking-wider mb-2 uppercase text-center">
          {currentContent.title} • {currentQuestionIdx + 1} / {questions.length}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center min-h-[4rem]">
          {currentQuestion.text}
        </h2>
        
        <div className="space-y-4 mb-12">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedAnswer === idx 
                  ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold' 
                  : 'border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
          className={`w-full px-6 py-4 font-bold rounded-xl shadow transition-colors ${
            selectedAnswer !== undefined 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestionIdx < questions.length - 1 ? 'Next Question' : currentContent.nextBtn}
        </button>
      </div>
    </div>
  );
}
