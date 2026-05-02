import { Variants, Transition } from 'framer-motion';

// Global Transition Curve
// "Calm guidance": smooth acceleration, calm deceleration
export const standardTransition: Transition = {
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
    transition: { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.3 },
  },
};

// Micro-interactions for buttons and interactive cards
export const microInteractionVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: { type: 'tween', duration: 0.15 },
  },
  tap: {
    scale: 0.98,
    transition: { type: 'tween', duration: 0.15 },
  },
};

// Simple fade for reduced motion or subtle elements
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: standardTransition },
  exit: { opacity: 0, transition: { type: 'tween', duration: 0.2 } },
};
