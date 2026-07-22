'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Send } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '../ui/toast';

export interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '이메일 주소를 입력해주세요.',
      });
      return;
    }

    if (!isSupabaseConfigured()) {
      showToast({
        type: 'error',
        title: '설정 미완료',
        description: 'Supabase가 설정되지 않은 환경입니다.',
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setIsSubmitting(false);

    if (error) {
      showToast({
        type: 'error',
        title: '재설정 실패',
        description: error.message || '재설정 이메일 발송에 실패했습니다.',
      });
    } else {
      showToast({
        type: 'success',
        title: '재설정 이메일 발송 완료 📧',
        description: '입력하신 이메일로 재설정 링크가 발송되었습니다.',
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="비밀번호 재설정"
      subtitle="가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다"
    >
      <form onSubmit={handleReset} className="space-y-4">
        <Input
          label="가입 이메일 주소"
          type="email"
          placeholder="example@daybreak.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          autoFocus
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<Send className="h-4 w-4" />}
        >
          재설정 링크 발송
        </Button>
      </form>
    </Modal>
  );
};

ResetPasswordModal.displayName = 'ResetPasswordModal';
