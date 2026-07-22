'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeConfig, ThemeId, THEME_PRESETS } from '@/constants/theme';
import { getItem, setItem } from '@/lib/storage';

const THEME_STORAGE_KEY = 'daybreak_study_active_theme_config';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  activeThemeId: ThemeId;
  brightness: number;
  cardOpacity: number;
  blurLevel: number;
  setThemeId: (id: ThemeId) => void;
  setBrightness: (val: number) => void;
  setCardOpacity: (val: number) => void;
  setBlurLevel: (val: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('midnight_sky');
  const [brightness, setBrightnessState] = useState<number>(100);
  const [cardOpacity, setCardOpacityState] = useState<number>(100);
  const [blurLevel, setBlurLevelState] = useState<number>(12);

  // Initialize theme from storage
  useEffect(() => {
    const saved = getItem<{
      themeId: ThemeId;
      brightness: number;
      cardOpacity: number;
      blurLevel: number;
    }>(THEME_STORAGE_KEY, {
      themeId: 'midnight_sky',
      brightness: 100,
      cardOpacity: 100,
      blurLevel: 12,
    });

    if (saved && saved.themeId && THEME_PRESETS[saved.themeId]) {
      setActiveThemeId(saved.themeId);
      setBrightnessState(saved.brightness ?? 100);
      setCardOpacityState(saved.cardOpacity ?? 100);
      setBlurLevelState(saved.blurLevel ?? 12);
    }
  }, []);

  const saveSettings = (
    id: ThemeId,
    b: number,
    co: number,
    bl: number
  ) => {
    setItem(THEME_STORAGE_KEY, {
      themeId: id,
      brightness: b,
      cardOpacity: co,
      blurLevel: bl,
    });
  };

  const setThemeId = (id: ThemeId) => {
    if (!THEME_PRESETS[id]) return;
    setActiveThemeId(id);
    saveSettings(id, brightness, cardOpacity, blurLevel);
  };

  const setBrightness = (val: number) => {
    setBrightnessState(val);
    saveSettings(activeThemeId, val, cardOpacity, blurLevel);
  };

  const setCardOpacity = (val: number) => {
    setCardOpacityState(val);
    saveSettings(activeThemeId, brightness, val, blurLevel);
  };

  const setBlurLevel = (val: number) => {
    setBlurLevelState(val);
    saveSettings(activeThemeId, brightness, cardOpacity, val);
  };

  const currentTheme = useMemo(() => {
    return THEME_PRESETS[activeThemeId] || THEME_PRESETS.midnight_sky;
  }, [activeThemeId]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        activeThemeId,
        brightness,
        cardOpacity,
        blurLevel,
        setThemeId,
        setBrightness,
        setCardOpacity,
        setBlurLevel,
      }}
    >
      <div
        style={{
          filter: brightness !== 100 ? `brightness(${brightness}%)` : undefined,
        }}
        className="min-h-screen transition-all duration-500"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
