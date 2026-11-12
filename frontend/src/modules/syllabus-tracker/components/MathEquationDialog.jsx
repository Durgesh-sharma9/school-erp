import React, { useState, useMemo, useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Sigma, Check, AlertCircle, X } from 'lucide-react';

const SYMBOL_GROUPS = [
  {
    label: 'Fractions & Roots',
    items: [
      { label: 'Fraction', symbol: 'a/b', snippet: '\\frac{a}{b}' },
      { label: 'Square Root', symbol: '√x', snippet: '\\sqrt{x}' },
      { label: 'N-th Root', symbol: 'ⁿ√x', snippet: '\\sqrt[n]{x}' },
      { label: 'dy/dx', symbol: 'dy/dx', snippet: '\\frac{dy}{dx}' },
    ],
  },
  {
    label: 'Powers & Indices',
    items: [
      { label: 'Square', symbol: 'x²', snippet: 'x^{2}' },
      { label: 'Subscript', symbol: 'x₁', snippet: 'x_{1}' },
      { label: 'Mix', symbol: 'x₁²', snippet: 'x_{1}^{2}' },
      { label: 'Exp', symbol: 'eˣ', snippet: 'e^{x}' },
    ],
  },
  {
    label: 'Operators',
    items: [
      { label: 'Plus/Minus', symbol: '±', snippet: '\\pm' },
      { label: 'Multiply', symbol: '×', snippet: '\\times' },
      { label: 'Divide', symbol: '÷', snippet: '\\div' },
      { label: 'Degree', symbol: '°', snippet: '^{\\circ}' },
      { label: 'Not Equal', symbol: '≠', snippet: '\\neq' },
      { label: 'LEQ', symbol: '≤', snippet: '\\le' },
      { label: 'GEQ', symbol: '≥', snippet: '\\ge' },
      { label: 'Infinity', symbol: '∞', snippet: '\\infty' },
    ],
  },
  {
    label: 'Greek & Trig',
    items: [
      { label: 'pi', symbol: 'π', snippet: '\\pi' },
      { label: 'theta', symbol: 'θ', snippet: '\\theta' },
      { label: 'alpha', symbol: 'α', snippet: '\\alpha' },
      { label: 'beta', symbol: 'β', snippet: '\\beta' },
      { label: 'Delta', symbol: 'Δ', snippet: '\\Delta' },
      { label: 'sin', symbol: 'sin θ', snippet: '\\sin\\theta' },
      { label: 'cos', symbol: 'cos θ', snippet: '\\cos\\theta' },
    ],
  },
  {
    label: 'Calculus & Sums',
    items: [
      { label: 'Integral', symbol: '∫', snippet: '\\int_{a}^{b} f(x)\\,dx' },
      { label: 'Sum', symbol: '∑', snippet: '\\sum_{i=1}^{n} x_i' },
      { label: 'Limit', symbol: 'lim', snippet: '\\lim_{x \\to 0}' },
      { label: 'Vector', symbol: 'v⃗', snippet: '\\vec{v}' },
    ],
  },
];

export function MathEquationDialog({ open, onOpenChange, onInsert }) {
  const [latex, setLatex] = useState('\\frac{a}{b}');
  const [activeGroup, setActiveGroup] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  const renderedPreview = useMemo(() => {
    if (!latex.trim()) return { html: '', error: false };
    try {
      return { html: katex.renderToString(latex, { throwOnError: true, displayMode: true }), error: false };
    } catch {
      try {
        return { html: katex.renderToString(latex, { throwOnError: false, displayMode: true }), error: true };
      } catch {
        return { html: latex, error: true };
      }
    }
  }, [latex]);

  if (!open) return null;

  const insertSnippet = (snippet) => {
    setLatex((prev) => `${prev ? `${prev} ` : ''}${snippet}`);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sigma className="w-4 h-4 text-indigo-600" />
            Insert Math Equation (LaTeX / KaTeX)
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {SYMBOL_GROUPS.map((g, idx) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setActiveGroup(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  activeGroup === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SYMBOL_GROUPS[activeGroup]?.items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => insertSnippet(item.snippet)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-xs font-semibold text-slate-700"
                title={item.snippet}
              >
                {item.symbol}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">LaTeX Expression</label>
            <input
              ref={inputRef}
              type="text"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="e.g. \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 min-h-[72px] flex items-center justify-center overflow-x-auto">
            {renderedPreview.error ? (
              <div className="flex items-center gap-1.5 text-xs text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span>Check LaTeX syntax</span>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderedPreview.html }} />
            )}
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (latex.trim()) {
                onInsert(latex.trim());
                onOpenChange(false);
              }
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  );
}
