'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  color?: string; // Optional custom accent background/border
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onSelect,
  onRemove,
  icon,
  color,
  className,
}) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all border select-none cursor-pointer break-keep whitespace-nowrap shrink-0',
        selected
          ? 'bg-[#0EA5E9] text-[#F8FAFC] border-[#0EA5E9] shadow-[0_2px_10px_rgba(14,165,233,0.3)]'
          : 'bg-[#0B0E17] text-[#94A3B8] border-[#1E293B] hover:text-[#F8FAFC] hover:border-[#334155]',
        className
      )}
      style={
        selected && color
          ? { backgroundColor: color, borderColor: color }
          : undefined
      }
    >
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span className="break-keep whitespace-nowrap">{label}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/20 text-current transition-colors shrink-0"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </motion.button>
  );
};

Chip.displayName = 'Chip';
