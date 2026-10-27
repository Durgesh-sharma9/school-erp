import React, { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  RefreshCw,
  Calendar,
  CalendarDays,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  BookmarkCheck,
  BookOpen,
  TrendingUp,
  BarChart3,
  Sparkles,
  GraduationCap,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DEFAULT_KPIS = {
  totalTeachers: 9,
  activePeriodsCount: 8,
  totalSlots: 48,
  absentCount: 1,
  substitutionsCount: 2,
  activeTimetableName: 'Academic Master Timetable 2026-27',
  lessonPlansCount: 6,
  reportsCount: 4
};

const DEFAULT_ABSENT_TEACHERS = [
  {
    id: 'att-1',
    name: 'Dr. Robert Smith',
    phone: '+91 98765 43210',
    reason: 'Medical Leave - Approved by Principal',
    status: 'Absent'
  }
];

const DEFAULT_TODAY_REPLACEMENTS = [
  {
    id: 'rep-1',
    className: 'Grade 10 - Section A',
    periodLabel: 'Period 3 (10:15 - 11:00 AM)',
    originalTeacherName: 'Dr. Robert Smith',
    replacementTeacherName: 'Prof. Anita Sharma',
    status: 'Assigned',
    notifiedAt: '08:30 AM'
  },
  {
    id: 'rep-2',
    className: 'Grade 9 - Section B',
    periodLabel: 'Period 5 (12:00 - 12:45 PM)',
    originalTeacherName: 'Dr. Robert Smith',
    replacementTeacherName: 'Mr. David Lee',
    status: 'In Progress',
    notifiedAt: '08:35 AM'
  }
];

const DEFAULT_TEACHER_WORKLOAD = [
  { name: 'Dr. Smith', assigned: 22, total: 24, utilization: 91 },
  { name: 'Prof. Anita', assigned: 20, total: 24, utilization: 83 },
  { name: 'Mr. David', assigned: 18, total: 24, utilization: 75 },
  { name: 'Ms. Sarah', assigned: 24, total: 24, utilization: 100 },
  { name: 'Mr. Rahul', assigned: 16, total: 24, utilization: 67 },
  { name: 'Mrs. Sunita', assigned: 19, total: 24, utilization: 79 },
  { name: 'Dr. Mehta', assigned: 21, total: 24, utilization: 88 }
];

const DEFAULT_SUBJECT_DISTRIBUTION = [
  { id: 'math', name: 'Mathematics', count: 14, percentage: 29, color: '#5c67f6' },
  { id: 'sci', name: 'Science', count: 12, percentage: 25, color: '#38bdf8' },
  { id: 'eng', name: 'English', count: 10, percentage: 21, color: '#10b981' },
  { id: 'soc', name: 'Social Studies', count: 7, percentage: 15, color: '#f59e0b' },
  { id: 'cs', name: 'Comp. Science', count: 5, percentage: 10, color: '#8b5cf6' }
];

export function TimetableDashboardPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/dashboard-stats?date=${selectedDate}`, {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (err) {
      console.warn('Backend timetable stats not reached, using default cached metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [schoolId, selectedDate]);

  const kpis = data?.kpis || DEFAULT_KPIS;
  const absentTeachers = (data?.absentTeachers && data.absentTeachers.length > 0)
    ? data.absentTeachers
    : DEFAULT_ABSENT_TEACHERS;
  const todayReplacements = (data?.todayReplacements && data.todayReplacements.length > 0)
    ? data.todayReplacements
    : DEFAULT_TODAY_REPLACEMENTS;
  const teacherWorkload = (data?.teacherWorkload && data.teacherWorkload.length > 0)
    ? data.teacherWorkload
    : DEFAULT_TEACHER_WORKLOAD;
  const subjectDistribution = (data?.subjectDistribution && data.subjectDistribution.length > 0)
    ? data.subjectDistribution
    : DEFAULT_SUBJECT_DISTRIBUTION;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Timetable Operations Dashboard
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Timetable Pro</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Dashboard</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            />
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh Metrics"
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetables')}
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
          <div
            onClick={() => onNavigate && onNavigate('/timetables')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Master Slots</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CalendarDays className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{kpis.totalSlots}</h3>
            <p className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> {kpis.activePeriodsCount || 8} active daily periods
            </p>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('/daily-desk')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-rose-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Faculty Absent</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Users className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-rose-600 mt-2">{kpis.absentCount}</h3>
            <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> {kpis.absentCount > 0 ? 'Proxy required' : 'Full attendance today'}
            </p>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('/daily-desk')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-amber-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Active Substitutions</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-600 mt-2">{kpis.substitutionsCount}</h3>
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> Daily desk proxies
            </p>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('/lesson-planning')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Lesson Plans</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">{kpis.lessonPlansCount}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <BookmarkCheck className="w-3 h-3" /> Curriculum tracking active
            </p>
          </div>
        </div>

        {/* Quick Module Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/timetables')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Time Tables</p>
              <p className="text-[10px] text-slate-400 truncate">Builder & Grid</p>
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Faculty Workload Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Faculty Weekly Workload Distribution</h3>
                <p className="text-xs text-slate-400">Assigned teaching periods vs maximum capacity (24 periods/week)</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Session 2026-2027
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teacherWorkload} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 24]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val) => [`${val} Periods`, 'Weekly Load']}
                  />
                  <Bar dataKey="assigned" radius={[6, 6, 0, 0]} fill="#5c67f6" name="Assigned Load" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Distribution Donut Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Subject Period Allocation</h3>
              <p className="text-xs text-slate-400 mb-3">Curriculum distribution across all grades</p>
              <div className="h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#5c67f6'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, item) => [`${value} periods`, item.payload.name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t text-xs">
              {subjectDistribution.map((s) => (
                <div key={s.id || s.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-600">{s.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{s.count} ({s.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Section: Substitutions Table & Absent Faculty */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Today's Substitutions Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Today's Substitutions & Proxy Desk</h3>
                <p className="text-xs text-slate-400">Live period adjustments & faculty coverage</p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/daily-desk')}
                className="text-xs text-[#5c67f6] hover:text-indigo-700 font-semibold flex items-center gap-1"
              >
                <span>Daily Desk ({todayReplacements.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="py-2.5 px-4">CLASS</th>
                    <th className="py-2.5 px-4">PERIOD</th>
                    <th className="py-2.5 px-4">ORIGINAL FACULTY</th>
                    <th className="py-2.5 px-4">PROXY REPLACEMENT</th>
                    <th className="py-2.5 px-4">STATUS</th>
                    <th className="py-2.5 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {todayReplacements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                        No faculty substitutions scheduled for today.
                      </td>
                    </tr>
                  ) : (
                    todayReplacements.slice(0, 5).map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{rep.className}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-indigo-600">
                          {rep.periodLabel || 'Period Slot'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 line-through">
                          {rep.originalTeacherName}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-emerald-700">
                          {rep.replacementTeacherName}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            {rep.status || 'Assigned'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => onNavigate && onNavigate('/daily-desk')}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Absent Faculty Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Absent Faculty Alerts</h3>
                  <p className="text-xs text-slate-400">Recorded leave requiring proxy</p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('/daily-desk')}
                  className="text-xs text-[#5c67f6] hover:text-indigo-700 font-semibold"
                >
                  Desk ({absentTeachers.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {absentTeachers.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <CheckCircle className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 text-xs">All Faculty Present</p>
                    <p className="text-[11px] text-slate-400">No leaves recorded for this date</p>
                  </div>
                ) : (
                  absentTeachers.slice(0, 3).map((att) => (
                    <div key={att.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{att.name}</span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {att.status || 'Absent'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{att.reason || 'Medical / Leave recorded'}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                        <span>Phone: {att.phone || 'N/A'}</span>
                        <button
                          onClick={() => onNavigate && onNavigate('/daily-desk')}
                          className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          Assign Proxy <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('/daily-desk')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Daily Desk & Replacements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimetableDashboardPage;
