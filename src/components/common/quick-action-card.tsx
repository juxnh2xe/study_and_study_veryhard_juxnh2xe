'use client';

import React from 'react';
import { Card } from '../ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface QuickActionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  badgeText?: string;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  badgeText,
  className,
}) => {
  return (
    <Card
      variant="interactive"
      padding="sm"
      onClick={onClick}
      className={cn('flex items-center justify-between group', className)}
    >
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-[0.75rem] bg-[#131825] border border-[#1E293B] text-[#0EA5E9] group-hover:border-[#0EA5E9]/50 transition-colors">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
              {title}
            </h4>
            {badgeText && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(14,165,233,0.15)] text-[#38BDF8] border border-[rgba(14,165,233,0.3)]">
                {badgeText}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-[#94A3B8] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-[#64748B] group-hover:text-[#F8FAFC] group-hover:translate-x-0.5 transition-all" />
    </Card>
  );
};

QuickActionCard.displayName = 'QuickActionCard';
