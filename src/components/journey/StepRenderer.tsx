'use client';

import React from 'react';
import { useAppState } from '@/app/journey/context';
import { Landing } from './Landing';
import { Onboarding } from './Onboarding';
import { LanguageSelect } from './LanguageSelect';
import { Timeline } from './Timeline';
import { Checklist } from './Checklist';
import { Rehearsal } from './Rehearsal';
import { Result } from './Result';

import { AnimatePresence } from 'framer-motion';

export function StepRenderer() {
  const { state } = useAppState();

  const renderStep = () => {
    switch (state.currentState) {
      case 'LANDING': return <Landing key="landing" />;
      case 'ONBOARDING': return <Onboarding key="onboarding" />;
      case 'LANGUAGE_SELECT': return <LanguageSelect key="language" />;
      case 'TIMELINE': return <Timeline key="timeline" />;
      case 'CHECKLIST': return <Checklist key="checklist" />;
      case 'REHEARSAL': return <Rehearsal key="rehearsal" />;
      case 'RESULT': return <Result key="result" />;
      default: return <Landing key="default" />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderStep()}
    </AnimatePresence>
  );
}
