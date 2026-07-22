'use client';

import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { SectionTitle } from './section-title';
import { Award, Flame, BookOpen, Star, ShieldCheck, Lock } from 'lucide-react';
import { useStudyStats } from '@/hooks/useStudyStats';

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  icon: React.ReactNode;
}

export const AchievementGallery: React.FC = () => {
  const { totalMinutes, streakDays, totalSessionsCount } = useStudyStats();
  const totalHours = Math.floor(totalMinutes / 60);

  const achievements: AchievementItem[] = [
    {
      id: 'a1',
      title: '첫 몰입의 시작',
      description: '첫 번째 Focus 세션을 성공적으로 완료함',
      isUnlocked: totalSessionsCount >= 1,
      icon: <Flame className="h-5 w-5 text-[#F59E0B]" />,
    },
    {
      id: 'a2',
      title: '7일 연속 몰입 스트릭',
      description: '7일 동안 매일 빠짐없이 공부 기록 달성',
      isUnlocked: streakDays >= 7,
      icon: <Award className="h-5 w-5 text-[#0EA5E9]" />,
    },
    {
      id: 'a3',
      title: '10시간 몰입 돌파',
      description: '누적 공부 시간 10시간 돌파',
      isUnlocked: totalHours >= 10,
      icon: <ShieldCheck className="h-5 w-5 text-[#10B981]" />,
    },
    {
      id: 'a4',
      title: '100시간 몰입 달성',
      description: '누적 공부 시간 100시간 돌파',
      isUnlocked: totalHours >= 100,
      icon: <BookOpen className="h-5 w-5 text-[#8B5CF6]" />,
    },
    {
      id: 'a5',
      title: '500시간 대기록',
      description: '누적 공부 시간 500시간 돌파',
      isUnlocked: totalHours >= 500,
      icon: <Star className="h-5 w-5 text-[#F59E0B]" />,
    },
    {
      id: 'a6',
      title: '1000시간 마스터피스',
      description: '누적 공부 시간 1000시간 돌파',
      isUnlocked: totalHours >= 1000,
      icon: <Award className="h-5 w-5 text-[#0EA5E9]" />,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <Card variant="flat" padding="md" className="space-y-4">
      <SectionTitle
        title="업적 &amp; 배지 (Achievements)"
        subtitle={`달성한 학업 훈장: ${unlockedCount} / ${achievements.length}개`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-[1rem] border transition-all ${
              item.isUnlocked
                ? 'border-[#0EA5E9]/40 bg-[rgba(14,165,233,0.08)]'
                : 'border-[#1E293B] bg-[#0B0E17]/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg ${
                  item.isUnlocked
                    ? 'bg-[#131825] border border-[#1E293B]'
                    : 'bg-[#0B0E17]'
                }`}
              >
                {item.isUnlocked ? item.icon : <Lock className="h-5 w-5 text-[#64748B]" />}
              </div>
              {item.isUnlocked ? (
                <Badge variant="sky" size="sm">
                  획득 완료
                </Badge>
              ) : (
                <Badge variant="neutral" size="sm">
                  잠김
                </Badge>
              )}
            </div>
            <h4 className="text-xs font-bold text-[#F8FAFC]">{item.title}</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-tight">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

AchievementGallery.displayName = 'AchievementGallery';
