'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Chip } from '../ui/chip';
import { Badge } from '../ui/badge';
import { Modal } from '../ui/modal';
import { CircularProgress } from '../ui/circular-progress';
import { SectionTitle } from '../common/section-title';
import { DEFAULT_SUBJECTS } from '@/constants/subjects';
import { Play, Pause, Square, Flame, BookOpen, Layers, Clock, Volume2, Sparkles, Star, Music } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useToast } from '../ui/toast';

export const FocusTab: React.FC = () => {
  const {
    timerState,
    formattedTime,
    progressPercentage,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTimer();

  const { showToast } = useToast();

  // Local Form state for configuration
  const [selectedSubjectId, setSelectedSubjectId] = useState('math');
  const [textbook, setTextbook] = useState('수능특강 수학II');
  const [range, setRange] = useState('45p ~ 60p 미분법 파트');
  const [studyType, setStudyType] = useState('기출 문제 풀이');
  const [targetMinutes, setTargetMinutes] = useState(60);
  const [isPomodoro, setIsPomodoro] = useState(true);

  // White noise sound state
  const [whiteNoise, setWhiteNoise] = useState<'none' | 'rain' | 'cafe' | 'forest' | 'ocean'>('rain');

  // Session Summary Modal State
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [sessionMemo, setSessionMemo] = useState('');

  const studyTypes = ['개념 정리', '기출 문제 풀이', '오답 노트 복습', '실전 모의고사'];
  const targetTimes = [25, 45, 60, 90, 120];

  const soundLabels: Record<string, string> = {
    none: '끄기 (Off)',
    rain: '새벽 빗소리 (Rain)',
    cafe: '조용한 도서관 (Cafe/Library)',
    forest: '새벽 숲 바람 (Forest)',
    ocean: '파도 소리 (Ocean Waves)',
  };

  const selectedSubject =
    DEFAULT_SUBJECTS.find((s) => s.id === (timerState.isRunning ? timerState.subjectId : selectedSubjectId)) || DEFAULT_SUBJECTS[1];

  const handleStart = () => {
    startTimer({
      subjectId: selectedSubjectId,
      textbook,
      range,
      studyType,
      targetMinutes,
      isPomodoro,
      whiteNoiseSound: whiteNoise,
    });
    showToast({
      type: 'success',
      title: '새벽 몰입 세션 시작! ⚡',
      description: `${selectedSubject.name} (${targetMinutes}분) 몰입을 시작합니다.`,
    });
  };

  const handleRequestStop = () => {
    setIsSummaryModalOpen(true);
  };

  const handleConfirmStop = () => {
    const session = stopTimer(rating, sessionMemo);
    setIsSummaryModalOpen(false);
    setSessionMemo('');

    if (session) {
      showToast({
        type: 'success',
        title: '몰입 세션 기록 완료! 🏆',
        description: `${session.subjectName} ${session.durationMinutes}분 학습 기록이 성공적으로 저장되었습니다.`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {!timerState.isRunning ? (
          /* ========================================================
             SETUP VIEW (설정 화면)
             ======================================================== */
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
                몰입 세션 설정 ⚡
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                오늘의 목표와 과목을 선택하고 최고 밀도로 몰입해보세요
              </p>
            </div>

            {/* Step 1: 과목 선택 Chip */}
            <div className="space-y-2.5">
              <SectionTitle title="1. 과목 선택" subtitle="공부할 과목을 고르세요" />
              <div className="flex flex-wrap gap-2">
                {DEFAULT_SUBJECTS.map((subject) => (
                  <Chip
                    key={subject.id}
                    label={subject.name}
                    selected={selectedSubjectId === subject.id}
                    onSelect={() => setSelectedSubjectId(subject.id)}
                    color={subject.color}
                  />
                ))}
              </div>
            </div>

            {/* Step 2: 교재 & 범위 입력 */}
            <Card variant="flat" padding="md" className="space-y-4">
              <SectionTitle title="2. 교재 및 학습 범위" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="교재명 / 강의명"
                  placeholder="예) 수능특강 수학II"
                  value={textbook}
                  onChange={(e) => setTextbook(e.target.value)}
                  leftIcon={<BookOpen className="h-4 w-4" />}
                />
                <Input
                  label="세부 학습 범위"
                  placeholder="예) 45p ~ 60p 미분법 파트"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  leftIcon={<Layers className="h-4 w-4" />}
                />
              </div>
            </Card>

            {/* Step 3: 학습 유형, 목표 시간 & 화이트 노이즈 */}
            <Card variant="flat" padding="md" className="space-y-4">
              <SectionTitle title="3. 학습 옵션 &amp; 몰입 사운드" />
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  학습 유형
                </label>
                <div className="flex flex-wrap gap-2">
                  {studyTypes.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      selected={studyType === type}
                      onSelect={() => setStudyType(type)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  목표 시간 (분)
                </label>
                <div className="flex flex-wrap gap-2">
                  {targetTimes.map((time) => (
                    <Chip
                      key={time}
                      label={`${time}분`}
                      selected={targetMinutes === time}
                      onSelect={() => setTargetMinutes(time)}
                    />
                  ))}
                </div>
              </div>

              {/* White Noise Selector */}
              <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                <label className="block text-xs font-semibold text-[#94A3B8] flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5 text-[#0EA5E9]" />
                  <span>백그라운드 화이트 노이즈 사운드 (White Noise)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['none', 'rain', 'cafe', 'forest', 'ocean'] as const).map((sound) => (
                    <Chip
                      key={sound}
                      label={soundLabels[sound]}
                      selected={whiteNoise === sound}
                      onSelect={() => setWhiteNoise(sound)}
                    />
                  ))}
                </div>
              </div>

              {/* Pomodoro Option Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#F8FAFC]">
                    뽀모도로 (Pomodoro) 타이머 모드
                  </span>
                  <p className="text-[11px] text-[#94A3B8]">
                    25분 집중 + 5분 휴식 자동 알림
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPomodoro(!isPomodoro)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isPomodoro ? 'bg-[#0EA5E9]' : 'bg-[#1E293B]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isPomodoro ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </Card>

            {/* Start Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Flame className="h-5 w-5 fill-current" />}
              onClick={handleStart}
              className="h-14 text-base shadow-[0_4px_25px_rgba(14,165,233,0.4)]"
            >
              새벽 몰입 시작하기
            </Button>
          </motion.div>
        ) : (
          /* ========================================================
             ACTIVE TIMER VIEW (타이머 화면)
             ======================================================== */
          <motion.div
            key="active-timer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center space-y-6 pt-4 pb-8"
          >
            {/* Subject Badge & Info */}
            <div className="text-center space-y-1.5">
              <Badge
                variant="sky"
                size="md"
                className="text-sm px-3 py-1"
                icon={<Sparkles className="h-3.5 w-3.5" />}
              >
                {selectedSubject.name} 몰입 중
              </Badge>
              <h2 className="text-xl font-extrabold text-[#F8FAFC]">
                {timerState.textbook}
              </h2>
              <p className="text-xs text-[#94A3B8]">{timerState.range} • {timerState.studyType}</p>
            </div>

            {/* Circular Progress Ring Timer */}
            <div className="py-4">
              <CircularProgress
                value={progressPercentage}
                size={260}
                strokeWidth={14}
                color={selectedSubject.color}
              >
                <div className="space-y-1">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#F8FAFC] font-mono">
                    {timerState.isPaused ? 'PAUSED' : formattedTime}
                  </span>
                  <div className="text-xs font-semibold text-[#94A3B8] flex items-center justify-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#0EA5E9]" />
                    <span>목표 {timerState.targetMinutes}분 세션</span>
                  </div>
                </div>
              </CircularProgress>
            </div>

            {/* Ambient Sound Status */}
            <Card variant="glass" padding="sm" className="flex items-center gap-3 border-[#1E293B]">
              <Volume2 className="h-4 w-4 text-[#0EA5E9] animate-pulse" />
              <span className="text-xs text-[#94A3B8]">
                백그라운드 화이트 노이즈: <span className="text-[#F8FAFC] font-semibold">{soundLabels[timerState.whiteNoiseSound || 'rain']}</span>
              </span>
            </Card>

            {/* Timer Controls */}
            <div className="flex items-center gap-4 pt-2">
              <Button
                variant={timerState.isPaused ? 'primary' : 'secondary'}
                size="lg"
                leftIcon={
                  timerState.isPaused ? (
                    <Play className="h-5 w-5 fill-current" />
                  ) : (
                    <Pause className="h-5 w-5 fill-current" />
                  )
                }
                onClick={timerState.isPaused ? resumeTimer : pauseTimer}
                className="w-36 h-12"
              >
                {timerState.isPaused ? '재개하기' : '일시정지'}
              </Button>
              <Button
                variant="danger"
                size="lg"
                leftIcon={<Square className="h-5 w-5 fill-current" />}
                onClick={handleRequestStop}
                className="w-36 h-12"
              >
                세션 종료
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Finish & Rating Modal */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title="학습 몰입 세션 종료"
        subtitle="오늘 공부한 내용과 집중도를 평가하세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsSummaryModalOpen(false)}>
              돌아가기
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmStop}>
              세션 기록 저장
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#94A3B8]">
              오늘의 몰입도 Self 평가
            </label>
            <div className="flex items-center justify-center gap-2 py-2">
              {([1, 2, 3, 4, 5] as const).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1.5 rounded-lg transition-all ${
                    rating >= star ? 'text-[#F59E0B] scale-110' : 'text-[#475569]'
                  }`}
                >
                  <Star className="h-7 w-7 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="학습 성과 및 메모"
            placeholder="예) 미분법 15문항 풀이 완료. 평균값 정리 계산 속도 향상 필요."
            value={sessionMemo}
            onChange={(e) => setSessionMemo(e.target.value)}
          />
        </div>
      </Modal>
    </motion.div>
  );
};

FocusTab.displayName = 'FocusTab';
