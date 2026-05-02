'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function StepContainer({ children, className = '' }: StepContainerProps) {
  return (
    <motion.div
      role="region"
      aria-label="Journey step"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

