'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps {
  variant?: 'sky' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'sky',
  size = 'md',
  children,
  icon,
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full select-none whitespace-nowrap shrink-0';

  const variants = {
    sky: 'bg-[rgba(14,165,233,0.15)] text-[#38BDF8] border border-[rgba(14,165,233,0.3)]',
    success: 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]',
    warning: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]',
    danger: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]',
    neutral: 'bg-[#131825] text-[#94A3B8] border border-[#1E293B]',
    outline: 'bg-transparent text-[#94A3B8] border border-[#1E293B]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};

Badge.displayName = 'Badge';
