import React from 'react';
import { Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const SEGMENT_TYPES = [
  { value: 'MCQ', label: 'Multiple Choice Questions (MCQ)' },
  { value: 'FILL_BLANK', label: 'Fill in the Blanks' },
  { value: 'TRUE_FALSE', label: 'True / False' },
  { value: 'MATCHING', label: 'Match the Following' },
  { value: 'ASSERTION_REASONING', label: 'Assertion & Reasoning' },
  { value: 'PASSAGE', label: 'Case Study / Passage Based' },
  { value: 'SHORT_ANSWER', label: 'Short Answer Questions' },
  { value: 'LONG_ANSWER', label: 'Long Answer Questions' },
  { value: 'CUSTOM', label: 'Custom Question Block' },
];

export function SectionSegmentForm({ totalMarks = 0, sections = [], onChange, onBack, onNext }) {
  const allocatedMarks = sections.reduce((secAcc, sec) => {
    const segSum = (sec.segments || []).reduce(
      (sAcc, seg) => sAcc + Number(seg.questionCount || 0) * Number(seg.marksPerQuestion || 0),
      0,
    );
    return secAcc + segSum;
  }, 0);

  const remaining = Number(totalMarks || 0) - allocatedMarks;

  const syncSectionQuestions = (sec) => {
    const existing = sec.questions || [];
    const targetList = [];
    let cursor = 0;

    (sec.segments || []).forEach((seg) => {
      const count = Math.max(0, Number(seg.questionCount || 0));
      const marks = Math.max(0.5, Number(seg.marksPerQuestion || 1));
      for (let i = 0; i < count; i++) {
        const prev = existing[cursor] || {};
        targetList.push({
          segmentType: seg.type,
          segmentLabel: seg.label,
          marks,
          questionText: prev.questionText || '',
          options:
            seg.type === 'MCQ'
              ? prev.options?.length
                ? prev.options
                : Array.from({ length: 4 }, (_, idx) => ({ text: '', isCorrect: idx === 0 }))
              : seg.type === 'TRUE_FALSE'
                ? prev.options?.length
                  ? prev.options
                  : [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }]
                : prev.options || [],
          matchingPairs:
            seg.type === 'MATCHING'
              ? prev.matchingPairs?.length
                ? prev.matchingPairs
                : [{ left: '', right: '' }, { left: '', right: '' }]
              : prev.matchingPairs || [],
          assertion: prev.assertion || '',
          reason: prev.reason || '',
          passageText: prev.passageText || '',
          subQuestions:
            seg.type === 'PASSAGE'
              ? prev.subQuestions?.length
                ? prev.subQuestions
                : [{ questionText: '', marks: Math.max(1, Math.floor(marks / 2)) }]
              : prev.subQuestions || [],
          imageUrl: prev.imageUrl || '',
          subject: prev.subject || '',
          hint: prev.hint || '',
          alternatives: prev.alternatives || [],
        });
        cursor += 1;
      }
    });

    return { ...sec, questions: targetList };
  };

  const addSection = () => {
    const nextLetter = String.fromCharCode(65 + sections.length);
    const nextSec = syncSectionQuestions({
      sectionTitle: `Section ${nextLetter}`,
      sectionDescription: '',
      segments: [{ label: 'Short Answer Questions', type: 'SHORT_ANSWER', questionCount: 2, marksPerQuestion: 2 }],
      questions: [],
    });
    onChange([...sections, nextSec]);
  };

  const updateSection = (secIdx, patch) => {
    const next = sections.map((s, idx) => (idx === secIdx ? syncSectionQuestions({ ...s, ...patch }) : s));
    onChange(next);
  };

  const removeSection = (secIdx) => {
    onChange(sections.filter((_, idx) => idx !== secIdx));
  };

  const addSegment = (secIdx) => {
    const sec = sections[secIdx];
    const nextSegments = [
      ...(sec.segments || []),
      { label: 'Multiple Choice Questions', type: 'MCQ', questionCount: 2, marksPerQuestion: 1 },
    ];
    updateSection(secIdx, { segments: nextSegments });
  };

  const updateSegment = (secIdx, segIdx, patch) => {
    const sec = sections[secIdx];
    const nextSegments = (sec.segments || []).map((seg, i) => (i === segIdx ? { ...seg, ...patch } : seg));
    updateSection(secIdx, { segments: nextSegments });
  };

  const removeSegment = (secIdx, segIdx) => {
    const sec = sections[secIdx];
    const nextSegments = (sec.segments || []).filter((_, i) => i !== segIdx);
    updateSection(secIdx, { segments: nextSegments });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 2: Sections &amp; Question Marks Distribution</h3>
          <p className="text-xs text-slate-500">Define Sections (A, B, C...) and question types; slots auto-sync into Question Builder.</p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 ${
              remaining === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {remaining === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            Allocated: {allocatedMarks} / {totalMarks} Marks
            {remaining !== 0 && ` (${remaining > 0 ? `${remaining} left` : `${Math.abs(remaining)} over`})`}
          </div>
          <button
            type="button"
            onClick={addSection}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Section
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 space-y-3">
          <Layers className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No Sections Defined Yet</div>
          <p className="text-xs text-slate-500">Add Section A to specify question segments and marks.</p>
          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Section A
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((sec, secIdx) => {
            const secMarks = (sec.segments || []).reduce(
              (acc, sg) => acc + Number(sg.questionCount || 0) * Number(sg.marksPerQuestion || 0),
              0,
            );
            return (
              <div key={secIdx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={sec.sectionTitle}
                      onChange={(e) => updateSection(secIdx, { sectionTitle: e.target.value })}
                      placeholder="Section A"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 w-40"
                    />
                    <input
                      type="text"
                      value={sec.sectionDescription || ''}
                      onChange={(e) => updateSection(secIdx, { sectionDescription: e.target.value })}
                      placeholder="Section description / subtitle (e.g., Objective Questions)"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs flex-1 min-w-[200px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
                      {secMarks} Marks
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSection(secIdx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(sec.segments || []).map((seg, segIdx) => (
                    <div key={segIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="sm:col-span-4">
                        <select
                          value={seg.type}
                          onChange={(e) => {
                            const found = SEGMENT_TYPES.find((t) => t.value === e.target.value);
                            updateSegment(secIdx, segIdx, { type: e.target.value, label: found?.label || seg.label });
                          }}
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold"
                        >
                          {SEGMENT_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={seg.label || ''}
                          onChange={(e) => updateSegment(secIdx, segIdx, { label: e.target.value })}
                          placeholder="Display heading"
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 font-bold block">Questions</label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={seg.questionCount}
                          onChange={(e) => updateSegment(secIdx, segIdx, { questionCount: Math.max(1, Number(e.target.value)) })}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 font-bold block">Marks / Q</label>
                        <input
                          type="number"
                          min="0.5"
                          max="20"
                          step="0.5"
                          value={seg.marksPerQuestion}
                          onChange={(e) => updateSegment(secIdx, segIdx, { marksPerQuestion: Math.max(0.5, Number(e.target.value)) })}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeSegment(secIdx, segIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                          title="Remove Segment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addSegment(secIdx)}
                    className="px-3 py-1.5 rounded-xl border border-dashed border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question Segment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Paper Setup
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={sections.length === 0}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          Continue to Question Builder <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
