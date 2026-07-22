'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { SectionTitle } from './section-title';
import { BarChart2, Award, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { WeeklyReportData, MonthlyReportData } from '@/types';

export interface AnalyticsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsReportModal: React.FC<AnalyticsReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyData: WeeklyReportData = {
    weekRange: '2026.07.20 ~ 2026.07.26 (7월 4주차)',
    totalHours: 30.6,
    targetAchievementRate: 85,
    topSubject: '수학 (40%)',
    averageRating: 4.8,
    routineSuccessRate: 92,
  };

  const monthlyData: MonthlyReportData = {
    monthName: '2026년 7월 심화 학업 리포트',
    totalHours: 118,
    completedTextbooksCount: 1,
    activeDaysCount: 22,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="주간 / 월간 심화 학업 리포트"
      subtitle="데이터 기반 학업 성과 및 성장 분석"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Toggle Scope */}
        <div className="flex gap-2 p-1 rounded-lg bg-[#131825] border border-[#1E293B]">
          <button
            type="button"
            onClick={() => setReportType('weekly')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
              reportType === 'weekly' ? 'bg-[#0EA5E9] text-white' : 'text-[#94A3B8]'
            }`}
          >
            주간 리포트 (Weekly)
          </button>
          <button
            type="button"
            onClick={() => setReportType('monthly')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
              reportType === 'monthly' ? 'bg-[#0EA5E9] text-white' : 'text-[#94A3B8]'
            }`}
          >
            월간 리포트 (Monthly)
          </button>
        </div>

        {reportType === 'weekly' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#131825] border border-[#0EA5E9]/30 flex justify-between items-center text-xs">
              <span className="font-bold text-[#F8FAFC]">{weeklyData.weekRange}</span>
              <Badge variant="sky" size="sm">
                최고 집행 주간
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card variant="flat" padding="sm" className="space-y-1">
                <span className="text-xs text-[#94A3B8]">총 몰입 시간</span>
                <div className="text-xl font-extrabold text-[#38BDF8]">
                  {weeklyData.totalHours}시간
                </div>
              </Card>
              <Card variant="flat" padding="sm" className="space-y-1">
                <span className="text-xs text-[#94A3B8]">목표 달성률</span>
                <div className="text-xl font-extrabold text-[#10B981]">
                  {weeklyData.targetAchievementRate}%
                </div>
              </Card>
              <Card variant="flat" padding="sm" className="space-y-1">
                <span className="text-xs text-[#94A3B8]">최대 비중 과목</span>
                <div className="text-sm font-bold text-[#F8FAFC]">
                  {weeklyData.topSubject}
                </div>
              </Card>
              <Card variant="flat" padding="sm" className="space-y-1">
                <span className="text-xs text-[#94A3B8]">루틴 완수율</span>
                <div className="text-xl font-extrabold text-[#F59E0B]">
                  {weeklyData.routineSuccessRate}%
                </div>
              </Card>
            </div>

            <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[#10B981]/30 text-xs space-y-1">
              <span className="font-bold text-[#10B981] flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                AI 학업 성장 총평
              </span>
              <p className="text-[#94A3B8] leading-relaxed">
                지난주 대비 수학 파트 문제 풀이 속도가 12% 상승하였으며, 루틴 이행률이 92%로 최고 수준입니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-[#131825] border border-[#0EA5E9]/30 flex justify-between items-center text-xs">
              <span className="font-bold text-[#F8FAFC]">{monthlyData.monthName}</span>
              <Badge variant="sky" size="sm">
                월간 리포트
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Card variant="flat" padding="sm" className="space-y-1 text-center">
                <span className="text-xs text-[#94A3B8]">월간 총 몰입</span>
                <div className="text-xl font-extrabold text-[#38BDF8]">
                  {monthlyData.totalHours}h
                </div>
              </Card>
              <Card variant="flat" padding="sm" className="space-y-1 text-center">
                <span className="text-xs text-[#94A3B8]">완독 교재</span>
                <div className="text-xl font-extrabold text-[#10B981]">
                  {monthlyData.completedTextbooksCount}권
                </div>
              </Card>
              <Card variant="flat" padding="sm" className="space-y-1 text-center">
                <span className="text-xs text-[#94A3B8]">출석 일수</span>
                <div className="text-xl font-extrabold text-[#F59E0B]">
                  {monthlyData.activeDaysCount}일
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

AnalyticsReportModal.displayName = 'AnalyticsReportModal';
