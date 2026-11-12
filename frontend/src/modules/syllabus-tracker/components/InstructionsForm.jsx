import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const PRESET_INSTRUCTIONS = [
  '1. All questions are compulsory.\n2. Marks are indicated against each question.\n3. Draw neat and labelled diagrams wherever necessary.',
  '1. This question paper contains Section A, B, C and D.\n2. Section A consists of objective MCQs.\n3. Use of calculator or electronic gadgets is strictly prohibited.',
  '1. Read the questions carefully before answering.\n2. Internal choice has been provided in select questions.\n3. 15 minutes reading time is allotted before writing begins.',
];

export function InstructionsForm({ instructions = '', onChange, onBack, onNext }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 4: General Exam Instructions</h3>
          <p className="text-xs text-slate-500">Printed right below the student name/roll number header box.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_INSTRUCTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset)}
              className="px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> CBSE Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <textarea
        rows={7}
        value={instructions}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter general instructions for candidates..."
        className="w-full rounded-xl border border-slate-200 p-4 text-xs font-medium text-slate-800 leading-relaxed focus:border-indigo-500 focus:outline-none"
      />

      <div className="flex justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Questions
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
        >
          Continue to Live Preview &amp; Export <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
