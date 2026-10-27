import React from 'react';
import { cn } from '../utils/cn';

const THEMES = [
  { wrap: 'bg-blue-50/80 border-blue-100/90', icon: 'bg-blue-100/80 text-blue-600', title: 'text-blue-700', sub: 'text-blue-700/80' },
  { wrap: 'bg-violet-50/80 border-violet-100/90', icon: 'bg-violet-100/80 text-violet-600', title: 'text-violet-700', sub: 'text-violet-700/80' },
  { wrap: 'bg-emerald-50/80 border-emerald-100/90', icon: 'bg-emerald-100/80 text-emerald-600', title: 'text-emerald-700', sub: 'text-emerald-700/80' },
  { wrap: 'bg-amber-50/80 border-amber-100/90', icon: 'bg-amber-100/80 text-amber-600', title: 'text-amber-700', sub: 'text-amber-700/80' },
  { wrap: 'bg-orange-50/80 border-orange-100/90', icon: 'bg-orange-100/80 text-orange-600', title: 'text-orange-700', sub: 'text-orange-700/80' },
  { wrap: 'bg-rose-50/80 border-rose-100/90', icon: 'bg-rose-100/80 text-rose-600', title: 'text-rose-700', sub: 'text-rose-700/80' },
  { wrap: 'bg-cyan-50/80 border-cyan-100/90', icon: 'bg-cyan-100/80 text-cyan-600', title: 'text-cyan-700', sub: 'text-cyan-700/80' },
];

export default function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  description,
  themeIndex = 0,
  className,
  children,
  onClick,
  badge,
}) {
  const theme = THEMES[themeIndex % THEMES.length];
  const bottomContent = subtitle || description || children;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border p-3 sm:p-3.5 shadow-2xs transition-all duration-200 flex flex-col justify-between min-h-[96px] sm:min-h-[104px]',
        theme.wrap,
        onClick && 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.99]',
        className
      )}
    >
      {/* Header: Title + Badge/Icon */}
      <div className="flex items-center justify-between gap-1.5">
        <span className={cn('text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate', theme.title)}>
          {title}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-700 shadow-2xs">
              {badge}
            </span>
          )}
          {Icon ? (
            <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105', theme.icon)}>
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Value */}
      <div className="my-0.5">
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none truncate font-mono">
          {value}
        </div>
      </div>

      {/* Footer / Subtitle (Clean single line) */}
      {bottomContent ? (
        <div className="text-[10.5px] sm:text-[11px] font-medium text-slate-600 truncate flex items-center gap-1.5">
          {bottomContent}
        </div>
      ) : null}
    </div>
  );
}
