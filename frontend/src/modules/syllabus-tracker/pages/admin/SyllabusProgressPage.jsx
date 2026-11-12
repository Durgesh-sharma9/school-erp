import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Settings,
  HelpCircle,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Zap,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { SyllabusSessionBanner } from '../../components/SyllabusSessionBanner';

export function SyllabusProgressPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('CLASS'); // CLASS | SUBJECT | TEACHER
  const [velocityFilter, setVelocityFilter] = useState('ALL'); // ALL | BEHIND | ON_PACE | AHEAD
  const [termTag, setTermTag] = useState('ALL');
  const [search, setSearch] = useState('');

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [tolerance, setTolerance] = useState({ onPaceMinDelta: -5, aheadMinDelta: 5 });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await syllabusApi.getProgressionAnalytics({ termTag });
      setData(res);
      if (res.pacingSettings) setTolerance(res.pacingSettings);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const sync = () => loadData();
    window.addEventListener('syllabus-session-changed', sync);
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, [termTag]);

  const saveTolerance = async (e) => {
    e.preventDefault();
    try {
      await syllabusApi.updatePacingSettings(tolerance);
      toast.success('Pacing tolerance thresholds updated');
      setSettingsOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const velocityBadge = (status, delta) => {
    const sign = delta >= 0 ? `+${delta}%` : `${delta}%`;
    if (status === 'AHEAD') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
          <Zap className="w-3 h-3" /> Ahead ({sign})
        </span>
      );
    }
    if (status === 'ON_PACE') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> On Pace ({sign})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Behind ({sign})
      </span>
    );
  };

  const filterList = (list = []) =>
    list.filter((item) => {
      if (velocityFilter !== 'ALL' && item.velocityStatus !== velocityFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${item.name} ${(item.subjects || []).map((s) => s.subjectName || s).join(' ')} ${(item.classes || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

  const activeList =
    tab === 'CLASS'
      ? filterList(data?.classProgress)
      : tab === 'SUBJECT'
        ? filterList(data?.subjectProgress)
        : filterList(data?.teacherProgress);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Curriculum Pacing &amp; Progress Analytics</h1>
              <SyllabusSessionBanner onSessionReload={loadData} />
            </div>
            <p className="text-xs text-slate-500">Compare real-time chapter completion against elapsed working days across Classes, Subjects &amp; Faculty</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" /> Pacing Guide
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-slate-600" /> Threshold Settings
          </button>
        </div>
      </div>

      {/* Global Timeline Target Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Global Target Pace (Elapsed Working Days): </span>
            <span className="text-indigo-700 text-sm font-black">{data?.targetPercentage || 0}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>School Actual: {data?.overallActualPercentage || 0}%</span>
            {data?.overallVelocity && velocityBadge(data.overallVelocity.velocityStatus, data.overallVelocity.paceDelta)}
          </div>
        </div>
        <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${data?.overallActualPercentage || 0}%` }} />
          <div
            className="absolute top-0 bottom-0 w-1 bg-rose-500"
            style={{ left: `${Math.min(99, data?.targetPercentage || 0)}%` }}
            title={`Target Pace: ${data?.targetPercentage || 0}%`}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-xs font-bold">
            {[
              { id: 'CLASS', label: 'By Class' },
              { id: 'SUBJECT', label: 'By Subject' },
              { id: 'TEACHER', label: 'By Teacher' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg ${tab === t.id ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-xs font-bold">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'BEHIND', label: 'Behind' },
              { id: 'ON_PACE', label: 'On Pace' },
              { id: 'AHEAD', label: 'Ahead' },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVelocityFilter(v.id)}
                className={`px-2.5 py-1.5 rounded-lg ${velocityFilter === v.id ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select value={termTag} onChange={(e) => setTermTag(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold">
            <option value="ALL">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
          </select>
          <div className="relative w-52">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Cards / Table */}
      {loading && !data ? (
        <div className="p-12 text-center text-sm text-slate-400">Calculating curriculum velocity...</div>
      ) : activeList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No progression records match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{item.name}</h3>
                  <p className="text-[11px] text-slate-500">
                    {item.completed || item.completedChapters || 0} / {item.total || item.totalChapters || 0} Chapters Complete
                  </p>
                </div>
                {velocityBadge(item.velocityStatus, item.paceDelta)}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Completion: {item.actualPercentage}%</span>
                  <span className="text-slate-400">Target: {data?.targetPercentage || 0}%</span>
                </div>
                <div className="relative h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-indigo-600" style={{ width: `${item.actualPercentage}%` }} />
                </div>
              </div>

              {tab === 'CLASS' && Array.isArray(item.subjects) && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {item.subjects.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{sub.subjectName} <span className="text-slate-400">({sub.teacherName || 'Unassigned'})</span></span>
                      <span className="font-bold text-slate-800">{sub.actualPercentage}%</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'TEACHER' && (
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  Classes: {(item.classes || []).join(', ')} • Subjects: {(item.subjects || []).join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tolerance Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={saveTolerance} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Pacing Tolerance Settings</h3>
              <button type="button" onClick={() => setSettingsOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">On-Pace Minimum Delta (% vs Target)</label>
              <input type="number" max="0" min="-40" value={tolerance.onPaceMinDelta} onChange={(e) => setTolerance((t) => ({ ...t, onPaceMinDelta: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold" />
              <p className="text-[10px] text-slate-400 mt-0.5">Default: -5% (more behind than this triggers Behind status)</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ahead Minimum Delta (% above Target)</label>
              <input type="number" min="1" max="50" value={tolerance.aheadMinDelta} onChange={(e) => setTolerance((t) => ({ ...t, aheadMinDelta: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSettingsOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Pacing Guide Modal */}
      {guideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">How Curriculum Velocity Works</h3>
              <button onClick={() => setGuideOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target % equals the percentage of <strong>effective teaching days elapsed</strong> in your active Academic Timeline (excluding Sundays, Indian festivals, and school vacations).
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"><strong>Ahead:</strong> Actual % ≥ Target % + {tolerance.aheadMinDelta}%</div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200"><strong>On Pace:</strong> Within {tolerance.onPaceMinDelta}% to +{tolerance.aheadMinDelta}% of Target</div>
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200"><strong>Behind:</strong> Actual % &lt; Target % {tolerance.onPaceMinDelta}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
