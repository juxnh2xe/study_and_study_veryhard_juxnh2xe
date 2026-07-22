'use client';

import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Routine } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

export function useRoutines() {
  // Start with an empty list [] so users can set their own custom routines from scratch!
  const [routines, setRoutines, isMounted] = useLocalStorage<Routine[]>(
    STORAGE_KEYS.ROUTINES,
    []
  );

  const getTodayDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check for Midnight Rollover (Auto reset completion status on new day)
  useEffect(() => {
    if (!isMounted || !routines || routines.length === 0) return;

    const todayStr = getTodayDateString();
    let needsUpdate = false;

    const updated = routines.map((routine) => {
      if (routine.lastCompletedDate && routine.lastCompletedDate !== todayStr && routine.isCompleted) {
        needsUpdate = true;
        return {
          ...routine,
          isCompleted: false,
        };
      }
      return routine;
    });

    if (needsUpdate) {
      setRoutines(updated);
    }
  }, [isMounted, routines, setRoutines]);

  const toggleRoutine = useCallback(
    (id: string) => {
      const todayStr = getTodayDateString();
      setRoutines((prev) =>
        (prev || []).map((routine) => {
          if (routine.id === id) {
            const nextCompleted = !routine.isCompleted;
            const nextStreak = nextCompleted ? routine.streak + 1 : Math.max(0, routine.streak - 1);
            return {
              ...routine,
              isCompleted: nextCompleted,
              streak: nextStreak,
              lastCompletedDate: nextCompleted ? todayStr : routine.lastCompletedDate,
            };
          }
          return routine;
        })
      );
    },
    [setRoutines]
  );

  const addRoutine = useCallback(
    (newRoutine: Omit<Routine, 'id' | 'isCompleted' | 'streak'>) => {
      const id = 'r_' + Date.now().toString(36);
      const created: Routine = {
        ...newRoutine,
        id,
        isCompleted: false,
        streak: 0,
      };
      setRoutines((prev) => [...(prev || []), created]);
    },
    [setRoutines]
  );

  const deleteRoutine = useCallback(
    (id: string) => {
      setRoutines((prev) => (prev || []).filter((r) => r.id !== id));
    },
    [setRoutines]
  );

  const completedCount = routines ? routines.filter((r) => r.isCompleted).length : 0;
  const totalCount = routines ? routines.length : 0;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    routines: routines || [],
    toggleRoutine,
    addRoutine,
    deleteRoutine,
    completedCount,
    totalCount,
    progressPercentage,
    isAllCompleted: totalCount > 0 && completedCount === totalCount,
    isMounted,
  };
}
