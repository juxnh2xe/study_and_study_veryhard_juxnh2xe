import { Subject, FocusSession } from '@/types';

export const MOCK_USER = {
  name: '김지훈',
  grade: '3학년',
  targetUniversity: '서울대학교 의예과 / 연세대학교 의예과',
  dDay: {
    title: '2027 수능',
    targetDate: '2026-11-19',
    daysRemaining: 115,
  },
};

export const MOCK_DASHBOARD_STATS = {
  todayStudyMinutes: 285, // 4시간 45분
  todayTargetMinutes: 360, // 6시간
  weeklyTotalMinutes: 1840, // 30시간 40분
  streakDays: 14,
  bestStreakDays: 21,
};

export const MOCK_ROUTINES = [
  {
    id: 'r1',
    title: '수학 1일 10제 문제 풀이',
    subject: '수학',
    category: 'math' as const,
    targetTimeMinutes: 60,
    isCompleted: true,
    streak: 12,
  },
  {
    id: 'r2',
    title: '국어 수능특강 독서 지문 3개 분석',
    subject: '국어',
    category: 'korean' as const,
    targetTimeMinutes: 45,
    isCompleted: true,
    streak: 8,
  },
  {
    id: 'r3',
    title: '영어 매일 단어 50개 암기 & 테스트',
    subject: '영어',
    category: 'english' as const,
    targetTimeMinutes: 30,
    isCompleted: false,
    streak: 5,
  },
  {
    id: 'r4',
    title: '과학탐구 (물리학I) 역학 파트 개념 복습',
    subject: '탐구 (과학)',
    category: 'science' as const,
    targetTimeMinutes: 90,
    isCompleted: false,
    streak: 14,
  },
];

export const MOCK_RECENT_SESSIONS: FocusSession[] = [
  {
    id: 's1',
    subjectId: 'math',
    subjectName: '수학',
    subjectColor: '#0EA5E9',
    title: '수학II 미분법 기출 15문항 풀이',
    textbook: '수능특강 수학II',
    studyType: '기출 문제 풀이',
    mode: 'target',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date().toISOString(),
    durationMinutes: 75,
    rating: 5,
  },
  {
    id: 's2',
    subjectId: 'korean',
    subjectName: '국어',
    subjectColor: '#EF4444',
    title: '언어와 매체 문법 실전 모의고사',
    textbook: '마더텅 국어',
    studyType: '실전 모의고사',
    mode: 'pomodoro',
    startTime: new Date(Date.now() - 10800000).toISOString(),
    endTime: new Date(Date.now() - 7800000).toISOString(),
    durationMinutes: 50,
    rating: 4,
  },
  {
    id: 's3',
    subjectId: 'science',
    subjectName: '탐구 (과학)',
    subjectColor: '#10B981',
    title: '물리학I 특수상대성이론 심화문제',
    textbook: '자이스토리 물리학I',
    studyType: '기출 문제 풀이',
    mode: 'target',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 82800000).toISOString(),
    durationMinutes: 60,
    rating: 5,
  },
];

export const MOCK_SUBJECT_DISTRIBUTION = [
  { name: '수학', value: 40, color: '#0EA5E9' },
  { name: '탐구(과학)', value: 25, color: '#10B981' },
  { name: '국어', value: 20, color: '#EF4444' },
  { name: '영어', value: 15, color: '#F59E0B' },
];

export const MOCK_TEXTBOOK_PROGRESS = [
  { id: 'tb1', name: '수능특강 수학II', progress: 82, totalPages: 180, completedPages: 148 },
  { id: 'tb2', name: '자이스토리 물리학I', progress: 65, totalPages: 240, completedPages: 156 },
  { id: 'tb3', name: '마더텅 국어 독서', progress: 90, totalPages: 200, completedPages: 180 },
];

export const MOCK_RETRIEVAL_NOTES = [
  {
    id: 'rn1',
    subject: '수학II',
    topic: '사잇값 정리 & 평균값 정리 조건 구분',
    weaknessPoint: '함수의 연속성 조건 누락 가능성 높음',
    date: '2026-07-22',
  },
  {
    id: 'rn2',
    subject: '물리학I',
    topic: '열역학 제1법칙 등압 과정 기체 한 일 계산',
    weaknessPoint: 'P-V 그래프 면적 환산 단위 실수 주의',
    date: '2026-07-21',
  },
];

export const MOCK_WRONG_NOTES = [
  {
    id: 'wn1',
    subject: '수학II',
    questionTitle: '2025학년도 6월 모의평가 22번 (삼차함수 비율관계)',
    reason: '극댓값 조건 오인으로 인한 계산 오류',
    reviewCount: 3,
  },
  {
    id: 'wn2',
    subject: '국어',
    questionTitle: '수능특강 독서 14강 (법률 비문학 지문 38번)',
    reason: '선지 4번과 5번 미세 단어 조건 판단 미흡',
    reviewCount: 2,
  },
];
