// Safe LocalStorage Utility Engine with Backup/Restore & Exception Recovery (v1.1)

export const STORAGE_KEYS = {
  PROFILE: 'daybreak_study_profile',
  ROUTINES: 'daybreak_study_routines',
  SESSIONS: 'daybreak_study_sessions',
  TEXTBOOKS: 'daybreak_study_textbooks',
  RETRIEVAL_NOTES: 'daybreak_study_retrieval_notes',
  WRONG_NOTES: 'daybreak_study_wrong_notes',
  ACTIVE_TIMER: 'daybreak_study_active_timer',
  GOALS: 'daybreak_study_goals',
  EXAMS: 'daybreak_study_exams',
  DIARIES: 'daybreak_study_diaries',
  ACHIEVEMENTS: 'daybreak_study_achievements',
  VERSION: 'daybreak_study_version',
} as const;

export const CURRENT_STORAGE_VERSION = '1.1.0';

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    const parsed = JSON.parse(item) as T;
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    console.warn(`[LocalStorage] Failed to parse key "${key}". Returning fallback.`, error);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[LocalStorage] Failed to write key "${key}".`, error);
    return false;
  }
}

export function removeItem(key: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[LocalStorage] Failed to remove key "${key}".`, error);
    return false;
  }
}

/**
 * Export all Daybreak Study LocalStorage data to a JSON object
 */
export function exportAllDataToJSON(): string {
  if (!isBrowser()) return '{}';
  const backup: Record<string, unknown> = {
    version: CURRENT_STORAGE_VERSION,
    exportDate: new Date().toISOString(),
    data: {},
  };

  const dataObj: Record<string, unknown> = {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        dataObj[key] = JSON.parse(item);
      } catch {
        dataObj[key] = item;
      }
    }
  });

  backup.data = dataObj;
  return JSON.stringify(backup, null, 2);
}

/**
 * Import and validate JSON backup into LocalStorage
 */
export function importDataFromJSON(jsonString: string): boolean {
  if (!isBrowser()) return false;
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      throw new Error('Invalid backup file format');
    }

    const dataObj = parsed.data as Record<string, unknown>;
    Object.entries(dataObj).forEach(([key, val]) => {
      if (key.startsWith('daybreak_study_')) {
        window.localStorage.setItem(key, JSON.stringify(val));
      }
    });
    return true;
  } catch (error) {
    console.error('[LocalStorage] Failed to import backup JSON:', error);
    return false;
  }
}
