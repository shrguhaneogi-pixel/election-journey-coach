import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveJourneyState, loadJourneyState } from '../lib/firebase/journey-store';
import { MachineState } from '../types/journey';

// ---------------------------------------------------------------------------
// Mock firebase/firestore module entirely — we test our logic, not Firebase
// ---------------------------------------------------------------------------
vi.mock('firebase/firestore', () => {
  return {
    doc: vi.fn(() => ({ path: 'mocked-doc-ref' })),
    getDoc: vi.fn(),
    setDoc: vi.fn().mockResolvedValue(undefined),
    serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
  };
});

// Mock firebase client so we don't trigger initialization
vi.mock('../lib/firebase/client', () => ({
  db: {},
}));

import { getDoc, setDoc } from 'firebase/firestore';

const VALID_STATE: MachineState = {
  currentState: 'CHECKLIST',
  context: {
    language: 'en',
    checklistState: { item1: true },
    rehearsalAnswers: {},
    readinessScore: 0,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('saveJourneyState', () => {
  it('calls setDoc with the correct structure', async () => {
    await saveJourneyState('user-123', VALID_STATE);

    expect(setDoc).toHaveBeenCalledOnce();
    const callArgs = (setDoc as ReturnType<typeof vi.fn>).mock.calls[0];
    const payload = callArgs[1];

    expect(payload.currentState).toBe('CHECKLIST');
    expect(payload.context).toEqual(VALID_STATE.context);
    expect(payload.updatedAt).toBe('SERVER_TIMESTAMP');
  });

  it('uses merge:true to avoid overwriting unrelated fields', async () => {
    await saveJourneyState('user-456', VALID_STATE);

    const callArgs = (setDoc as ReturnType<typeof vi.fn>).mock.calls[0];
    const options = callArgs[2];
    expect(options).toEqual({ merge: true });
  });
});

describe('loadJourneyState', () => {
  it('returns null when document does not exist', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockResolvedValue({ exists: () => false });

    const result = await loadJourneyState('user-123');
    expect(result).toBeNull();
  });

  it('returns parsed MachineState when document exists and is valid', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockResolvedValue({
      exists: () => true,
      data: () => ({
        currentState: 'CHECKLIST',
        context: VALID_STATE.context,
        updatedAt: 'SERVER_TIMESTAMP',
      }),
    });

    const result = await loadJourneyState('user-123');
    expect(result).not.toBeNull();
    expect(result!.currentState).toBe('CHECKLIST');
    expect(result!.context.language).toBe('en');
  });

  it('returns null when document data is missing currentState', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockResolvedValue({
      exists: () => true,
      data: () => ({ context: VALID_STATE.context }), // no currentState
    });

    const result = await loadJourneyState('user-123');
    expect(result).toBeNull();
  });

  it('returns null when document data is missing context', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockResolvedValue({
      exists: () => true,
      data: () => ({ currentState: 'LANDING' }), // no context
    });

    const result = await loadJourneyState('user-123');
    expect(result).toBeNull();
  });

  it('returns null when data is null', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockResolvedValue({
      exists: () => true,
      data: () => null,
    });

    const result = await loadJourneyState('user-123');
    expect(result).toBeNull();
  });

  it('returns null when context is null', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockResolvedValue({
      exists: () => true,
      data: () => ({ currentState: 'LANDING', context: null }),
    });

    const result = await loadJourneyState('user-123');
    expect(result).toBeNull();
  });

  it('propagates Firestore errors (does not swallow them)', async () => {
    (getDoc as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    await expect(loadJourneyState('user-err')).rejects.toThrow('Network error');
  });
});
