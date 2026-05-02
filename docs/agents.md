# Agent Rules

## Phase 2 Rules
- NEVER introduce new steps outside the defined state machine
- NEVER hardcode content inside components
- ALWAYS use typed state transitions
- KEEP components presentational only

## Phase 3 Rules
- DO NOT modify state machine logic
- Firestore only stores state snapshots
- Authentication required for persistence
- ALL Firebase logic must be isolated in lib/firebase
- UI must not directly call Firestore

## Phase 4 Rules
- Translation must not affect logic
- Always fallback to static content
- Accessibility is mandatory for all components
- Voice features must be optional enhancements
- No API calls inside UI components
