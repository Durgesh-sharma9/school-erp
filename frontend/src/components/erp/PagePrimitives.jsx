import React from 'react';
import { cn } from '../../utils/cn';

const TONE_STYLES = {
  blue: {
    header: 'bg-gradient-to-r from-blue-100/70 via-indigo-50 to-blue-100/50 border-blue-200 text-indigo-950',
    icon: 'text-indigo-600',
  },
  orange: {
    header: 'bg-gradient-to-r from-[#FFEEDD] via-[#FFF7ED] to-[#FFEEDD] border-orange-200/80 text-[#8E3200]',
    icon: 'text-orange-600',
  },
  indigo: {
    header: 'bg-gradient-to-r from-indigo-100/70 via-blue-50 to-indigo-100/50 border-indigo-200 text-indigo-950',
    icon: 'text-indigo-600',
  },
  green: {
    header: 'bg-gradient-to-r from-emerald-100/70 via-teal-50 to-emerald-100/50 border-emerald-200 text-emerald-950',
    icon: 'text-emerald-600',
  },
  purple: {
    header: 'bg-gradient-to-r from-violet-100/70 via-purple-50 to-violet-100/50 border-violet-200 text-violet-950',
    icon: 'text-violet-600',
  },
  yellow: {
    header: 'bg-gradient-to-r from-amber-100/70 via-yellow-50 to-amber-100/50 border-amber-200 text-amber-950',
    icon: 'text-amber-600',
  },
  cyan: {
    header: 'bg-gradient-to-r from-cyan-100/70 via-sky-50 to-cyan-100/50 border-cyan-200 text-cyan-950',
    icon: 'text-cyan-600',
  },
  rose: {
    header: 'bg-gradient-to-r from-rose-100/70 via-pink-50 to-rose-100/50 border-rose-200 text-rose-950',
    icon: 'text-rose-600',
  },
};

export function PageHeader({ title, description, children, badge }) {
  return (
    <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full max-w-full overflow-x-hidden">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl break-words leading-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {badge}
            </span>
          )}
        </div>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500 break-words leading-normal">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2 shrink-0">{children}</div> : null}
    </div>
  );
}

export const ErpSection = React.forwardRef(function ErpSection(
  { title, icon: Icon, tone = 'green', children, action, className, contentClassName, ...props },
  ref
) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.green;

  return (
    <section
      ref={ref}
      className={cn('rounded-xl border border-slate-200 shadow-xs', (!className?.includes?.('bg-')) && 'bg-white', className)}
      {...props}
    >
      <div className={cn('flex items-center justify-between gap-3 border-b px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-t-xl overflow-hidden', styles.header)}>
        <div className="flex items-center gap-2">
          {Icon ? <Icon className={cn('h-4 w-4 shrink-0', styles.icon)} /> : null}
          <span className="font-semibold tracking-tight">{title}</span>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children != null && children !== false && (
        <div className={cn('p-3 sm:p-4', contentClassName)}>{children}</div>
      )}
    </section>
  );
});

export function FormField({ label, children, className, required, hint }) {
  return (
    <div className={cn('space-y-1', className)}>
      {label ? (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-slate-700 tracking-tight">
            {label}
            {required ? <span className="text-red-500 ml-0.5 font-bold">*</span> : null}
          </label>
          {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function PageStack({ children, className }) {
  return <div className={cn('space-y-3 sm:space-y-4 max-w-[1600px] mx-auto p-3 sm:p-5', className)}>{children}</div>;
}
