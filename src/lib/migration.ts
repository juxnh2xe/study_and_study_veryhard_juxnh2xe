import { supabase, isSupabaseConfigured } from './supabase';
import { getItem, setItem, STORAGE_KEYS } from './storage';
import { FocusSession, Routine, StudyGoal, Exam, StudyDiary, Textbook } from '@/types';

const MIGRATION_DONE_KEY = 'daybreak_study_migration_completed';

export async function migrateLocalStorageToSupabase(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const isAlreadyMigrated = getItem<boolean>(`${MIGRATION_DONE_KEY}_${userId}`, false);
  if (isAlreadyMigrated) return true;

  try {
    // 1. Migrate Routines
    const localRoutines = getItem<Routine[]>(STORAGE_KEYS.ROUTINES, []);
    if (localRoutines.length > 0) {
      const routinePayloads = localRoutines.map((r) => ({
        user_id: userId,
        title: r.title,
        subject: r.subject,
        category: r.category,
        target_time_minutes: r.targetTimeMinutes,
        is_completed: r.isCompleted,
        streak: r.streak,
        last_completed_date: r.lastCompletedDate || null,
      }));
      await supabase.from('routines').upsert(routinePayloads, { onConflict: 'user_id,title' });
    }

    // 2. Migrate Focus Sessions
    const localSessions = getItem<FocusSession[]>(STORAGE_KEYS.SESSIONS, []);
    if (localSessions.length > 0) {
      const sessionPayloads = localSessions.map((s) => ({
        user_id: userId,
        subject_id: s.subjectId,
        subject_name: s.subjectName,
        subject_color: s.subjectColor,
        title: s.title,
        textbook: s.textbook,
        study_type: s.studyType,
        mode: s.mode,
        start_time: s.startTime,
        end_time: s.endTime,
        duration_minutes: s.durationMinutes,
        rating: s.rating,
        memo: s.memo || '',
      }));
      await supabase.from('sessions').insert(sessionPayloads);
    }

    // 3. Migrate Goals
    const localGoals = getItem<StudyGoal[]>(STORAGE_KEYS.GOALS, []);
    if (localGoals.length > 0) {
      const goalPayloads = localGoals.map((g) => ({
        user_id: userId,
        title: g.title,
        scope: g.scope,
        target_minutes: g.targetMinutes,
        current_minutes: g.currentMinutes,
        is_completed: g.isCompleted,
      }));
      await supabase.from('goals').insert(goalPayloads);
    }

    // 4. Migrate Exams
    const localExams = getItem<Exam[]>(STORAGE_KEYS.EXAMS, []);
    if (localExams.length > 0) {
      const examPayloads = localExams.map((e) => ({
        user_id: userId,
        title: e.title,
        subject: e.subject,
        exam_date: e.examDate,
        importance: e.importance,
        is_archived: e.isArchived,
      }));
      await supabase.from('exams').insert(examPayloads);
    }

    // Mark migration complete for this user
    setItem(`${MIGRATION_DONE_KEY}_${userId}`, true);
    return true;
  } catch (error) {
    console.error('[Migration] Failed to migrate LocalStorage to Supabase:', error);
    return false;
  }
}
