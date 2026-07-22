'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Textbook } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

export function useTextbooks() {
  const [textbooks, setTextbooks, isMounted] = useLocalStorage<Textbook[]>(
    STORAGE_KEYS.TEXTBOOKS,
    []
  );

  const updateProgress = useCallback(
    (id: string, completedPages: number) => {
      setTextbooks((prev) =>
        (prev || []).map((tb) => {
          if (tb.id === id) {
            const nextCompleted = Math.min(tb.totalPages, Math.max(0, completedPages));
            return {
              ...tb,
              completedPages: nextCompleted,
            };
          }
          return tb;
        })
      );
    },
    [setTextbooks]
  );

  const addTextbook = useCallback(
    (name: string, subject: string, totalPages: number) => {
      const id = 'tb_' + Date.now().toString(36);
      const newTb: Textbook = {
        id,
        name,
        subject,
        totalPages,
        completedPages: 0,
      };
      setTextbooks((prev) => [...(prev || []), newTb]);
    },
    [setTextbooks]
  );

  return {
    textbooks: textbooks || [],
    updateProgress,
    addTextbook,
    isMounted,
  };
}
