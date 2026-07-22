'use client';

import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { SectionTitle } from './section-title';
import { Flame } from 'lucide-react';
import { FocusSession } from '@/types';

export interface StudyHeatmapProps {
  sessions: FocusSession[];
  className?: string;
}

export const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ sessions, className }) => {
  // Generate 52 weeks (364 days) leading up to today
  const heatmapData = useMemo(() => {
    const today = new Date();
    const daysMap: Record<string, number> = {};

    sessions.forEach((s) => {
      if (!s.startTime) return;
      const dateStr = s.startTime.split('T')[0];
      const mins = Number(s.durationMinutes) || 0;
      daysMap[dateStr] = (daysMap[dateStr] || 0) + mins;
    });

    const days = [];
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const minutes = daysMap[dateStr] || (i % 7 === 0 ? 120 : i % 3 === 0 ? 60 : 0); // Demo fallback
      days.push({
        date: dateStr,
        minutes,
      });
    }

    return days;
  }, [sessions]);

  const getColorClass = (minutes: number) => {
    if (minutes === 0) return 'bg-[#131825] border-[#1E293B]/40';
    if (minutes <= 60) return 'bg-[rgba(14,165,233,0.3)] border-[rgba(14,165,233,0.5)]';
    if (minutes <= 120) return 'bg-[rgba(14,165,233,0.6)] border-[#0EA5E9]';
    return 'bg-[#0EA5E9] shadow-[0_0_8px_rgba(14,165,233,0.8)] border-[#38BDF8]';
  };

  return (
    <Card variant="flat" padding="md" className={className}>
      <SectionTitle
        title="365일 몰입 릴레이 잔디 (Heatmap)"
        subtitle="하루하루 쌓여가는 빛나는 새벽 학업 기록"
        action={
          <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold">
            <Flame className="h-4 w-4" />
            <span>14일 연속 스트릭</span>
          </div>
        }
      />

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[650px] grid grid-rows-7 grid-flow-col gap-1.5 pt-2">
          {heatmapData.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.minutes}분 몰입`}
              className={`w-3 h-3 rounded-[2px] border transition-colors hover:scale-125 hover:z-10 cursor-pointer ${getColorClass(
                day.minutes
              )}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-[10px] text-[#94A3B8] mt-2">
        <span>Less</span>
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#131825] border border-[#1E293B]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[rgba(14,165,233,0.3)]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[rgba(14,165,233,0.6)]" />
        <div className="w-2.5 h-2.5 rounded-[2px] bg-[#0EA5E9]" />
        <span>More</span>
      </div>
    </Card>
  );
};

StudyHeatmap.displayName = 'StudyHeatmap';
