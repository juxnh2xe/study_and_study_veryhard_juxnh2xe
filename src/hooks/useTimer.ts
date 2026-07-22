'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ActiveTimerState, FocusSession } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';
import { DEFAULT_SUBJECTS } from '@/constants/subjects';

const INITIAL_TIMER_STATE: ActiveTimerState = {
  isRunning: false,
  isPaused: false,
  subjectId: 'math',
  textbook: '수능특강 수학II',
  range: '45p ~ 60p 미분법 파트',
  studyType: '기출 문제 풀이',
  targetMinutes: 60,
  isPomodoro: true,
  whiteNoiseSound: 'rain',
  startTimestamp: null,
  pausedAccumulatedMs: 0,
  pauseStartTimestamp: null,
};

export function useTimer() {
  const [timerState, setTimerState, isMounted] = useLocalStorage<ActiveTimerState>(
    STORAGE_KEYS.ACTIVE_TIMER,
    INITIAL_TIMER_STATE
  );

  const [sessions, setSessions] = useLocalStorage<FocusSession[]>(
    STORAGE_KEYS.SESSIONS,
    []
  );

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Recalculate exact elapsed time using Date.now()
  const calculateElapsed = useCallback((state: ActiveTimerState): number => {
    if (!state.isRunning || !state.startTimestamp) return 0;

    let totalMs = 0;
    if (state.isPaused && state.pauseStartTimestamp) {
      totalMs = state.pauseStartTimestamp - state.startTimestamp - (state.pausedAccumulatedMs || 0);
    } else {
      totalMs = Date.now() - state.startTimestamp - (state.pausedAccumulatedMs || 0);
    }

    return Math.max(0, Math.floor(totalMs / 1000));
  }, []);

  // Update timer ticks every second based on Date.now()
  useEffect(() => {
    if (!isMounted) return;

    const updateTick = () => {
      if (timerState && timerState.isRunning) {
        const secs = calculateElapsed(timerState);
        setElapsedSeconds(secs);
      } else {
        setElapsedSeconds(0);
      }
    };

    updateTick();

    if (timerState && timerState.isRunning && !timerState.isPaused) {
      intervalRef.current = setInterval(updateTick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isMounted, timerState, calculateElapsed]);

  // Start Focus Session
  const startTimer = useCallback(
    (config: Partial<ActiveTimerState>) => {
      const now = Date.now();
      setTimerState((prev) => ({
        ...prev,
        ...config,
        isRunning: true,
        isPaused: false,
        startTimestamp: now,
        pausedAccumulatedMs: 0,
        pauseStartTimestamp: null,
      }));
    },
    [setTimerState]
  );

  // Pause Focus Session
  const pauseTimer = useCallback(() => {
    const now = Date.now();
    setTimerState((prev) => {
      if (!prev.isRunning || prev.isPaused) return prev;
      return {
        ...prev,
        isPaused: true,
        pauseStartTimestamp: now,
      };
    });
  }, [setTimerState]);

  // Resume Focus Session
  const resumeTimer = useCallback(() => {
    const now = Date.now();
    setTimerState((prev) => {
      if (!prev.isRunning || !prev.isPaused || !prev.pauseStartTimestamp) return prev;
      const additionalPausedMs = Math.max(0, now - prev.pauseStartTimestamp);
      return {
        ...prev,
        isPaused: false,
        pausedAccumulatedMs: (prev.pausedAccumulatedMs || 0) + additionalPausedMs,
        pauseStartTimestamp: null,
      };
    });
  }, [setTimerState]);

  // Stop Focus Session & Save to History
  const stopTimer = useCallback(
    (rating: 1 | 2 | 3 | 4 | 5 = 5, memo: string = ''): FocusSession | null => {
      if (!timerState || !timerState.isRunning || !timerState.startTimestamp) {
        setTimerState(INITIAL_TIMER_STATE);
        return null;
      }

      const totalSecs = calculateElapsed(timerState);
      const durationMins = Math.max(1, Math.round(totalSecs / 60));
      const subject =
        DEFAULT_SUBJECTS.find((s) => s.id === timerState.subjectId) || DEFAULT_SUBJECTS[1];

      const newSession: FocusSession = {
        id: 's_' + Date.now().toString(36),
        subjectId: timerState.subjectId || 'math',
        subjectName: subject.name,
        subjectColor: subject.color,
        title: `${subject.name} - ${timerState.textbook || '기본 학습'}`,
        textbook: timerState.textbook || '',
        studyType: timerState.studyType || '개념 정리',
        mode: timerState.isPomodoro ? 'pomodoro' : 'target',
        startTime: new Date(timerState.startTimestamp).toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: durationMins,
        rating,
        memo: memo.trim(),
      };

      setSessions((prev) => [newSession, ...(prev || [])]);
      setTimerState(INITIAL_TIMER_STATE);
      setElapsedSeconds(0);
      return newSession;
    },
    [timerState, calculateElapsed, setSessions, setTimerState]
  );

  const targetSecs = (timerState?.targetMinutes || 60) * 60;
  const remainingSeconds = Math.max(0, targetSecs - elapsedSeconds);
  const progressPercentage = Math.min(100, Math.round((elapsedSeconds / targetSecs) * 100));

  const formatTime = (secs: number): string => {
    const safeSecs = Math.max(0, Math.floor(secs || 0));
    const m = Math.floor(safeSecs / 60);
    const s = safeSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return {
    timerState: timerState || INITIAL_TIMER_STATE,
    setTimerState,
    elapsedSeconds,
    remainingSeconds,
    progressPercentage,
    formattedTime: formatTime(remainingSeconds),
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    sessions: sessions || [],
    isMounted,
  };
}
