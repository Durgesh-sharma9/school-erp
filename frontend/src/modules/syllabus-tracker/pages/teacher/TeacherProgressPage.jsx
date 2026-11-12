import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';

export function TeacherProgressPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState('ALL');
  const [velocityFilter, setVelocityFilter] = useState('ALL');

  useEffect(() => {
    syllabusApi
      .getTeacherProgression()
      .then(setData)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading && !data) {
    return <div className="p-8 text-center text-sm text-slate-400">Calculating your curriculum velocity...</div>;
  }

  const classes = data?.classes || [];
  const visibleClasses = classes.filter((c) => selectedClassId === 'ALL' || c.id === selectedClassId);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">My Curriculum Velocity &amp; Pacing</h1>
          <p className="text-xs text-slate-500">Compare your class-wise &amp; subject completion speed against elapsed school working days</p>
        </div>
      </div>

      {/* Global Timeline vs My Actual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Target Timeline Pace: <strong className="text-indigo-700">{data?.targetPercentage || 0}%</strong></span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>My Overall Completion: <strong>{data?.overallPercentage || 0}%</strong></span>
            {data?.overallVelocity && velocityBadge(data.overallVelocity.velocityStatus, data.overallVelocity.paceDelta)}
          </div>
        </div>
        <div className="relative h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${data?.overallPercentage || 0}%` }} />
          <div className="absolute top-0 bottom-0 w-1 bg-rose-500" style={{ left: `${Math.min(99, data?.targetPercentage || 0)}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedClassId('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${selectedClassId === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            All Classes
          </button>
          {classes.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClassId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${selectedClassId === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-white text-xs font-bold">
          {['ALL', 'BEHIND', 'ON_PACE', 'AHEAD'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVelocityFilter(v)}
              className={`px-2.5 py-1 rounded-lg ${velocityFilter === v ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
            >
              {v.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleClasses.flatMap((c) =>
          (c.subjects || [])
            .filter((sub) => velocityFilter === 'ALL' || sub.velocityStatus === velocityFilter)
            .map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600">{c.label}</div>
                    <h3 className="text-sm font-extrabold text-slate-900">{sub.subjectName}</h3>
                  </div>
                  {velocityBadge(sub.velocityStatus, sub.paceDelta)}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">{sub.completionPercentage}% Completed ({sub.completedCount}/{sub.chapterCount} ch)</span>
                    <span className="text-slate-400">Target: {data?.targetPercentage || 0}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${sub.completionPercentage}%` }} />
                  </div>
                </div>
              </div>
            )),
        )}
      </div>
    </div>
  );
}
