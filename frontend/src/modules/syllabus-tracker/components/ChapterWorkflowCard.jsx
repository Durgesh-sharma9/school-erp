import React from 'react';
import { BookOpen, CheckCircle2, ClipboardCheck, FileText, Loader2 } from 'lucide-react';

export function ChapterWorkflowCard({ chapter, onToggleStep, disabled = false, updating = false }) {
  const {
    id,
    chapterNo,
    name,
    termTag,
    teachingCompleted = false,
    qaCompleted = false,
    copyCheckedCompleted = false,
    completionPercentage = 0,
    status = 'PENDING',
  } = chapter;

  const badgeStyle =
    status === 'COMPLETED'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'IN_PROGRESS'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-slate-50 text-slate-600 border-slate-200';

  const barColor =
    completionPercentage === 100
      ? 'bg-emerald-500'
      : completionPercentage > 0
        ? 'bg-indigo-600'
        : 'bg-slate-300';

  const steps = [
    { key: 'teachingCompleted', label: 'Teaching Done', value: teachingCompleted, icon: BookOpen, activeCls: 'border-indigo-300 bg-indigo-50 text-indigo-800' },
    { key: 'qaCompleted', label: 'Q&A Done', value: qaCompleted, icon: FileText, activeCls: 'border-sky-300 bg-sky-50 text-sky-800' },
    { key: 'copyCheckedCompleted', label: 'Copy Checked', value: copyCheckedCompleted, icon: ClipboardCheck, activeCls: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-indigo-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
              Ch {chapterNo || '-'}
            </span>
            {termTag && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {termTag}
              </span>
            )}
            <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {updating && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyle}`}>
            {completionPercentage === 100 && <CheckCircle2 className="w-3 h-3" />}
            {completionPercentage}% • {status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full transition-all duration-300 ${barColor}`} style={{ width: `${completionPercentage}%` }} />
      </div>

      {/* 3-Step Workflow Toggles */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <button
              key={st.key}
              type="button"
              disabled={disabled || updating}
              onClick={() => onToggleStep?.(id, st.key, !st.value)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                st.value
                  ? st.activeCls
                  : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                {st.label}
              </span>
              <span
                className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold ${
                  st.value ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-transparent'
                }`}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
