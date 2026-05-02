import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './client';
import { MachineState } from '@/types/journey';

export async function saveJourneyState(userId: string, state: MachineState): Promise<void> {
  const docRef = doc(db, 'users', userId, 'journeyState', 'current');
  await setDoc(docRef, {
    currentState: state.currentState,
    context: state.context,
    updatedAt: serverTimestamp(),
  }, { merge: true }); // Use merge so we don't accidentally overwrite unrelated fields if they exist later
}

export async function loadJourneyState(userId: string): Promise<MachineState | null> {
  const docRef = doc(db, 'users', userId, 'journeyState', 'current');
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      currentState: data.currentState,
      context: data.context,
    } as MachineState;
  }
  return null;
}
