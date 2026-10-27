import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  CalendarDays,
  Plus,
  CheckCircle,
  Clock,
  Edit3,
  Trash2,
  Sparkles,
  Layers,
  BookOpen,
  BarChart3,
  GraduationCap,
  RefreshCw,
  X,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function TimetablesManagerPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTimetableForm, setNewTimetableForm] = useState({
    name: '',
    baseStartTime: '08:00',
    periodDuration: 45,
    workingDays: [1, 2, 3, 4, 5, 6]
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/timetable/timetables', {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
      if (res.ok) {
        const json = await res.json();
        setTimetables(json.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not load timetables list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, [schoolId]);

  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    if (!newTimetableForm.name.trim()) {
      toast.error('Please enter a timetable title');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/timetable/timetables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId || 'sch_jd_intl'
        },
        body: JSON.stringify(newTimetableForm)
      });
      if (res.ok) {
        const json = await res.json();
        toast.success('Timetable created successfully!');
        setCreateModalOpen(false);
        setNewTimetableForm({
          name: '',
          baseStartTime: '08:00',
          periodDuration: 45,
          workingDays: [1, 2, 3, 4, 5, 6]
        });
        fetchTimetables();
        if (onNavigate && json.data?.id) {
          onNavigate(`/timetable-edit?id=${json.data.id}`);
        }
      } else {
        toast.error('Failed to create timetable');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/timetable/timetables/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId || 'sch_jd_intl'
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        toast.success(`Timetable marked as ${nextStatus}`);
        fetchTimetables();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable and all its slots?')) return;

    try {
      const res = await fetch(`/api/timetable/timetables/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
      if (res.ok) {
        toast.success('Timetable deleted');
        fetchTimetables();
      }
    } catch {
      toast.error('Failed to delete timetable');
    }
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Stats calculation
  const publishedCount = useMemo(() => timetables.filter(t => t.status === 'PUBLISHED').length, [timetables]);
  const totalSlotsCount = useMemo(() => timetables.reduce((acc, t) => acc + (t.slotCount || 0), 0), [timetables]);
  const activeTimetable = useMemo(() => timetables.find(t => t.status === 'PUBLISHED') || timetables[0], [timetables]);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Timetables & Weekly Schedules
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/timetable-dashboard')} className="hover:text-indigo-600 transition-colors">
              Timetable Pro
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Time Tables</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchTimetables}
            title="Refresh List"
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="h-9 px-3 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-xs text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Timetable</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total Timetables</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CalendarDays className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{timetables.length}</h3>
            <p className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Master routines configured
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Active (Published)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">{publishedCount}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> {activeTimetable ? activeTimetable.name : 'Routine in effect'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Assigned Period Slots</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">{totalSlotsCount}</h3>
            <p className="text-[11px] text-blue-500 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Across all grade sections
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Default Duration</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-purple-600 mt-2">
              {activeTimetable?.periodDuration || 45} <span className="text-sm font-semibold">min</span>
            </h3>
            <p className="text-[11px] text-purple-500 font-semibold flex items-center gap-1 mt-1">
              <SlidersHorizontal className="w-3 h-3" /> {activeTimetable?.baseStartTime || '08:00 AM'} start
            </p>
          </div>
        </div>

        {/* Quick Module Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/timetable-dashboard')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Dashboard</p>
              <p className="text-[10px] text-slate-400 truncate">Live Metrics</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/daily-desk')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Daily Desk</p>
              <p className="text-[10px] text-slate-400 truncate">Substitutions</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-builder')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Visual Editor</p>
              <p className="text-[10px] text-slate-400 truncate">Interactive builder</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/lesson-planning')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Lesson Plans</p>
              <p className="text-[10px] text-slate-400 truncate">Curriculum tracker</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-reports')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Reports & Logs</p>
              <p className="text-[10px] text-slate-400 truncate">Teacher activity</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-homework')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Homework</p>
              <p className="text-[10px] text-slate-400 truncate">Class assignments</p>
            </div>
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Master Timetable Routines</h2>
            <p className="text-xs text-slate-400">Class schedules, period timings, and faculty allocations</p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
            {timetables.length} Timetables Registered
          </span>
        </div>

        {/* Grid of Timetables */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {timetables.map((item) => {
            const isPublished = item.status === 'PUBLISHED';
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isPublished ? 'border-indigo-400/80 ring-2 ring-indigo-500/10' : 'border-slate-200'
                }`}
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isPublished ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Active (Published)
                          </>
                        ) : (
                          'Draft'
                        )}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 leading-snug">{item.name}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Timetable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Assigned Slots</span>
                      <span className="font-bold text-slate-800 text-sm">{item.slotCount || 0} Slots</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Period Length</span>
                      <span className="font-bold text-slate-800 text-sm">{item.periodDuration || 45} mins</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Day Start Time</span>
                      <span className="font-bold text-slate-800 text-sm">{item.baseStartTime || '08:00'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-medium">Working Days</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {Array.isArray(item.workingDays) ? `${item.workingDays.length} Days/wk` : '6 Days/wk'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                      isPublished
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100 bg-white'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {isPublished ? 'Set as Draft' : 'Publish Routine'}
                  </button>

                  <button
                    onClick={() => onNavigate && onNavigate(`/timetable-edit?id=${item.id}`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Grid</span>
                  </button>
                </div>
              </div>
            );
          })}

          {timetables.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
              <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Timetables Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Get started by creating your first academic timetable routine.
              </p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#5c67f6] text-white font-semibold text-xs shadow-xs hover:bg-indigo-600 transition-colors"
              >
                Create Timetable Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Timetable Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Create New Timetable</h3>
                <p className="text-xs text-slate-500">Configure new routine schedule</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTimetable} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Timetable Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Routine 2026-27 or Winter Schedule"
                  value={newTimetableForm.name}
                  onChange={(e) => setNewTimetableForm({ ...newTimetableForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Day Start Time</label>
                  <input
                    type="time"
                    value={newTimetableForm.baseStartTime}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, baseStartTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Period Duration (mins)</label>
                  <input
                    type="number"
                    min="20"
                    max="90"
                    value={newTimetableForm.periodDuration}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, periodDuration: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Active Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {dayNames.map((day, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = newTimetableForm.workingDays.includes(dayNum);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => {
                          const updated = isSelected
                            ? newTimetableForm.workingDays.filter((d) => d !== dayNum)
                            : [...newTimetableForm.workingDays, dayNum];
                          setNewTimetableForm({ ...newTimetableForm, workingDays: updated.sort() });
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#5c67f6] text-white border-[#5c67f6]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#5c67f6] hover:bg-indigo-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {submitting ? 'Creating...' : 'Create & Open Grid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetablesManagerPage;
