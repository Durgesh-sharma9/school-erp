import React from 'react';
import { cn } from '../../utils/cn';

const TONE_STYLES = {
  orange: {
    header: 'bg-gradient-to-r from-[#FFF5EB] via-[#FFF8F2] to-[#FFEBD9] border-b border-orange-200/80 text-orange-950',
    body: 'bg-white',
    card: 'border-orange-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.03)] bg-white',
    icon: 'text-orange-600',
    innerBox: 'border border-orange-200/70 bg-gradient-to-b from-[#FFFDF9] to-[#FFF6ED]',
  },
  blue: {
    header: 'bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-blue-50/80 border-b border-blue-100 text-blue-950',
    body: 'bg-white',
    card: 'border-blue-200/70 shadow-xs bg-white',
    icon: 'text-blue-600',
    innerBox: 'border border-blue-100/80 bg-gradient-to-b from-[#F8FAFF] to-[#EFF4FE]',
  },
  indigo: {
    header: 'bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-indigo-50/80 border-b border-indigo-100 text-indigo-950',
    body: 'bg-white',
    card: 'border-indigo-200/70 shadow-xs bg-white',
    icon: 'text-indigo-600',
    innerBox: 'border border-indigo-100/80 bg-gradient-to-b from-[#F8FAFF] to-[#EEF2FF]',
  },
  green: {
    header: 'bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-emerald-50/80 border-b border-emerald-100 text-emerald-950',
    body: 'bg-white',
    card: 'border-emerald-200/70 shadow-xs bg-white',
    icon: 'text-emerald-600',
    innerBox: 'border border-emerald-100/80 bg-gradient-to-b from-[#F2FBF7] to-[#E6F8F0]',
  },
  purple: {
    header: 'bg-gradient-to-r from-violet-50/80 via-purple-50/40 to-violet-50/80 border-b border-purple-100 text-purple-950',
    body: 'bg-white',
    card: 'border-purple-200/70 shadow-xs bg-white',
    icon: 'text-purple-600',
    innerBox: 'border border-purple-100/80 bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF]',
  },
  yellow: {
    header: 'bg-gradient-to-r from-amber-50/80 via-yellow-50/40 to-amber-50/80 border-b border-amber-100 text-amber-950',
    body: 'bg-white',
    card: 'border-amber-200/70 shadow-xs bg-white',
    icon: 'text-amber-600',
    innerBox: 'border border-amber-100/80 bg-gradient-to-b from-[#FFFDF0] to-[#FEF3C7]',
  },
  rose: {
    header: 'bg-gradient-to-r from-rose-50/80 via-pink-50/40 to-rose-50/80 border-b border-rose-100 text-rose-950',
    body: 'bg-white',
    card: 'border-rose-200/70 shadow-xs bg-white',
    icon: 'text-rose-600',
    innerBox: 'border border-rose-100/80 bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E6]',
  },
};

export function PageHeader({ title, description, children, badge }) {
  return (
    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full max-w-full overflow-x-hidden">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl break-words leading-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-[#C2410C] border border-orange-200 shadow-2xs">
              {badge}
            </span>
          )}
        </div>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500 font-medium break-words leading-normal">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2 shrink-0">{children}</div> : null}
    </div>
  );
}

export const ErpSection = React.forwardRef(function ErpSection(
  { title, icon: Icon, tone = 'orange', children, action, className, contentClassName, ...props },
  ref
) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.orange;

  return (
    <section
      ref={ref}
      className={cn('rounded-2xl border overflow-hidden transition-all duration-200', styles.card, className)}
      {...props}
    >
      <div className={cn('flex items-center justify-between gap-3 px-5 py-3 text-xs sm:text-sm font-bold tracking-tight rounded-t-2xl', styles.header)}>
        <div className="flex items-center gap-2">
          {Icon ? <Icon className={cn('h-4 w-4 shrink-0', styles.icon)} /> : null}
          <span className="font-bold tracking-tight">{title}</span>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children != null && children !== false && (
        <div className={cn('p-5 sm:p-6', styles.body, contentClassName)}>{children}</div>
      )}
    </section>
  );
});

export function FormField({ label, children, className, required, hint }) {
  return (
    <div className={cn('space-y-1', className)}>
      {label ? (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-700 tracking-tight">
            {label}
            {required ? <span className="text-rose-500 ml-0.5 font-bold">*</span> : null}
          </label>
          {hint && <span className="text-[10px] text-slate-400 font-medium">{hint}</span>}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function ErpInnerBox({ children, tone = 'blue', className }) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.blue;
  return (
    <div className={cn("rounded-2xl p-4 sm:p-5 shadow-2xs", styles.innerBox, className)}>
      {children}
    </div>
  );
}

export function TestMasterEmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("border border-dashed border-orange-300/80 bg-gradient-to-b from-[#FFFDF9] to-[#FFF6ED] rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xs", className)}>
      {Icon ? (
        <div className="w-12 h-12 rounded-2xl bg-orange-100/90 text-orange-600 flex items-center justify-center mb-3 shadow-2xs">
          <Icon className="w-6 h-6" />
        </div>
      ) : null}
      <h4 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h4>
      {description && <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm leading-relaxed">{description}</p>}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function PageStack({ children, className }) {
  return <div className={cn('space-y-4 max-w-[1600px] mx-auto p-3 sm:p-6', className)}>{children}</div>;
}
