import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './client';
import { MachineState } from '@/types/journey';

const JOURNEY_COLLECTION = 'users' as const;
const STATE_SUBCOLLECTION = 'journeyState' as const;
const STATE_DOCUMENT_ID = 'current' as const;

/**
 * Type guard — validates that raw Firestore data has the expected MachineState shape.
 * Prevents malformed or tampered Firestore documents from breaking the reducer.
 */
function isMachineState(data: unknown): data is MachineState {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.currentState === 'string' &&
    typeof d.context === 'object' &&
    d.context !== null
  );
}

/**
 * Persist the journey state for an authenticated user.
 *
 * Uses setDoc with merge:true so partial saves don't overwrite unrelated fields.
 * The `updatedAt` serverTimestamp lets us audit when data was last written.
 *
 * @throws — Callers should catch and handle (context.tsx does this with debounce + error log)
 */
export async function saveJourneyState(userId: string, state: MachineState): Promise<void> {
  if (!userId) throw new Error('[Firestore] saveJourneyState called without userId');

  const docRef = doc(
    db,
    JOURNEY_COLLECTION,
    userId,
    STATE_SUBCOLLECTION,
    STATE_DOCUMENT_ID,
  );

  await setDoc(
    docRef,
    {
      currentState: state.currentState,
      context: state.context,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Load the persisted journey state for an authenticated user.
 * Returns null if no data exists yet, or if data fails the type guard.
 *
 * @throws — Callers should catch (context.tsx handles this).
 */
export async function loadJourneyState(userId: string): Promise<MachineState | null> {
  if (!userId) return null;

  const docRef = doc(
    db,
    JOURNEY_COLLECTION,
    userId,
    STATE_SUBCOLLECTION,
    STATE_DOCUMENT_ID,
  );

  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  if (!isMachineState(data)) {
    console.warn('[Firestore] Ignoring malformed journey state document for user:', userId);
    return null;
  }

  return {
    currentState: data.currentState,
    context: data.context,
  };
}
