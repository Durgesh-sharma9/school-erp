import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Sun,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Flag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function AcademicTimelinePage() {
  const [terms, setTerms] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  // Create form
  const [form, setForm] = useState({
    name: 'Academic Session 2026-27',
    startDate: '2026-04-01',
    endDate: '2027-03-20',
    weeklyHolidays: [0],
    includeIndianHolidays: true,
  });

  // Vacation modal
  const [vacForm, setVacForm] = useState({ name: '', startDate: '', endDate: '' });
  const [vacOpen, setVacOpen] = useState(false);

  // Calendar view state
  const [viewMode, setViewMode] = useState('YEAR'); // MONTH | YEAR
  const [activeMonthKey, setActiveMonthKey] = useState('');
  const [dayModal, setDayModal] = useState(null);
  const [customHolidayName, setCustomHolidayName] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const res = await syllabusApi.listAcademicTerms();
      const list = res.terms || [];
      setTerms(list);
      if (list.length > 0 && (!selectedId || !list.some((t) => t.id === selectedId))) {
        setSelectedId(list[0].id);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
    const sync = () => loadTerms();
    window.addEventListener('syllabus-session-changed', sync);
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, []);

  const currentTerm = useMemo(() => terms.find((t) => t.id === selectedId) || terms[0] || null, [terms, selectedId]);

  const monthsInTerm = useMemo(() => {
    if (!currentTerm?.calendarDays?.length) return [];
    const map = new Map();
    currentTerm.calendarDays.forEach((d) => {
      const key = d.date.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(d);
    });
    return Array.from(map.entries()).map(([key, days]) => {
      const [yr, mo] = key.split('-').map(Number);
      return { key, label: `${MONTH_NAMES[mo - 1]} ${yr}`, days, year: yr, month: mo - 1 };
    });
  }, [currentTerm]);

  useEffect(() => {
    if (monthsInTerm.length > 0 && (!activeMonthKey || !monthsInTerm.some((m) => m.key === activeMonthKey))) {
      setActiveMonthKey(monthsInTerm[0].key);
    }
  }, [monthsInTerm]);

  const handleCreateTerm = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const created = await syllabusApi.createAcademicTerm(form);
      toast.success('Academic timeline created!');
      setCreateOpen(false);
      await loadTerms();
      setSelectedId(created.id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleWeeklyHoliday = async (dow) => {
    if (!currentTerm) return;
    const prev = currentTerm.weeklyHolidays || [0];
    const next = prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow];
    try {
      await syllabusApi.updateAcademicTerm(currentTerm.id, { weeklyHolidays: next });
      await loadTerms();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleIndianHolidays = async () => {
    if (!currentTerm) return;
    try {
      await syllabusApi.updateAcademicTerm(currentTerm.id, {
        includeIndianHolidays: !currentTerm.includeIndianHolidays,
      });
      toast.success(!currentTerm.includeIndianHolidays ? 'Indian Holidays Enabled' : 'Indian Holidays Disabled');
      await loadTerms();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddVacation = async (e) => {
    e.preventDefault();
    if (!currentTerm) return;
    try {
      setSaving(true);
      await syllabusApi.addVacationPeriod(currentTerm.id, vacForm);
      toast.success('Vacation break added & working days recalculated');
      setVacOpen(false);
      setVacForm({ name: '', startDate: '', endDate: '' });
      await loadTerms();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVacation = async (vacId) => {
    if (!currentTerm) return;
    try {
      await syllabusApi.deleteVacationPeriod(currentTerm.id, vacId);
      toast.success('Vacation break removed');
      await loadTerms();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDayAction = async (actionType) => {
    if (!currentTerm || !dayModal) return;
    const dateIso = dayModal.date;
    let nextOverrides = [...(currentTerm.holidayDates || [])].filter((h) => h.date !== dateIso);

    if (actionType === 'MARK_HOLIDAY') {
      nextOverrides.push({ date: dateIso, name: customHolidayName.trim() || 'Special Holiday', isRemoved: false, type: 'CUSTOM' });
    } else if (actionType === 'MAKE_WORKING') {
      nextOverrides.push({ date: dateIso, name: 'Converted Working Day', isRemoved: true, type: 'OVERRIDE' });
    } // CLEAR_OVERRIDE just leaves it filtered out

    try {
      await syllabusApi.updateAcademicTerm(currentTerm.id, { holidayDates: nextOverrides });
      toast.success('Calendar updated');
      setDayModal(null);
      await loadTerms();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getDayColor = (kind) => {
    switch (kind) {
      case 'VACATION': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'INDIAN_HOLIDAY': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'HOLIDAY': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'WEEKLY_OFF': return 'bg-slate-100 text-slate-400 border-slate-200';
      default: return 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Academic Timeline &amp; Working Days Calendar</h1>
            <p className="text-xs text-slate-500">Configure term boundaries (30–380 days), weekly offs, Indian festivals &amp; vacation breaks</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create New Timeline
        </button>
      </div>

      {loading && !currentTerm ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading academic calendar...</div>
      ) : !currentTerm ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-base font-bold text-slate-800">No Academic Timeline Configured</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">Create an academic timeline for this session to compute working days and pacing velocity automatically.</p>
          <button type="button" onClick={() => setCreateOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            + Setup Session Calendar
          </button>
        </div>
      ) : (
        <>
          {/* Term Selector & KPI Row */}
          {terms.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {terms.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-bold ${
                    t.id === currentTerm.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] font-bold text-slate-500">Calendar Span</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{currentTerm.totalDays}d</div>
              <div className="text-[11px] text-slate-400">{currentTerm.startDate} → {currentTerm.endDate}</div>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-200 p-4">
              <div className="text-[11px] font-bold text-emerald-700">Teaching Days</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">{currentTerm.effectiveWorkingDays}d</div>
              <div className="text-[11px] text-emerald-600">{currentTerm.elapsedWorkingDays} elapsed / {currentTerm.remainingWorkingDays} left</div>
            </div>
            <div className="bg-white rounded-2xl border border-indigo-200 p-4">
              <div className="text-[11px] font-bold text-indigo-700">Target Syllabus Pace</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">{currentTerm.timeProgressPercentage}%</div>
              <div className="text-[11px] text-indigo-500">Time elapsed ratio</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] font-bold text-slate-500">Holidays &amp; Offs</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{currentTerm.holidayDays}d</div>
              <div className="text-[11px] text-slate-400">Sundays + Gazetted</div>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 p-4">
              <div className="text-[11px] font-bold text-amber-700">Vacation Days</div>
              <div className="text-2xl font-black text-amber-800 mt-1">{currentTerm.vacationDays}d</div>
              <div className="text-[11px] text-amber-600">{(currentTerm.vacationPeriods || []).length} scheduled breaks</div>
            </div>
          </div>

          {/* Controls: Weekly Offs, Indian Holidays & Vacations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Weekly Holiday &amp; Festival Rules</h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Weekly Off Days (Click to toggle)</label>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAYS.map((day, idx) => {
                    const active = (currentTerm.weeklyHolidays || []).includes(idx);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleWeeklyHoliday(idx)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                          active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5 text-purple-600" /> Auto-Detect Indian National &amp; Festival Holidays
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {currentTerm.indianHolidaysDetected?.length || 0} national/festival dates detected in term range
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleIndianHolidays}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border ${
                    currentTerm.includeIndianHolidays
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {currentTerm.includeIndianHolidays ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" /> Vacation Breaks
                </h3>
                <button
                  type="button"
                  onClick={() => setVacOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Vacation
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(currentTerm.vacationPeriods || []).length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No vacation periods added.</div>
                ) : (
                  currentTerm.vacationPeriods.map((v) => (
                    <div key={v.id} className="px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{v.name}</div>
                        <div className="text-[11px] text-slate-500">{v.startDate} to {v.endDate}</div>
                      </div>
                      <button type="button" onClick={() => handleDeleteVacation(v.id)} className="text-slate-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Interactive Calendar Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Academic Calendar Grid (Click Any Day to Mark/Override Holiday)</h3>
                <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-600 mt-1">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" /> Teaching Day</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block" /> Weekly Off</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block" /> Indian Holiday</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" /> Vacation</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 inline-block" /> Custom Holiday</span>
                </div>
              </div>

              <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('YEAR')}
                  className={`px-3 py-1.5 rounded-lg ${viewMode === 'YEAR' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'}`}
                >
                  Full Year Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('MONTH')}
                  className={`px-3 py-1.5 rounded-lg ${viewMode === 'MONTH' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'}`}
                >
                  Single Month
                </button>
              </div>
            </div>

            <div className={`grid gap-4 ${viewMode === 'YEAR' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-xl mx-auto'}`}>
              {(viewMode === 'YEAR' ? monthsInTerm : monthsInTerm.filter((m) => m.key === activeMonthKey)).map((m) => {
                const firstDow = m.days[0]?.dow || 0;
                return (
                  <div key={m.key} className="rounded-xl border border-slate-200 p-3 bg-slate-50/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-slate-800">{m.label}</span>
                      {viewMode === 'MONTH' && monthsInTerm.length > 1 && (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const idx = monthsInTerm.findIndex((x) => x.key === m.key);
                              if (idx > 0) setActiveMonthKey(monthsInTerm[idx - 1].key);
                            }}
                            className="p-1 rounded border bg-white hover:bg-slate-50"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const idx = monthsInTerm.findIndex((x) => x.key === m.key);
                              if (idx < monthsInTerm.length - 1) setActiveMonthKey(monthsInTerm[idx + 1].key);
                            }}
                            className="p-1 rounded border bg-white hover:bg-slate-50"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                      {WEEKDAYS.map((w) => <div key={w}>{w.charAt(0)}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDow }).map((_, i) => <div key={`pad_${i}`} />)}
                      {m.days.map((d) => {
                        const dayNum = Number(d.date.slice(8, 10));
                        return (
                          <button
                            key={d.date}
                            type="button"
                            onClick={() => {
                              setDayModal(d);
                              setCustomHolidayName(d.label || 'Special School Holiday');
                            }}
                            title={`${d.date}: ${d.label || 'Working Teaching Day'}`}
                            className={`h-7 rounded-md border text-[11px] font-bold flex items-center justify-center transition-transform hover:scale-105 ${getDayColor(d.dayKind)}`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Day Click Override Modal */}
      {dayModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{dayModal.date}</h3>
                <p className="text-xs text-slate-500">Current: {dayModal.dayKind.replace('_', ' ')} {dayModal.label ? `(${dayModal.label})` : ''}</p>
              </div>
              <button onClick={() => setDayModal(null)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Holiday / Event Name</label>
              <input
                type="text"
                value={customHolidayName}
                onChange={(e) => setCustomHolidayName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button type="button" onClick={() => handleDayAction('MARK_HOLIDAY')} className="w-full py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">
                Mark as Holiday / Event
              </button>
              <button type="button" onClick={() => handleDayAction('MAKE_WORKING')} className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">
                Override as Working Teaching Day
              </button>
              <button type="button" onClick={() => handleDayAction('CLEAR_OVERRIDE')} className="w-full py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
                Restore Default Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Timeline Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateTerm} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create Academic Timeline (30–380 days)</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Timeline Title *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Create Calendar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Vacation Modal */}
      {vacOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddVacation} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Vacation Period</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Break Name *</label>
              <input type="text" placeholder="e.g. Summer Break" value={vacForm.name} onChange={(e) => setVacForm((f) => ({ ...f, name: e.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">From *</label>
                <input type="date" value={vacForm.startDate} onChange={(e) => setVacForm((f) => ({ ...f, startDate: e.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">To *</label>
                <input type="date" value={vacForm.endDate} onChange={(e) => setVacForm((f) => ({ ...f, endDate: e.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setVacOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold">Add Vacation</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
