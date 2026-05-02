import { MachineState, Action } from '@/types/journey';
import { initialContext } from './context';
import { handleTransition } from './transitions';

export const initialState: MachineState = {
  currentState: 'LANDING',
  context: initialContext,
};

export function appReducer(state: MachineState, action: Action): MachineState {
  if (action.type === 'HYDRATE') {
    return action.payload;
  }
  return handleTransition(state, action);
}
