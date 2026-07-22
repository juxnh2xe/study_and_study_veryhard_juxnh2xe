'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sparkles, CheckCircle, Smile, Meh, Frown } from 'lucide-react';

export interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  durationMinutes: number;
  subjectName: string;
  onSaveFeedback: (rating: 'great' | 'good' | 'hard', memo: string) => void;
}

export const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({
  isOpen,
  onClose,
  durationMinutes,
  subjectName,
  onSaveFeedback,
}) => {
  const [rating, setRating] = useState<'great' | 'good' | 'hard'>('great');
  const [memo, setMemo] = useState('');

  const handleSave = () => {
    onSaveFeedback(rating, memo.trim());
    setMemo('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="몰입 세션 완수 회고 📝"
      subtitle={`${subjectName} ${durationMinutes}분 집중 세션이 성공적으로 기록되었습니다!`}
      footer={
        <Button variant="primary" size="sm" onClick={handleSave} fullWidth>
          기록 저장하기
        </Button>
      }
    >
      <div className="space-y-4 select-none">
        {/* Rating Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#94A3B8]">
            오늘 공부 집중도 상태
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'great', label: '매우 좋음', icon: Smile, color: 'text-[#10B981] border-[#10B981]' },
              { id: 'good', label: '보통', icon: Meh, color: 'text-[#0EA5E9] border-[#0EA5E9]' },
              { id: 'hard', label: '어려움', icon: Frown, color: 'text-[#F59E0B] border-[#F59E0B]' },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = rating === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRating(opt.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                    isSelected
                      ? `bg-[rgba(14,165,233,0.15)] ${opt.color}`
                      : 'bg-[#0B0E17] text-[#94A3B8] border-[#1E293B]'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memo Input */}
        <Input
          label="오늘 배운 핵심 내용 및 메모 (선택)"
          placeholder="예) 미분 가능성 조건 개념 정리, 15번 유형 복습 필요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
    </Modal>
  );
};

SessionFeedbackModal.displayName = 'SessionFeedbackModal';
