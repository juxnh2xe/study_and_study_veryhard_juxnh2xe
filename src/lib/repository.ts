// Cloud Sync Ready Repository Layer Abstraction (v2.0 SaaS Architecture)
import { FocusSession, Routine, UserProfile } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from './storage';
import { MOCK_RECENT_SESSIONS, MOCK_USER } from '@/constants/mock-data';

export interface IStudyRepository {
  getSessions(): Promise<FocusSession[]>;
  saveSession(session: FocusSession): Promise<boolean>;
  getRoutines(): Promise<Routine[]>;
  saveRoutines(routines: Routine[]): Promise<boolean>;
  getUserProfile(): Promise<UserProfile>;
  saveUserProfile(profile: UserProfile): Promise<boolean>;
}

/**
 * LocalStorage Implementation of IStudyRepository
 */
export class LocalStorageStudyRepository implements IStudyRepository {
  async getSessions(): Promise<FocusSession[]> {
    return getItem<FocusSession[]>(STORAGE_KEYS.SESSIONS, MOCK_RECENT_SESSIONS);
  }

  async saveSession(session: FocusSession): Promise<boolean> {
    const existing = await this.getSessions();
    return setItem(STORAGE_KEYS.SESSIONS, [session, ...existing]);
  }

  async getRoutines(): Promise<Routine[]> {
    return getItem<Routine[]>(STORAGE_KEYS.ROUTINES, []);
  }

  async saveRoutines(routines: Routine[]): Promise<boolean> {
    return setItem(STORAGE_KEYS.ROUTINES, routines);
  }

  async getUserProfile(): Promise<UserProfile> {
    return getItem<UserProfile>(STORAGE_KEYS.PROFILE, {
      name: MOCK_USER.name,
      grade: '3',
      targetUniversity: MOCK_USER.targetUniversity,
      dDay: MOCK_USER.dDay,
      dailyTargetMinutes: 360,
      themePreference: 'dark_sky',
      dynamicThemeEnabled: true,
      notificationsEnabled: true,
      defaultPomodoroMinutes: 25,
      defaultBreakMinutes: 5,
      hasCompletedOnboarding: false,
    });
  }

  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    return setItem(STORAGE_KEYS.PROFILE, profile);
  }
}

// Import SupabaseRepository dynamically
import { SupabaseStudyRepository } from './repository-supabase';

// Global Repository Instance
export const studyRepository: IStudyRepository = new SupabaseStudyRepository();
