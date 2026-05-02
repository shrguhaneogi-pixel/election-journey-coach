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

export function StepRenderer() {
  const { state } = useAppState();

  switch (state.currentState) {
    case 'LANDING': return <Landing />;
    case 'ONBOARDING': return <Onboarding />;
    case 'LANGUAGE_SELECT': return <LanguageSelect />;
    case 'TIMELINE': return <Timeline />;
    case 'CHECKLIST': return <Checklist />;
    case 'REHEARSAL': return <Rehearsal />;
    case 'RESULT': return <Result />;
    default: return <Landing />;
  }
}
