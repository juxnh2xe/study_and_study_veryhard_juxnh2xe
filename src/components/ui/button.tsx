'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      ariaLabel,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-[0.75rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A0F] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer';

    const variants = {
      primary:
        'bg-[#0EA5E9] text-[#F8FAFC] hover:bg-[#0284C7] shadow-[0_4px_14px_rgba(14,165,233,0.3)] active:bg-[#0369A1]',
      secondary:
        'bg-[#131825] text-[#F8FAFC] hover:bg-[#171E30] border border-[#1E293B] active:bg-[#0F1420]',
      outline:
        'bg-transparent text-[#F8FAFC] border border-[#1E293B] hover:border-[#0EA5E9] hover:bg-[rgba(14,165,233,0.08)] active:bg-[rgba(14,165,233,0.15)]',
      ghost:
        'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#131825] active:bg-[#171E30]',
      danger:
        'bg-[#EF4444] text-[#F8FAFC] hover:bg-[#DC2626] shadow-[0_4px_14px_rgba(239,68,68,0.3)] active:bg-[#B91C1C]',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs gap-1.5 min-w-[36px]',
      md: 'h-11 px-4 text-sm gap-2 min-w-[44px]',
      lg: 'h-13 px-6 text-base gap-2.5 min-w-[48px]',
    };

    return (
      <motion.button
        ref={ref}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
