import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileText,
  Award,
  Calendar,
  ArrowUpRight,
  Search,
  X,
  GraduationCap,
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
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { SyllabusSessionBanner } from '../../components/SyllabusSessionBanner';

export function SyllabusDashboardPage({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [drilldownTeacher, setDrilldownTeacher] = useState(null);
  const [drilldownData, setDrilldownData] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await syllabusApi.getDashboardAnalytics();
      setAnalytics(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const onSessChange = () => loadData();
    window.addEventListener('syllabus-session-changed', onSessChange);
    return () => window.removeEventListener('syllabus-session-changed', onSessChange);
  }, []);

  const openTeacherDrilldown = async (teacherName) => {
    setDrilldownTeacher(teacherName);
    setDrilldownData(null);
    try {
      const res = await syllabusApi.getTeacherDrilldown(teacherName);
      setDrilldownData(res);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading Academic Operations &amp; Syllabus Analytics...
      </div>
    );
  }

  const kpis = analytics?.kpis || {};
  const activeTerm = analytics?.activeTerm;
  const vel = analytics?.velocityBreakdown || {};
  const filteredTeachers = (analytics?.teacherPerformance || []).filter((t) =>
    t.teacherName.toLowerCase().includes(teacherSearch.toLowerCase()),
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Academic Operations &amp; Syllabus Dashboard</h1>
              <p className="text-xs text-slate-500">Real-time curriculum completion, timeline velocity, exam papers &amp; CBSE CPD compliance</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SyllabusSessionBanner onSessionReload={loadData} />
          <button
            type="button"
            onClick={() => onNavigate?.('/syllabus-structure')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" /> Manage Syllabus
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('/syllabus-sessions')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
          >
            Sessions
          </button>
        </div>
      </div>

      {/* Active Term Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
            <Calendar className="w-3.5 h-3.5" />
            {activeTerm ? `${activeTerm.name} (${activeTerm.status})` : 'No Active Academic Timeline Configured'}
          </div>
          {activeTerm ? (
            <h2 className="text-lg font-extrabold">
              {activeTerm.elapsedWorkingDays} / {activeTerm.effectiveWorkingDays} Effective Working Days Elapsed ({activeTerm.timeProgressPercentage}% Target Pace)
            </h2>
          ) : (
            <h2 className="text-lg font-extrabold">Set up your school academic calendar to track schedule pacing</h2>
          )}
          {activeTerm && (
            <p className="text-xs text-indigo-100">
              {activeTerm.startDate} to {activeTerm.endDate} • {activeTerm.holidayDays} Holidays • {activeTerm.vacationDays} Vacation Days • {activeTerm.remainingWorkingDays} Days Remaining
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate?.('/syllabus-academic-timeline')}
            className="px-4 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
          >
            Open Academic Timeline <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Overall Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">{kpis.overallCompletion || 0}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpis.completedChapters || 0} completed • {kpis.inProgressChapters || 0} in progress / {kpis.totalChapters || 0} ch
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Synced ERP Scope</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">{kpis.totalClasses || 0} Classes</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpis.totalSubjects || 0} Active Subjects • {kpis.totalTeachers || 0} Faculty
          </div>
        </div>

        <div
          onClick={() => onNavigate?.('/syllabus-exam-papers')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Exam Papers</span>
            <FileText className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">{kpis.totalExamPapers || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {kpis.reviewedPapers || 0} Reviewed &amp; Approved
          </div>
        </div>

        <div
          onClick={() => onNavigate?.('/syllabus-teacher-training')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>CPD Pending Approvals</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1.5">{kpis.pendingApprovals || 0}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Teacher 50h CBSE training submissions awaiting review
          </div>
        </div>
      </div>

      {/* Velocity Snapshot + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Class-Wise Syllabus Completion</h3>
              <p className="text-xs text-slate-500">Target timeline pace: {vel.targetPct || 0}%</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('/syllabus-progress')}
              className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              Full Progress Analytics <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.completionByClass || []} margin={{ top: 10, right: 16, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Completion']} />
                <Bar dataKey="completionPercentage" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Chapter Workflow Split</h3>
            <p className="text-xs text-slate-500">Faculty velocity: {vel.aheadCount || 0} Ahead • {vel.onPaceCount || 0} On Pace • {vel.behindCount || 0} Behind</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics?.statusDistribution || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3}>
                  {(analytics?.statusDistribution || []).map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[11px] font-bold">
            {(analytics?.statusDistribution || []).map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}: {s.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Performance Table + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Faculty Curriculum Pacing (Click to Drilldown)</h3>
            </div>
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Filter teacher..."
                className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Teacher</th>
                  <th className="py-2.5 px-4">Classes / Subjects</th>
                  <th className="py-2.5 px-4">Progress</th>
                  <th className="py-2.5 px-4">Pacing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">No faculty data yet for this session.</td>
                  </tr>
                ) : (
                  filteredTeachers.map((t) => (
                    <tr
                      key={t.teacherName}
                      onClick={() => openTeacherDrilldown(t.teacherName)}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">{t.teacherName}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-semibold">{t.subjects.join(', ')}</div>
                        <div className="text-[11px] text-slate-400">{t.classes.join(', ')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${t.completionPercentage}%` }} />
                          </div>
                          <span className="font-bold text-slate-800">{t.completionPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.velocityStatus === 'AHEAD'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : t.velocityStatus === 'ON_PACE'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {t.velocityStatus.replace('_', ' ')} ({t.paceDelta >= 0 ? `+${t.paceDelta}` : t.paceDelta}%)
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Syllabus Updates</h3>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {(analytics?.recentUpdates || []).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No recent updates logged yet.</div>
            ) : (
              analytics.recentUpdates.map((upd) => (
                <div key={upd.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-slate-800">{upd.chapterName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {upd.completionPercentage}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {upd.className} • {upd.subjectName} — by <strong>{upd.teacherName}</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Teacher Drilldown Modal */}
      {drilldownTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Faculty Curriculum Detail — {drilldownTeacher}</h3>
                <p className="text-xs text-slate-500">Assigned classes, subjects, and 3-step chapter progress</p>
              </div>
              <button onClick={() => setDrilldownTeacher(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!drilldownData ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading faculty chapters...</div>
              ) : drilldownData.subjects.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No subjects mapped yet.</div>
              ) : (
                drilldownData.subjects.map((sub) => (
                  <div key={sub.classSubjectId} className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900">
                        {sub.className} — {sub.subjectName}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {sub.completionPercentage}% Done
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {sub.chapters.map((ch) => (
                        <div key={ch.id} className="py-2 flex items-center justify-between text-xs">
                          <span className="text-slate-700">Ch {ch.chapterNo}: {ch.name}</span>
                          <span className="font-bold text-slate-600">
                            {[
                              ch.teachingCompleted ? 'Teach ✓' : 'Teach ✗',
                              ch.qaCompleted ? 'Q&A ✓' : 'Q&A ✗',
                              ch.copyCheckedCompleted ? 'Copy ✓' : 'Copy ✗',
                            ].join(' • ')}
                          </span>
                        </div>
                      ))}
                    </div>
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
