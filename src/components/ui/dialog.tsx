'use client';

import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'info' | 'warning' | 'danger' | 'success';
  isLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'info',
  isLoading = false,
}) => {
  const icons = {
    info: <Info className="h-6 w-6 text-[#0EA5E9]" />,
    warning: <AlertTriangle className="h-6 w-6 text-[#F59E0B]" />,
    danger: <AlertTriangle className="h-6 w-6 text-[#EF4444]" />,
    success: <CheckCircle2 className="h-6 w-6 text-[#10B981]" />,
  };

  const confirmVariants = {
    info: 'primary' as const,
    warning: 'primary' as const,
    danger: 'danger' as const,
    success: 'primary' as const,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariants[variant]}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-full bg-[#131825] border border-[#1E293B] shrink-0">
          {icons[variant]}
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#F8FAFC]">{title}</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">{description}</p>
        </div>
      </div>
    </Modal>
  );
};

Dialog.displayName = 'Dialog';
