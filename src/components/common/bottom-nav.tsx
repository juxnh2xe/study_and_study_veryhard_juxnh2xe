'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Flame, User, Users, BarChart2, Settings, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type StudentNavTab = 'dashboard' | 'routine' | 'focus' | 'profile';
export type ParentNavTab = 'overview' | 'reports' | 'students' | 'settings';

export interface StudentBottomNavProps {
  activeTab: StudentNavTab;
  onChangeTab: (tab: StudentNavTab) => void;
  className?: string;
}

export const BottomNav: React.FC<StudentBottomNavProps> = ({
  activeTab,
  onChangeTab,
  className,
}) => {
  const items: { id: StudentNavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: '홈', icon: LayoutDashboard },
    { id: 'routine', label: '루틴', icon: CheckSquare },
    { id: 'focus', label: '몰입', icon: Flame },
    { id: 'profile', label: '마이', icon: User },
  ];

  return (
    <div
      role="navigation"
      aria-label="학생 탭 네비게이션"
      className={cn(
        'fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md bg-[#0B0E17]/95 backdrop-blur-xl border border-[#1E293B] rounded-full p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] select-none',
        className
      )}
    >
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${item.label} 탭으로 이동`}
              onClick={() => onChangeTab(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center min-h-[44px] py-1.5 px-3 sm:px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]',
                isActive ? 'text-[#0EA5E9]' : 'text-[#64748B] hover:text-[#94A3B8]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStudentTab"
                  className="absolute inset-0 bg-[rgba(14,165,233,0.14)] border border-[rgba(14,165,233,0.35)] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="h-5 w-5 mb-0.5 z-10 shrink-0" aria-hidden="true" />
              <span className="z-10 text-[11px] whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

BottomNav.displayName = 'BottomNav';

export interface ParentBottomNavProps {
  activeTab: ParentNavTab;
  onChangeTab: (tab: ParentNavTab) => void;
  className?: string;
}

export const ParentBottomNav: React.FC<ParentBottomNavProps> = ({
  activeTab,
  onChangeTab,
  className,
}) => {
  const items: { id: ParentNavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: '학생 현황', icon: Users },
    { id: 'reports', label: '학습 리포트', icon: BarChart2 },
    { id: 'students', label: '연결 관리', icon: LinkIcon },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div
      role="navigation"
      aria-label="보호자 탭 네비게이션"
      className={cn(
        'fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md bg-[#0B0E17]/95 backdrop-blur-xl border border-[#0EA5E9]/40 rounded-full p-1.5 shadow-[0_10px_25px_rgba(14,165,233,0.25)] select-none',
        className
      )}
    >
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${item.label} 탭으로 이동`}
              onClick={() => onChangeTab(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center min-h-[44px] py-1.5 px-2.5 sm:px-3 rounded-full text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]',
                isActive ? 'text-[#0EA5E9]' : 'text-[#64748B] hover:text-[#94A3B8]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeParentTab"
                  className="absolute inset-0 bg-[rgba(14,165,233,0.14)] border border-[rgba(14,165,233,0.35)] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="h-5 w-5 mb-0.5 z-10 shrink-0" aria-hidden="true" />
              <span className="z-10 text-[10px] sm:text-[11px] whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

ParentBottomNav.displayName = 'ParentBottomNav';
