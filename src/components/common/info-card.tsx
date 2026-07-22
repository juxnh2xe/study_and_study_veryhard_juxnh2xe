'use client';

import React from 'react';
import { Card } from '../ui/card';
import { Info } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: 'sky' | 'warning' | 'success';
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon = <Info className="h-5 w-5 text-[#0EA5E9]" />,
  variant = 'sky',
  className,
}) => {
  const borders = {
    sky: 'border-[#0EA5E9]/40 bg-[rgba(14,165,233,0.06)]',
    warning: 'border-[#F59E0B]/40 bg-[rgba(245,158,11,0.06)]',
    success: 'border-[#10B981]/40 bg-[rgba(16,185,129,0.06)]',
  };

  return (
    <Card
      variant="flat"
      padding="sm"
      className={cn('border flex items-start gap-3.5', borders[variant], className)}
    >
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-[#F8FAFC]">{title}</h4>
        <p className="text-xs text-[#94A3B8] leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};

InfoCard.displayName = 'InfoCard';
