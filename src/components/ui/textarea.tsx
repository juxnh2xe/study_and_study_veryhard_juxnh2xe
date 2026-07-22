'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, rows = 3, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-[#94A3B8] tracking-wide"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-[#0B0E17] text-[#F8FAFC] placeholder-[#64748B] text-sm rounded-[0.75rem] border border-[#1E293B] p-3.5 transition-all focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] disabled:opacity-50 disabled:cursor-not-allowed resize-none',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-[#64748B]">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
