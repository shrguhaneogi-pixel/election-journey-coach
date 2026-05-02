import { MachineState } from '@/types/journey';

/**
 * Local Notification Utilities.
 * These functions inspect the state machine and provide contextual nudges
 * without requiring a backend push notification infrastructure.
 */

export function getReminderMessage(state: MachineState, lang: string): string | null {
  // Simplistic check: If rehearsal isn't finished and we are at the end...
  // In our state machine, if we are at RESULT but readinessScore < 100
  if (state.currentState === 'RESULT' && state.context.readinessScore < 100) {
    if (lang === 'es') return "Recuerda completar tu práctica del día de las elecciones.";
    if (lang === 'hi') return "कृपया अपना मतदान दिवस अभ्यास पूरा करना न भूलें।";
    return "Don't forget to complete your polling day practice!";
  }

  // Could add more nudges based on date logic or other state missing flags
  
  return null;
}
