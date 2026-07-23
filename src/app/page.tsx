'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { PageContainer } from '@/components/common/page-container';
import { BottomNav, ParentBottomNav, StudentNavTab, ParentNavTab } from '@/components/common/bottom-nav';
import { DashboardTab } from '@/components/dashboard/DashboardTab';
import { RoutineTab } from '@/components/routine/RoutineTab';
import { FocusTab } from '@/components/focus/FocusTab';
import { ProfileTab } from '@/components/profile/ProfileTab';
import { ParentDashboardTab } from '@/components/parent/ParentDashboardTab';
import { GlobalSearchModal } from '@/components/common/global-search-modal';
import { SplashScreen } from '@/components/common/splash-screen';
import { OnboardingModal } from '@/components/common/onboarding-modal';
import { AuthGate } from '@/components/auth/auth-gate';
import { useDynamicSkyTheme } from '@/hooks/useDynamicSkyTheme';

function AppContent() {
  const { user, userRole } = useAuth();
  const { currentTheme } = useTheme();

  // Student navigation tab state
  const [studentTab, setStudentTab] = useState<StudentNavTab>('dashboard');

  // Parent navigation tab state
  const [parentTab, setParentTab] = useState<ParentNavTab>('overview');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { glowGradient } = useDynamicSkyTheme(true);

  // Require user login
  if (!user) {
    return <AuthGate />;
  }

  // 1. Parent Role View
  if (userRole === 'parent') {
    return (
      <div
        className={`h-[100dvh] max-h-[100dvh] w-full flex flex-col overflow-hidden relative ${currentTheme.background} transition-all duration-700`}
        style={{ color: currentTheme.foreground }}
      >
        {/* Dynamic Ambient Glow */}
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
          style={{ background: glowGradient }}
        />

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain w-full relative z-10">
          <PageContainer maxWidth="md">
            <ParentDashboardTab
              activeSubTab={parentTab}
              onNavigateSubTab={(tab) => setParentTab(tab)}
            />
          </PageContainer>
        </div>

        {/* Parent Dedicated Navigation Bar */}
        <ParentBottomNav
          activeTab={parentTab}
          onChangeTab={(tab) => setParentTab(tab)}
        />
      </div>
    );
  }

  // 2. Student Role View (Default)
  return (
    <div
      className={`h-[100dvh] max-h-[100dvh] w-full flex flex-col overflow-hidden relative ${currentTheme.background} transition-all duration-700`}
      style={{ color: currentTheme.foreground }}
    >
      {/* Dynamic Ambient Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{ background: glowGradient }}
      />

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain w-full relative z-10">
        <PageContainer maxWidth="md">
          {studentTab === 'dashboard' && (
            <DashboardTab
              onStartFocus={() => setStudentTab('focus')}
              onNavigateTab={(tab) => setStudentTab(tab as StudentNavTab)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          )}

          {studentTab === 'routine' && <RoutineTab />}

          {studentTab === 'focus' && <FocusTab />}

          {studentTab === 'profile' && <ProfileTab />}
        </PageContainer>
      </div>

      {/* Global Search Modal Trigger */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Student Dedicated Bottom Navigation Bar */}
      <BottomNav
        activeTab={studentTab}
        onChangeTab={(tab) => setStudentTab(tab)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          {/* Brand Splash Screen on Initial Load */}
          <SplashScreen />

          {/* First-time User Onboarding Carousel */}
          <OnboardingModal />

          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
