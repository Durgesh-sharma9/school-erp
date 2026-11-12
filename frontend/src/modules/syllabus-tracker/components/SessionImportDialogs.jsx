import React, { useState, useEffect } from 'react';
import { Download, Loader2, Layers, BookOpen, GraduationCap, Users, X, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../services/syllabusApi';

export function ImportDataButton({ importType = 'structure', label = 'Import from Past Session', onSuccess }) {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sourceSessionId, setSourceSessionId] = useState('');
  const [targetSessionId, setTargetSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  const loadSessions = async () => {
    try {
      const res = await syllabusApi.listSessions();
      const list = res.sessions || [];
      setSessions(list);
      const active = list.find((s) => s.isActive);
      const nonActive = list.find((s) => !s.isActive);
      if (active) setTargetSessionId(active.id);
      if (nonActive) setSourceSessionId(nonActive.id);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (open) loadSessions();
  }, [open]);

  const handleImport = async () => {
    if (!sourceSessionId || !targetSessionId || sourceSessionId === targetSessionId) {
      return toast.error('Select a source session different from target session');
    }
    try {
      setLoading(true);
      const res = await syllabusApi.importSessionData(importType, { sourceSessionId, targetSessionId });
      toast.success(
        `Imported: ${res.classesCopied || 0} classes, ${res.subjectsCopied || 0} subjects, ${res.chaptersCopied || 0} chapters`,
      );
      setOpen(false);
      onSuccess?.(res);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">{label}</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Source Session</label>
                <select
                  value={sourceSessionId}
                  onChange={(e) => setSourceSessionId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="">Select source session...</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.isArchived ? '(Archived)' : s.isActive ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Target Session</label>
                <select
                  value={targetSessionId}
                  onChange={(e) => setTargetSessionId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="">Select target session...</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.isActive ? '(Active)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Run Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PostSessionImportDialog({ open, onOpenChange, targetSession, sessions = [], onSuccess }) {
  const [sourceSessionId, setSourceSessionId] = useState('');
  const [selectedType, setSelectedType] = useState('structure');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && targetSession) {
      const other = sessions.find((s) => s.id !== targetSession.id);
      setSourceSessionId(other?.id || '');
    }
  }, [open, targetSession, sessions]);

  if (!open || !targetSession) return null;

  const importOptions = [
    { id: 'structure', title: 'Complete Academic Structure', desc: 'Classes, Subjects, Teacher Mappings & Full Syllabus Chapters', icon: Layers },
    { id: 'classes', title: 'Classes Only', desc: 'Import class & section structure into this session', icon: GraduationCap },
    { id: 'subjects', title: 'Classes & Subjects', desc: 'Copy subject assignments per class', icon: BookOpen },
    { id: 'teachers', title: 'Teacher Assignments', desc: 'Map faculty onto matching class-subjects', icon: Users },
    { id: 'syllabus', title: 'Full Syllabus & Chapters', desc: 'Import chapter plans cleanly into matching subjects', icon: BookOpen },
  ];

  const handleRun = async () => {
    if (!sourceSessionId) return toast.error('Choose a past session to import from');
    try {
      setLoading(true);
      const res = await syllabusApi.importSessionData(selectedType, {
        sourceSessionId,
        targetSessionId: targetSession.id,
      });
      toast.success(
        `Session ${targetSession.name} updated: +${res.classesCopied} classes, +${res.subjectsCopied} subjects, +${res.chaptersCopied} chapters`,
      );
      onOpenChange(false);
      onSuccess?.(res);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 to-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Import Data into {targetSession.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Carry over structure or syllabus from a previous academic session.</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Source Session</label>
            <select
              value={sourceSessionId}
              onChange={(e) => setSourceSessionId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
            >
              <option value="">Choose previous session...</option>
              {sessions
                .filter((s) => s.id !== targetSession.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s._count?.chapters || 0} chapters, {s._count?.classes || 0} classes)
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">What would you like to import?</label>
            {importOptions.map((opt) => {
              const Icon = opt.icon;
              const active = selectedType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedType(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    active ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-800">{opt.title}</div>
                    <div className="text-[11px] text-slate-500">{opt.desc}</div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
          >
            Skip / Close
          </button>
          <button
            type="button"
            onClick={handleRun}
            disabled={loading || !sourceSessionId}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Start Import
          </button>
        </div>
      </div>
    </div>
  );
}
