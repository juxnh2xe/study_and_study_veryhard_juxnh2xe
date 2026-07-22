'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'flat' | 'elevated' | 'interactive' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'flat',
      padding = 'md',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-[1rem] border border-[#1E293B] transition-all';

    const variants = {
      flat: 'bg-[#0B0E17] text-[#F8FAFC] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)]',
      elevated:
        'bg-[#131825] text-[#F8FAFC] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.6)] border-[#26334D]',
      interactive:
        'bg-[#0B0E17] text-[#F8FAFC] hover:bg-[#111625] hover:border-[#0EA5E9]/50 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] cursor-pointer',
      glass:
        'bg-[#0B0E17]/80 backdrop-blur-md text-[#F8FAFC] border-[#1E293B]/80',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-3.5 sm:p-4',
      md: 'p-5 sm:p-6',
      lg: 'p-6 sm:p-8',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={variant === 'interactive' ? { y: -2 } : undefined}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
