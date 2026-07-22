'use client';

import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { Sparkles, Quote } from 'lucide-react';

export const MotivationBanner: React.FC = () => {
  const quotes = [
    '오늘도 고생 많았어요! 꾸준함이 비범함을 만듭니다 🌅',
    '어제보다 42분 더 몰입했네요! 이대로 수능까지 직진해볼까요? 🔥',
    '목표 대학을 향해 걸어가는 당신의 모든 시간이 빛나고 있습니다 🎓',
    '집중력이 가장 뛰어난 순간입니다. 지금의 페이스를 유지해보세요 ⚡',
    '작은 루틴의 성공이 모여 압도적인 합격을 만듭니다 🏆',
  ];

  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
  }, []);

  return (
    <Card
      variant="flat"
      padding="sm"
      className="border-[#0EA5E9]/40 bg-gradient-to-r from-[rgba(14,165,233,0.12)] via-[#0B0E17] to-transparent flex items-center gap-3"
    >
      <div className="p-2 rounded-full bg-[rgba(14,165,233,0.2)] text-[#0EA5E9] shrink-0">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="space-y-0.5">
        <span className="text-[10px] font-bold text-[#38BDF8] tracking-wide uppercase">
          DAYBREAK MOTIVATION
        </span>
        <p className="text-xs font-semibold text-[#F8FAFC] leading-relaxed">
          &quot;{randomQuote}&quot;
        </p>
      </div>
    </Card>
  );
};

MotivationBanner.displayName = 'MotivationBanner';
