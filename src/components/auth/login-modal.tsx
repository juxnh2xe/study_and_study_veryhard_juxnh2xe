'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Flame, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/toast';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onOpenResetPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenSignup,
  onOpenResetPassword,
}) => {
  const { signInWithEmail, isConfigured } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '이메일과 비밀번호를 모두 입력해주세요.',
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signInWithEmail(email.trim(), password);
    setIsSubmitting(false);

    if (error) {
      showToast({
        type: 'error',
        title: '로그인 실패',
        description: error.message || '이메일 또는 비밀번호가 올바르지 않습니다.',
      });
    } else {
      showToast({
        type: 'success',
        title: '로그인 성공! 🌅',
        description: '클라우드 데이터 동기화가 설정되었습니다.',
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daybreak Study 로그인"
      subtitle="클라우드 동기화로 어디서나 나의 학업 기록을 연결하세요"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {!isConfigured && (
          <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[#F59E0B]/30 text-xs text-[#F59E0B]">
            현재 Supabase 환경 변수가 설정되지 않았습니다. (.env.local 설정 후 이용해 주세요)
          </div>
        )}

        <Input
          label="이메일 주소"
          type="email"
          placeholder="example@daybreak.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          autoFocus
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={onOpenResetPassword}
            className="text-[#94A3B8] hover:text-[#0EA5E9] transition-colors"
          >
            비밀번호를 잊으셨나요?
          </button>
          <button
            type="button"
            onClick={onOpenSignup}
            className="font-bold text-[#0EA5E9] hover:underline"
          >
            회원가입하기
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          로그인
        </Button>
      </form>
    </Modal>
  );
};

LoginModal.displayName = 'LoginModal';
