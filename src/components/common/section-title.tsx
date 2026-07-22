'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-end justify-between mb-4', className)}>
      <div className="space-y-0.5">
        <h3 className="text-lg font-bold tracking-tight text-[#F8FAFC]">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-[#94A3B8]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
};

SectionTitle.displayName = 'SectionTitle';
