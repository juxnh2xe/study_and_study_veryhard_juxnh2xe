'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User, Mail, Lock, UserPlus, GraduationCap, HeartHandshake } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/toast';
import { UserRole } from '@/types';

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

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<'1' | '2' | '3' | 'other'>('3');
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
    const { error } = await signUpWithEmail(
      email.trim(),
      password,
      name.trim(),
      selectedRole,
      grade
    );
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
        description: `${selectedRole === 'student' ? '학생' : '보호자'} 계정이 생성되었습니다.`,
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="새 계정 만들기 (회원가입)"
      subtitle="계정 유형을 선택하고 Daybreak Study 서비스를 시작하세요"
    >
      <form onSubmit={handleSignup} className="space-y-3.5">
        {/* Role Selector Toggle */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#94A3B8]">계정 유형 선택</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-[rgba(14,165,233,0.15)] text-[#38BDF8] border-[#0EA5E9]'
                  : 'bg-[#131825] text-[#94A3B8] border-[#1E293B]'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>🎓 학생 계정</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('parent')}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                selectedRole === 'parent'
                  ? 'bg-[rgba(14,165,233,0.15)] text-[#38BDF8] border-[#0EA5E9]'
                  : 'bg-[#131825] text-[#94A3B8] border-[#1E293B]'
              }`}
            >
              <HeartHandshake className="h-4 w-4" />
              <span>👨‍👩‍👦 보호자 계정</span>
            </button>
          </div>
        </div>

        <Input
          label={selectedRole === 'student' ? '이름 / 닉네임' : '보호자 성함'}
          placeholder={selectedRole === 'student' ? '예) 김지훈' : '예) 보호자 성함'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          autoFocus
        />

        {selectedRole === 'student' && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#94A3B8]">학년</label>
            <div className="flex gap-2">
              {(['1', '2', '3'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    grade === g
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]'
                      : 'bg-[#131825] text-[#94A3B8] border-[#1E293B]'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>
        )}

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
          {selectedRole === 'student' ? '학생 회원가입 완료' : '보호자 회원가입 완료'}
        </Button>
      </form>
    </Modal>
  );
};

SignupModal.displayName = 'SignupModal';
