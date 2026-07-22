import { Subject } from '@/types';

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'korean',
    name: '국어',
    category: 'korean',
    color: '#EF4444', // Red / Coral Accent
    icon: 'BookOpen',
    targetHoursPerWeek: 10,
  },
  {
    id: 'math',
    name: '수학',
    category: 'math',
    color: '#0EA5E9', // Sky Blue Accent
    icon: 'Calculator',
    targetHoursPerWeek: 15,
  },
  {
    id: 'english',
    name: '영어',
    category: 'english',
    color: '#F59E0B', // Amber Accent
    icon: 'Languages',
    targetHoursPerWeek: 10,
  },
  {
    id: 'science',
    name: '탐구 (과학)',
    category: 'science',
    color: '#10B981', // Emerald Green Accent
    icon: 'FlaskConical',
    targetHoursPerWeek: 12,
  },
  {
    id: 'social',
    name: '탐구 (사회)',
    category: 'social',
    color: '#8B5CF6', // Purple Accent
    icon: 'Compass',
    targetHoursPerWeek: 8,
  },
  {
    id: 'foreign',
    name: '제2외국어 / 한문',
    category: 'foreign',
    color: '#EC4899', // Pink Accent
    icon: 'Globe',
    targetHoursPerWeek: 4,
  },
];
