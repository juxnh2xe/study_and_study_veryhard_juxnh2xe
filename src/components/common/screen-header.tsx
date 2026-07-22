'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between py-3.5 px-4 mb-4 bg-[#070A0F]/80 backdrop-blur-md border-b border-[#1E293B]/60',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full bg-[#0B0E17] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E293B] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h1 className="text-base font-bold text-[#F8FAFC] tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-xs text-[#94A3B8]">{subtitle}</p>}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
};

ScreenHeader.displayName = 'ScreenHeader';
