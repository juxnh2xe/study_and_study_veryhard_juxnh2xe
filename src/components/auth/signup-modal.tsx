'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/toast';

export interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { signUpWithEmail } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '모든 항목을 입력해주세요.',
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        type: 'error',
        title: '비밀번호 불일치',
        description: '비밀번호 확인이 일치하지 않습니다.',
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUpWithEmail(email.trim(), password, name.trim());
    setIsSubmitting(false);

    if (error) {
      showToast({
        type: 'error',
        title: '회원가입 실패',
        description: error.message || '가입 처리 중 오류가 발생했습니다.',
      });
    } else {
      showToast({
        type: 'success',
        title: '회원가입 성공! 🎉',
        description: '계정이 생성되었으며 자동으로 로그인되었습니다.',
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="새 계정 만들기 (회원가입)"
      subtitle="Daybreak Study 멤버가 되어 데이터 손실 없이 학습하세요"
    >
      <form onSubmit={handleSignup} className="space-y-3.5">
        <Input
          label="이름 / 닉네임"
          placeholder="예) 김지훈"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          autoFocus
        />

        <Input
          label="이메일 주소"
          type="email"
          placeholder="example@daybreak.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="6자리 이상 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호 재입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <div className="text-right text-xs pt-1">
          <span className="text-[#94A3B8]">이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={onOpenLogin}
            className="font-bold text-[#0EA5E9] hover:underline"
          >
            로그인하기
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          회원가입 완료 및 시작
        </Button>
      </form>
    </Modal>
  );
};

SignupModal.displayName = 'SignupModal';
