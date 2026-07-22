'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Flame, User } from 'lucide-react';
import { cn } from '@/lib/cn';

export type NavTab = 'dashboard' | 'routine' | 'focus' | 'profile';

export interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  className,
}) => {
  const items: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: '홈', icon: LayoutDashboard },
    { id: 'routine', label: '루틴', icon: CheckSquare },
    { id: 'focus', label: '몰입', icon: Flame },
    { id: 'profile', label: '마이', icon: User },
  ];

  return (
    <div
      role="navigation"
      aria-label="하늘 탭 네비게이션"
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md bg-[#0B0E17]/90 backdrop-blur-xl border border-[#1E293B] rounded-full p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] select-none',
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
                'relative flex flex-col items-center justify-center min-h-[44px] py-2 px-4 rounded-full text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]',
                isActive ? 'text-[#0EA5E9]' : 'text-[#64748B] hover:text-[#94A3B8]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-[rgba(14,165,233,0.14)] border border-[rgba(14,165,233,0.35)] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="h-5 w-5 mb-0.5 z-10" aria-hidden="true" />
              <span className="z-10 text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

BottomNav.displayName = 'BottomNav';
