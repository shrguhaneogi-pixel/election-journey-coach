import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './client';
import { MachineState } from '@/types/journey';

/** Type guard — validates that raw Firestore data has the expected MachineState shape */
function isMachineState(data: unknown): data is MachineState {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.currentState === 'string' &&
    typeof d.context === 'object' && d.context !== null
  );
}

export async function saveJourneyState(userId: string, state: MachineState): Promise<void> {
  const docRef = doc(db, 'users', userId, 'journeyState', 'current');
  await setDoc(docRef, {
    currentState: state.currentState,
    context: state.context,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function loadJourneyState(userId: string): Promise<MachineState | null> {
  const docRef = doc(db, 'users', userId, 'journeyState', 'current');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    if (!isMachineState(data)) return null; // Reject malformed data
    return {
      currentState: data.currentState,
      context: data.context,
    };
  }
  return null;
}

