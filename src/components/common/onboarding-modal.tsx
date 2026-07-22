'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Flame, CheckSquare, Timer, Target, ChevronRight, X } from 'lucide-react';
import { getItem, setItem } from '@/lib/storage';

const ONBOARDING_STORAGE_KEY = 'daybreak_study_onboarding_done';

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const isDone = getItem<boolean>(ONBOARDING_STORAGE_KEY, false);
    if (!isDone) {
      setIsOpen(true);
    }
  }, []);

  const slides = [
    {
      icon: <Flame className="h-10 w-10 text-[#0EA5E9]" />,
      title: 'Daybreak Study에 오신 것을 환영합니다 🌅',
      description: '고등학생을 위한 차세대 몰입 타이머 & 학업 관리 앱으로, 눈의 피로 없이 깊은 학업 몰입을 유도합니다.',
    },
    {
      icon: <CheckSquare className="h-10 w-10 text-[#10B981]" />,
      title: '매일 실천하는 습관, 승리 루틴 📋',
      description: '과목별 1일 문제 풀이, 영어 단어 암기 등 일일 학습 습관을 체크하고 스트릭을 쌓아가세요.',
    },
    {
      icon: <Timer className="h-10 w-10 text-[#F59E0B]" />,
      title: '타임스탬프 기반 초밀도 Focus ⚡',
      description: '뽀모도로 25분/5분 분할 및 백그라운드 몰입 화이트 노이즈와 함께 완벽한 몰입 세션을 시작하세요.',
    },
    {
      icon: <Target className="h-10 w-10 text-[#8B5CF6]" />,
      title: '체계적인 학업 목표 & 리포트 📊',
      description: '오늘, 주간, 월간 목표 진행률과 과목별 비율을 Recharts 차트와 365일 잔디로 한눈에 확인하세요.',
    },
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setItem(ONBOARDING_STORAGE_KEY, true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#070A0F]/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#0B0E17] text-[#F8FAFC] border border-[#1E293B] rounded-[1.25rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10 space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0EA5E9]">
              가이드 ({step + 1} / {slides.length})
            </span>
            <button
              onClick={handleComplete}
              className="text-xs text-[#64748B] hover:text-[#F8FAFC] flex items-center gap-1"
            >
              <span>건너뛰기</span>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="py-4 flex flex-col items-center text-center space-y-3">
            <div className="p-4 rounded-2xl bg-[#131825] border border-[#1E293B]">
              {slides[step].icon}
            </div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">
              {slides[step].title}
            </h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xs">
              {slides[step].description}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <div
                key={`dot-${i}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-[#0EA5E9]' : 'w-1.5 bg-[#1E293B]'
                }`}
              />
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ChevronRight className="h-4 w-4" />}
            onClick={handleNext}
          >
            {step === slides.length - 1 ? '시작하기' : '다음'}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

OnboardingModal.displayName = 'OnboardingModal';
