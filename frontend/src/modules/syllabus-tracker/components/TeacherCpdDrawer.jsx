import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, XCircle, Building, Laptop, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../services/syllabusApi';
import { DOMAIN_INFO } from '../constants/cbseCatalog';
import { CpdQuotaProgressBar, DomainStackedProgressBar } from './CpdProgressBars';

export function TeacherCpdDrawer({ open, onOpenChange, teacherId, onAddTrainingClick, onUpdated }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDetail = async () => {
    if (!teacherId) return;
    try {
      setLoading(true);
      const data = await syllabusApi.getTeacherCpdDetail(teacherId);
      setTeacher(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && teacherId) loadDetail();
  }, [open, teacherId]);

  if (!open) return null;

  const handleStatusChange = async (recordId, status) => {
    try {
      await syllabusApi.updateTrainingRecord(recordId, { status });
      toast.success(`Record marked ${status}`);
      await loadDetail();
      onUpdated?.();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm('Delete this training record permanently?')) return;
    try {
      await syllabusApi.deleteTrainingRecord(recordId);
      toast.success('Training record deleted');
      await loadDetail();
      onUpdated?.();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
              {teacher?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{teacher?.name || 'Loading...'}</h3>
                {teacher && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      teacher.complianceStatus === 'COMPLIANT'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : teacher.complianceStatus === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {teacher.complianceStatus.replace('_', ' ')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {teacher?.email || 'No email'} • {teacher?.subjectNames?.join(', ') || 'Faculty'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {teacher && onAddTrainingClick && (
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onAddTrainingClick(teacher.teacherId);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Log Training
              </button>
            )}
            <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-700 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading || !teacher ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading faculty CPD portfolio...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Effective Total (50h Mandate)</span>
                    <span className="text-indigo-700">{teacher.effectiveTotalHours} / 50 hrs</span>
                  </div>
                  <CpdQuotaProgressBar
                    cbseHours={teacher.cbseHours}
                    schoolHours={teacher.schoolHours}
                    effectiveTotalHours={teacher.effectiveTotalHours}
                    showLegend
                  />
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>NPST Domain Split (12 / 24 / 14h)</span>
                    <span>Raw: {teacher.totalRawHours}h</span>
                  </div>
                  <DomainStackedProgressBar
                    domain1Hours={teacher.domain1Hours}
                    domain2Hours={teacher.domain2Hours}
                    domain3Hours={teacher.domain3Hours}
                    totalHours={teacher.totalRawHours}
                    showLegend
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Training Portfolio ({teacher.records?.length || 0} Records)
                </h4>
                {(!teacher.records || teacher.records.length === 0) ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                    No training hours logged for this faculty member yet.
                  </div>
                ) : (
                  teacher.records.map((rec) => {
                    const domInfo = DOMAIN_INFO[rec.domain];
                    return (
                      <div key={rec.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                rec.status === 'VERIFIED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : rec.status === 'REJECTED'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {rec.provider}</span>
                            <span className="flex items-center gap-1"><Laptop className="w-3 h-3" /> {rec.mode}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rec.hours} hrs</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rec.trainingDate}</span>
                            {domInfo && <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${domInfo.badgeClass}`}>{domInfo.shortTitle}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {rec.status === 'SUBMITTED' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(rec.id, 'VERIFIED')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold inline-flex items-center gap-1 hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(rec.id, 'REJECTED')}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold inline-flex items-center gap-1 hover:bg-rose-100"
                              >
                                <XCircle className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(rec.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
