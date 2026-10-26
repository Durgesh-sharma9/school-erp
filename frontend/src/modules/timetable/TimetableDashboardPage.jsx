import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieIcon,
  ArrowRight,
  RefreshCw,
  BookOpen,
  FileText,
  BookmarkCheck,
  Plus,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function TimetableDashboardPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/dashboard-stats?date=${selectedDate}`, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      } else {
        toast.error('Failed to load timetable analytics');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [schoolId, selectedDate]);

  const kpis = data?.kpis || {
    totalTeachers: 9,
    activePeriodsCount: 8,
    totalSlots: 48,
    absentCount: 1,
    substitutionsCount: 1,
    activeTimetableName: 'Academic Master Timetable 2026-27',
    lessonPlansCount: 3,
    reportsCount: 2
  };

  const absentTeachers = data?.absentTeachers || [];
  const todayReplacements = data?.todayReplacements || [];
  const teacherWorkload = data?.teacherWorkload || [];
  const subjectDistribution = data?.subjectDistribution || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 p-6 rounded-2xl text-white shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <CalendarDays className="w-3.5 h-3.5" />
            Timetable Pro Suite
          </div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
            Operations & Timetable Dashboard
          </h1>
          <p className="text-sm text-indigo-200">
            {schoolName || 'J D International School'} ?" Real-time faculty schedules, substitutions & curriculum metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white/10 text-white border border-white/20 rounded-xl px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-white/40"
          />
          <button
            onClick={fetchDashboardData}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all text-white flex items-center justify-center"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Absent Today</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{kpis.absentCount}</p>
            <span className="text-xs text-rose-600 font-medium inline-flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Action required
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Substitutions</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{kpis.substitutionsCount}</p>
            <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 mt-1">
              <CheckCircle className="w-3.5 h-3.5" /> Proxies assigned
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weekly Master Slots</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">{kpis.totalSlots}</p>
            <span className="text-xs text-slate-500 font-medium inline-flex items-center gap-1 mt-1">
              {kpis.activePeriodsCount} periods/day
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lesson Plans Today</p>
            <p className="text-3xl font-black text-teal-600 mt-1">{kpis.lessonPlansCount}</p>
            <span className="text-xs text-teal-600 font-medium inline-flex items-center gap-1 mt-1">
              <BookmarkCheck className="w-3.5 h-3.5" /> Daily curriculum
            </span>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Launch Hub */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Timetable Pro Modules</h2>
          <span className="text-xs text-indigo-400 font-medium">Quick Access</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/timetable-dashboard')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
          >
            <BarChart3 className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white">Dashboard</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Live Metrics</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetables')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
          >
            <CalendarDays className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white">Time Tables</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Builder & Grid</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/daily-desk')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
          >
            <Clock className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white">Daily Desk</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Substitutions</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/lesson-planning')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
          >
            <BookOpen className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white">Lesson Planning</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Curriculum Tracker</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-reports')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
          >
            <FileText className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white">Reports</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Teacher Activity</p>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-homework')}
            className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
          >
            <GraduationCap className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-bold text-white">Homework</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Class Assignments</p>
          </button>
        </div>
      </div>

      {/* Main Grid: Absent & Substitutions Overview + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Absent & Substitutions Today */}
        <div className="space-y-6 lg:col-span-1">
          {/* Absent Teachers Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <h3 className="font-bold text-slate-800 text-sm">Absent Faculty ({absentTeachers.length})</h3>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/daily-desk')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {absentTeachers.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  All faculty members are present today.
                </div>
              ) : (
                absentTeachers.map((att) => (
                  <div key={att.id} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-rose-950">{att.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-200/80 text-rose-800">
                        {att.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{att.reason || 'Leave recorded'}</p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Phone: {att.phone || 'N/A'}</span>
                      <button
                        onClick={() => onNavigate && onNavigate('/daily-desk')}
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        Assign Proxy
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Substitutions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-slate-800 text-sm">Today's Substitutions ({todayReplacements.length})</h3>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/daily-desk')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Daily Desk <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {todayReplacements.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No substitutions needed or scheduled today.
                </div>
              ) : (
                todayReplacements.map((rep) => (
                  <div key={rep.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-100/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{rep.className}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800">
                        {rep.periodLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong className="text-slate-800">{rep.replacementTeacherName}</strong> replacing{' '}
                      <span className="text-slate-500 line-through">{rep.originalTeacherName}</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Assigned at {rep.notifiedAt || 'Morning Routine'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Workload & Distribution Visuals */}
        <div className="space-y-6 lg:col-span-2">
          {/* Faculty Workload Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Faculty Weekly Workload Distribution</h3>
                <p className="text-xs text-slate-500">Assigned teaching periods vs maximum capacity (24 periods/week)</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Active Schedule
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teacherWorkload} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 24]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val, name) => [`${val} Periods`, 'Assigned Load']}
                  />
                  <Bar dataKey="assigned" radius={[6, 6, 0, 0]} fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Subject Period Allocation</h3>
                <p className="text-xs text-slate-500">Distribution of weekly teaching periods by subject domain</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/timetables')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View Full Grid <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {subjectDistribution.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl border border-slate-100 flex flex-col justify-between"
                  style={{ borderLeftColor: sub.color, borderLeftWidth: '4px' }}
                >
                  <p className="text-xs font-bold text-slate-700 truncate">{sub.name}</p>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900">{sub.count}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{sub.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetableDashboardPage;
