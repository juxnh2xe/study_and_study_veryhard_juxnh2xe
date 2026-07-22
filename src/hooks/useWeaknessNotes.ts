'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { RetrievalNote, WrongAnswerNote } from '@/types';
import { STORAGE_KEYS } from '@/lib/storage';

export function useWeaknessNotes() {
  const [retrievalNotes, setRetrievalNotes, isRetrievalMounted] = useLocalStorage<RetrievalNote[]>(
    STORAGE_KEYS.RETRIEVAL_NOTES,
    []
  );

  const [wrongNotes, setWrongNotes, isWrongMounted] = useLocalStorage<WrongAnswerNote[]>(
    STORAGE_KEYS.WRONG_NOTES,
    []
  );

  const addRetrievalNote = useCallback(
    (subject: string, topic: string, weaknessPoint: string) => {
      const id = 'rn_' + Date.now().toString(36);
      const note: RetrievalNote = {
        id,
        subject,
        topic,
        weaknessPoint,
        date: new Date().toISOString().split('T')[0],
      };
      setRetrievalNotes((prev) => [note, ...(prev || [])]);
    },
    [setRetrievalNotes]
  );

  const addWrongNote = useCallback(
    (subject: string, questionTitle: string, reason: string) => {
      const id = 'wn_' + Date.now().toString(36);
      const note: WrongAnswerNote = {
        id,
        subject,
        questionTitle,
        reason,
        reviewCount: 1,
      };
      setWrongNotes((prev) => [note, ...(prev || [])]);
    },
    [setWrongNotes]
  );

  const incrementReviewCount = useCallback(
    (id: string) => {
      setWrongNotes((prev) =>
        (prev || []).map((wn) => (wn.id === id ? { ...wn, reviewCount: wn.reviewCount + 1 } : wn))
      );
    },
    [setWrongNotes]
  );

  return {
    retrievalNotes: retrievalNotes || [],
    wrongNotes: wrongNotes || [],
    addRetrievalNote,
    addWrongNote,
    incrementReviewCount,
    isMounted: isRetrievalMounted && isWrongMounted,
  };
}
