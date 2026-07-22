'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { StatCard } from '../common/stat-card';
import { SectionTitle } from '../common/section-title';
import { QuickActionCard } from '../common/quick-action-card';
import { MotivationBanner } from '../common/motivation-banner';
import { StudyHeatmap } from '../common/study-heatmap';
import { GoalManager } from '../common/goal-manager';
import { ExamManager } from '../common/exam-manager';
import { FocusGarden } from '../common/focus-garden';
import { Flame, Play, Calendar, Clock, Award, BookOpen, Plus, CheckCircle2, Circle, Search } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { useStudyStats } from '@/hooks/useStudyStats';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/toast';
import { studyRepository } from '@/lib/repository';
import { UserProfile } from '@/types';

export interface DashboardTabProps {
  onStartFocus: () => void;
  onNavigateTab: (tab: 'dashboard' | 'routine' | 'focus' | 'profile') => void;
  onOpenSearch: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  onStartFocus,
  onNavigateTab,
  onOpenSearch,
}) => {
  const { user } = useAuth();
  const { routines, toggleRoutine } = useRoutines();
  const { todayMinutes, weeklyMinutes, monthlyMinutes, streakDays, recentSessions } = useStudyStats();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile>({
    name: '학생',
    grade: '3',
    targetUniversity: '목표 대학 설정 필요',
    dDay: {
      title: 'D-Day 목표',
      targetDate: '2026-11-19',
    },
    dailyTargetMinutes: 360,
    themePreference: 'dark_sky',
    dynamicThemeEnabled: true,
    notificationsEnabled: true,
    defaultPomodoroMinutes: 25,
    defaultBreakMinutes: 5,
    hasCompletedOnboarding: true,
  });

  useEffect(() => {
    studyRepository.getUserProfile().then((p) => setProfile(p));
  }, [user]);

  const userName = user?.user_metadata?.name || profile.name || '학생';
  const todayTargetMinutes = profile.dailyTargetMinutes || 360;
  const goalPercentage = Math.min(100, Math.round((todayMinutes / todayTargetMinutes) * 100));

  const calculateDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDaysRemaining(profile.dDay.targetDate);

  const formatHoursMins = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  const handleToggleRoutine = (id: string, title: string, isCompleted: boolean) => {
    toggleRoutine(id);
    showToast({
      type: isCompleted ? 'info' : 'success',
      title: isCompleted ? '루틴 해제' : '루틴 달성 완료! 🎉',
      description: `"${title}" 상태가 변경되었습니다.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Greeting & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] mb-1 whitespace-nowrap break-keep">
            <Calendar className="h-3.5 w-3.5 text-[#0EA5E9] shrink-0" />
            <span className="whitespace-nowrap">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap break-keep">
            {userName} 님, 좋은 아침입니다 🌅
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5 whitespace-nowrap break-keep">
            목표 대학: <span className="text-[#38BDF8] font-bold">{profile.targetUniversity}</span>
          </p>
        </div>

        {/* Clean Single Line Search Button & D-Day Card */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
          <button
            onClick={onOpenSearch}
            className="h-10 px-3.5 rounded-xl border border-[#1E293B] bg-[#0B0E17] text-[#F8FAFC] text-xs font-semibold hover:border-[#0EA5E9] transition-all flex items-center gap-2 shrink-0 whitespace-nowrap"
          >
            <Search className="h-4 w-4 text-[#0EA5E9] shrink-0" />
            <span className="whitespace-nowrap">검색</span>
          </button>

          <Card
            variant="glass"
            padding="sm"
            className="flex items-center justify-between border-[#0EA5E9]/40 bg-gradient-to-r from-[rgba(14,165,233,0.12)] to-transparent shrink-0 min-w-[150px]"
          >
            <div>
              <span className="text-[11px] font-medium text-[#94A3B8] block truncate max-w-[90px] whitespace-nowrap">
                {profile.dDay.title}
              </span>
              <div className="text-lg font-extrabold text-[#38BDF8] whitespace-nowrap">
                D-{daysLeft}
              </div>
            </div>
            <div className="p-2 rounded-full bg-[rgba(14,165,233,0.2)] text-[#0EA5E9] shrink-0 ml-2">
              <Award className="h-4 w-4" />
            </div>
          </Card>
        </div>
      </div>

      {/* Motivation Banner */}
      <MotivationBanner />

      {/* Focus Quick Launch Banner */}
      <Card variant="interactive" padding="md" className="relative overflow-hidden bg-[#0B0E17] border-[#0EA5E9]/50 shadow-[0_0_25px_-5px_rgba(14,165,233,0.2)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(14,165,233,0.1)] rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0EA5E9] whitespace-nowrap">
              <Flame className="h-4 w-4 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">새벽 몰입 타이머 준비 완료</span>
            </div>
            <h2 className="text-lg font-bold text-[#F8FAFC] break-keep">
              오늘의 몰입 세션을 시작해볼까요?
            </h2>
            <p className="text-xs text-[#94A3B8] break-keep">
              목표 6시간 중 <span className="text-[#F8FAFC] font-semibold whitespace-nowrap">{formatHoursMins(todayMinutes)}</span> 달성 중 ({goalPercentage}%)
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play className="h-4 w-4 fill-current" />}
            onClick={onStartFocus}
            className="shrink-0 shadow-[0_4px_20px_rgba(14,165,233,0.4)] whitespace-nowrap"
          >
            Focus 시작하기
          </Button>
        </div>
      </Card>

      {/* Focus Garden Visual Growth */}
      <FocusGarden cumulativeMinutes={monthlyMinutes} />

      {/* Today Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <StatCard
          label="오늘 학습 시간"
          value={formatHoursMins(todayMinutes)}
          subvalue="/ 6h"
          accentColor="#0EA5E9"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="이번 주 누적"
          value={formatHoursMins(weeklyMinutes)}
          accentColor="#10B981"
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          label="연속 학습 스트릭"
          value={`${streakDays}일 째`}
          accentColor="#F59E0B"
          icon={<Flame className="h-4 w-4 text-[#F59E0B]" />}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* 365-day Study Heatmap */}
      <StudyHeatmap sessions={recentSessions} />

      {/* Goals Manager Component */}
      <GoalManager />

      {/* Exam D-Day Manager Component */}
      <ExamManager />

      {/* Recent Routine Status */}
      <div className="space-y-3">
        <SectionTitle
          title="오늘의 루틴 현황"
          subtitle="매일 실천하는 학습 습관"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigateTab('routine')}>
              전체 보기
            </Button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {(!routines || routines.length === 0) ? (
            <Card variant="flat" padding="sm" className="col-span-full py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
              등록된 루틴이 없습니다. [루틴] 탭에서 나만의 공부 습관을 등록해보세요!
            </Card>
          ) : (
            routines.slice(0, 4).map((routine) => (
              <Card
                key={routine.id}
                variant="interactive"
                padding="sm"
                onClick={() => handleToggleRoutine(routine.id, routine.title, routine.isCompleted)}
                className="flex items-center justify-between select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1 rounded-full ${
                      routine.isCompleted
                        ? 'text-[#10B981]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {routine.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 fill-[rgba(16,185,129,0.2)]" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold break-keep ${routine.isCompleted ? 'line-through text-[#64748B]' : 'text-[#F8FAFC]'}`}>
                      {routine.title}
                    </h4>
                    <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                      {routine.subject} • {routine.targetTimeMinutes}분
                    </span>
                  </div>
                </div>
                <Badge variant={routine.isCompleted ? 'success' : 'neutral'} size="sm">
                  {routine.isCompleted ? '완료' : '진행중'}
                </Badge>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Expanded Quick Actions */}
      <div className="space-y-3">
        <SectionTitle title="Quick Actions &amp; Shortcuts" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickActionCard
            title="새 몰입 세션 시작"
            description="과목 및 목표 시간 설정 후 시작"
            icon={<Play className="h-5 w-5 text-[#0EA5E9]" />}
            onClick={onStartFocus}
          />
          <QuickActionCard
            title="새 루틴 추가하기"
            description="매일 반복할 학습 계획 생성"
            icon={<Plus className="h-5 w-5 text-[#0EA5E9]" />}
            onClick={() => onNavigateTab('routine')}
          />
          <QuickActionCard
            title="인출 약점 &amp; 오답 노트"
            description="복습이 필요한 취약 파트 점검"
            icon={<BookOpen className="h-5 w-5 text-[#0EA5E9]" />}
            onClick={() => onNavigateTab('profile')}
          />
          <QuickActionCard
            title="통합 검색"
            description="교재, 학습 기록, 일기 키워드 검색"
            icon={<Search className="h-5 w-5 text-[#0EA5E9]" />}
            onClick={onOpenSearch}
          />
        </div>
      </div>
    </motion.div>
  );
};

DashboardTab.displayName = 'DashboardTab';
