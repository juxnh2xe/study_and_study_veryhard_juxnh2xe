'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
  className,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow || '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#070A0F]/85 backdrop-blur-md z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full max-h-[85dvh] sm:max-h-[90dvh] flex flex-col bg-[#0B0E17] text-[#F8FAFC] border border-[#1E293B] rounded-2xl sm:rounded-[1.25rem] shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden',
              maxWidths[maxWidth],
              className
            )}
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="flex items-start justify-between border-b border-[#1E293B] p-4 sm:p-6 shrink-0 bg-[#0B0E17]">
                <div className="space-y-0.5 pr-4">
                  {title && (
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC] break-keep">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-xs text-[#94A3B8] break-keep">{subtitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="모달 닫기"
                  className="rounded-lg p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#131825] transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2.5 border-t border-[#1E293B] bg-[#070A0F]/60 p-3.5 sm:p-4 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

Modal.displayName = 'Modal';
