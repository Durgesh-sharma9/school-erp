import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Calendar,
  SlidersHorizontal,
  Plus,
  X,
  Check,
  Bell,
  Dot,
  ChevronDown,
  MessageSquare,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Eye,
  RefreshCw,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { tenantStore } from '../../services/tenantStore';

const CLASSES = [
  'Nursery - PP3+',
  'Lower Kindergarten - PP4+',
  'Upper Kindergarten - PP5+',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI- HUMANITIES',
  'XII-HUMANITIES',
  'XI-MEDICAL',
  'XII-MEDICAL',
  'XI-NON-MEDICAL',
  'XII-NON-MEDICAL',
  'XI-COMMERCE'
];

const DIVISIONS = ['A', 'B', 'C', 'D'];

// Initial Mock Class Cards for Test Master Grid View
const INITIAL_CLASS_CARDS = [];

export function StudentAttendancePage({ onNavigate }) {
  const { role, user, schoolId } = useAuth();
  const isAttender = role === 'ATTENDER';
  const todayStr = new Date().toISOString().split('T')[0];

  // Active Main Tab: 'grid' (Class-wise Board) vs 'register' (History Log Table)
  const [activeView, setActiveView] = useState('grid');

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');

  // Class Grid state (Clean fresh state)
  const [classCards, setClassCards] = useState(INITIAL_CLASS_CARDS);

  // History state (Clean, starts empty with 0 dummy records)
  const [history, setHistory] = useState([]);

  // Student roster inside modal (Dynamic from tenantStore)
  const [modalStudents, setModalStudents] = useState([]);

  useEffect(() => {
    if (!isModalOpen) return;
    const realStudents = (tenantStore.getStudents(schoolId) || []).filter((s) => {
      const cls = (s.className || s.class_id || '').toLowerCase().trim();
      const sec = (s.section || s.division_id || 'A').toLowerCase().trim();
      return (
        cls === selectedClass.toLowerCase().trim() &&
        sec === selectedSection.toLowerCase().trim()
      );
    });

    setModalStudents(
      realStudents.map((s, idx) => ({
        id: s.id || `std_${idx}`,
        rollNo: s.rollNo || String(idx + 1),
        name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toUpperCase().trim() || 'STUDENT',
        status: 'Present',
        father: (s.fatherName || s.fathers_name || '').toUpperCase().trim() || '-',
        mobile: s.contactNo || s.fatherMobile || '-'
      }))
    );
  }, [isModalOpen, schoolId, selectedClass, selectedSection]);

  const [modalSearch, setModalSearch] = useState('');
  const [attendanceAlert, setAttendanceAlert] = useState(null);

  // Filters for Register View
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Perfect' | 'HasAbsentees'
  const [showFilterBar, setShowFilterBar] = useState(false);

  // Enforce today's date if Attender
  useEffect(() => {
    if (isAttender) {
      setAttendanceDate(todayStr);
    }
  }, [isAttender, todayStr]);

  // --- KPI Analytics Calculations (Test Master Pro Metrics) ---
  const stats = useMemo(() => {
    const totalEnrolled = classCards.reduce((acc, c) => acc + c.total, 0);
    const markedCards = classCards.filter(c => c.marked);
    const totalPresent = markedCards.reduce((acc, c) => acc + c.present, 0);
    const totalAbsent = markedCards.reduce((acc, c) => acc + c.absent, 0);
    const totalMarkedStudents = totalPresent + totalAbsent;
    const overallRate = totalMarkedStudents > 0 ? ((totalPresent / totalMarkedStudents) * 100).toFixed(1) : 0;
    const completedClasses = markedCards.length;
    const totalClasses = classCards.length;

    // Top attendance classes
    const rankedClasses = [...markedCards].sort((a, b) => {
      const rateA = a.total > 0 ? (a.present / a.total) : 0;
      const rateB = b.total > 0 ? (b.present / b.total) : 0;
      return rateB - rateA;
    });

    const topClasses = rankedClasses.slice(0, 3);
    const lowClasses = markedCards.filter(c => (c.present / (c.total || 1)) < 0.88);

    return {
      totalEnrolled,
      totalPresent,
      totalAbsent,
      overallRate,
      completedClasses,
      totalClasses,
      topClasses,
      lowClasses
    };
  }, [classCards]);

  // Modal actions
  const totalAbsentInModal = modalStudents.filter((s) => s.status === 'Absent').length;
  const totalPresentInModal = modalStudents.filter((s) => s.status === 'Present').length;

  const toggleStudentStatus = (id, newStatus) => {
    setModalStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleMarkAll = (status) => {
    setModalStudents(prev => prev.map(s => ({ ...s, status })));
    toast.success(`Marked all students as ${status}`);
  };

  const openAttendanceModalForClass = (cls) => {
    setSelectedClass(cls.className);
    setSelectedSection(cls.section);
    if (isAttender) {
      setAttendanceDate(todayStr);
    }
    setIsModalOpen(true);
  };

  const handleSaveAttendance = async () => {
    try {
      const presentCount = modalStudents.filter((s) => s.status === 'Present').length;
      const absentCount = modalStudents.filter((s) => s.status === 'Absent').length;
      const total = modalStudents.length || 1;
      const pct = Math.round((presentCount / total) * 100);

      const newHistoryItem = {
        id: `att_${Date.now()}`,
        className: selectedClass,
        section: selectedSection,
        presentCount,
        absentCount,
        totalCount: total,
        attendanceSummary: `${presentCount} Present / ${absentCount} Absent (${pct}%)`,
        markedBy: isAttender ? `${user?.name || 'Attender'}` : 'Admin',
        date: attendanceDate
      };

      // Update history list
      setHistory((prev) => [newHistoryItem, ...prev]);

      // Update Class Card status
      setClassCards(prev => prev.map(c => {
        if (c.className === selectedClass && c.section === selectedSection) {
          return {
            ...c,
            marked: true,
            present: presentCount,
            absent: absentCount,
            total: total,
            markedBy: isAttender ? 'Attender' : 'Admin',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return c;
      }));

      setIsModalOpen(false);
      toast.success(`Class ${selectedClass}-${selectedSection} Attendance Saved Successfully!`);

      if (absentCount > 0) {
        setAttendanceAlert({
          className: selectedClass,
          section: selectedSection,
          date: attendanceDate,
          absentCount,
          summary: `${presentCount} Present / ${absentCount} Absent`
        });
      }
    } catch {
      setIsModalOpen(false);
    }
  };

  // Filtered List for Table View
  const filteredHistory = history.filter((item) => {
    if (filterDate && item.date !== filterDate) return false;
    if (filterClass !== 'All' && item.className !== filterClass) return false;
    if (filterStatus === 'Perfect' && item.absentCount > 0) return false;
    if (filterStatus === 'HasAbsentees' && item.absentCount === 0) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.className.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.date.includes(q) ||
      (item.markedBy || '').toLowerCase().includes(q)
    );
  });

  // Filtered Cards for Grid View
  const filteredClassCards = classCards.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.className.toLowerCase().includes(q) ||
      c.section.toLowerCase().includes(q) ||
      c.incharge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-[#f4f6f9] min-h-screen text-slate-800 space-y-4 max-w-7xl mx-auto">
      {/* 1. Absentee Alert Banner */}
      {attendanceAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 text-amber-950 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-slate-900">
                {attendanceAlert.summary} in Class {attendanceAlert.className}-{attendanceAlert.section}
              </p>
              <p className="text-xs text-amber-800 font-medium">
                {attendanceAlert.absentCount} student(s) marked ABSENT today. Send direct automated SMS to parents now.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                tenantStore.setPendingAbsenteeNotice({
                  className: attendanceAlert.className,
                  section: attendanceAlert.section,
                  date: attendanceAlert.date,
                  absentCount: attendanceAlert.absentCount
                });
                onNavigate?.('/student-sms');
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Absentee SMS</span>
            </button>
            <button
              type="button"
              onClick={() => setAttendanceAlert(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-amber-200/50 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Page Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
              Student Attendance System
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Test Master Pro Flow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time daily attendance recording, class progress monitoring, and absentee analytics
          </p>
        </div>

        {/* View Switchers & Add Attendance Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Sub-Tabs: Staff vs Student */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onNavigate?.('/staff-attendance')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
            >
              Staff Attendance
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-700 shadow-2xs cursor-default"
            >
              Student Attendance
            </button>
          </div>

          {/* Primary Take Attendance Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* 3. TEST MASTER PRO KPI STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Enrolled */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalEnrolled}</span>
            <span className="text-[11px] font-semibold text-slate-500">Students</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-indigo-600">{stats.totalClasses} Class Sections</span> active today
          </div>
        </div>

        {/* Card 2: Present Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Present Today</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">{stats.totalPresent}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {stats.overallRate}% Rate
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-emerald-600">+2.4%</span> higher than school average
          </div>
        </div>

        {/* Card 3: Absent Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Absent Today</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 tracking-tight">{stats.totalAbsent}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {((stats.totalAbsent / (stats.totalEnrolled || 1)) * 100).toFixed(1)}% Absent
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Defaulters identified</span>
            <span className="text-indigo-600 hover:underline font-bold cursor-pointer" onClick={() => setActiveView('register')}>
              View List &rarr;
            </span>
          </div>
        </div>

        {/* Card 4: Classes Marked */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Classes Completed</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.completedClasses}</span>
            <span className="text-[11px] font-semibold text-slate-500">/ {stats.totalClasses} Classes</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.completedClasses / (stats.totalClasses || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. ANALYTICS PODIUM & TOLL BARS (Test Master Style Snapshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Attendance Champions / Top Classes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Top Attending Classes Today
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Ranking
            </span>
          </div>

          <div className="space-y-2.5">
            {stats.topClasses.map((cls, idx) => {
              const rate = ((cls.present / (cls.total || 1)) * 100).toFixed(1);
              return (
                <div key={cls.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
                      idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-600 text-white'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">Class {cls.className} - {cls.section}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Incharge: {cls.incharge}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600">{rate}%</span>
                    <p className="text-[10px] text-slate-400">{cls.present}/{cls.total} Present</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classes Needing Attention / Defaulters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Attention Required (Low Attendance)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              &lt; 88% Alert
            </span>
          </div>

          {stats.lowClasses.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-medium">
              🎉 Excellent! No classes have critical absentee rates today.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.lowClasses.map((cls) => {
                const rate = ((cls.present / (cls.total || 1)) * 100).toFixed(1);
                return (
                  <div key={cls.id} className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-200">
                    <div>
                      <p className="font-extrabold text-xs text-slate-900">Class {cls.className} - {cls.section}</p>
                      <p className="text-[10px] text-rose-600 font-bold">{cls.absent} Absentees Detected</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-rose-600">{rate}%</span>
                      <button
                        type="button"
                        onClick={() => openAttendanceModalForClass(cls)}
                        className="block text-[10px] text-indigo-600 hover:underline font-bold mt-0.5 cursor-pointer"
                      >
                        Review Roster
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Role & Security Badge Box */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-4 rounded-2xl text-white shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Active Operator Session</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isAttender ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' : 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
              }`}>
                {isAttender ? 'ROLE: ATTENDER' : 'ROLE: ADMINISTRATOR'}
              </span>
            </div>
            <p className="font-extrabold text-sm text-white mt-2">
              {isAttender ? '🔒 Attender Locked Protocol Active' : '🔓 SuperAdmin Unrestricted Access'}
            </p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isAttender
                ? `You are strictly permitted to mark attendance for TODAY (${todayStr}). Past & future dates remain locked for data audit integrity.`
                : 'You have full permission to backdate, modify, or audit attendance across any date and session.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">System Date: <strong>{todayStr}</strong></span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              Quick Open &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 5. MAIN CONTENT TABS & TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Class Attendance Board (Grid Flow)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('register')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeView === 'register'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Daily Attendance Register (Table Log)</span>
            </button>
          </div>

          {/* Search bar & Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search class, section, incharge..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-52 sm:w-64"
              />
            </div>

            {activeView === 'register' && (
              <button
                type="button"
                onClick={() => setShowFilterBar(prev => !prev)}
                className={`p-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showFilterBar || filterDate || filterClass !== 'All'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar (When Active) */}
        {showFilterBar && activeView === 'register' && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
            <div>
              <label className="font-bold text-slate-600 mr-2">Filter Date:</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 mr-2">Class:</label>
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-xs font-bold"
              >
                <option value="All">All Classes</option>
                {CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-600 mr-2">Status:</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-slate-300 rounded-lg px-2.5 py-1 bg-white text-xs font-bold"
              >
                <option value="All">All Records</option>
                <option value="Perfect">100% Present Only</option>
                <option value="HasAbsentees">Has Absentees</option>
              </select>
            </div>
            {(filterDate || filterClass !== 'All' || filterStatus !== 'All') && (
              <button
                type="button"
                onClick={() => { setFilterDate(''); setFilterClass('All'); setFilterStatus('All'); }}
                className="text-rose-600 hover:underline font-bold text-xs ml-auto cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* VIEW 1: CLASS-WISE BOARD (TEST MASTER GRID) */}
        {activeView === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredClassCards.map((cls) => {
              const rate = cls.total > 0 ? Math.round((cls.present / cls.total) * 100) : 0;
              return (
                <div
                  key={cls.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    cls.marked
                      ? 'bg-white border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-xs'
                      : 'bg-amber-50/30 border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Card Top: Class Name & Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-base text-slate-900 tracking-tight">
                          Class {cls.className}
                        </span>
                        <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                          Sec {cls.section}
                        </span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        cls.marked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {cls.marked ? 'MARKED ✅' : 'PENDING ⏳'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Incharge: <span className="text-slate-700 font-semibold">{cls.incharge}</span>
                    </p>

                    {/* Numbers: Present / Absent */}
                    {cls.marked ? (
                      <div className="mt-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-600">Attendance Rate</span>
                          <span className="font-black text-emerald-600">{rate}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              rate >= 90 ? 'bg-emerald-500' : rate >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            {cls.present} Present
                          </span>
                          <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md">
                            {cls.absent} Absent
                          </span>
                          <span className="text-slate-500 font-bold">
                            Total: {cls.total}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
                        <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1 animate-spin" />
                        <p className="text-xs font-bold text-amber-900">Attendance Not Taken Yet</p>
                        <p className="text-[10px] text-amber-700">{cls.total} Enrolled Students</p>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cls.marked ? `By ${cls.markedBy} • ${cls.time}` : 'Action Required'}
                    </span>
                    <button
                      type="button"
                      onClick={() => openAttendanceModalForClass(cls)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        cls.marked
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                      }`}
                    >
                      {cls.marked ? 'Update / View' : 'Take Attendance'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: REGISTER / TABLE LOG */}
        {activeView === 'register' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">CLASS & SEC</th>
                  <th className="py-3 px-4">SUMMARY</th>
                  <th className="py-3 px-4 text-center">PRESENT</th>
                  <th className="py-3 px-4 text-center">ABSENT</th>
                  <th className="py-3 px-4 text-center">RATE (%)</th>
                  <th className="py-3 px-4">MARKED BY</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-semibold">
                      No attendance records found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => {
                    const pct = item.totalCount > 0 ? Math.round((item.presentCount / item.totalCount) * 100) : 0;
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-black text-slate-900">Class {item.className}</span>
                          <span className="ml-1.5 font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            Sec {item.section}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                          {item.attendanceSummary}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                            {item.presentCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-extrabold text-xs ${
                            item.absentCount > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {item.absentCount}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`font-black text-xs ${
                            pct >= 90 ? 'text-emerald-600' : pct >= 80 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {pct}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {item.markedBy || 'Attender'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500 font-bold">
                          {item.date}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openAttendanceModalForClass({ className: item.className, section: item.section })}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer"
                          >
                            Edit Roster
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. MODAL: MARK ATTENDANCE (TEST MASTER PRO FULL FLOW) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight">
                    Mark Student Attendance
                  </h2>
                  <p className="text-[11px] text-slate-400">Class-wise live attendance sheet</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls: Class, Section, Date */}
            <div className="p-6 border-b border-slate-100 shrink-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Class selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Select Class*
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Section selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Select Section*
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>Section {d}</option>
                    ))}
                  </select>
                </div>

                {/* Date Picker (Role Restricted) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Attendance Date*
                    </label>
                    {isAttender ? (
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        🔒 Today Only
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        🔓 Admin
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    value={attendanceDate}
                    max={isAttender ? todayStr : undefined}
                    min={isAttender ? todayStr : undefined}
                    readOnly={isAttender}
                    disabled={isAttender}
                    onChange={(e) => !isAttender && setAttendanceDate(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs font-mono font-bold border rounded-xl focus:outline-none ${
                      isAttender
                        ? 'bg-slate-100 text-slate-500 border-slate-300 cursor-not-allowed'
                        : 'bg-white border-slate-200 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                </div>
              </div>

              {/* Fast Bulk Action Buttons & Search */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Fast Actions:</span>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('Present')}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    + All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('Absent')}
                    className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    + All Absent
                  </button>
                </div>

                {/* Counter Pills */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Present: {totalPresentInModal}
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                    Absent: {totalAbsentInModal}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body: Student Roster Grid */}
            <div className="p-6 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {modalStudents.map((std) => (
                  <div
                    key={std.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-xs">
                        {std.rollNo}
                      </span>
                      <div>
                        <p className="font-extrabold text-slate-900">{std.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Father: {std.father} • {std.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(std.id, 'Present')}
                        className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                          std.status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(std.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                          std.status === 'Absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(std.id, 'Leave')}
                        className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${
                          std.status === 'Leave'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                Total Roster: <strong>{modalStudents.length}</strong> students
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Attendance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
