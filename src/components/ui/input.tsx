'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const infoText = hint || helperText;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#94A3B8] tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-[#64748B] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-11 bg-[#0B0E17] text-[#F8FAFC] placeholder-[#64748B] text-sm rounded-[0.75rem] border border-[#1E293B] px-3.5 py-2 transition-all focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center text-[#64748B]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && infoText && <p className="text-xs text-[#64748B]">{infoText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
