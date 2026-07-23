'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { StatCard } from '../common/stat-card';
import { SectionTitle } from '../common/section-title';
import { ParentNavTab } from '../common/bottom-nav';
import { ThemeSelectorModal } from '../common/theme-selector-modal';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Users,
  Flame,
  Clock,
  HeartHandshake,
  Sparkles,
  Activity,
  Plus,
  CheckCircle2,
  Layers,
  Settings as SettingsIcon,
  LogOut,
  Sun,
  ShieldCheck,
  Link as LinkIcon,
  BarChart2,
} from 'lucide-react';
import { useToast } from '../ui/toast';
import { ParentStudentLink } from '@/types';
import { useStudyStats } from '@/hooks/useStudyStats';
import { useAuth } from '@/context/AuthContext';

export interface ParentDashboardTabProps {
  activeSubTab: ParentNavTab;
  onNavigateSubTab: (tab: ParentNavTab) => void;
}

export const ParentDashboardTab: React.FC<ParentDashboardTabProps> = ({
  activeSubTab,
  onNavigateSubTab,
}) => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const { todayMinutes, weeklyMinutes, streakDays, subjectDistribution, recentSessions } = useStudyStats();

  const [connectedStudents, setConnectedStudents] = useState<ParentStudentLink[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');

  // Dynamic status check
  const isLiveStudying = false; // Realtime active timer state
  const selectedStudent = connectedStudents.find((s) => s.studentId === selectedStudentId);

  const formatHoursMins = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h}h ${m}m`;
  };

  const handleAddLink = () => {
    if (!inputCode.trim()) {
      showToast({
        type: 'error',
        title: '입력 오류',
        description: '보호자 연결 코드를 입력해주세요.',
      });
      return;
    }

    const newLink: ParentStudentLink = {
      id: `link-${Date.now()}`,
      parentId: user?.id || 'parent-id',
      studentId: `student-${Date.now()}`,
      studentName: '연결된 자녀',
      studentGrade: '3학년',
      targetUniversity: '목표 대학 설정됨',
      connectionCode: inputCode.trim().toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    setConnectedStudents([...connectedStudents, newLink]);
    setSelectedStudentId(newLink.studentId);
    setInputCode('');
    setIsLinkModalOpen(false);

    showToast({
      type: 'success',
      title: '학생 계정 연결 완료 🎉',
      description: `코드 [${inputCode.trim().toUpperCase()}] 자녀 계정과 성공적으로 연결되었습니다.`,
    });
  };

  const weeklyHoursData = [
    { day: '월', hours: 0 },
    { day: '화', hours: 0 },
    { day: '수', hours: 0 },
    { day: '목', hours: 0 },
    { day: '금', hours: 0 },
    { day: '토', hours: 0 },
    { day: '일', hours: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* =========================================================
         TAB 1: 학생 현황 (parent_overview)
         ========================================================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Parent Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0EA5E9] mb-1">
                <HeartHandshake className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">DAYBREAK PARENT COACHING</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap break-keep">
                자녀 학습 현황 🎓
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5 break-keep">
                따뜻한 관찰과 응원으로 자녀의 새벽 몰입을 지원합니다
              </p>
            </div>

            {/* Student Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {connectedStudents.map((s) => (
                <button
                  key={s.studentId}
                  onClick={() => setSelectedStudentId(s.studentId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    selectedStudentId === s.studentId
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-[0_2px_10px_rgba(14,165,233,0.3)]'
                      : 'bg-[#0B0E17] text-[#94A3B8] border-[#1E293B]'
                  }`}
                >
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>{s.studentName} ({s.studentGrade})</span>
                </button>
              ))}

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsLinkModalOpen(true)}
                className="whitespace-nowrap"
              >
                학생 연결
              </Button>
            </div>
          </div>

          {/* No Connected Student Empty State */}
          {(!connectedStudents || connectedStudents.length === 0) ? (
            <Card variant="flat" padding="md" className="py-10 text-center space-y-3 border-dashed border-[#1E293B] bg-[#0B0E17]">
              <div className="p-3 rounded-full bg-[rgba(14,165,233,0.15)] text-[#0EA5E9] inline-flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#F8FAFC]">아직 연결된 자녀 계정이 없습니다</h3>
                <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                  자녀 학생 앱 [마이페이지]에 표시된 <span className="text-[#F8FAFC] font-bold">[보호자 연동 코드]</span>를 확인하여 등록해보세요!
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={() => setIsLinkModalOpen(true)} className="mt-2">
                연결 코드 등록하기
              </Button>
            </Card>
          ) : (
            <>
              {/* Realtime Live Study Status Monitor Card */}
              <Card
                variant="interactive"
                padding="md"
                className={`relative overflow-hidden border-2 transition-all ${
                  isLiveStudying
                    ? 'border-[#10B981] bg-[rgba(16,185,129,0.06)] shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : 'border-[#1E293B] bg-[#0B0E17]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        {isLiveStudying && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-3 w-3 ${
                            isLiveStudying ? 'bg-[#10B981]' : 'bg-[#64748B]'
                          }`}
                        />
                      </span>
                      <Badge variant={isLiveStudying ? 'success' : 'neutral'} size="md">
                        {isLiveStudying ? '🟢 현재 실시간 집중 공부 중' : '⚪ 현재 휴식 중 / 대기 중'}
                      </Badge>
                      <span className="text-[11px] text-[#94A3B8]">
                        {selectedStudent?.studentName || '자녀'} 학생의 타임아웃 라이브 연동
                      </span>
                    </div>

                    {!isLiveStudying && (
                      <p className="text-xs text-[#94A3B8] pt-1">
                        현재 진행 중인 몰입 타이머 세션이 없습니다. 자녀가 공부를 시작하면 실시간 현황이 표시됩니다.
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Overview Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  label="오늘 몰입 시간"
                  value={formatHoursMins(todayMinutes)}
                  subvalue="/ 6h 목표"
                  accentColor="#0EA5E9"
                  icon={<Clock className="h-4 w-4" />}
                />
                <StatCard
                  label="이번 주 누적"
                  value={formatHoursMins(weeklyMinutes)}
                  accentColor="#10B981"
                  icon={<Activity className="h-4 w-4" />}
                />
                <StatCard
                  label="오늘 완료 루틴"
                  value="0개"
                  accentColor="#F59E0B"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />
                <StatCard
                  label="연속 학습 스트릭"
                  value={`${streakDays}일 째`}
                  accentColor="#8B5CF6"
                  icon={<Flame className="h-4 w-4" />}
                />
              </div>

              {/* Timeline Study Log */}
              <div className="space-y-3">
                <SectionTitle title="오늘의 공부 타임라인 기록" subtitle="자녀의 실시간 학습 세션 로깅" />
                {(!recentSessions || recentSessions.length === 0) ? (
                  <Card variant="flat" padding="sm" className="py-6 text-center text-xs text-[#94A3B8] border-dashed border-[#1E293B]">
                    오늘 기록된 학습 세션이 없습니다. 첫 공부가 완료되면 타임라인이 형성됩니다.
                  </Card>
                ) : (
                  <div className="space-y-2.5">
                    {recentSessions.map((s) => (
                      <Card key={s.id} variant="flat" padding="sm" className="flex items-center justify-between border-[#1E293B]">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#131825] text-[#0EA5E9] font-mono text-xs font-bold shrink-0">
                            {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#F8FAFC]">
                              [{s.subjectName}] {s.textbook}
                            </h4>
                            <span className="text-[10px] text-[#94A3B8]">{s.durationMinutes}분 집중 세션 완료</span>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">
                          기록됨
                        </Badge>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* =========================================================
         TAB 2: 학습 리포트 (parent_reports)
         ========================================================= */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0EA5E9] mb-1">
              <BarChart2 className="h-4 w-4 shrink-0" />
              <span>LEARNING ANALYTICS &amp; REPORTS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap break-keep">
              자녀 심화 학습 리포트 📊
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5 break-keep">
              주간 및 과목별 몰입 비중 분석과 AI 응원 코칭 피드백
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject Ratio Pie Chart */}
            <Card variant="flat" padding="md" className="space-y-3">
              <SectionTitle title="과목별 학습 몰입 비중" subtitle="이번 주 몰입 비율" />
              {(!subjectDistribution || subjectDistribution.length === 0) ? (
                <div className="h-48 flex items-center justify-center text-xs text-[#94A3B8]">
                  아직 기록된 과목별 학습 데이터가 없습니다.
                </div>
              ) : (
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0B0E17', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Weekly Hours Bar Chart */}
            <Card variant="flat" padding="md" className="space-y-3">
              <SectionTitle title="주간 일자별 몰입 시간 (시간)" subtitle="월~일 일일 공부량" />
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyHoursData}>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0B0E17', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }}
                    />
                    <Bar dataKey="hours" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Learning Insights & Coaching Recommendation */}
          <Card variant="flat" padding="md" className="space-y-3 bg-[#0B0E17] border-[#0EA5E9]/30">
            <SectionTitle
              title="💡 부모 전용 AI 학습 패턴 분석 &amp; 코칭 리포트"
              subtitle="자녀의 습관 데이터를 바탕으로 제공되는 긍정 피드백"
            />
            <div className="p-3.5 rounded-xl bg-[rgba(14,165,233,0.08)] border border-[#0EA5E9]/30 flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#0EA5E9] text-white shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-xs text-[#F8FAFC] leading-relaxed">
                <span className="font-bold text-[#38BDF8]">코칭 팁:</span> 학업 세션이 축적되면 자녀의 최고 집중 시간대와 과목별 비중을 분석하여 따뜻한 응원의 코칭 가이드를 자동으로 생성해 드립니다! 💬
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================
         TAB 3: 연결 학생 관리 (parent_students)
         ========================================================= */}
      {activeSubTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0EA5E9] mb-1">
                <LinkIcon className="h-4 w-4 shrink-0" />
                <span>STUDENT CONNECTION MANAGEMENT</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap break-keep">
                연결 자녀 계정 관리 🔗
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5 break-keep">
                자녀의 Daybreak 앱에서 발급한 연동 코드로 계정을 연결합니다
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsLinkModalOpen(true)}
            >
              자녀 연결 추가
            </Button>
          </div>

          {(!connectedStudents || connectedStudents.length === 0) ? (
            <Card variant="flat" padding="md" className="py-10 text-center space-y-3 border-dashed border-[#1E293B] bg-[#0B0E17]">
              <div className="p-3 rounded-full bg-[rgba(14,165,233,0.15)] text-[#0EA5E9] inline-flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#F8FAFC]">아직 연결된 자녀 계정이 없습니다</h3>
                <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                  자녀의 스마트폰 Daybreak 앱 [마이페이지 ➔ 보호자 연동 코드]에 표시된 코드를 아래 버튼을 눌러 등록해주세요.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={() => setIsLinkModalOpen(true)} className="mt-2">
                연결 코드 등록하기
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {connectedStudents.map((student) => (
                <Card key={student.id} variant="flat" padding="md" className="flex items-center justify-between border-[#1E293B]">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-full bg-[#131825] border border-[#0EA5E9]/50 text-[#0EA5E9]">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F8FAFC]">
                        {student.studentName} ({student.studentGrade})
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        목표: <span className="text-[#38BDF8]">{student.targetUniversity}</span>
                      </p>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">
                        연동 코드: {student.connectionCode}
                      </span>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">
                    연결 승인됨
                  </Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
         TAB 4: 설정 (parent_settings)
         ========================================================= */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0EA5E9] mb-1">
              <SettingsIcon className="h-4 w-4 shrink-0" />
              <span>PARENT ACCOUNT &amp; PREFERENCES</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] whitespace-nowrap break-keep">
              보호자 서비스 설정 ⚙️
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5 break-keep">
              계정 정보 및 테마 디스플레이 설정
            </p>
          </div>

          <Card variant="flat" padding="md" className="space-y-4 border-[#1E293B]">
            {/* Account Info */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131825] border border-[#1E293B]">
              <div>
                <span className="text-xs font-bold text-[#F8FAFC]">보호자 계정 정보</span>
                <p className="text-xs text-[#94A3B8] mt-0.5">{user?.email || '보호자 로그인됨'}</p>
                <Badge variant="sky" size="sm" className="mt-1">
                  👨‍👩‍👦 보호자 (Parent)
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<LogOut className="h-4 w-4 text-[#EF4444]" />}
                onClick={() => signOut()}
              >
                로그아웃
              </Button>
            </div>

            {/* Theme Customization */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131825] border border-[#0EA5E9]/30">
              <div>
                <span className="text-xs font-bold text-[#F8FAFC]">화면 테마 &amp; 앰비언스 커스텀 🎨</span>
                <p className="text-xs text-[#94A3B8] mt-0.5">Midnight, Cloud Blue 등 6가지 테마 조절</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sun className="h-4 w-4" />}
                onClick={() => setIsThemeModalOpen(true)}
              >
                테마 설정
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Link Student Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="학생 계정 연결하기 🔗"
        subtitle="학생의 Daybreak 앱에서 발급받은 보호자 연결 코드를 입력하세요"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsLinkModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddLink}>
              연결하기
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="보호자 연결 코드 (Connection Code)"
            placeholder="예) DAYBREAK-A82K91"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <p className="text-xs text-[#94A3B8]">
            * 학생용 Daybreak 앱 [마이페이지 ➔ 보호자 연결 코드]에서 확인하실 수 있습니다.
          </p>
        </div>
      </Modal>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </motion.div>
  );
};

ParentDashboardTab.displayName = 'ParentDashboardTab';
