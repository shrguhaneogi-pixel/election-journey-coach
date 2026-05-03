/**
 * Component render tests — StepProgress
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/firebase/client', () => ({ auth: {}, db: {}, app: {} }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(() => () => {}),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({ addScope: vi.fn() })),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  signOut: vi.fn(),
  browserLocalPersistence: 'LOCAL',
  setPersistence: vi.fn().mockResolvedValue(undefined),
  AuthErrorCodes: {
    POPUP_BLOCKED: 'auth/popup-blocked',
    POPUP_CLOSED_BY_USER: 'auth/popup-closed-by-user',
  },
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));
vi.mock('@/lib/firebase/analytics', () => ({
  logStepView: vi.fn(),
  logJourneyComplete: vi.fn(),
  logLanguageChange: vi.fn(),
  logExplanationRequested: vi.fn(),
}));
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, disabled, className }: React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }) =>
      <button onClick={onClick} disabled={disabled} className={className}>{children}</button>,
    div: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) =>
      <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { StepProgress } from '@/components/journey/StepProgress';
import { JourneyProvider } from '@/app/journey/context';

function renderWithProvider(ui: React.ReactElement) {
  return render(<JourneyProvider>{ui}</JourneyProvider>);
}

beforeEach(() => { vi.clearAllMocks(); });

describe('StepProgress component', () => {
  it('displays the current step and total steps', () => {
    renderWithProvider(<StepProgress currentStep={3} totalSteps={5} />);
    expect(screen.getByText(/step 3/i)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('renders totalSteps number of dot indicators', () => {
    const { container } = renderWithProvider(
      <StepProgress currentStep={2} totalSteps={5} />,
    );
    // Each dot is a div.rounded-full
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(5);
  });

  it('renders correctly for step 1 of 5', () => {
    renderWithProvider(<StepProgress currentStep={1} totalSteps={5} />);
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
  });

  it('renders correctly for the last step', () => {
    renderWithProvider(<StepProgress currentStep={5} totalSteps={5} />);
    expect(screen.getByText(/step 5/i)).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen reader announcements', () => {
    const { container } = renderWithProvider(
      <StepProgress currentStep={1} totalSteps={5} />,
    );
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('dot container is aria-hidden (decorative)', () => {
    const { container } = renderWithProvider(
      <StepProgress currentStep={2} totalSteps={5} />,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
