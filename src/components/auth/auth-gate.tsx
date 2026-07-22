'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Flame, Mail, Lock, User, Key, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/toast';

export const AuthGate: React.FC = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Private Custom Security Access Key
  const REQUIRED_ACCESS_KEY = 'juxnh2xe1004';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '이메일과 비밀번호를 입력해주세요.',
      });
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        showToast({
          type: 'error',
          title: '입력 오류',
          description: '이름/닉네임을 입력해주세요.',
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

      // Check Private Security Access Key
      if (accessKey.trim() !== REQUIRED_ACCESS_KEY) {
        showToast({
          type: 'error',
          title: '보안 액세스 키 오류 🔒',
          description: '올바른 개인 보안 액세스 키를 입력해야 회원가입이 승인됩니다.',
        });
        return;
      }
    }

    setIsSubmitting(true);

    if (mode === 'login') {
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
          description: '환영합니다. 새벽하늘 몰입 관리를 시작합니다.',
        });
      }
    } else {
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
          title: '회원가입 완료! 🎉',
          description: '보안 인증 키 승인으로 계정이 생성되었습니다.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#070A0F] text-[#F8FAFC]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8] shadow-[0_0_30px_rgba(14,165,233,0.4)] mb-1">
            <Flame className="h-8 w-8 text-white fill-current animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
            DAYBREAK STUDY
          </h1>
          <p className="text-xs text-[#94A3B8]">
            고등학생을 위한 프라이빗 몰입 타이머 &amp; 학업 플래너
          </p>
        </div>

        {/* Login / Signup Card */}
        <Card variant="flat" padding="md" className="space-y-4 border-[#0EA5E9]/30 bg-[#0B0E17]">
          {/* Mode Switch Tabs */}
          <div className="flex gap-2 p-1 rounded-lg bg-[#131825] border border-[#1E293B]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md text-xs font-bold transition-colors ${
                mode === 'login' ? 'bg-[#0EA5E9] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-md text-xs font-bold transition-colors ${
                mode === 'signup' ? 'bg-[#0EA5E9] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              보안 회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <Input
                label="이름 / 닉네임"
                placeholder="이름 또는 닉네임 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                autoFocus
              />
            )}

            <Input
              label="이메일 주소"
              type="email"
              placeholder="이메일 주소 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            {mode === 'signup' && (
              <>
                <Input
                  label="비밀번호 확인"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                />

                <Input
                  label="개인 보안 액세스 키 (Security Key)"
                  type="password"
                  placeholder="비밀 액세스 키 입력"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  leftIcon={<Key className="h-4 w-4 text-[#F59E0B]" />}
                  helperText="관리자에게 전달받은 전용 보안 키를 입력해야 회원가입이 승인됩니다."
                />
              </>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={mode === 'login' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              className="mt-2"
            >
              {mode === 'login' ? 'Daybreak 로그인' : '보안 가입 완료'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

AuthGate.displayName = 'AuthGate';
