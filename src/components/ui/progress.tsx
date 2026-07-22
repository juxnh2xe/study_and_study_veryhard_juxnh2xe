'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  color?: string; // Custom fill color
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  height = 'md',
  color = '#0EA5E9',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
          <span>진행률</span>
          <span className="text-[#F8FAFC]">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[#131825] rounded-full overflow-hidden border border-[#1E293B] relative',
          heights[height]
        )}
      >
        <motion.div
          className="h-full rounded-full transition-all"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}66`,
          }}
        />
      </div>
    </div>
  );
};

Progress.displayName = 'Progress';
