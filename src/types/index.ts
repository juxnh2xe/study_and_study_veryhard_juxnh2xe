// TypeScript Strict Data Definitions for Daybreak Focus (v2.0 Premium Release)

export type PriorityLevel = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type SubjectCategory = 'math' | 'korean' | 'english' | 'science' | 'social' | 'foreign' | 'other';
export type DynamicSkyPhase = 'dawn' | 'morning' | 'day' | 'sunset' | 'night';
export type UserRole = 'student' | 'parent';

export interface ParentStudentLink {
  id: string;
  parentId: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  targetUniversity: string;
  connectionCode: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  color: string; // Hex or HSL token
  icon: string;  // Lucide icon identifier
  targetHoursPerWeek: number;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO String YYYY-MM-DD
  estimatedMinutes: number;
  completedMinutes: number;
  priority: PriorityLevel;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Routine {
  id: string;
  title: string;
  subject: string;
  category: SubjectCategory;
  targetTimeMinutes: number;
  isCompleted: boolean;
  streak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  linkedTextbookId?: string;
}

export type GoalScope = 'today' | 'week' | 'month' | 'year';

export interface StudyGoal {
  id: string;
  title: string;
  scope: GoalScope;
  targetMinutes: number;
  currentMinutes: number;
  isCompleted: boolean;
  dueDate?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  examDate: string; // YYYY-MM-DD
  importance: PriorityLevel;
  isArchived: boolean;
}

export interface StudyDiary {
  id: string;
  date: string; // YYYY-MM-DD
  todayStudySummary: string;
  feelings: string;
  difficulties: string;
  tomorrowGoal: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'time' | 'focus' | 'textbook' | 'routine';
}

export type FocusMode = 'pomodoro' | 'stopwatch' | 'target';

export interface ActiveTimerState {
  isRunning: boolean;
  isPaused: boolean;
  subjectId: string;
  textbook: string;
  range: string;
  studyType: string;
  targetMinutes: number;
  isPomodoro: boolean;
  whiteNoiseSound: 'none' | 'rain' | 'cafe' | 'forest' | 'ocean';
  startTimestamp: number | null; // Date.now() when started
  pausedAccumulatedMs: number;  // Total paused time in ms
  pauseStartTimestamp: number | null; // Date.now() when paused
}

export interface FocusSession {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  textbook: string;
  studyType: string;
  mode: FocusMode;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  durationMinutes: number;
  rating: 1 | 2 | 3 | 4 | 5; // Focus quality self-assessment
  sessionRating?: 'great' | 'good' | 'hard';
  memo?: string;
}

export interface DailyGoal {
  date: string; // ISO String YYYY-MM-DD
  targetMinutes: number;
  achievedMinutes: number;
}

export interface UserProfile {
  name: string;
  role?: UserRole;
  grade: '1' | '2' | '3' | 'other'; // High school 1st, 2nd, 3rd year
  targetUniversity: string;
  connectionCode?: string; // Student protection link code e.g. "DAYBREAK-A82K91"
  allowParentMonitoring?: boolean;
  dDay: {
    title: string; // e.g. "2027 수능"
    targetDate: string; // YYYY-MM-DD
  };
  dailyTargetMinutes: number;
  themePreference: 'dark_sky' | 'midnight';
  dynamicThemeEnabled: boolean;
  notificationsEnabled: boolean;
  defaultPomodoroMinutes: number;
  defaultBreakMinutes: number;
  hasCompletedOnboarding: boolean;
}

export interface Textbook {
  id: string;
  name: string;
  subject: string;
  color?: string;
  totalPages: number;
  completedPages: number;
  expectedCompletionDate?: string;
  lastStudiedDate?: string;
  cumulativeHours?: number;
}

export interface RetrievalNote {
  id: string;
  subject: string;
  topic: string;
  weaknessPoint: string;
  date: string;
}

export interface WrongAnswerNote {
  id: string;
  subject: string;
  questionTitle: string;
  reason: string;
  reviewCount: number;
  reviewDate?: string; // YYYY-MM-DD spaced repetition date
}

export interface SubjectDistributionItem {
  name: string;
  value: number; // Percentage or minutes
  color: string;
}

export interface StudyAnalyticsSummary {
  todayStudyMinutes: number;
  weeklyTotalMinutes: number;
  monthlyTotalMinutes: number;
  currentStreakDays: number;
  bestStreakDays: number;
  subjectDistribution: SubjectDistributionItem[];
}

export interface FocusGardenState {
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  cumulativeHours: number;
  nextLevelHours: number;
  progressPercentage: number;
}

export interface WeeklyReportData {
  weekRange: string;
  totalHours: number;
  targetAchievementRate: number;
  topSubject: string;
  averageRating: number;
  routineSuccessRate: number;
}

export interface MonthlyReportData {
  monthName: string;
  totalHours: number;
  completedTextbooksCount: number;
  activeDaysCount: number;
}
