'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'md',
}) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md sm:max-w-xl md:max-w-2xl',
    lg: 'max-w-4xl',
    full: 'max-w-full',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'w-full mx-auto px-3.5 sm:px-6 pt-4 pb-28 sm:pb-32 text-[#F8FAFC] overflow-x-hidden',
        maxWidths[maxWidth],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

PageContainer.displayName = 'PageContainer';
