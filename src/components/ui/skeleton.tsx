'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  className,
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-[#131825] border border-[#1E293B]/50';

  const variants = {
    text: 'h-4 w-full rounded-md',
    card: 'h-32 w-full rounded-[1rem]',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
};

Skeleton.displayName = 'Skeleton';
