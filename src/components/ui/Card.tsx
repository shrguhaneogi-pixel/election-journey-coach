import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  ariaLabelledBy?: string;
}

/**
 * Card — pure layout wrapper.
 * React.memo prevents re-renders when parent dispatches don't affect this card's props.
 */
export const Card = React.memo(function Card({
  children,
  className = '',
  ariaLabelledBy,
}: CardProps) {
  return (
    <section
      className={`bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-2xl mx-auto ${className}`}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </section>
  );
});

Card.displayName = 'Card';
