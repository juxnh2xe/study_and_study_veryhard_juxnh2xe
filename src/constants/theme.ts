// Early Morning Sky (새벽하늘) Design System Tokens

export const THEME_TOKENS = {
  colors: {
    bg: {
      deepBlack: '#070A0F',     // Main background
      surfaceDark: '#0B0E17',   // Lighter surface container
      cardBg: '#111625',        // Card background
      cardHover: '#171E30',     // Card hover state
      modalBg: '#131825',       // Modal elevated surface
      glassBg: 'rgba(11, 14, 23, 0.85)',
    },
    text: {
      primary: '#F8FAFC',       // White Cloud
      secondary: '#94A3B8',     // Mist Gray
      caption: '#64748B',       // Dawn Dusk subtle
      disabled: '#475569',
    },
    accent: {
      skyBluePrimary: '#0EA5E9', // Sky Blue 500
      skyBlueHover: '#0284C7',   // Sky Blue 600
      skyBlueGlow: '#38BDF8',    // Sky Blue 400
      skyBlueSubtle: 'rgba(14, 165, 233, 0.12)',
      gradientSky: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
      gradientCardSky: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(11, 14, 23, 0) 100%)',
    },
    status: {
      success: '#10B981',        // Emerald Green
      successBg: 'rgba(16, 185, 129, 0.12)',
      warning: '#F59E0B',        // Orange / Amber
      warningBg: 'rgba(245, 158, 11, 0.12)',
      danger: '#EF4444',         // Red
      dangerBg: 'rgba(239, 68, 68, 0.12)',
    },
    border: {
      subtle: '#1E293B',         // Subtle Gray border
      hover: '#334155',          // Hover border
      accent: 'rgba(14, 165, 233, 0.4)',
    },
  },
  radius: {
    button: '0.75rem',    // 12px
    card: '1rem',         // 16px
    modal: '1.25rem',     // 20px
    input: '0.75rem',     // 12px
    progress: '9999px',   // Pill
    chip: '9999px',       // Pill
    bottomNav: '1.5rem',  // 24px
  },
  shadows: {
    softCard: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(30, 41, 59, 0.6)',
    softElevated: '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(30, 41, 59, 0.8)',
    skyGlow: '0 0 20px -2px rgba(14, 165, 233, 0.25)',
  },
  typography: {
    title: 'text-2xl font-bold tracking-tight text-[#F8FAFC]',
    subtitle: 'text-lg font-semibold tracking-tight text-[#F8FAFC]',
    body: 'text-sm font-normal text-[#94A3B8] leading-relaxed',
    caption: 'text-xs font-medium text-[#64748B]',
    button: 'text-sm font-semibold tracking-wide',
    statistic: 'text-3xl font-extrabold tracking-tight text-[#F8FAFC]',
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  motion: {
    durationFast: 0.15,
    durationNormal: 0.25,
    easeDefault: [0.16, 1, 0.3, 1], // Linear / Apple smooth ease
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 12 },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.96 },
    },
  },
} as const;
