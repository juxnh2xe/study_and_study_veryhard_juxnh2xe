import { FocusSession } from '@/types';

export const MOCK_USER = {
  name: '학생',
  grade: '3학년',
  targetUniversity: '목표 대학 설정 필요',
  dDay: {
    title: 'D-Day 목표',
    targetDate: '2026-11-19',
    daysRemaining: 0,
  },
};

export const MOCK_DASHBOARD_STATS = {
  todayStudyMinutes: 0,
  todayTargetMinutes: 360,
  weeklyTotalMinutes: 0,
  streakDays: 0,
  bestStreakDays: 0,
};

export const MOCK_ROUTINES: any[] = [];

export const MOCK_RECENT_SESSIONS: FocusSession[] = [];

export const MOCK_SUBJECT_DISTRIBUTION: any[] = [];

export const MOCK_TEXTBOOK_PROGRESS: any[] = [];

export const MOCK_RETRIEVAL_NOTES: any[] = [];

export const MOCK_WRONG_NOTES: any[] = [];
