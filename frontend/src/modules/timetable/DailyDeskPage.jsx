import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  UserCheck,
  UserX,
  History,
  X,
  ArrowRight,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function DailyDeskPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [gridData, setGridData] = useState(null);

  // Zoom level state
  const [zoom, setZoom] = useState(1);

  // Replacement Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedSlotForSub, setSelectedSlotForSub] = useState(null);
  const [subForm, setSubForm] = useState({
    replacementTeacherId: '',
    reason: 'Casual Leave'
  });
  const [submittingSub, setSubmittingSub] = useState(false);

  // Mark Absent Modal
  const [absentModalOpen, setAbsentModalOpen] = useState(false);
  const [absentForm, setAbsentForm] = useState({
    teacherId: '',
    status: 'ABSENT',
    reason: 'Casual Leave (Approved)'
  });
  const [submittingAbsent, setSubmittingAbsent] = useState(false);

  // Replacement History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchDailyDesk = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/daily-desk?date=${selectedDate}`, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setGridData(json.data);
      }
    } catch {
      toast.error('Could not load Daily Desk operational matrix');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyDesk();
  }, [selectedDate, schoolId]);

  const changeDateBy = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleOpenAssignModal = (classItem, slot) => {
    setSelectedSlotForSub({
      classId: classItem.classId,
      className: classItem.className,
      ...slot
    });

    const freeList = gridData?.freeTeachersByPeriod?.[slot.periodId] || [];
    setSubForm({
      replacementTeacherId: freeList[0]?.id || '',
      reason: 'Casual Leave'
    });
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotForSub || !subForm.replacementTeacherId) {
      toast.error('Please select a substitute teacher');
      return;
    }

    setSubmittingSub(true);
    try {
      const payload = {
        date: selectedDate,
        periodId: selectedSlotForSub.periodId,
        classId: selectedSlotForSub.classId,
        originalTeacherId: selectedSlotForSub.teacherId || '',
        replacementTeacherId: subForm.replacementTeacherId,
        reason: subForm.reason
      };

      const res = await fetch('http://localhost:5000/api/timetable/replacements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok) {
        toast.success('Substitute teacher assigned successfully!');
        setAssignModalOpen(false);
        fetchDailyDesk();
      } else {
        toast.error(json.message || 'Could not assign substitute');
      }
    } catch {
      toast.error('Failed to submit assignment');
    } finally {
      setSubmittingSub(false);
    }
  };

  const handleMarkAttendanceSubmit = async (e) => {
    e.preventDefault();
    if (!absentForm.teacherId) {
      toast.error('Please select a faculty member');
      return;
    }

    setSubmittingAbsent(true);
    try {
      const payload = {
        teacherId: absentForm.teacherId,
        date: selectedDate,
        status: absentForm.status,
        reason: absentForm.reason
      };

      const res = await fetch('http://localhost:5000/api/timetable/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Faculty attendance updated (${absentForm.status})`);
        setAbsentModalOpen(false);
        fetchDailyDesk();
      } else {
        toast.error('Failed to update attendance');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmittingAbsent(false);
    }
  };

  const handleOpenHistory = async () => {
    setHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const res = await fetch('http://localhost:5000/api/timetable/replacement-history', {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setHistoryList(json.data || []);
      }
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const periods = gridData?.periods || [];
  const grid = gridData?.grid || [];
  const teachers = gridData?.teachers || [];
  const attendance = gridData?.attendance || [];
  const replacements = gridData?.replacements || [];

  const absentTeachersList = useMemo(() => {
    return attendance.filter((a) => a.status === 'ABSENT').map((a) => {
      const t = teachers.find((tech) => tech.id === a.teacherId);
      return {
        ...a,
        name: t?.name || a.teacherId,
        email: t?.email || ''
      };
    });
  }, [attendance, teachers]);

  const freeTeachersForActiveSlot = useMemo(() => {
    if (!selectedSlotForSub?.periodId) return [];
    return gridData?.freeTeachersByPeriod?.[selectedSlotForSub.periodId] || [];
  }, [selectedSlotForSub, gridData]);

  const handleExportCSV = () => {
    if (!grid.length) return;
    let csv = `Class,${periods.map((p) => p.label).join(',')}\n`;
    grid.forEach((row) => {
      const rowSlots = row.slots.map((s) => {
        if (s.isBreak) return 'Break';
        if (s.empty) return 'Free';
        if (s.replacement) return `${s.subjectName} (${s.replacement.replacementTeacherName} [Sub])`;
        if (s.isAbsent) return `${s.subjectName} (ABSENT - Unassigned)`;
        return `${s.subjectName} (${s.teacherName})`;
      });
      csv += `"${row.className}",${rowSlots.map((s) => `"${s}"`).join(',')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daily_Desk_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Daily Desk exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Daily Desk Operations & Substitution Engine
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Live Daily Operations Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time absent faculty tracking, single-click substitute allocation & period coverage
          </p>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 px-2 py-1 focus:outline-hidden"
            />
            <button
              onClick={() => changeDateBy(1)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => setAbsentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition-colors"
          >
            <UserX className="w-4 h-4 text-rose-600" />
            Mark Faculty Absent
          </button>

          <button
            onClick={handleOpenHistory}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            title="Substitution History"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operational Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty On Leave Today</span>
            <p className="text-2xl font-black text-rose-600 mt-0.5">{absentTeachersList.length}</p>
            <span className="text-[11px] text-slate-500">
              {absentTeachersList.length === 0 ? 'No absences reported' : 'Requires substitutions'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Substitutions Deployed</span>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{replacements.length}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Cover duties assigned</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Coverage Efficiency</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">100%</p>
            <span className="text-[11px] text-slate-500">All periods supervised</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Matrix Controls & Zoom Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Zoom Matrix:</span>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-600 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-indigo-50 border border-indigo-200"></span>
            <span>Regular Slot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300"></span>
            <span>Teacher Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></span>
            <span>Proxy Assigned</span>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <table className="w-full border-collapse text-left text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5 w-36 border-r border-slate-200 uppercase tracking-wider text-[11px] sticky left-0 bg-slate-50 z-10">
                  Class / Grade
                </th>
                {periods.map((p) => (
                  <th
                    key={p.id}
                    className={`p-3 text-center border-r border-slate-200 ${
                      p.isBreak ? 'bg-amber-50/70 text-amber-800 w-24' : 'w-40'
                    }`}
                  >
                    <div className="font-bold text-slate-800">{p.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{p.time}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {grid.map((row) => (
                <tr key={row.classId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40 sticky left-0 z-10">
                    <div>{row.className}</div>
                  </td>

                  {row.slots.map((slot, sIdx) => {
                    if (slot.isBreak) {
                      return (
                        <td
                          key={sIdx}
                          className="p-2 border-r border-slate-200 bg-amber-50/40 text-center text-[10px] font-bold text-amber-700"
                        >
                          Break
                        </td>
                      );
                    }

                    if (slot.empty) {
                      return (
                        <td key={sIdx} className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-300">
                          -
                        </td>
                      );
                    }

                    // Slot has assigned subject. Check absent or substitution
                    const isAbsent = slot.isAbsent;
                    const hasReplacement = !!slot.replacement;

                    let bgClass = 'bg-indigo-50/40 border-indigo-200/80';
                    if (isAbsent && !hasReplacement) bgClass = 'bg-rose-100/80 border-rose-300 animate-pulse';
                    if (hasReplacement) bgClass = 'bg-amber-100/90 border-amber-300';

                    return (
                      <td key={sIdx} className="p-2 border-r border-slate-200 align-top">
                        <div
                          onClick={() => handleOpenSlotModal(row, slot)}
                          className={`p-2.5 rounded-xl border cursor-pointer hover:shadow-xs transition-all relative ${bgClass}`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span className="truncate">{slot.subjectName}</span>
                            {isAbsent && !hasReplacement && (
                              <span className="px-1.5 py-0.2 rounded-md bg-rose-600 text-white text-[9px]">ABSENT</span>
                            )}
                            {hasReplacement && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-600 text-white text-[9px]">SUB</span>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-600 mt-1">
                            {hasReplacement ? (
                              <div>
                                <span className="font-bold text-amber-900 block truncate">
                                  {slot.replacement.replacementTeacherName}
                                </span>
                                <span className="text-[9px] text-slate-400 line-through truncate block">
                                  {slot.teacherName}
                                </span>
                              </div>
                            ) : (
                              <span className={`block truncate ${isAbsent ? 'text-rose-700 font-bold' : ''}`}>
                                {slot.teacherName}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 pt-1 border-t border-slate-200/50 flex items-center justify-between text-[9px] text-slate-400">
                            <span>Period {slot.periodNumber}</span>
                            <span className="text-indigo-600 font-bold">Assign Sub</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Substitute Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Assign Substitute Teacher</h3>
                <p className="text-xs text-slate-500">
                  {selectedSlotForSub?.className} ?" Period {selectedSlotForSub?.periodNumber} ({selectedSlotForSub?.time})
                </p>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Subject:</span>
                  <span className="font-bold text-slate-800">{selectedSlotForSub?.subjectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Original Faculty:</span>
                  <span className="font-bold text-slate-800">{selectedSlotForSub?.teacherName}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Available Substitute Faculty *
                </label>
                <select
                  required
                  value={subForm.replacementTeacherId}
                  onChange={(e) => setSubForm({ ...subForm, replacementTeacherId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Choose Free Teacher --</option>
                  {freeTeachersForActiveSlot.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Free during this period)
                    </option>
                  ))}
                  {/* Also list all teachers if desired */}
                  {teachers.map((t) => (
                    <option key={`all_${t.id}`} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Faculty marked free have zero teaching allocations for this specific time slot.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Duty Type</label>
                <select
                  value={subForm.reason}
                  onChange={(e) => setSubForm({ ...subForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Casual Leave">Casual Leave Cover</option>
                  <option value="Medical Leave">Medical Emergency Cover</option>
                  <option value="Official Duty">Official School Duty / Meeting</option>
                  <option value="Exam Supervision">Exam Supervision</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSub}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {submittingSub ? 'Assigning...' : 'Confirm Substitution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark Faculty Absent Modal */}
      {absentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Mark Faculty Attendance</h3>
                <p className="text-xs text-slate-500">Record absence or restore presence for {selectedDate}</p>
              </div>
              <button
                onClick={() => setAbsentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMarkAttendanceSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Member *</label>
                <select
                  required
                  value={absentForm.teacherId}
                  onChange={(e) => setAbsentForm({ ...absentForm, teacherId: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attendance Status *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAbsentForm({ ...absentForm, status: 'ABSENT' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      absentForm.status === 'ABSENT'
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserX className="w-4 h-4" /> Mark Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbsentForm({ ...absentForm, status: 'PRESENT' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      absentForm.status === 'PRESENT'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" /> Mark Present
                  </button>
                </div>
              </div>

              {absentForm.status === 'ABSENT' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Leave Reason</label>
                  <input
                    type="text"
                    value={absentForm.reason}
                    onChange={(e) => setAbsentForm({ ...absentForm, reason: e.target.value })}
                    placeholder="e.g. Casual Leave (Medical approved)"
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAbsentModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAbsent}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  {submittingAbsent ? 'Saving...' : 'Update Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replacement History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Substitution Activity History</h3>
                <p className="text-xs text-slate-500">Record of substitutions by date</p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-96 overflow-y-auto space-y-2.5">
              {loadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading history...</div>
              ) : historyList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No past substitutions recorded yet.</div>
              ) : (
                historyList.map((h) => (
                  <div
                    key={h.date}
                    onClick={() => {
                      setSelectedDate(h.date);
                      setHistoryModalOpen(false);
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900">{h.date}</span>
                      <p className="text-[10px] text-slate-500">View matrix for this day</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      {h.replacementCount} Substituted
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyDeskPage;
