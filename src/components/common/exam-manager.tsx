'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { SectionTitle } from './section-title';
import { Calendar, Plus, Award, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { Exam, PriorityLevel } from '@/types';
import { useToast } from '../ui/toast';

export const ExamManager: React.FC = () => {
  const [exams, setExams] = useLocalStorage<Exam[]>(STORAGE_KEYS.EXAMS, []);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('수학');
  const [examDate, setExamDate] = useState('2026-11-19');
  const [importance, setImportance] = useState<PriorityLevel>('high');

  const calculateDDay = (targetDateStr: string): number => {
    const target = new Date(targetDateStr).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleAddExam = () => {
    if (!title.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '시험명을 입력해주세요.',
      });
      return;
    }

    const newExam: Exam = {
      id: 'e_' + Date.now().toString(36),
      title: title.trim(),
      subject,
      examDate,
      importance,
      isArchived: false,
    };

    setExams([...(exams || []), newExam]);
    showToast({
      type: 'success',
      title: '시험 등록 완료 📅',
      description: `"${title.trim()}" 목표 시험 일정이 등록되었습니다.`,
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteExam = (id: string) => {
    setExams((prev) => (prev || []).filter((e) => e.id !== id));
    showToast({
      type: 'info',
      title: '시험 삭제 완료',
      description: '선택한 시험 일정이 삭제되었습니다.',
    });
  };

  return (
    <div className="space-y-3">
      <SectionTitle
        title="목표 시험 일정 (Exam D-Day)"
        subtitle="중요 시험 타임라인 관리"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            시험 등록
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(!exams || exams.length === 0) ? (
          <Card variant="flat" padding="sm" className="col-span-full py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
            등록된 시험 일정이 없습니다. 우상단 [시험 등록] 버튼을 눌러 나만의 D-Day 일정을 등록해보세요!
          </Card>
        ) : (
          exams.map((exam) => {
            const dDay = calculateDDay(exam.examDate);
            return (
              <Card
                key={exam.id}
                variant="flat"
                padding="sm"
                className="flex items-center justify-between border-[#0EA5E9]/30 bg-gradient-to-r from-[rgba(14,165,233,0.08)] to-transparent"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={exam.importance === 'high' ? 'danger' : 'warning'} size="sm">
                      {exam.subject}
                    </Badge>
                    <h4 className="text-xs font-bold text-[#F8FAFC]">{exam.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <Calendar className="h-3 w-3 text-[#0EA5E9]" />
                    <span>{exam.examDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-[#94A3B8]">남은 기간</span>
                    <div className="text-lg font-extrabold text-[#38BDF8]">
                      {dDay >= 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-1 text-[#64748B] hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="목표 시험 일정 추가"
        subtitle="새로운 시험 일정과 과목을 설정하세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddExam}>
              시험 등록
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="시험명"
            placeholder="예) 2학기 중간고사, 9월 모의평가"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="과목명"
            placeholder="예) 수학II / 물리학I"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            label="시험 날짜"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

ExamManager.displayName = 'ExamManager';
