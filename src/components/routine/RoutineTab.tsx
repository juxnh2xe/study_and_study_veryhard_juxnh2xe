'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Modal } from '../ui/modal';
import { Chip } from '../ui/chip';
import { SectionTitle } from '../common/section-title';
import { StatCard } from '../common/stat-card';
import { CheckCircle2, Circle, Plus, Flame, Sparkles, Clock, Target, Trash2, Play } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { useToast } from '../ui/toast';
import { DEFAULT_SUBJECTS } from '@/constants/subjects';
import { SubjectCategory, Routine } from '@/types';

export interface RoutineTabProps {
  onStartFocusRoutine?: (routine: Routine) => void;
}

export const RoutineTab: React.FC<RoutineTabProps> = ({ onStartFocusRoutine }) => {
  const {
    routines,
    toggleRoutine,
    addRoutine,
    deleteRoutine,
    completedCount,
    totalCount,
    progressPercentage,
    isAllCompleted,
  } = useRoutines();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('수학');
  const [newCategory, setNewCategory] = useState<SubjectCategory>('math');
  const [newTargetMinutes, setNewTargetMinutes] = useState(45);

  const maxStreak = (routines || []).reduce((max, r) => Math.max(max, r.streak || 0), 0);
  const totalTargetMins = (routines || []).reduce((sum, r) => sum + (r.targetTimeMinutes || 0), 0);
  const targetHours = Math.floor(totalTargetMins / 60);
  const targetMins = totalTargetMins % 60;
  const targetTimeDisplay = targetHours > 0 ? `${targetHours}시간 ${targetMins}분` : `${targetMins}분`;

  const handleToggle = (id: string, title: string, isCompleted: boolean) => {
    toggleRoutine(id);
    showToast({
      type: isCompleted ? 'info' : 'success',
      title: isCompleted ? '루틴 해제' : '루틴 달성 완료! 🎉',
      description: `"${title}" 상태가 변경되었습니다.`,
    });
  };

  const handleCreateRoutine = () => {
    if (!newTitle.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '루틴 목표 제목을 입력해주세요.',
      });
      return;
    }

    addRoutine({
      title: newTitle.trim(),
      subject: newSubject,
      category: newCategory,
      targetTimeMinutes: newTargetMinutes,
    });

    showToast({
      type: 'success',
      title: '루틴 생성 완료',
      description: `새로운 학습 루틴 "${newTitle.trim()}"이(가) 추가되었습니다.`,
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    deleteRoutine(id);
    showToast({
      type: 'info',
      title: '루틴 삭제됨',
      description: `"${title}" 루틴이 삭제되었습니다.`,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
            오늘의 루틴 관리 📋
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            매일 꾸준히 반복하는 고득점 필수 승리 루틴
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          루틴 추가
        </Button>
      </div>

      {/* Routine Completion Progress Card */}
      <Card variant="flat" padding="md" className="space-y-3 bg-[#0B0E17] border-[#1E293B]">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#94A3B8]">달성 현황</span>
            <div className="text-lg font-bold text-[#F8FAFC]">
              {completedCount}개 완료 / 총 {totalCount}개
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-[#0EA5E9]">
              {progressPercentage}%
            </span>
          </div>
        </div>
        <Progress value={progressPercentage} height="md" showLabel={false} />
      </Card>

      {/* Routine Completion Celebration Banner */}
      {isAllCompleted && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-[1rem] bg-gradient-to-r from-[rgba(16,185,129,0.15)] to-[rgba(14,165,233,0.15)] border border-[#10B981]/40 flex items-center gap-3.5"
        >
          <div className="p-2.5 rounded-full bg-[#10B981] text-white shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">
              축하합니다! 오늘 모든 루틴을 달성했습니다 🎉
            </h3>
            <p className="text-xs text-[#94A3B8]">
              연속 학습 스트릭이 늘어났어요. 오늘도 최고였습니다!
            </p>
          </div>
        </motion.div>
      )}

      {/* Routine Stats Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        <StatCard
          label="루틴 최고 스트릭"
          value={`${maxStreak}일 연속`}
          subvalue="달성 중"
          accentColor="#F59E0B"
          icon={<Flame className="h-4 w-4 text-[#F59E0B]" />}
        />
        <StatCard
          label="오늘 목표 시간"
          value={targetTimeDisplay}
          subvalue="루틴 총합"
          accentColor="#0EA5E9"
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      {/* Routine Check Cards List */}
      <div className="space-y-3">
        <SectionTitle title="오늘의 루틴 체크리스트" subtitle="카드를 클릭해 체크하세요" />
        <div className="space-y-2.5">
          {(!routines || routines.length === 0) ? (
            <Card variant="flat" padding="md" className="py-8 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
              아직 등록된 학습 루틴이 없습니다. 우상단 [루틴 추가] 버튼을 눌러 나만의 매일 공부 습관을 등록해 보세요!
            </Card>
          ) : (
            routines.map((routine) => (
              <motion.div
                key={routine.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleToggle(routine.id, routine.title, routine.isCompleted)}
              >
                <Card
                  variant="interactive"
                  padding="md"
                  className={`flex items-center justify-between transition-all select-none ${
                    routine.isCompleted
                      ? 'border-[#10B981]/40 bg-[rgba(16,185,129,0.04)]'
                      : 'border-[#1E293B] bg-[#0B0E17]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      className={`p-1 rounded-full transition-colors ${
                        routine.isCompleted
                          ? 'text-[#10B981]'
                          : 'text-[#64748B] hover:text-[#94A3B8]'
                      }`}
                    >
                      {routine.isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 fill-[rgba(16,185,129,0.2)]" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`text-sm font-bold transition-all ${
                          routine.isCompleted
                            ? 'line-through text-[#64748B]'
                            : 'text-[#F8FAFC]'
                        }`}
                      >
                        {routine.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="sky" size="sm">
                          {routine.subject}
                        </Badge>
                        <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {routine.targetTimeMinutes}분
                        </span>
                        <span className="text-[11px] text-[#F59E0B] flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {routine.streak}일 연속
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Play className="h-3.5 w-3.5 fill-current" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStartFocusRoutine) {
                          onStartFocusRoutine(routine);
                        } else {
                          showToast({
                            type: 'info',
                            title: '몰입 타이머 이동 ⏱',
                            description: `"${routine.title}" 과목(${routine.subject})으로 공부를 시작합니다.`,
                          });
                        }
                      }}
                      className="whitespace-nowrap px-2.5 h-8 text-[11px]"
                    >
                      ▶ 바로 시작
                    </Button>
                    <Badge variant={routine.isCompleted ? 'success' : 'neutral'} size="sm">
                      {routine.isCompleted ? '달성' : '대기'}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(routine.id, routine.title);
                      }}
                      className="p-1 text-[#64748B] hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* New Routine Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새로운 학업 루틴 추가"
        subtitle="매일 반복해서 완료할 목표를 설정하세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateRoutine}>
              루틴 생성
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="루틴 목표 제목"
            placeholder="예) 수학 1일 10제 문제 풀이"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#94A3B8]">과목 선택</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SUBJECTS.map((sub) => (
                <Chip
                  key={sub.id}
                  label={sub.name}
                  selected={newSubject === sub.name}
                  onSelect={() => {
                    setNewSubject(sub.name);
                    setNewCategory(sub.category);
                  }}
                  color={sub.color}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#94A3B8]">목표 시간 (분)</label>
            <div className="flex flex-wrap gap-2">
              {[15, 30, 45, 60, 90].map((mins) => (
                <Chip
                  key={mins}
                  label={`${mins}분`}
                  selected={newTargetMinutes === mins}
                  onSelect={() => setNewTargetMinutes(mins)}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

RoutineTab.displayName = 'RoutineTab';
