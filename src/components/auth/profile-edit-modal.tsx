'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { UserProfile } from '@/types';
import { studyRepository } from '@/lib/repository';
import { useToast } from '../ui/toast';
import { User, School, GraduationCap, Award, Calendar, Clock } from 'lucide-react';

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveSuccess: (updatedProfile: UserProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveSuccess,
}) => {
  const { showToast } = useToast();

  const [name, setName] = useState(currentProfile.name || '');
  const [grade, setGrade] = useState<'1' | '2' | '3' | 'other'>(currentProfile.grade || '3');
  const [targetUniv, setTargetUniv] = useState(currentProfile.targetUniversity || '');
  const [dDayTitle, setDDayTitle] = useState(currentProfile.dDay?.title || '2027 수능');
  const [dDayDate, setDDayDate] = useState(currentProfile.dDay?.targetDate || '2026-11-19');
  const [dailyTargetMins, setDailyTargetMins] = useState(currentProfile.dailyTargetMinutes || 360);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '이름을 입력해주세요.',
      });
      return;
    }

    const updated: UserProfile = {
      ...currentProfile,
      name: name.trim(),
      grade,
      targetUniversity: targetUniv.trim() || '목표 대학 미정',
      dDay: {
        title: dDayTitle.trim(),
        targetDate: dDayDate,
      },
      dailyTargetMinutes: Number(dailyTargetMins) || 360,
    };

    setIsSaving(true);
    await studyRepository.saveUserProfile(updated);
    setIsSaving(false);

    showToast({
      type: 'success',
      title: '프로필 수정 완료 👤',
      description: '회원 정보 및 학업 목표가 업데이트되었습니다.',
    });

    onSaveSuccess(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="내 프로필 &amp; 학업 목표 수정"
      subtitle="목표 대학 및 D-Day 일정을 수정하세요"
    >
      <form onSubmit={handleSave} className="space-y-3.5">
        <Input
          label="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#94A3B8]">학년</label>
          <div className="flex gap-2">
            {(['1', '2', '3'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
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

        <Input
          label="목표 대학 / 학과"
          placeholder="예) 서울대학교 의예과"
          value={targetUniv}
          onChange={(e) => setTargetUniv(e.target.value)}
          leftIcon={<GraduationCap className="h-4 w-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="목표 시험명"
            placeholder="예) 2027 수능"
            value={dDayTitle}
            onChange={(e) => setDDayTitle(e.target.value)}
            leftIcon={<Award className="h-4 w-4" />}
          />

          <Input
            label="시험 날짜"
            type="date"
            value={dDayDate}
            onChange={(e) => setDDayDate(e.target.value)}
            leftIcon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <Input
          label="일일 목표 몰입 시간 (분)"
          type="number"
          value={dailyTargetMins.toString()}
          onChange={(e) => setDailyTargetMins(Number(e.target.value))}
          leftIcon={<Clock className="h-4 w-4" />}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSaving}
        >
          수정 사항 저장
        </Button>
      </form>
    </Modal>
  );
};

ProfileEditModal.displayName = 'ProfileEditModal';
