import { IStudyRepository, LocalStorageStudyRepository } from './repository';
import { supabase, isSupabaseConfigured } from './supabase';
import { FocusSession, Routine, UserProfile } from '@/types';

export class SupabaseStudyRepository implements IStudyRepository {
  private fallback = new LocalStorageStudyRepository();

  async getSessions(): Promise<FocusSession[]> {
    if (!isSupabaseConfigured()) return this.fallback.getSessions();

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return this.fallback.getSessions();

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('start_time', { ascending: false });

      if (error || !data) return this.fallback.getSessions();

      return data.map((d) => ({
        id: d.id,
        subjectId: d.subject_id,
        subjectName: d.subject_name,
        subjectColor: d.subject_color,
        title: d.title,
        textbook: d.textbook,
        studyType: d.study_type,
        mode: d.mode,
        startTime: d.start_time,
        endTime: d.end_time,
        durationMinutes: d.duration_minutes,
        rating: d.rating,
        memo: d.memo,
      }));
    } catch (error) {
      console.warn('[SupabaseRepository] Falling back to LocalStorage:', error);
      return this.fallback.getSessions();
    }
  }

  async saveSession(session: FocusSession): Promise<boolean> {
    const localResult = await this.fallback.saveSession(session);
    if (!isSupabaseConfigured()) return localResult;

    try {
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession.session?.user) return localResult;

      const { error } = await supabase.from('sessions').insert({
        user_id: authSession.session.user.id,
        subject_id: session.subjectId,
        subject_name: session.subjectName,
        subject_color: session.subjectColor,
        title: session.title,
        textbook: session.textbook,
        study_type: session.studyType,
        mode: session.mode,
        start_time: session.startTime,
        end_time: session.endTime,
        duration_minutes: session.durationMinutes,
        rating: session.rating,
        memo: session.memo || '',
      });

      return !error;
    } catch (error) {
      console.error('[SupabaseRepository] Error saving session to Supabase:', error);
      return localResult;
    }
  }

  async getRoutines(): Promise<Routine[]> {
    if (!isSupabaseConfigured()) return this.fallback.getRoutines();

    try {
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession.session?.user) return this.fallback.getRoutines();

      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', authSession.session.user.id);

      if (error || !data) return [];

      return data.map((d) => ({
        id: d.id,
        title: d.title,
        subject: d.subject,
        category: d.category,
        targetTimeMinutes: d.target_time_minutes,
        isCompleted: d.is_completed,
        streak: d.streak,
        lastCompletedDate: d.last_completed_date,
      }));
    } catch {
      return [];
    }
  }

  async saveRoutines(routines: Routine[]): Promise<boolean> {
    const localResult = await this.fallback.saveRoutines(routines);
    if (!isSupabaseConfigured()) return localResult;

    try {
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession.session?.user) return localResult;

      const payloads = routines.map((r) => ({
        user_id: authSession.session.user.id,
        title: r.title,
        subject: r.subject,
        category: r.category,
        target_time_minutes: r.targetTimeMinutes,
        is_completed: r.isCompleted,
        streak: r.streak,
        last_completed_date: r.lastCompletedDate || null,
      }));

      const { error } = await supabase.from('routines').upsert(payloads);
      return !error;
    } catch {
      return localResult;
    }
  }

  async getUserProfile(): Promise<UserProfile> {
    if (!isSupabaseConfigured()) return this.fallback.getUserProfile();

    try {
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession.session?.user) return this.fallback.getUserProfile();

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authSession.session.user.id)
        .single();

      if (error || !data) return this.fallback.getUserProfile();

      return {
        name: data.name || '학생',
        grade: data.grade || '3',
        targetUniversity: data.target_university || '목표 대학 설정 필요',
        dDay: {
          title: data.d_day_title || '2027 수능',
          targetDate: data.d_day_date || '2026-11-19',
        },
        dailyTargetMinutes: data.daily_target_minutes || 360,
        themePreference: 'dark_sky',
        dynamicThemeEnabled: true,
        notificationsEnabled: true,
        defaultPomodoroMinutes: 25,
        defaultBreakMinutes: 5,
        hasCompletedOnboarding: data.has_completed_onboarding || false,
      };
    } catch {
      return this.fallback.getUserProfile();
    }
  }

  async saveUserProfile(profile: UserProfile): Promise<boolean> {
    const localResult = await this.fallback.saveUserProfile(profile);
    if (!isSupabaseConfigured()) return localResult;

    try {
      const { data: authSession } = await supabase.auth.getSession();
      if (!authSession.session?.user) return localResult;

      const { error } = await supabase.from('profiles').upsert({
        id: authSession.session.user.id,
        name: profile.name,
        grade: profile.grade,
        target_university: profile.targetUniversity,
        d_day_title: profile.dDay.title,
        d_day_date: profile.dDay.targetDate,
        daily_target_minutes: profile.dailyTargetMinutes,
        has_completed_onboarding: profile.hasCompletedOnboarding,
        updated_at: new Date().toISOString(),
      });

      return !error;
    } catch {
      return localResult;
    }
  }
}
