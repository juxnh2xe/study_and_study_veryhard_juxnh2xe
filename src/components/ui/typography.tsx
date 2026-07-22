'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'name' | 'label' | 'stat' | 'unit' | 'badgeText' | 'title' | 'subtitle';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  variant = 'label',
  children,
  className,
  as: Component = 'span',
  ...props
}) => {
  const baseStyles = 'break-keep whitespace-nowrap inline-flex items-center';

  const variants = {
    name: 'font-bold text-[#F8FAFC] tracking-tight text-lg sm:text-2xl',
    label: 'font-semibold text-[#94A3B8] text-xs',
    stat: 'font-extrabold text-[#F8FAFC] tracking-tight text-lg sm:text-2xl font-mono',
    unit: 'font-bold text-[#38BDF8] text-xs shrink-0',
    badgeText: 'font-semibold text-xs shrink-0',
    title: 'font-bold text-[#F8FAFC] tracking-tight text-base sm:text-lg',
    subtitle: 'font-medium text-[#94A3B8] text-xs',
  };

  return (
    <Component className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};

Text.displayName = 'Text';
