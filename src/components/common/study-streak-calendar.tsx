'use client';

import React from 'react';
import { Card } from '../ui/card';
import { Flame, Calendar as CalendarIcon } from 'lucide-react';
import { useStudyStats } from '@/hooks/useStudyStats';

export const StudyStreakCalendar: React.FC = () => {
  const { recentSessions, streakDays } = useStudyStats();

  // Generate last 30 days array
  const last30Days = React.useMemo(() => {
    const days: { dateStr: string; dayNum: number; hasStudied: boolean }[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();

      const hasStudied = (recentSessions || []).some((s) => {
        const sDate = new Date(s.startTime).toISOString().split('T')[0];
        return sDate === dateStr;
      });

      days.push({ dateStr, dayNum, hasStudied });
    }
    return days;
  }, [recentSessions]);

  const activeDaysCount = last30Days.filter((d) => d.hasStudied).length;

  return (
    <Card variant="flat" padding="md" className="space-y-3 bg-[#0B0E17] border-[#1E293B]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[#0EA5E9]" />
          <h3 className="text-xs font-bold text-[#F8FAFC] whitespace-nowrap">
            최근 30일 Study Streak 캘린더
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] whitespace-nowrap">
          <Flame className="h-4 w-4" />
          <span>{streakDays}일 연속 달성 중 ({activeDaysCount}/30일 출석)</span>
        </div>
      </div>

      {/* 30-Day Dot Matrix Grid */}
      <div className="grid grid-cols-10 gap-1.5 pt-1">
        {last30Days.map((day, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-1"
            title={`${day.dateStr}: ${day.hasStudied ? '공부 완료' : '미완료'}`}
          >
            <div
              className={`h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-bold transition-all ${
                day.hasStudied
                  ? 'bg-[#0EA5E9] text-white shadow-[0_0_8px_rgba(14,165,233,0.5)]'
                  : 'bg-[#131825] text-[#64748B] border border-[#1E293B]'
              }`}
            >
              {day.dayNum}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

StudyStreakCalendar.displayName = 'StudyStreakCalendar';
