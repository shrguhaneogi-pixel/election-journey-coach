'use client';

import React from 'react';
import { JourneyProvider } from './context';
import { StepRenderer } from '@/components/journey/StepRenderer';
import { AuthHeader } from '@/components/journey/AuthHeader';
import { LanguageSwitcher } from '@/components/journey/LanguageSwitcher';

export default function JourneyPage() {
  return (
    <JourneyProvider>
      <LanguageSwitcher />
      <AuthHeader />
      <StepRenderer />
    </JourneyProvider>
  );
}
