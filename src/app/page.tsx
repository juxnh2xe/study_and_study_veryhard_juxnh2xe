'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { PageContainer } from '@/components/common/page-container';
import { BottomNav, NavTab } from '@/components/common/bottom-nav';
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
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { glowGradient } = useDynamicSkyTheme(true);

  // Strictly require user login! Guest mode disabled.
  if (!user) {
    return <AuthGate />;
  }

  return (
    <main
      className={`min-h-screen ${currentTheme.background} relative transition-all duration-700`}
      style={{ color: currentTheme.foreground }}
    >
      {/* Dynamic Ambient Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{ background: glowGradient }}
      />

      <PageContainer maxWidth="md" className="relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardTab
            onStartFocus={() => setActiveTab('focus')}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {activeTab === 'routine' && <RoutineTab />}

        {activeTab === 'focus' && <FocusTab />}

        {activeTab === 'parent' && <ParentDashboardTab />}

        {activeTab === 'profile' && <ProfileTab />}
      </PageContainer>

      {/* Global Search Modal Trigger */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Fixed iOS Style Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
      />
    </main>
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
