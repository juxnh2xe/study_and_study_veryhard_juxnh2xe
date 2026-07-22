'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { THEME_PRESETS, ThemeId } from '@/constants/theme';
import { Check, Sun, Eye, Sparkles } from 'lucide-react';
import { useToast } from '../ui/toast';

export interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeThemeId,
    setThemeId,
    brightness,
    setBrightness,
    cardOpacity,
    setCardOpacity,
    blurLevel,
    setBlurLevel,
  } = useTheme();

  const { showToast } = useToast();

  const handleSelectTheme = (id: ThemeId, name: string) => {
    setThemeId(id);
    showToast({
      type: 'success',
      title: '테마 변경 완료 🎨',
      description: `"${name}" 테마가 실시간 적용되었습니다.`,
    });
  };

  const presetList = Object.values(THEME_PRESETS);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="앱 화면 테마 &amp; 앰비언스 설정 🎨"
      subtitle="내 학습 몰입 환경에 딱 맞는 분위기를 선택하세요"
      footer={
        <Button variant="primary" size="sm" onClick={onClose} fullWidth>
          설정 완료
        </Button>
      }
    >
      <div className="space-y-5 select-none">
        {/* Preset Theme Selection Grid */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-[#94A3B8] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>시그니처 테마 프리셋</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presetList.map((preset) => {
              const isSelected = activeThemeId === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectTheme(preset.id, preset.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-[#0EA5E9] bg-[rgba(14,165,233,0.12)] shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                      : 'border-[#1E293B] bg-[#0B0E17] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{preset.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
                          {preset.name}
                          {isSelected && (
                            <Badge variant="sky" size="sm">
                              선택됨
                            </Badge>
                          )}
                        </h4>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1 rounded-full bg-[#0EA5E9] text-white shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Color Preview Dots */}
                  <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#1E293B]/60">
                    <div
                      className="h-3.5 w-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.accent }}
                      title="Accent Color"
                    />
                    <div
                      className="h-3.5 w-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.cardBg }}
                      title="Card Color"
                    />
                    <div
                      className="h-3.5 w-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: preset.cardBorder }}
                      title="Border Color"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detailed Personalization Controls */}
        <div className="p-3.5 rounded-xl bg-[#0B0E17] border border-[#1E293B] space-y-3.5">
          <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
            <Sun className="h-4 w-4 text-[#F59E0B]" />
            <span>세부 디스플레이 커스텀</span>
          </h4>

          {/* Brightness Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">화면 밝기 (Brightness)</span>
              <span className="font-bold text-[#0EA5E9]">{brightness}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="130"
              step="5"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#0EA5E9] bg-[#1E293B] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Card Opacity Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">카드 투명도 (Opacity)</span>
              <span className="font-bold text-[#0EA5E9]">{cardOpacity}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="5"
              value={cardOpacity}
              onChange={(e) => setCardOpacity(Number(e.target.value))}
              className="w-full accent-[#0EA5E9] bg-[#1E293B] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Blur Level Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">Glass 블러 효과 (Blur)</span>
              <span className="font-bold text-[#0EA5E9]">{blurLevel}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="2"
              value={blurLevel}
              onChange={(e) => setBlurLevel(Number(e.target.value))}
              className="w-full accent-[#0EA5E9] bg-[#1E293B] h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

ThemeSelectorModal.displayName = 'ThemeSelectorModal';
