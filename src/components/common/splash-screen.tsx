'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A0F] text-[#F8FAFC] select-none pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center space-y-3"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8] shadow-[0_0_40px_rgba(14,165,233,0.5)]">
              <Flame className="h-10 w-10 text-white fill-current animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC]">
                DAYBREAK
              </h1>
              <p className="text-xs font-semibold text-[#0EA5E9] tracking-widest uppercase flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Early Morning Focus</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SplashScreen.displayName = 'SplashScreen';
