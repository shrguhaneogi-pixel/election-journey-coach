import React from 'react';

/**
 * Triggers a callback if the user presses Enter or Space.
 * Useful for making custom div/span elements behave like buttons for keyboard navigation.
 */
export function onKeyboardClick(callback: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
}
