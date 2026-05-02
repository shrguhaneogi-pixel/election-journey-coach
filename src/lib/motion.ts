import { Variants } from 'framer-motion';

// Global Transition Curve
// "Calm guidance": smooth acceleration, calm deceleration
export const standardTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1], // cubic-bezier
  duration: 0.4,
};

// Step Transition (Slide + fade)
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 40,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: standardTransition,
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { ...standardTransition, duration: 0.3 },
  },
};

// Micro-interactions for buttons and interactive cards
// Framer Motion automatically respects `prefers-reduced-motion` if we configure it,
// or we can use useReducedMotion hook in components. For variants, we can provide 
// a non-transforming fallback or rely on framer-motion's default reduced motion handling.
export const microInteractionVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.15 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.15 },
  },
};

// Simple fade for reduced motion or subtle elements
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
