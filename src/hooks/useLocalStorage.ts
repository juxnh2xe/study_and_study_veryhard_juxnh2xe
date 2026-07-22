'use client';

import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, isBrowser } from '@/lib/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    if (isBrowser()) {
      const item = getItem<T>(key, initialValue);
      setStoredValue(item);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          setItem<T>(key, valueToStore);
          return valueToStore;
        });
      } catch (error) {
        console.error(`[useLocalStorage] Error setting key ${key}:`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue, isMounted];
}
