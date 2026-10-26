import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  Clock,
  Edit3,
  Trash2,
  Share2,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  X
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
      const res = await fetch('http://localhost:5000/api/timetable/timetables', {
        headers: { 'x-school-id': schoolId }
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
      const res = await fetch('http://localhost:5000/api/timetable/timetables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
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
      const res = await fetch(`http://localhost:5000/api/timetable/timetables/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
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
      const res = await fetch(`http://localhost:5000/api/timetable/timetables/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': schoolId }
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <CalendarDays className="w-4 h-4" /> Timetable Master Repository
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Timetables & Weekly Schedules</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, configure and manage master class routines, period durations and faculty allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTimetables}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Timetable
          </button>
        </div>
      </div>

      {/* Grid of Timetables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {timetables.map((item) => {
          const isPublished = item.status === 'PUBLISHED';
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                isPublished ? 'border-indigo-400/80 ring-2 ring-indigo-500/10' : 'border-slate-200'
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
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
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
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
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {isPublished ? 'Set as Draft' : 'Publish Routine'}
                </button>

                <button
                  onClick={() => onNavigate && onNavigate(`/timetable-edit?id=${item.id}`)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Grid
                </button>
              </div>
            </div>
          );
        })}

        {timetables.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Timetables Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Get started by creating your first academic timetable routine.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 transition-colors"
            >
              Create Timetable Now
            </button>
          </div>
        )}
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
                            ? 'bg-indigo-600 text-white border-indigo-600'
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
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
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
