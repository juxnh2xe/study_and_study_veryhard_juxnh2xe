'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, BookOpen, Clock, Calendar } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { FocusSession, Textbook, StudyDiary } from '@/types';
import { MOCK_RECENT_SESSIONS, MOCK_TEXTBOOK_PROGRESS } from '@/constants/mock-data';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [sessions] = useLocalStorage<FocusSession[]>(STORAGE_KEYS.SESSIONS, MOCK_RECENT_SESSIONS);
  const [textbooks] = useLocalStorage<Textbook[]>(STORAGE_KEYS.TEXTBOOKS, MOCK_TEXTBOOK_PROGRESS.map(t => ({ id: t.id, name: t.name, subject: '수학', totalPages: t.totalPages, completedPages: t.completedPages })));
  const [diaries] = useLocalStorage<StudyDiary[]>(STORAGE_KEYS.DIARIES, []);

  const trimmed = query.trim().toLowerCase();

  const filteredSessions = trimmed
    ? (sessions || []).filter(
        (s) =>
          s.title.toLowerCase().includes(trimmed) ||
          s.textbook.toLowerCase().includes(trimmed) ||
          s.subjectName.toLowerCase().includes(trimmed)
      )
    : [];

  const filteredTextbooks = trimmed
    ? (textbooks || []).filter(
        (t) =>
          t.name.toLowerCase().includes(trimmed) ||
          t.subject.toLowerCase().includes(trimmed)
      )
    : [];

  const filteredDiaries = trimmed
    ? (diaries || []).filter(
        (d) =>
          d.todayStudySummary.toLowerCase().includes(trimmed) ||
          d.feelings.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="통합 검색 (Global Search)"
      subtitle="교재, 공부 기록, 공부 일기 검색"
      maxWidth="lg"
    >
      <div className="space-y-4">
        <Input
          placeholder="검색할 키워드를 입력하세요 (예: 수학, 미분, 수능특강)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          autoFocus
        />

        {!trimmed ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            검색어를 입력하시면 교재, 세션 기록, 공부 일기를 한 번에 찾아드립니다.
          </div>
        ) : (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {/* Textbook Results */}
            {filteredTextbooks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#0EA5E9]" />
                  교재 ({filteredTextbooks.length}건)
                </h4>
                {filteredTextbooks.map((tb) => (
                  <div key={tb.id} className="p-3 rounded-lg bg-[#131825] border border-[#1E293B] text-xs flex justify-between items-center">
                    <span className="font-bold text-[#F8FAFC]">{tb.name}</span>
                    <Badge variant="sky" size="sm">
                      {tb.completedPages} / {tb.totalPages}p
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Session Results */}
            {filteredSessions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#10B981]" />
                  몰입 세션 ({filteredSessions.length}건)
                </h4>
                {filteredSessions.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-[#131825] border border-[#1E293B] text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#F8FAFC]">{s.title}</span>
                      <Badge variant="success" size="sm">
                        {s.durationMinutes}분
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#94A3B8]">{s.textbook} • {s.studyType}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Diary Results */}
            {filteredDiaries.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#F59E0B]" />
                  공부 일기 ({filteredDiaries.length}건)
                </h4>
                {filteredDiaries.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-[#131825] border border-[#1E293B] text-xs space-y-1">
                    <span className="font-bold text-[#38BDF8]">{d.date}</span>
                    <p className="text-[#94A3B8]">{d.todayStudySummary}</p>
                  </div>
                ))}
              </div>
            )}

            {filteredTextbooks.length === 0 && filteredSessions.length === 0 && filteredDiaries.length === 0 && (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                &quot;{query}&quot; 에 일치하는 검색 결과가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

GlobalSearchModal.displayName = 'GlobalSearchModal';
