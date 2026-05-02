'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { microInteractionVariants } from '@/lib/motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'disabled';
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ variant = 'primary', className = '', children, disabled, onClick, type = 'button', ...ariaProps }: ButtonProps) {
  const isActuallyDisabled = disabled || variant === 'disabled';

  let baseStyles = 'w-full px-6 py-4 font-bold rounded-xl shadow-sm transition-colors focus:ring-4 focus:outline-none flex items-center justify-center gap-2 ';

  if (isActuallyDisabled) {
    baseStyles += 'bg-gray-200 text-gray-400 cursor-not-allowed';
  } else if (variant === 'secondary') {
    baseStyles += 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-100';
  } else {
    baseStyles += 'bg-[var(--color-brand-indigo)] text-white hover:bg-indigo-700 focus:ring-indigo-300';
  }

  return (
    <motion.button
      type={type}
      variants={isActuallyDisabled ? {} : microInteractionVariants}
      whileHover={isActuallyDisabled ? undefined : 'hover'}
      whileTap={isActuallyDisabled ? undefined : 'tap'}
      disabled={isActuallyDisabled}
      aria-disabled={isActuallyDisabled}
      onClick={isActuallyDisabled ? undefined : onClick}
      className={`${baseStyles} ${className}`}
      {...ariaProps}
    >
      {children}
    </motion.button>
  );
}

