'use client';

import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { SectionTitle } from './section-title';
import { Cloud, Sprout, Trees, Star } from 'lucide-react';
import { FocusGardenState } from '@/types';

export interface FocusGardenProps {
  cumulativeMinutes: number;
  className?: string;
}

export const FocusGarden: React.FC<FocusGardenProps> = ({
  cumulativeMinutes,
  className,
}) => {
  const gardenState = useMemo<FocusGardenState>(() => {
    const hours = Math.floor(cumulativeMinutes / 60);

    if (hours < 10) {
      return {
        level: 1,
        levelName: '새벽 구름 (Level 1)',
        cumulativeHours: hours,
        nextLevelHours: 10,
        progressPercentage: Math.min(100, Math.round((hours / 10) * 100)),
      };
    }
    if (hours < 50) {
      return {
        level: 2,
        levelName: '몰입의 새싹 (Level 2)',
        cumulativeHours: hours,
        nextLevelHours: 50,
        progressPercentage: Math.min(100, Math.round((hours / 50) * 100)),
      };
    }
    if (hours < 150) {
      return {
        level: 3,
        levelName: '성장의 푸른 나무 (Level 3)',
        cumulativeHours: hours,
        nextLevelHours: 150,
        progressPercentage: Math.min(100, Math.round((hours / 150) * 100)),
      };
    }
    if (hours < 300) {
      return {
        level: 4,
        levelName: '울창한 학업의 숲 (Level 4)',
        cumulativeHours: hours,
        nextLevelHours: 300,
        progressPercentage: Math.min(100, Math.round((hours / 300) * 100)),
      };
    }

    return {
      level: 5,
      levelName: '별이 빛나는 새벽 하늘 (Max Level)',
      cumulativeHours: hours,
      nextLevelHours: 500,
      progressPercentage: 100,
    };
  }, [cumulativeMinutes]);

  const levelIcons: Record<number, React.ReactNode> = {
    1: <Cloud className="h-7 w-7 text-[#38BDF8]" />,
    2: <Sprout className="h-7 w-7 text-[#10B981]" />,
    3: <Trees className="h-7 w-7 text-[#10B981]" />,
    4: <Trees className="h-7 w-7 text-[#0EA5E9]" />,
    5: <Star className="h-7 w-7 text-[#F59E0B] fill-current" />,
  };

  return (
    <Card variant="flat" padding="md" className={className}>
      <SectionTitle
        title="몰입 정원 (Focus Garden)"
        subtitle="공부 시간에 따라 성장하는 나의 학업 정원"
      />

      <div className="flex items-center justify-between p-4 rounded-[1rem] bg-[#131825] border border-[#1E293B]">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-full bg-[#0B0E17] border border-[#1E293B] shrink-0">
            {levelIcons[gardenState.level]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#F8FAFC]">
                {gardenState.levelName}
              </h4>
              <Badge variant="sky" size="sm">
                Level {gardenState.level}
              </Badge>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              누적 몰입: <span className="text-[#38BDF8] font-bold">{gardenState.cumulativeHours}시간</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-[#64748B]">다음 단계까지</span>
          <div className="text-sm font-bold text-[#F8FAFC]">
            {Math.max(0, gardenState.nextLevelHours - gardenState.cumulativeHours)}시간 남아있음
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <Progress value={gardenState.progressPercentage} height="sm" showLabel={false} />
        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
          <span>성장 진행률</span>
          <span className="text-[#38BDF8] font-semibold">{gardenState.progressPercentage}%</span>
        </div>
      </div>
    </Card>
  );
};

FocusGarden.displayName = 'FocusGarden';
