'use client';

import { useMemo } from 'react';
import { DynamicSkyPhase } from '@/types';

export function useDynamicSkyTheme(enabled = true) {
  const currentPhase = useMemo<DynamicSkyPhase>(() => {
    if (!enabled) return 'night';

    const hour = new Date().getHours();
    if (hour >= 4 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'day';
    if (hour >= 18 && hour < 21) return 'sunset';
    return 'night';
  }, [enabled]);

  const phaseDetails = useMemo(() => {
    const map: Record<
      DynamicSkyPhase,
      { label: string; bgStyle: string; glowGradient: string }
    > = {
      dawn: {
        label: '새벽 하늘 (Dawn)',
        bgStyle: 'bg-[#070A0F]',
        glowGradient: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15), transparent 70%)',
      },
      morning: {
        label: '아침 하늘 (Morning)',
        bgStyle: 'bg-[#0A101D]',
        glowGradient: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.12), transparent 70%)',
      },
      day: {
        label: '낮 하늘 (Day)',
        bgStyle: 'bg-[#0B1222]',
        glowGradient: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.18), transparent 70%)',
      },
      sunset: {
        label: '노을 하늘 (Sunset)',
        bgStyle: 'bg-[#100F1C]',
        glowGradient: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.14), transparent 70%)',
      },
      night: {
        label: '밤 하늘 (Night)',
        bgStyle: 'bg-[#070A0F]',
        glowGradient: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.1), transparent 70%)',
      },
    };

    return map[currentPhase];
  }, [currentPhase]);

  return {
    currentPhase,
    ...phaseDetails,
  };
}
