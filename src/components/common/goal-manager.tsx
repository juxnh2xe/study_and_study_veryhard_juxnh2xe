'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { SectionTitle } from './section-title';
import { Target, Plus, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { StudyGoal, GoalScope } from '@/types';
import { useToast } from '../ui/toast';

export const GoalManager: React.FC = () => {
  const [goals, setGoals] = useLocalStorage<StudyGoal[]>(STORAGE_KEYS.GOALS, []);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<GoalScope>('today');
  const [targetMins, setTargetMins] = useState(300);

  const scopeLabels: Record<GoalScope, string> = {
    today: '오늘',
    week: '이번 주',
    month: '이번 달',
    year: '연간',
  };

  const handleAddGoal = () => {
    if (!title.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '목표 제목을 입력해주세요.',
      });
      return;
    }

    const newGoal: StudyGoal = {
      id: 'g_' + Date.now().toString(36),
      title: title.trim(),
      scope,
      targetMinutes: targetMins,
      currentMinutes: 0,
      isCompleted: false,
    };

    setGoals([...(goals || []), newGoal]);
    showToast({
      type: 'success',
      title: '목표 생성 완료 🎯',
      description: `"${title.trim()}" 학습 목표가 등록되었습니다.`,
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => (prev || []).filter((g) => g.id !== id));
    showToast({
      type: 'info',
      title: '목표 삭제 완료',
      description: '목표가 삭제되었습니다.',
    });
  };

  return (
    <div className="space-y-3">
      <SectionTitle
        title="학업 목표 (Goals System)"
        subtitle="오늘 / 주간 / 월간 / 연간 목표 달성 현황"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            목표 추가
          </Button>
        }
      />

      <div className="space-y-2.5">
        {(!goals || goals.length === 0) ? (
          <Card variant="flat" padding="sm" className="py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
            등록된 학업 목표가 없습니다. 우상단 [목표 추가] 버튼을 눌러 나만의 목표를 설정해보세요!
          </Card>
        ) : (
          goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentMinutes / goal.targetMinutes) * 100));
            return (
              <Card key={goal.id} variant="flat" padding="sm" className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="sky" size="sm">
                      {scopeLabels[goal.scope]}
                    </Badge>
                    <h4 className={`text-xs font-bold ${goal.isCompleted ? 'line-through text-[#64748B]' : 'text-[#F8FAFC]'}`}>
                      {goal.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#38BDF8]">{pct}%</span>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 text-[#64748B] hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Progress value={pct} height="sm" />

                {goal.isCompleted && (
                  <div className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>목표 완수! 축하합니다 🎉</span>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새로운 학업 목표 추가"
        subtitle="기간별 학습 목표를 설정하고 달성해보세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddGoal}>
              목표 생성
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="목표 제목"
            placeholder="예) 이번 주 누적 공부 35시간 달성"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#94A3B8]">목표 범위</label>
            <div className="flex gap-2">
              {(['today', 'week', 'month', 'year'] as GoalScope[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    scope === s
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]'
                      : 'bg-[#131825] text-[#94A3B8] border-[#1E293B]'
                  }`}
                >
                  {scopeLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

GoalManager.displayName = 'GoalManager';
