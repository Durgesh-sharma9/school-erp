import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  Trash2,
  Sparkles,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle,
  Users,
  GraduationCap,
  Filter,
  Search,
  X,
  RefreshCw,
  SlidersHorizontal,
  Clock,
  Check,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ALL_DAYS = [
  { index: 1, label: 'Monday', short: 'Mon' },
  { index: 2, label: 'Tuesday', short: 'Tue' },
  { index: 3, label: 'Wednesday', short: 'Wed' },
  { index: 4, label: 'Thursday', short: 'Thu' },
  { index: 5, label: 'Friday', short: 'Fri' },
  { index: 6, label: 'Saturday', short: 'Sat' }
];

export function TimetableEditorPage({ onNavigate, currentPath }) {
  const { schoolId } = useAuth();

  // Extract ID from currentPath, location.search, or location.href
  const timetableId = useMemo(() => {
    if (currentPath && currentPath.includes('id=')) {
      const match = currentPath.match(/id=([^&]+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (id) return id;
      const hrefMatch = window.location.href.match(/id=([^&]+)/);
      if (hrefMatch && hrefMatch[1]) return decodeURIComponent(hrefMatch[1]);
    }
    return 'tt_main_2026';
  }, [currentPath]);

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  // Settings
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5, 6]);
  const [baseStartTime, setBaseStartTime] = useState('08:00');
  const [periodDuration, setPeriodDuration] = useState(45);

  // View state: 'section' (Classes) | 'faculty' (Faculty)
  const [viewMode, setViewMode] = useState('section');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [searchEntity, setSearchEntity] = useState('');

  // Slot editor modal state
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState(null); // { dayIndex, period, existingSlot }
  const [slotForm, setSlotForm] = useState({
    subjectId: '',
    teacherId: ''
  });
  const [savingSlot, setSavingSlot] = useState(false);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Helper to add minutes
  const addMinutesToTime = (timeStr, minsToAdd) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '00:00';
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + minsToAdd);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const fetchTimetableDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/timetables/${timetableId}`, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDetail(json.data);
          if (json.data.workingDays) setWorkingDays(json.data.workingDays);
          if (json.data.baseStartTime) setBaseStartTime(json.data.baseStartTime);
          if (json.data.periodDuration) setPeriodDuration(json.data.periodDuration);
        }
      } else {
        toast.error('Failed to load timetable details');
      }
    } catch {
      toast.error('Network error loading timetable');
    } finally {
      setLoading(false);
    }
  }, [timetableId, schoolId]);

  useEffect(() => {
    fetchTimetableDetail();
  }, [fetchTimetableDetail]);

  const periods = detail?.periods || [];
  const classes = detail?.classes || [];
  const subjects = detail?.subjects || [];
  const teachers = detail?.teachers || [];
  const slots = detail?.slots || [];

  // Re-calculate period times based on start time & duration
  const calculatedPeriods = useMemo(() => {
    if (!periods.length) return [];
    let cur = baseStartTime;
    return periods.map((p) => {
      if (p.isBreak) {
        const breakEnd = addMinutesToTime(cur, 30);
        const res = { ...p, startTime: cur, endTime: breakEnd, time: `${cur} - ${breakEnd}` };
        cur = breakEnd;
        return res;
      }
      const end = addMinutesToTime(cur, periodDuration);
      const res = { ...p, startTime: cur, endTime: end, time: `${cur} - ${end}` };
      cur = end;
      return res;
    });
  }, [periods, baseStartTime, periodDuration]);

  // Sidebar Items for Left Panel
  const sidebarItems = useMemo(() => {
    const q = searchEntity.trim().toLowerCase();
    if (viewMode === 'section') {
      const list = classes.map((c) => {
        const activePeriods = periods.filter((p) => !p.isBreak);
        const expected = activePeriods.length * workingDays.length;
        const filled = slots.filter((s) => (s.classId === c.id || (c.id === 'cls_13_a' && s.classId === 'c_10a')) && workingDays.includes(s.dayOfWeek)).length;
        return {
          id: c.id,
          name: c.name,
          subtext: c.classTeacher ? `Class Teacher: ${c.classTeacher}` : (c.wing || 'Standard Wing'),
          filled,
          expected,
          isComplete: expected > 0 && filled >= expected
        };
      });
      return q ? list.filter((i) => i.name.toLowerCase().includes(q)) : list;
    }

    if (viewMode === 'faculty') {
      const list = teachers.map((t) => {
        const filled = slots.filter((s) => s.teacherId === t.id && workingDays.includes(s.dayOfWeek)).length;
        const maxWeekly = 24;
        return {
          id: t.id,
          name: t.name,
          subtext: t.designation || t.email || 'Faculty',
          filled,
          expected: maxWeekly,
          isComplete: filled >= maxWeekly
        };
      });
      return q ? list.filter((i) => i.name.toLowerCase().includes(q)) : list;
    }

    return [];
  }, [viewMode, searchEntity, classes, teachers, slots, periods, workingDays]);

  // Ensure an item is always selected
  useEffect(() => {
    if (sidebarItems.length > 0 && !sidebarItems.some((i) => i.id === selectedEntityId)) {
      setSelectedEntityId(sidebarItems[0].id);
    }
  }, [sidebarItems, selectedEntityId]);

  // Selected Entity Record
  const currentEntity = useMemo(() => {
    if (viewMode === 'section') return classes.find((c) => c.id === selectedEntityId);
    if (viewMode === 'faculty') return teachers.find((t) => t.id === selectedEntityId);
    return null;
  }, [viewMode, selectedEntityId, classes, teachers]);

  // Open slot editor
  const handleOpenSlotModal = (dayIndex, period, existingSlot) => {
    setActiveCell({
      dayIndex,
      period,
      existingSlot
    });

    if (existingSlot) {
      setSlotForm({
        subjectId: existingSlot.subjectId || '',
        teacherId: existingSlot.teacherId || ''
      });
    } else {
      setSlotForm({
        subjectId: subjects[0]?.id || '',
        teacherId: viewMode === 'faculty' ? selectedEntityId : (teachers[0]?.id || '')
      });
    }

    setSlotModalOpen(true);
  };

  // Conflict detection in UI
  const conflictWarning = useMemo(() => {
    if (!activeCell || !slotForm.teacherId) return null;
    const targetClassId = viewMode === 'section' ? selectedEntityId : (activeCell.existingSlot?.classId || classes[0]?.id);

    const clash = slots.find((s) =>
      s.dayOfWeek === activeCell.dayIndex &&
      s.periodId === activeCell.period.id &&
      s.teacherId === slotForm.teacherId &&
      s.classId !== targetClassId
    );

    if (clash) {
      const cls = classes.find((c) => c.id === clash.classId);
      const teacher = teachers.find((t) => t.id === slotForm.teacherId);
      return `Faculty Clash: ${teacher?.name || 'Faculty'} is already scheduled to teach ${cls?.name || clash.classId} during Period ${activeCell.period.periodNumber}!`;
    }
    return null;
  }, [activeCell, slotForm.teacherId, slots, viewMode, selectedEntityId, classes, teachers]);

  // Save slot
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!activeCell) return;

    const classId = viewMode === 'section' ? selectedEntityId : (activeCell.existingSlot?.classId || classes[0]?.id);
    const teacherId = viewMode === 'faculty' ? selectedEntityId : slotForm.teacherId;

    if (!slotForm.subjectId || !teacherId || !classId) {
      toast.error('Subject, Teacher, and Class are required');
      return;
    }

    setSavingSlot(true);
    try {
      const payload = {
        dayOfWeek: activeCell.dayIndex,
        periodId: activeCell.period.id,
        classId,
        subjectId: slotForm.subjectId,
        teacherId
      };

      const res = await fetch(`http://localhost:5000/api/timetable/timetables/${timetableId}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok) {
        toast.success('Period slot saved');
        setSlotModalOpen(false);
        fetchTimetableDetail();
      } else {
        toast.error(json.message || 'Faculty conflict detected');
      }
    } catch {
      toast.error('Failed to save slot');
    } finally {
      setSavingSlot(false);
    }
  };

  // Delete slot
  const handleDeleteSlot = async () => {
    if (!activeCell?.existingSlot) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/timetable/timetables/${timetableId}/slots/${activeCell.existingSlot.id}`,
        {
          method: 'DELETE',
          headers: { 'x-school-id': schoolId }
        }
      );
      if (res.ok) {
        toast.success('Slot removed');
        setSlotModalOpen(false);
        fetchTimetableDetail();
      } else {
        toast.error('Failed to remove slot');
      }
    } catch {
      toast.error('Error removing slot');
    }
  };

  // Auto-generate AI
  const handleAutoGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/timetables/${timetableId}/auto-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        }
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(`Generated ${json.data?.totalGeneratedSlots || 0} clash-free period slots!`);
        setAiModalOpen(false);
        fetchTimetableDetail();
      } else {
        toast.error(json.message || 'Generation failed');
      }
    } catch {
      toast.error('Failed to trigger AI generation');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !detail) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="mt-3 text-sm text-slate-500 font-medium">Loading schedule matrix...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/timetables')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {detail?.name || 'Schedule Builder'}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  detail?.status === 'PUBLISHED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {detail?.status || 'DRAFT'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Synced with ERP Master Classes, Subjects, and Faculty Staff
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors border border-purple-200 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Auto-Generate
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors border border-slate-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Main 2-Column Schedule Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Entity Selector (Classes / Faculty) */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          {/* View Mode Toggle: Classes vs Faculty */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('section')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                viewMode === 'section'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Classes
            </button>
            <button
              type="button"
              onClick={() => setViewMode('faculty')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                viewMode === 'faculty'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Faculty
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${viewMode === 'section' ? 'classes' : 'faculty'}...`}
              value={searchEntity}
              onChange={(e) => setSearchEntity(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Scrollable List */}
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {sidebarItems.map((item) => {
              const isSelected = item.id === selectedEntityId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntityId(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-xs truncate">{item.name}</p>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {item.subtext}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.isComplete
                          ? isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                          : isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.filled} slots
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Weekly Schedule Matrix */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          {/* Header of Grid */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3 bg-slate-50/50">
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                {viewMode === 'section' ? 'Class Weekly Timetable' : 'Faculty Weekly Routine'}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{currentEntity?.name || 'Routine Matrix'}</span>
                {viewMode === 'section' && currentEntity?.classTeacher && (
                  <span className="text-slate-400">• Class Teacher: {currentEntity.classTeacher}</span>
                )}
                {viewMode === 'faculty' && currentEntity?.designation && (
                  <span className="text-slate-400">• {currentEntity.designation}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                {periodDuration} mins / period
              </span>
              <span className="text-slate-400 text-xs">Click any cell to assign or edit a period</span>
            </div>
          </div>

          {/* Matrix Table: Columns = Working Days, Rows = Periods */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3 w-32 border-r border-slate-200 uppercase tracking-wider text-[10px]">
                    Period / Time
                  </th>
                  {workingDays.map((dayNum) => {
                    const dayObj = ALL_DAYS.find((d) => d.index === dayNum);
                    return (
                      <th key={dayNum} className="p-3 border-r border-slate-200 text-center font-bold text-slate-800">
                        {dayObj?.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {calculatedPeriods.map((period) => {
                  if (period.isBreak) {
                    return (
                      <tr key={period.id} className="bg-amber-50/50">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-amber-900 text-center">
                          {period.label || 'Recess / Lunch'}
                          <span className="block text-[10px] text-amber-700/80 font-normal">{period.time}</span>
                        </td>
                        <td
                          colSpan={workingDays.length}
                          className="p-2.5 text-center text-xs font-bold text-amber-800 tracking-wider"
                        >
                          LUNCH & RECESS BREAK
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={period.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Period Header */}
                      <td className="p-3 border-r border-slate-200 bg-slate-50/40 font-bold text-slate-800">
                        <div>{period.label || `Period ${period.periodNumber}`}</div>
                        <span className="text-[10px] text-slate-400 font-normal block">{period.time}</span>
                      </td>

                      {/* Day Columns */}
                      {workingDays.map((dayNum) => {
                        const slot = slots.find((s) => {
                          if (s.dayOfWeek !== dayNum || s.periodId !== period.id) return false;
                          if (viewMode === 'section') return s.classId === selectedEntityId || (selectedEntityId === 'cls_13_a' && s.classId === 'c_10a');
                          if (viewMode === 'faculty') return s.teacherId === selectedEntityId;
                          return false;
                        });

                        return (
                          <td key={dayNum} className="p-2 border-r border-slate-200 align-top">
                            {slot ? (
                              <div
                                onClick={() => handleOpenSlotModal(dayNum, period, slot)}
                                className="p-2.5 rounded-xl border cursor-pointer hover:shadow-xs transition-all relative group overflow-hidden"
                                style={{
                                  backgroundColor: `${slot.subjectColor || '#6366f1'}0d`,
                                  borderColor: `${slot.subjectColor || '#6366f1'}33`
                                }}
                              >
                                <div
                                  className="font-black text-xs truncate"
                                  style={{ color: slot.subjectColor || '#4f46e5' }}
                                >
                                  {slot.subjectName}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-700 truncate mt-0.5">
                                  {viewMode === 'faculty' ? slot.className : slot.teacherName}
                                </div>
                                <div className="mt-1 flex items-center justify-end text-[9px] text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                  Edit Slot
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenSlotModal(dayNum, period, null)}
                                className="w-full h-15 rounded-xl border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-300 hover:text-indigo-600 flex flex-col items-center justify-center transition-all group"
                              >
                                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-medium mt-0.5 opacity-0 group-hover:opacity-100">
                                  Assign
                                </span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit / Assign Slot Modal */}
      {slotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {activeCell?.existingSlot ? 'Edit Scheduled Slot' : 'Assign Period Slot'}
                </h3>
                <p className="text-xs text-slate-500">
                  {ALL_DAYS.find((d) => d.index === activeCell?.dayIndex)?.label} • {activeCell?.period?.label} ({activeCell?.period?.time})
                </p>
              </div>
              <button
                onClick={() => setSlotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-5 space-y-4">
              {conflictWarning && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{conflictWarning}</span>
                </div>
              )}

              {/* Class indicator */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                <div className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
                  {viewMode === 'section' ? currentEntity?.name : (activeCell?.existingSlot?.className || classes[0]?.name)}
                </div>
              </div>

              {/* Subject Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  required
                  value={slotForm.subjectId}
                  onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} {sub.code ? `(${sub.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculty Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Member *</label>
                <select
                  required
                  value={slotForm.teacherId}
                  onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.designation ? `(${t.designation})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                {activeCell?.existingSlot ? (
                  <button
                    type="button"
                    onClick={handleDeleteSlot}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Slot
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSlotModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSlot}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    {savingSlot ? 'Saving...' : 'Save Slot'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Timetable Generator Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Clash-Free Schedule Generator</h3>
                  <p className="text-xs text-purple-200">Algorithmic routine optimizer</p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                This engine automatically schedules all registered academic subjects across active classes and periods
                while strictly guaranteeing:
              </p>

              <ul className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Zero Faculty Double-Booking:</strong> No teacher is assigned twice in the same period.
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Curriculum Balance:</strong> Even distribution of core scholastic subjects.
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Recess Protection:</strong> Lunch breaks remain untouched.
                  </span>
                </li>
              </ul>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  disabled={generating}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimizing Slots...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Schedule Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetableEditorPage;
