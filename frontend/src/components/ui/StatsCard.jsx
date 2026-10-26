import React from 'react';
import { cn } from '../../utils/cn';

const THEMES = [
  { wrap: 'bg-blue-50/80 border-blue-100 hover:border-blue-300', icon: 'bg-blue-100 text-blue-600', title: 'text-blue-700', sub: 'text-blue-700/80' },
  { wrap: 'bg-violet-50/80 border-violet-100 hover:border-violet-300', icon: 'bg-violet-100 text-violet-600', title: 'text-violet-700', sub: 'text-violet-700/80' },
  { wrap: 'bg-emerald-50/80 border-emerald-100 hover:border-emerald-300', icon: 'bg-emerald-100 text-emerald-600', title: 'text-emerald-700', sub: 'text-emerald-700/80' },
  { wrap: 'bg-amber-50/80 border-amber-100 hover:border-amber-300', icon: 'bg-amber-100 text-amber-600', title: 'text-amber-700', sub: 'text-amber-700/80' },
  { wrap: 'bg-orange-50/80 border-orange-100 hover:border-orange-300', icon: 'bg-orange-100 text-orange-600', title: 'text-orange-700', sub: 'text-orange-700/80' },
  { wrap: 'bg-rose-50/80 border-rose-100 hover:border-rose-300', icon: 'bg-rose-100 text-rose-600', title: 'text-rose-700', sub: 'text-rose-700/80' },
  { wrap: 'bg-cyan-50/80 border-cyan-100 hover:border-cyan-300', icon: 'bg-cyan-100 text-cyan-600', title: 'text-cyan-700', sub: 'text-cyan-700/80' },
];

export default function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  description,
  trend,
  trendUp = true,
  themeIndex = 0,
  className,
  children,
  onClick,
}) {
  const theme = THEMES[themeIndex % THEMES.length];
  const bottomContent = subtitle || description || children;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border p-3.5 shadow-2xs transition-all duration-200 flex flex-col justify-between min-h-[100px]',
        theme.wrap,
        onClick && 'cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
    >
      {/* Header: Title + Icon */}
      <div className="flex items-center justify-between gap-1.5">
        <span className={cn('text-[11px] font-bold uppercase tracking-wider truncate', theme.title)}>
          {title}
        </span>
        {Icon ? (
          <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-110', theme.icon)}>
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      {/* Main Value */}
      <div className="my-1">
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none truncate">
          {value}
        </div>
      </div>

      {/* Footer / Subtitle */}
      <div className="text-[11px] font-medium text-slate-600 truncate flex items-center justify-between gap-1.5">
        <span className="truncate">{bottomContent}</span>
        {trend && (
          <span className={cn('text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0', trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
