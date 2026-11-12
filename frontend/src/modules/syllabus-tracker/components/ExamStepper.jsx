import React from 'react';
import { FileText, Layers, HelpCircle, ScrollText, CheckCircle2, Eye, Clock, Award } from 'lucide-react';

export const EXAM_STEPS = [
  { id: 1, title: 'Paper Setup', shortTitle: 'Setup', icon: FileText },
  { id: 2, title: 'Sections & Marks', shortTitle: 'Sections', icon: Layers },
  { id: 3, title: 'Question Builder', shortTitle: 'Questions', icon: HelpCircle },
  { id: 4, title: 'Instructions', shortTitle: 'Instructions', icon: ScrollText },
  { id: 5, title: 'Review & Export', shortTitle: 'Export', icon: CheckCircle2 },
];

export function ExamStepper({ currentStep, maxStepReached = currentStep, onStepClick, onOpenPreview, paperDetails }) {
  const pct = Math.round(((currentStep - 1) / (EXAM_STEPS.length - 1)) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Step {currentStep} of {EXAM_STEPS.length}
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {paperDetails?.examName || 'New Examination Paper'}
              {paperDetails?.subjectName ? ` • ${paperDetails.subjectName}` : ''}
              {paperDetails?.className ? ` (${paperDetails.className})` : ''}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {paperDetails?.totalMarks ? (
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {paperDetails.totalMarks} Marks
            </span>
          ) : null}
          {paperDetails?.duration ? (
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {paperDetails.duration} min
            </span>
          ) : null}
          {onOpenPreview && (
            <button
              type="button"
              onClick={onOpenPreview}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" /> Quick Preview
            </button>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {EXAM_STEPS.map((st) => {
          const Icon = st.icon;
          const active = st.id === currentStep;
          const reached = st.id <= maxStepReached;
          return (
            <button
              key={st.id}
              type="button"
              disabled={!reached && st.id > currentStep + 1}
              onClick={() => onStepClick?.(st.id)}
              className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                active
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold'
                  : reached
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800 hover:bg-emerald-50'
                    : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[11px] truncate hidden sm:inline">{st.title}</span>
              <span className="text-[11px] truncate sm:hidden">{st.shortTitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
