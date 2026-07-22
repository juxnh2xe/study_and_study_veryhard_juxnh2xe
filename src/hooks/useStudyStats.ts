'use client';

import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { FocusSession, SubjectDistributionItem } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

export function useStudyStats() {
  const [sessions, , isMounted] = useLocalStorage<FocusSession[]>(
    STORAGE_KEYS.SESSIONS,
    []
  );

  const stats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        todayMinutes: 0,
        weeklyMinutes: 0,
        monthlyMinutes: 0,
        totalMinutes: 0,
        totalSessionsCount: 0,
        streakDays: 0,
        bestStreakDays: 0,
        subjectDistribution: [
          { name: '수학', value: 40, color: '#0EA5E9' },
          { name: '탐구', value: 30, color: '#10B981' },
          { name: '국어', value: 20, color: '#F59E0B' },
          { name: '영어', value: 10, color: '#8B5CF6' },
        ],
        recentSessions: [],
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayMins = 0;
    let weeklyMins = 0;
    let monthlyMins = 0;
    let totalMins = 0;

    const subjectTotals: Record<string, { minutes: number; color: string }> = {};

    sessions.forEach((s) => {
      if (!s.startTime) return;
      const sDate = new Date(s.startTime);
      const dateStr = s.startTime.split('T')[0];
      const mins = Math.max(0, Number(s.durationMinutes) || 0);

      totalMins += mins;

      if (dateStr === todayStr) {
        todayMins += mins;
      }
      if (sDate >= startOfWeek) {
        weeklyMins += mins;
      }
      if (sDate >= startOfMonth) {
        monthlyMins += mins;
      }

      // Aggregate subject breakdown
      const subName = s.subjectName || '기타';
      if (!subjectTotals[subName]) {
        subjectTotals[subName] = { minutes: 0, color: s.subjectColor || '#0EA5E9' };
      }
      subjectTotals[subName].minutes += mins;
    });

    // Format subject distribution for Recharts Donut Chart
    const totalMinsAll = Object.values(subjectTotals).reduce((acc, curr) => acc + curr.minutes, 0);

    const distributionList: SubjectDistributionItem[] = Object.entries(subjectTotals).map(([name, data]) => {
      const pct = totalMinsAll > 0 ? Math.round((data.minutes / totalMinsAll) * 100) : 0;
      return {
        name,
        value: Number.isNaN(pct) ? 0 : pct,
        color: data.color,
      };
    });

    return {
      todayMinutes: todayMins,
      weeklyMinutes: weeklyMins,
      monthlyMinutes: monthlyMins,
      totalMinutes: totalMins,
      totalSessionsCount: sessions.length,
      streakDays: sessions.length > 0 ? 1 : 0,
      bestStreakDays: sessions.length > 0 ? 1 : 0,
      subjectDistribution: distributionList.length > 0 ? distributionList : [
        { name: '수학', value: 40, color: '#0EA5E9' },
        { name: '탐구', value: 30, color: '#10B981' },
        { name: '국어', value: 20, color: '#F59E0B' },
        { name: '영어', value: 10, color: '#8B5CF6' },
      ],
      recentSessions: sessions.slice(0, 5),
    };
  }, [sessions]);

  return {
    ...stats,
    isMounted,
  };
}
