'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Modal } from '../ui/modal';
import { SectionTitle } from './section-title';
import { BookOpen, Plus, Sparkles, Calendar } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { StudyDiary } from '@/types';
import { useToast } from '../ui/toast';

export const StudyDiarySection: React.FC = () => {
  const [diaries, setDiaries] = useLocalStorage<StudyDiary[]>(STORAGE_KEYS.DIARIES, []);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [summary, setSummary] = useState('');
  const [feelings, setFeelings] = useState('');
  const [difficulties, setDifficulties] = useState('');
  const [tomorrowGoal, setTomorrowGoal] = useState('');

  const handleSaveDiary = () => {
    if (!summary.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '오늘의 학습 요약을 작성해주세요.',
      });
      return;
    }

    const newDiary: StudyDiary = {
      id: 'd_' + Date.now().toString(36),
      date: new Date().toISOString().split('T')[0],
      todayStudySummary: summary.trim(),
      feelings: feelings.trim() || '오늘도 보람찬 몰입이었습니다.',
      difficulties: difficulties.trim() || '없음',
      tomorrowGoal: tomorrowGoal.trim() || '목표 달성하기',
    };

    setDiaries([newDiary, ...(diaries || [])]);
    showToast({
      type: 'success',
      title: '공부 일기 저장 완료 📝',
      description: '오늘의 학습 소감과 성과가 저장되었습니다.',
    });

    setSummary('');
    setFeelings('');
    setDifficulties('');
    setTomorrowGoal('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3">
      <SectionTitle
        title="공부 일기 (Study Diary)"
        subtitle="매일의 피드백과 성찰 노하우"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            일기 작성
          </Button>
        }
      />

      <div className="space-y-3">
        {(!diaries || diaries.length === 0) ? (
          <Card variant="flat" padding="sm" className="py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
            작성된 공부 일기가 없습니다. [일기 작성] 버튼을 눌러 하루의 공부 소감을 기록해보세요!
          </Card>
        ) : (
          diaries.map((diary) => (
            <Card key={diary.id} variant="flat" padding="md" className="space-y-2 border-[#1E293B]">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {diary.date} 공부 일기
                </span>
                <span className="text-[10px] text-[#94A3B8]">저장됨</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="font-bold text-[#F8FAFC]">📝 오늘 공부: </span>
                  <span className="text-[#94A3B8]">{diary.todayStudySummary}</span>
                </div>
                <div>
                  <span className="font-bold text-[#10B981]">💡 느낀 점: </span>
                  <span className="text-[#94A3B8]">{diary.feelings}</span>
                </div>
                <div>
                  <span className="font-bold text-[#F59E0B]">⚠️ 어려웠던 점: </span>
                  <span className="text-[#94A3B8]">{diary.difficulties}</span>
                </div>
                <div>
                  <span className="font-bold text-[#0EA5E9]">🎯 내일 목표: </span>
                  <span className="text-[#94A3B8]">{diary.tomorrowGoal}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Diary Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="오늘의 공부 일기 작성"
        subtitle="하루의 학업 성과와 피드백을 기록하세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveDiary}>
              일기 저장
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="오늘 공부 핵심 요약"
            placeholder="예) 수학II 미분법 파트 기출 15문항 풀이"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <Textarea
            label="느낀 점"
            placeholder="오늘의 성과나 몰입도에 대한 생각"
            value={feelings}
            onChange={(e) => setFeelings(e.target.value)}
          />
          <Textarea
            label="어려웠던 점 & 보완할 점"
            placeholder="실수나 취약했던 파트 분석"
            value={difficulties}
            onChange={(e) => setDifficulties(e.target.value)}
          />
          <Input
            label="내일 학습 목표"
            placeholder="예) 물리학I 특수상대성이론 10제 풀이"
            value={tomorrowGoal}
            onChange={(e) => setTomorrowGoal(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

StudyDiarySection.displayName = 'StudyDiarySection';
