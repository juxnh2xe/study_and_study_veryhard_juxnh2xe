'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { Dialog } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { StatCard } from '../common/stat-card';
import { SectionTitle } from '../common/section-title';
import { StudyCalendar } from '../common/study-calendar';
import { AchievementGallery } from '../common/achievement-gallery';
import { StudyDiarySection } from '../common/study-diary-section';
import { FocusGarden } from '../common/focus-garden';
import { AnalyticsReportModal } from '../common/analytics-report-modal';
import { LoginModal } from '../auth/login-modal';
import { SignupModal } from '../auth/signup-modal';
import { ResetPasswordModal } from '../auth/reset-password-modal';
import { ProfileEditModal } from '../auth/profile-edit-modal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_USER } from '@/constants/mock-data';
import { useStudyStats } from '@/hooks/useStudyStats';
import { useTextbooks } from '@/hooks/useTextbooks';
import { useWeaknessNotes } from '@/hooks/useWeaknessNotes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '../ui/toast';
import { exportAllDataToJSON, importDataFromJSON, removeItem, STORAGE_KEYS, setItem } from '@/lib/storage';
import { requestNotificationPermission } from '@/lib/notifications';
import { UserProfile } from '@/types';
import { studyRepository } from '@/lib/repository';
import { User, Award, Plus, Settings, ChevronRight, Download, Upload, RefreshCw, BarChart2, Bell, Sun, HelpCircle, LogIn, LogOut, Edit3, BookOpen } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { user, signOut } = useAuth();
  const { todayMinutes, weeklyMinutes, monthlyMinutes, subjectDistribution } = useStudyStats();
  const { textbooks, updateProgress, addTextbook } = useTextbooks();
  const { retrievalNotes, wrongNotes, addRetrievalNote, addWrongNote, incrementReviewCount } = useWeaknessNotes();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile>({
    name: MOCK_USER.name,
    grade: '3',
    targetUniversity: MOCK_USER.targetUniversity,
    dDay: MOCK_USER.dDay,
    dailyTargetMinutes: 360,
    themePreference: 'dark_sky',
    dynamicThemeEnabled: true,
    notificationsEnabled: true,
    defaultPomodoroMinutes: 25,
    defaultBreakMinutes: 5,
    hasCompletedOnboarding: true,
  });

  useEffect(() => {
    studyRepository.getUserProfile().then((p) => setProfile(p));
  }, [user]);

  // Auth Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Settings & Report Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Add Textbook Modal
  const [isAddTextbookOpen, setIsAddTextbookOpen] = useState(false);
  const [tbName, setTbName] = useState('');
  const [tbSubject, setTbSubject] = useState('수학');
  const [tbPages, setTbPages] = useState(200);

  // Weakness Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteType, setNoteType] = useState<'retrieval' | 'wrong'>('retrieval');
  const [subject, setSubject] = useState('수학II');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  // Settings Toggles
  const [dynamicTheme, setDynamicTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const formatHoursMins = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  const handleAddTextbookSubmit = () => {
    if (!tbName.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '교재 이름을 입력해주세요.',
      });
      return;
    }

    addTextbook(tbName.trim(), tbSubject, Number(tbPages) || 100);
    showToast({
      type: 'success',
      title: '교재 추가 완료 📚',
      description: `"${tbName.trim()}" 교재가 완독 리스트에 추가되었습니다.`,
    });

    setTbName('');
    setIsAddTextbookOpen(false);
  };

  const handleAddNote = () => {
    if (!title.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '제목/주제를 입력해주세요.',
      });
      return;
    }

    if (noteType === 'retrieval') {
      addRetrievalNote(subject, title.trim(), detail.trim() || '개념 이해 보완 필요');
      showToast({
        type: 'success',
        title: '인출 약점 노트 추가 완료',
        description: `"${title.trim()}" 약점 항목이 저장되었습니다.`,
      });
    } else {
      addWrongNote(subject, title.trim(), detail.trim() || '오답 원인 분석 필요');
      showToast({
        type: 'success',
        title: '오답 노트 추가 완료',
        description: `"${title.trim()}" 오답 문제 항목이 저장되었습니다.`,
      });
    }

    setTitle('');
    setDetail('');
    setIsNoteModalOpen(false);
  };

  const handleExportJSON = () => {
    const jsonStr = exportAllDataToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daybreak_study_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: '데이터 백업 다운로드 완료 💾',
      description: '모든 학습 데이터가 JSON 파일로 내보내졌습니다.',
    });
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJSON(content);
        if (success) {
          showToast({
            type: 'success',
            title: '복원 성공 🎉',
            description: '데이터가 성공적으로 복원되었습니다. 페이지를 새로고침합니다.',
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showToast({
            type: 'error',
            title: '복원 실패',
            description: '올바르지 않은 백업 파일 형식입니다.',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleToggleNotification = async () => {
    if (!notifications) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotifications(true);
        showToast({
          type: 'success',
          title: '알림 권한 승인 완료 🔔',
          description: '몰입 타이머 및 D-Day 알림을 받습니다.',
        });
      } else {
        showToast({
          type: 'warning',
          title: '알림 권한 거부됨',
          description: '브라우저 설정에서 알림 권한을 허용해주세요.',
        });
      }
    } else {
      setNotifications(false);
    }
  };

  const handleResetData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      removeItem(key);
    });
    setIsResetDialogOpen(false);
    showToast({
      type: 'info',
      title: '데이터 초기화 완료',
      description: '모든 데이터가 초기화되었습니다. 새로고침합니다.',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleLogout = async () => {
    await signOut();
    showToast({
      type: 'info',
      title: '로그아웃 완료',
      description: '안전하게 로그아웃되었습니다.',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Profile Header Card */}
      <Card variant="flat" padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#0EA5E9]/30 bg-gradient-to-r from-[rgba(14,165,233,0.08)] to-transparent">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-[#131825] border border-[#0EA5E9]/50 text-[#0EA5E9]">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#F8FAFC]">
                {user?.user_metadata?.name || profile.name}
              </h1>
              <Badge variant="sky" size="sm">
                {profile.grade}학년
              </Badge>
              {user ? (
                <Badge variant="success" size="sm">
                  Cloud 연결됨
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  게스트 로컬 모드
                </Badge>
              )}
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {user?.email ? user.email : `목표: ${profile.targetUniversity}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit3 className="h-3.5 w-3.5" />}
                onClick={() => setIsEditProfileOpen(true)}
              >
                프로필 수정
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogOut className="h-3.5 w-3.5 text-[#EF4444]" />}
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<LogIn className="h-3.5 w-3.5" />}
              onClick={() => setIsLoginOpen(true)}
            >
              로그인 / 회원가입
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BarChart2 className="h-4 w-4 text-[#10B981]" />}
            onClick={() => setIsReportOpen(true)}
          >
            심화 리포트
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Settings className="h-4 w-4" />} onClick={() => setIsSettingsOpen(true)}>
            설정
          </Button>
        </div>
      </Card>

      {/* Time Stats Summary Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="오늘 공부" value={formatHoursMins(todayMinutes)} accentColor="#0EA5E9" />
        <StatCard label="이번 주" value={formatHoursMins(weeklyMinutes)} accentColor="#10B981" />
        <StatCard label="이번 달" value={formatHoursMins(monthlyMinutes)} accentColor="#F59E0B" />
      </div>

      {/* Focus Garden */}
      <FocusGarden cumulativeMinutes={monthlyMinutes} />

      {/* Monthly Study Calendar */}
      <StudyCalendar />

      {/* Achievement Gallery & Badges */}
      <AchievementGallery />

      {/* Subject Distribution Recharts Donut Chart */}
      <Card variant="flat" padding="md" className="space-y-4">
        <SectionTitle
          title="과목별 학습 비율 (이번 주)"
          subtitle="수학 및 탐구 영역 집중 이행 중"
        />
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-44 h-44 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0E17" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B0E17',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F8FAFC',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-[#94A3B8]">최대 집중</span>
              <span className="text-xs font-bold text-[#38BDF8]">
                {subjectDistribution[0]?.name || '수학'} {subjectDistribution[0]?.value || 40}%
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 w-full">
            {subjectDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-[#F8FAFC]">{item.name}</span>
                </div>
                <span className="text-[#94A3B8] font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Textbook Progress */}
      <Card variant="flat" padding="md" className="space-y-4">
        <SectionTitle
          title="교재별 완독 진행률"
          subtitle="목표 범위 완독율"
          action={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setIsAddTextbookOpen(true)}
            >
              교재 추가
            </Button>
          }
        />

        <div className="space-y-3.5">
          {(!textbooks || textbooks.length === 0) ? (
            <div className="py-6 text-center text-xs text-[#94A3B8] border border-dashed border-[#1E293B] rounded-lg">
              등록된 교재가 없습니다. 우상단 [교재 추가] 버튼을 눌러 나의 교재 범위를 등록해보세요!
            </div>
          ) : (
            textbooks.map((tb) => {
              const pct = Math.min(100, Math.round((tb.completedPages / tb.totalPages) * 100));
              return (
                <div key={tb.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F8FAFC]">{tb.name} ({tb.subject})</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#38BDF8] font-semibold">
                        {tb.completedPages}p / {tb.totalPages}p ({pct}%)
                      </span>
                      <button
                        onClick={() => updateProgress(tb.id, tb.completedPages + 10)}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#131825] border border-[#1E293B] text-[#0EA5E9] hover:bg-[#171E30]"
                      >
                        +10p
                      </button>
                    </div>
                  </div>
                  <Progress value={pct} height="sm" />
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Study Diary Section */}
      <StudyDiarySection />

      {/* Retrieval Weakness Notes UI */}
      <div className="space-y-3">
        <SectionTitle
          title="인출 약점 노트"
          subtitle="개념 복습이 시급한 취약 단원"
          action={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                setNoteType('retrieval');
                setIsNoteModalOpen(true);
              }}
            >
              약점 추가
            </Button>
          }
        />
        <div className="space-y-2.5">
          {(!retrievalNotes || retrievalNotes.length === 0) ? (
            <Card variant="flat" padding="sm" className="py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
              등록된 인출 약점 노트가 없습니다. [약점 추가] 버튼을 눌러 복습이 필요한 핵심 단원을 기록해보세요!
            </Card>
          ) : (
            retrievalNotes.map((note) => (
              <Card key={note.id} variant="flat" padding="sm" className="border-l-4 border-l-[#F59E0B]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm">
                        {note.subject}
                      </Badge>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">{note.topic}</h4>
                    </div>
                    <p className="text-xs text-[#94A3B8]">{note.weaknessPoint}</p>
                  </div>
                  <span className="text-[10px] text-[#64748B]">{note.date}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Wrong Answer Notes UI */}
      <div className="space-y-3">
        <SectionTitle
          title="오답 노트"
          subtitle="반복 오답 문제 복습 관리"
          action={
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                setNoteType('wrong');
                setIsNoteModalOpen(true);
              }}
            >
              오답 추가
            </Button>
          }
        />
        <div className="space-y-2.5">
          {(!wrongNotes || wrongNotes.length === 0) ? (
            <Card variant="flat" padding="sm" className="py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
              등록된 오답 문제가 없습니다. [오답 추가] 버튼을 눌러 틀린 문제와 오답 원인을 분석해보세요!
            </Card>
          ) : (
            wrongNotes.map((wn) => (
              <Card key={wn.id} variant="flat" padding="sm" className="border-l-4 border-l-[#EF4444]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="danger" size="sm">
                        {wn.subject}
                      </Badge>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">
                        {wn.questionTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-[#94A3B8]">원인: {wn.reason}</p>
                  </div>
                  <button
                    onClick={() => incrementReviewCount(wn.id)}
                    className="shrink-0"
                  >
                    <Badge variant="neutral" size="sm">
                      복습 {wn.reviewCount}회 +
                    </Badge>
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Settings Menu Button */}
      <Card variant="flat" padding="none" className="divide-y divide-[#1E293B] overflow-hidden">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-[#131825] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 text-xs font-semibold text-[#F8FAFC]">
            <Settings className="h-4 w-4 text-[#0EA5E9]" />
            <span>SaaS 시스템 설정, 동적 테마, 계정 &amp; 백업</span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#64748B]" />
        </button>
      </Card>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onOpenResetPassword={() => {
          setIsLoginOpen(false);
          setIsResetPasswordOpen(true);
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
      />

      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentProfile={profile}
        onSaveSuccess={(p) => setProfile(p)}
      />

      {/* Add Textbook Modal */}
      <Modal
        isOpen={isAddTextbookOpen}
        onClose={() => setIsAddTextbookOpen(false)}
        title="새로운 교재 추가"
        subtitle="공부할 교재명과 목표 총 페이지 수를 입력하세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAddTextbookOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddTextbookSubmit}>
              교재 추가
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="교재명"
            placeholder="예) 수능특강 수학II, 자이스토리 물리학I"
            value={tbName}
            onChange={(e) => setTbName(e.target.value)}
          />
          <Input
            label="과목명"
            placeholder="예) 수학, 물리학, 국어"
            value={tbSubject}
            onChange={(e) => setTbSubject(e.target.value)}
          />
          <Input
            label="전체 페이지 수"
            type="number"
            value={tbPages.toString()}
            onChange={(e) => setTbPages(Number(e.target.value))}
          />
        </div>
      </Modal>

      {/* Analytics Report Modal */}
      <AnalyticsReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* v2.0 Settings & System Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="시스템 및 계정 설정"
        subtitle="동적 테마, 알림 권한, 데이터 백업 &amp; 계정 관리"
      >
        <div className="space-y-4">
          {/* Account status */}
          <div className="p-3.5 rounded-lg bg-[#131825] border border-[#1E293B] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#F8FAFC]">계정 상태</span>
              <p className="text-[11px] text-[#94A3B8]">
                {user ? `로그인됨 (${user.email})` : '로그인되지 않음 (로컬 모드)'}
              </p>
            </div>
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => { setIsSettingsOpen(false); setIsLoginOpen(true); }}>
                로그인
              </Button>
            )}
          </div>

          {/* Toggles */}
          <div className="p-3.5 rounded-lg bg-[#131825] border border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sun className="h-4 w-4 text-[#F59E0B]" />
                <span className="text-xs font-bold text-[#F8FAFC]">
                  Dynamic Sky Theme (시간대별 테마)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDynamicTheme(!dynamicTheme)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  dynamicTheme ? 'bg-[#0EA5E9]' : 'bg-[#1E293B]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    dynamicTheme ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-[#0EA5E9]" />
                <span className="text-xs font-bold text-[#F8FAFC]">
                  학습 알림 &amp; D-Day 푸시 권한
                </span>
              </div>
              <Button
                variant={notifications ? 'primary' : 'outline'}
                size="sm"
                onClick={handleToggleNotification}
              >
                {notifications ? '권한 켜짐' : '알림 켜기'}
              </Button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="p-3.5 rounded-lg bg-[#131825] border border-[#1E293B] space-y-2">
            <h4 className="text-xs font-bold text-[#F8FAFC]">JSON 데이터 백업 &amp; 복원</h4>
            <p className="text-[11px] text-[#94A3B8]">
              학습 기록, 루틴, 교재 데이터를 안전하게 내보내고 복원하세요.
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="h-4 w-4 text-[#0EA5E9]" />}
                onClick={handleExportJSON}
              >
                JSON 백업 받기
              </Button>
              <label className="inline-flex items-center justify-center font-semibold rounded-[0.75rem] border border-[#1E293B] bg-transparent text-[#F8FAFC] text-xs h-9 px-3 gap-1.5 hover:border-[#0EA5E9] cursor-pointer">
                <Upload className="h-4 w-4 text-[#10B981]" />
                <span>JSON 파일 복원</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJSON}
                />
              </label>
            </div>
          </div>

          {/* Reset */}
          <div className="p-3.5 rounded-lg bg-[rgba(239,68,68,0.06)] border border-[#EF4444]/30 space-y-2">
            <h4 className="text-xs font-bold text-[#EF4444]">데이터 초기화</h4>
            <p className="text-[11px] text-[#94A3B8]">
              로컬에 저장된 모든 학업 기록과 루틴을 완전 삭제합니다.
            </p>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={() => setIsResetDialogOpen(true)}
            >
              모든 데이터 초기화
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog for Data Reset */}
      <Dialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="모든 데이터를 초기화하시겠습니까?"
        description="이 작업은 되돌릴 수 없으며 로컬에 저장된 모든 학습 세션과 루틴이 즉시 삭제됩니다."
        variant="danger"
        confirmText="초기화 실행"
      />
    </motion.div>
  );
};

ProfileTab.displayName = 'ProfileTab';
