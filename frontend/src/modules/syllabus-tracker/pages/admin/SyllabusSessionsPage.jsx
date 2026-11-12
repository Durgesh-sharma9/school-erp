import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Archive,
  Trash2,
  Edit3,
  Eye,
  Download,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi, getViewingSession, setViewingSession } from '../../services/syllabusApi';
import { PostSessionImportDialog } from '../../components/SessionImportDialogs';

export function SyllabusSessionsPage({ onNavigate }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [setAsActive, setSetAsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editName, setEditName] = useState('');
  const [importTarget, setImportTarget] = useState(null);
  const [viewing, setViewing] = useState(() => getViewingSession());

  const loadSessions = async () => {
    try {
      setLoading(true);
      const res = await syllabusApi.listSessions();
      setSessions(res.sessions || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    const sync = () => setViewing(getViewingSession());
    window.addEventListener('syllabus-session-changed', sync);
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error('Enter session name like 2027-28');
    try {
      setSaving(true);
      const created = await syllabusApi.createSession({ name: newName.trim(), setAsActive });
      toast.success(`Session ${created.name} created!`);
      setCreateOpen(false);
      setNewName('');
      await loadSessions();
      if (sessions.length > 0) setImportTarget(created);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSwitch = async (sess) => {
    try {
      await syllabusApi.switchSession(sess.id);
      setViewingSession(null, null);
      toast.success(`Switched active session to ${sess.name}`);
      await loadSessions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleArchive = async (sess) => {
    try {
      await syllabusApi.archiveSession(sess.id);
      toast.success(sess.isArchived ? `Restored ${sess.name}` : `Archived ${sess.name}`);
      await loadSessions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    try {
      await syllabusApi.updateSession(editTarget.id, { name: editName.trim() });
      toast.success('Session renamed');
      setEditTarget(null);
      await loadSessions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (sess) => {
    if (!window.confirm(`Delete session "${sess.name}" and all its syllabus chapters?`)) return;
    try {
      await syllabusApi.deleteSession(sess.id);
      toast.success('Session deleted');
      await loadSessions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEnterViewMode = (sess) => {
    setViewingSession(null, sess);
    toast.success(`Entered Preview Mode for ${sess.name}`);
    onNavigate?.('/syllabus-dashboard');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Academic Sessions</h1>
            <p className="text-xs text-slate-500">Manage multi-year academic sessions, switch active year, preview archives &amp; import structures</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewing && !viewing.isActive && (
            <button
              type="button"
              onClick={() => setViewingSession(null, null)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Exit View Mode ({viewing.name})
            </button>
          )}
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> New Academic Session
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading academic sessions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((sess) => {
            const isViewing = viewing?.id === sess.id;
            return (
              <div
                key={sess.id}
                className={`rounded-2xl border p-5 bg-white shadow-xs space-y-4 ${
                  sess.isActive ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900">{sess.name}</h3>
                      {sess.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                      {sess.isArchived && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold">
                          Archived
                        </span>
                      )}
                      {isViewing && !sess.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                          Previewing
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Created {new Date(sess.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditTarget(sess);
                        setEditName(sess.name);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Rename Session"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {!sess.isActive && (
                      <button
                        type="button"
                        onClick={() => handleDelete(sess)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div>
                    <div className="text-base font-black text-slate-900">{sess._count?.classes || 0}</div>
                    <div className="text-[10px] font-bold text-slate-500">Classes</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900">{sess._count?.subjects || 0}</div>
                    <div className="text-[10px] font-bold text-slate-500">Subjects</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900">{sess._count?.chapters || 0}</div>
                    <div className="text-[10px] font-bold text-slate-500">Chapters</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900">{sess._count?.academicTerms || 0}</div>
                    <div className="text-[10px] font-bold text-slate-500">Timelines</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {!sess.isActive && (
                    <button
                      type="button"
                      onClick={() => handleSwitch(sess)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEnterViewMode(sess)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Session
                  </button>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImportTarget(sess)}
                      className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Import Data Into
                    </button>
                  )}
                  {!sess.isActive && (
                    <button
                      type="button"
                      onClick={() => handleArchive(sess)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Archive className="w-3.5 h-3.5" /> {sess.isArchived ? 'Unarchive' : 'Archive'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Session Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Academic Session</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Label *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. 2027-28"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={setAsActive} onChange={(e) => setSetAsActive(e.target.checked)} className="rounded" />
              Immediately switch school to this session
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Create Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rename Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRename} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Rename Session</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditTarget(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">Save</button>
            </div>
          </form>
        </div>
      )}

      <PostSessionImportDialog
        open={Boolean(importTarget)}
        onOpenChange={(v) => { if (!v) setImportTarget(null); }}
        targetSession={importTarget}
        sessions={sessions}
        onSuccess={loadSessions}
      />
    </div>
  );
}
