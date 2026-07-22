'use client';

import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Modal } from '../ui/modal';
import { SectionTitle } from './section-title';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { FocusSession, Exam } from '@/types';

export const StudyCalendar: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [sessions] = useLocalStorage<FocusSession[]>(STORAGE_KEYS.SESSIONS, []);
  const [exams] = useLocalStorage<Exam[]>(STORAGE_KEYS.EXAMS, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Helper to get formatted YYYY-MM-DD string for a day in current month
  const getDayString = (day: number): string => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const selectedDateStr = selectedDay ? getDayString(selectedDay) : '';
  const daySessions = selectedDateStr
    ? (sessions || []).filter((s) => s.startTime && s.startTime.startsWith(selectedDateStr))
    : [];

  const dayTotalMins = daySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const dayHours = Math.floor(dayTotalMins / 60);
  const dayMins = dayTotalMins % 60;

  return (
    <Card variant="flat" padding="md" className="space-y-4">
      <SectionTitle
        title="학습 캘린더 (Study Calendar)"
        subtitle="월간 몰입 기록 및 시험 D-Day 일정"
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-[#131825] text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-[#F8FAFC] px-1">
              {year}년 {monthNames[month]}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-[#131825] text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#64748B] mb-1">
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 rounded-lg bg-transparent" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = getDayString(day);

          const hasSession = (sessions || []).some((s) => s.startTime && s.startTime.startsWith(dateStr));
          const hasExam = (exams || []).some((e) => e.examDate === dateStr);
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <button
              key={`day-${day}`}
              onClick={() => setSelectedDay(day)}
              className={`h-11 rounded-lg p-1 flex flex-col items-center justify-between border transition-all cursor-pointer ${
                isToday
                  ? 'border-[#0EA5E9] bg-[rgba(14,165,233,0.15)] text-[#38BDF8]'
                  : hasSession
                  ? 'border-[#1E293B] bg-[#0B0E17] text-[#F8FAFC] hover:border-[#334155]'
                  : 'border-transparent text-[#64748B] hover:bg-[#131825]'
              }`}
            >
              <span className="text-xs font-bold">{day}</span>
              <div className="flex items-center gap-0.5">
                {hasSession && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                )}
                {hasExam && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day Detail Modal */}
      <Modal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        title={`${year}년 ${month + 1}월 ${selectedDay}일 학습 리포트`}
        subtitle="상세 몰입 기록"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#131825] border border-[#1E293B]">
            <span className="text-xs font-semibold text-[#94A3B8]">총 공부 시간</span>
            <span className="text-base font-extrabold text-[#38BDF8]">
              {dayHours > 0 ? `${dayHours}시간 ${dayMins}분` : `${dayMins}분 몰입`}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F8FAFC]">완료한 세션 목록</h4>
            {daySessions.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#94A3B8] border border-dashed border-[#1E293B] rounded-lg">
                해당 일자의 몰입 기록이 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {daySessions.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-[#0B0E17] border border-[#1E293B] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#F8FAFC]">{s.title}</span>
                      <p className="text-[11px] text-[#94A3B8]">{s.durationMinutes}분 몰입 • {s.studyType}</p>
                    </div>
                    <Badge variant="sky" size="sm">
                      {s.subjectName}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );
};

StudyCalendar.displayName = 'StudyCalendar';
