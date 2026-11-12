import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, Sigma } from 'lucide-react';
import { MathEquationDialog } from './MathEquationDialog';

export function RichTextField({
  value = '',
  onChange,
  placeholder = 'Type question or prompt here...',
  fontFamily = 'Times New Roman',
  fontSize = '11pt',
  color = '#0f172a',
}) {
  const editorRef = useRef(null);
  const [mathOpen, setMathOpen] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, null);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInsertMath = (latex) => {
    const token = `$${latex}$ `;
    const current = editorRef.current ? editorRef.current.innerHTML : value || '';
    const updated = current + (current && !current.endsWith(' ') ? ' ' : '') + token;
    if (editorRef.current) editorRef.current.innerHTML = updated;
    onChange(updated);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
      <div className="px-2.5 py-1.5 border-b border-slate-100 bg-slate-50/80 flex flex-wrap items-center gap-1">
        <button type="button" onClick={() => exec('bold')} title="Bold" className="p-1.5 rounded-lg hover:bg-white text-slate-600"><Bold className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('italic')} title="Italic" className="p-1.5 rounded-lg hover:bg-white text-slate-600"><Italic className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('underline')} title="Underline" className="p-1.5 rounded-lg hover:bg-white text-slate-600"><Underline className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('strikeThrough')} title="Strikethrough" className="p-1.5 rounded-lg hover:bg-white text-slate-600"><Strikethrough className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet List" className="p-1.5 rounded-lg hover:bg-white text-slate-600"><List className="w-3.5 h-3.5" /></button>
        <button type="button" onClick={() => exec('superscript')} title="Superscript" className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold text-slate-600">x²</button>
        <button type="button" onClick={() => exec('subscript')} title="Subscript" className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold text-slate-600">x₂</button>
        <div className="h-4 w-px bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => setMathOpen(true)}
          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold inline-flex items-center gap-1"
        >
          <Sigma className="w-3.5 h-3.5" />
          Math LaTeX
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        style={{ fontFamily, fontSize, color }}
        className="min-h-[82px] px-3 py-2.5 text-sm outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
      />

      <MathEquationDialog open={mathOpen} onOpenChange={setMathOpen} onInsert={handleInsertMath} />
    </div>
  );
}
