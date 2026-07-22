'use client';

import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Inbox className="h-8 w-8 text-[#64748B]" />,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <Card
      variant="flat"
      padding="lg"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border-dashed border-[#1E293B]',
        className
      )}
    >
      <div className="p-3.5 rounded-full bg-[#131825] border border-[#1E293B] mb-3">
        {icon}
      </div>
      <h4 className="text-base font-bold text-[#F8FAFC] mb-1">{title}</h4>
      <p className="text-xs text-[#94A3B8] max-w-xs leading-relaxed mb-4">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Card>
  );
};

EmptyState.displayName = 'EmptyState';
