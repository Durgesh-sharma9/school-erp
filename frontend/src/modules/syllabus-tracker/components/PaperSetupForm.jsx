import React from 'react';
import { Columns, FileText, ArrowRight, Palette } from 'lucide-react';

const FONT_OPTIONS = ['Times New Roman', 'Arial', 'Georgia', 'Calibri', 'Verdana'];
const SIZE_OPTIONS = ['9pt', '10pt', '11pt', '12pt', '14pt'];

export function PaperSetupForm({
  classes = [],
  examNames = [],
  classId,
  subjectId,
  examName,
  examDate,
  duration,
  totalMarks,
  templateType,
  styleFontFamily,
  styleFontSize,
  styleColor,
  showTeacherName,
  onChange,
  onNext,
}) {
  const selectedClass = classes.find((c) => c.id === classId);
  const subjectsForClass = selectedClass?.subjects || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Step 1: Examination Paper Metadata &amp; Print Layout</h3>
        <p className="text-xs text-slate-500">Select class &amp; subject, configure marks/duration, and choose Single or 2-Column format.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
          <select
            value={classId}
            onChange={(e) => {
              const cls = classes.find((c) => c.id === e.target.value);
              const firstSub = cls?.subjects?.[0];
              onChange({
                classId: e.target.value,
                className: cls?.label || '',
                subjectId: firstSub?.subjectId || '',
                subjectName: firstSub?.subjectName || '',
              });
            }}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold"
          >
            <option value="">Select Class...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
          <select
            value={subjectId}
            onChange={(e) => {
              const sub = subjectsForClass.find((s) => s.subjectId === e.target.value);
              onChange({ subjectId: e.target.value, subjectName: sub?.subjectName || '' });
            }}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold"
          >
            <option value="">Select Subject...</option>
            {subjectsForClass.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Exam Name *</label>
          <select
            value={examName}
            onChange={(e) => onChange({ examName: e.target.value })}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold"
          >
            <option value="">Select Exam Name...</option>
            {examNames.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => onChange({ examDate: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes) *</label>
          <input
            type="number"
            min="15"
            max="300"
            value={duration}
            onChange={(e) => onChange({ duration: Number(e.target.value) })}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Total Marks *</label>
          <input
            type="number"
            min="1"
            max="200"
            value={totalMarks}
            onChange={(e) => onChange({ totalMarks: Number(e.target.value) })}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
          />
        </div>
      </div>

      {/* Print Layout & Typography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="text-xs font-bold text-slate-800">Page Column Template</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ templateType: 'SINGLE' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                templateType === 'SINGLE' ? 'border-indigo-500 bg-white ring-2 ring-indigo-100' : 'border-slate-200 bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600 mb-1" />
              <div className="text-xs font-bold text-slate-900">Single Column A4</div>
              <div className="text-[11px] text-slate-500">Classic CBSE question booklet format</div>
            </button>
            <button
              type="button"
              onClick={() => onChange({ templateType: 'SPLIT' })}
              className={`p-3 rounded-xl border text-left transition-all ${
                templateType === 'SPLIT' ? 'border-indigo-500 bg-white ring-2 ring-indigo-100' : 'border-slate-200 bg-white/60'
              }`}
            >
              <Columns className="w-4 h-4 text-indigo-600 mb-1" />
              <div className="text-xs font-bold text-slate-900">2-Column Split A4</div>
              <div className="text-[11px] text-slate-500">Paper-saving compact MCQ &amp; Board sheet</div>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Palette className="w-3.5 h-3.5 text-indigo-600" /> Typography &amp; Header Options
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Font</label>
              <select value={styleFontFamily} onChange={(e) => onChange({ styleFontFamily: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Size</label>
              <select value={styleFontSize} onChange={(e) => onChange({ styleFontSize: e.target.value })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs">
                {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Ink Color</label>
              <input type="color" value={styleColor || '#0f172a'} onChange={(e) => onChange({ styleColor: e.target.value })} className="w-full h-8 rounded-lg border border-slate-200 bg-white p-0.5 cursor-pointer" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showTeacherName !== false}
              onChange={(e) => onChange({ showTeacherName: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600"
            />
            Display faculty name in printed question paper header
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-slate-100">
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-2"
        >
          Continue to Sections &amp; Marks <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
