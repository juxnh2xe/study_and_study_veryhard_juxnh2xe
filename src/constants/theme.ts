export type ThemeId =
  | 'midnight_sky'
  | 'cloud_blue'
  | 'dawn_gradient'
  | 'forest_focus'
  | 'warm_paper'
  | 'pure_oled';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  background: string;
  foreground: string;
  mutedText: string;
  accent: string;
  accentGlow: string;
  cardBg: string;
  cardBorder: string;
  chartColors: string[];
}

export const THEME_PRESETS: Record<ThemeId, ThemeConfig> = {
  midnight_sky: {
    id: 'midnight_sky',
    name: 'Midnight Sky',
    description: '깊은 밤하늘 (기본 시그니처 테마)',
    icon: '🌌',
    background: 'bg-[#070A0F]',
    foreground: '#F8FAFC',
    mutedText: '#94A3B8',
    accent: '#0EA5E9',
    accentGlow: 'rgba(14, 165, 233, 0.25)',
    cardBg: '#0B0E17',
    cardBorder: '#1E293B',
    chartColors: ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'],
  },
  cloud_blue: {
    id: 'cloud_blue',
    name: 'Cloud Blue',
    description: '맑은 하늘과 구름 (장시간 학습용 청량 테마)',
    icon: '☁️',
    background: 'bg-[#0F172A]',
    foreground: '#F1F5F9',
    mutedText: '#94A3B8',
    accent: '#38BDF8',
    accentGlow: 'rgba(56, 189, 248, 0.25)',
    cardBg: '#1E293B',
    cardBorder: '#334155',
    chartColors: ['#38BDF8', '#2DD4BF', '#FBBF24', '#C084FC'],
  },
  dawn_gradient: {
    id: 'dawn_gradient',
    name: 'Dawn Gradient',
    description: '새벽에서 아침으로 넘어가는 감성 하늘',
    icon: '🌅',
    background: 'bg-gradient-to-b from-[#090D16] via-[#111827] to-[#1E293B]',
    foreground: '#F8FAFC',
    mutedText: '#CBD5E1',
    accent: '#60A5FA',
    accentGlow: 'rgba(96, 165, 250, 0.25)',
    cardBg: 'rgba(17, 24, 39, 0.85)',
    cardBorder: '#374151',
    chartColors: ['#60A5FA', '#34D399', '#F472B6', '#A78BFA'],
  },
  forest_focus: {
    id: 'forest_focus',
    name: 'Forest Focus',
    description: '집중을 위한 차분한 딥 그린 정원',
    icon: '🌲',
    background: 'bg-[#05140E]',
    foreground: '#ECFDF5',
    mutedText: '#6EE7B7',
    accent: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.25)',
    cardBg: '#0A2118',
    cardBorder: '#133E2E',
    chartColors: ['#10B981', '#34D399', '#0EA5E9', '#F59E0B'],
  },
  warm_paper: {
    id: 'warm_paper',
    name: 'Warm Paper',
    description: '따뜻한 종이 노트와 원목 분위기',
    icon: '📜',
    background: 'bg-[#1C1917]',
    foreground: '#F5F5F4',
    mutedText: '#A8A29E',
    accent: '#F97316',
    accentGlow: 'rgba(249, 115, 22, 0.25)',
    cardBg: '#292524',
    cardBorder: '#44403C',
    chartColors: ['#F97316', '#F59E0B', '#84CC16', '#0EA5E9'],
  },
  pure_oled: {
    id: 'pure_oled',
    name: 'Pure OLED Black',
    description: '최소 전력 및 피로 감소 완전 검정',
    icon: '🖤',
    background: 'bg-[#000000]',
    foreground: '#FFFFFF',
    mutedText: '#888888',
    accent: '#00A3FF',
    accentGlow: 'rgba(0, 163, 255, 0.3)',
    cardBg: '#0A0A0A',
    cardBorder: '#222222',
    chartColors: ['#00A3FF', '#00E5FF', '#00FF66', '#FFD600'],
  },
};
