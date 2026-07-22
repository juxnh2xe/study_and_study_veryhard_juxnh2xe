'use client';

import React from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subvalue,
  icon,
  trend,
  accentColor = '#0EA5E9',
  className,
}) => {
  return (
    <Card variant="flat" padding="sm" className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-[1rem]"
        style={{ backgroundColor: accentColor }}
      />
      <div className="pl-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-[#94A3B8]">{label}</span>
          {icon && (
            <div className="p-1.5 rounded-lg bg-[#131825] border border-[#1E293B] text-[#94A3B8]">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
            {value}
          </span>
          {subvalue && (
            <span className="text-xs font-medium text-[#64748B]">
              {subvalue}
            </span>
          )}
        </div>
        {trend && (
          <div className="mt-1.5 text-[11px] font-medium flex items-center gap-1">
            <span
              className={
                trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-[#64748B]">전주 대비</span>
          </div>
        )}
      </div>
    </Card>
  );
};

StatCard.displayName = 'StatCard';
