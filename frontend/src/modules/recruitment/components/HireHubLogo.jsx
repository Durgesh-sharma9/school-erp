import React from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export function HireHubLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  withText = true,
  withSubtitle = true,
  className = '',
  iconClassName = '',
  textClassName = '',
}) {
  const sizeMap = {
    sm: { box: 'h-6 w-6', text: 'text-sm', sub: 'text-[8px]' },
    md: { box: 'h-8 sm:h-9 w-8 sm:w-9', text: 'text-lg sm:text-xl', sub: 'text-[9px]' },
    lg: { box: 'h-10 sm:h-11 w-10 sm:w-11', text: 'text-xl sm:text-2xl', sub: 'text-[10px]' },
    xl: { box: 'h-14 w-14', text: 'text-2xl sm:text-3xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Brand Emblem Icon with Teal + Purple Gradient */}
      <div className={`rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] text-white flex items-center justify-center shadow-sm shadow-purple-500/20 shrink-0 ${currentSize.box} ${iconClassName}`}>
        <Briefcase className="h-4 w-4" />
      </div>

      {/* Brand Typography: "Hire" in Deep Navy, "Hub" in Teal */}
      {withText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-[#08295C] dark:text-white leading-tight font-sans ${currentSize.text} ${textClassName}`}
          >
            Hire<span className="text-[#12B9A5]">Hub</span>
          </span>
          {withSubtitle && (
            <span
              className={`font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase -mt-0.5 ${currentSize.sub}`}
            >
              School Staff Recruitment OS
            </span>
          )}
        </div>
      )}
    </div>
  );
}
