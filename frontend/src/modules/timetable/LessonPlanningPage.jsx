import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Filter,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Printer,
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Sparkles,
  BookmarkCheck,
  GraduationCap,
  X,
  RefreshCw,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function LessonPlanningPage({ onNavigate }) {
  const { schoolId, user } = useAuth();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Create Plan Form
  const [planForm, setPlanForm] = useState({
    lessonTitle: '',
    planDate: todayStr,
    teacherId: 't_sharma',
    classId: 'c_10a',
    subjectId: 'sub_math',
    periodId: 'p_1',
    topic: '',
    chapter: '',
    subtopic: '',
    teachingAids: '',
    activities: '',
    homework: '',
    learningOutcomes: '',
    estimatedDuration: 45,
    status: 'PLANNED'
  });
  const [submittingPlan, setSubmittingPlan] = useState(false);

  const fetchLessonPlans = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/timetable/lesson-plans?`;
      if (dateFrom) url += `dateFrom=${dateFrom}&`;
      if (dateTo) url += `dateTo=${dateTo}&`;
      if (classFilter !== 'all') url += `classId=${classFilter}&`;
      if (subjectFilter !== 'all') url += `subjectId=${subjectFilter}&`;
      if (teacherFilter !== 'all') url += `teacherId=${teacherFilter}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setLessonPlans(json.data || []);
      }
    } catch {
      toast.error('Could not load lesson plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, [schoolId, dateFrom, dateTo, classFilter, subjectFilter, teacherFilter, statusFilter, searchQuery]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planForm.lessonTitle.trim()) {
      toast.error('Please enter a lesson title');
      return;
    }

    setSubmittingPlan(true);
    try {
      const res = await fetch('http://localhost:5000/api/timetable/lesson-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(planForm)
      });
      if (res.ok) {
        toast.success('Lesson plan created successfully!');
        setCreateModalOpen(false);
        setPlanForm({
          lessonTitle: '',
          planDate: todayStr,
          teacherId: 't_sharma',
          classId: 'c_10a',
          subjectId: 'sub_math',
          periodId: 'p_1',
          topic: '',
          chapter: '',
          subtopic: '',
          teachingAids: '',
          activities: '',
          homework: '',
          learningOutcomes: '',
          estimatedDuration: 45,
          status: 'PLANNED'
        });
        fetchLessonPlans();
      } else {
        toast.error('Failed to create lesson plan');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmittingPlan(false);
    }
  };

  const handleStatusChange = async (planId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/lesson-plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Plan marked as ${newStatus}`);
        fetchLessonPlans();
        if (activeLesson && activeLesson.id === planId) {
          setActiveLesson({ ...activeLesson, status: newStatus });
        }
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activeLesson) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/lesson-plans/${activeLesson.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify({
          content: newComment.trim(),
          authorName: user?.name || 'Administrator'
        })
      });
      if (res.ok) {
        const json = await res.json();
        toast.success('Feedback comment added');
        setNewComment('');
        const updatedComments = [...(activeLesson.comments || []), json.data];
        setActiveLesson({ ...activeLesson, comments: updatedComments });
        fetchLessonPlans();
      }
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this lesson plan?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/lesson-plans/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        toast.success('Lesson plan deleted');
        if (detailModalOpen) setDetailModalOpen(false);
        fetchLessonPlans();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExportCSV = () => {
    if (!lessonPlans.length) return;
    let csv = 'Plan Date,Class,Subject,Faculty,Lesson Title,Chapter,Topic,Estimated Mins,Status\n';
    lessonPlans.forEach((p) => {
      csv += `"${p.planDate}","${p.class?.name || ''}","${p.subject?.name || ''}","${p.teacher?.name || ''}","${p.lessonTitle}","${p.chapter || ''}","${p.topic || ''}",${p.estimatedDuration || 45},"${p.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Lesson_Plans_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Lesson plans exported to CSV');
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = lessonPlans.length;
    const completed = lessonPlans.filter((p) => p.status === 'COMPLETED').length;
    const planned = lessonPlans.filter((p) => p.status === 'PLANNED').length;
    const skipped = lessonPlans.filter((p) => p.status === 'SKIPPED' || p.status === 'CANCELLED').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, planned, skipped, completionRate };
  }, [lessonPlans]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span>;
      case 'PLANNED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Planned</span>;
      case 'SKIPPED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Skipped</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Curriculum & Pedagogy Tracking
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Lesson Planning & Academic Execution</h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized teacher lesson plans, chapter objectives, learning outcomes and principal review
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchLessonPlans}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Plans"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Lesson Plan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Lesson Plans</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.total}</p>
            <span className="text-[11px] text-slate-500">Across all classes</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Lessons</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{stats.completed}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">{stats.completionRate}% completion rate</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Planned / In Progress</span>
            <p className="text-2xl font-black text-purple-600 mt-0.5">{stats.planned}</p>
            <span className="text-[11px] text-purple-600 font-medium">Scheduled ahead</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skipped / Rescheduled</span>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{stats.skipped}</p>
            <span className="text-[11px] text-slate-400">Activity readjustments</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lesson title, chapter or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="PLANNED">Planned</option>
            <option value="COMPLETED">Completed</option>
            <option value="SKIPPED">Skipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Date range inputs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
            />
            <span>To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
            />
          </div>

          {(dateFrom || dateTo || classFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setClassFilter('all');
                setSubjectFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Lesson Plans Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5 w-28">Date</th>
                <th className="p-3.5 w-28">Class</th>
                <th className="p-3.5 w-32">Subject</th>
                <th className="p-3.5 w-40">Faculty</th>
                <th className="p-3.5">Lesson Title & Chapter</th>
                <th className="p-3.5 w-28 text-center">Status</th>
                <th className="p-3.5 w-36 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {lessonPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-800">{plan.planDate}</td>
                  <td className="p-3.5 font-bold text-indigo-700">{plan.class?.name || 'Class'}</td>
                  <td className="p-3.5 font-medium text-slate-700">{plan.subject?.name || 'Subject'}</td>
                  <td className="p-3.5 text-slate-800 font-semibold">{plan.teacher?.name || 'Faculty'}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{plan.lessonTitle}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {plan.chapter && <span className="font-semibold text-slate-600">{plan.chapter} ?" </span>}
                      {plan.topic}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">{getStatusBadge(plan.status)}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setActiveLesson(plan);
                          setDetailModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors"
                        title="View Full Lesson Plan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <select
                        value={plan.status}
                        onChange={(e) => handleStatusChange(plan.id, e.target.value)}
                        className="px-2 py-1 text-[11px] font-bold border border-slate-200 rounded-lg bg-white text-slate-700"
                      >
                        <option value="PLANNED">Planned</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="SKIPPED">Skipped</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {lessonPlans.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    No lesson plans matching criteria. Click &quot;New Lesson Plan&quot; to schedule one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Lesson Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900">New Lesson Plan</h3>
                <p className="text-xs text-slate-500">Record curriculum objectives and classroom activities</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plan Date *</label>
                  <input
                    type="date"
                    required
                    value={planForm.planDate}
                    onChange={(e) => setPlanForm({ ...planForm, planDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Duration (mins)</label>
                  <input
                    type="number"
                    value={planForm.estimatedDuration}
                    onChange={(e) => setPlanForm({ ...planForm, estimatedDuration: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations & Finding Real Roots"
                  value={planForm.lessonTitle}
                  onChange={(e) => setPlanForm({ ...planForm, lessonTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chapter</label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter 4"
                    value={planForm.chapter}
                    onChange={(e) => setPlanForm({ ...planForm, chapter: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Algebra & Polynomials"
                    value={planForm.topic}
                    onChange={(e) => setPlanForm({ ...planForm, topic: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teaching Aids & Materials</label>
                <input
                  type="text"
                  placeholder="e.g. Smartboard, NCERT Exemplar, Lab Kit"
                  value={planForm.teachingAids}
                  onChange={(e) => setPlanForm({ ...planForm, teachingAids: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Activities Planned</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Group problem solving session, litmus test demonstration..."
                  value={planForm.activities}
                  onChange={(e) => setPlanForm({ ...planForm, activities: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Learning Outcomes Expected</label>
                <textarea
                  rows={2}
                  placeholder="Students should be able to solve quadratic formulas and identify root properties..."
                  value={planForm.learningOutcomes}
                  onChange={(e) => setPlanForm({ ...planForm, learningOutcomes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Homework Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. Exercise 4.3 questions 1 to 6 in homework notebook"
                  value={planForm.homework}
                  onChange={(e) => setPlanForm({ ...planForm, homework: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
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
                  disabled={submittingPlan}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                >
                  {submittingPlan ? 'Saving...' : 'Save Lesson Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Plan Detail & Comments Modal */}
      {detailModalOpen && activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">{activeLesson.lessonTitle}</h3>
                {getStatusBadge(activeLesson.status)}
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date</span>
                  <span className="font-bold text-slate-800">{activeLesson.planDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Class</span>
                  <span className="font-bold text-slate-800">{activeLesson.class?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Subject</span>
                  <span className="font-bold text-slate-800">{activeLesson.subject?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Faculty</span>
                  <span className="font-bold text-slate-800">{activeLesson.teacher?.name}</span>
                </div>
              </div>

              {activeLesson.chapter && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Chapter & Topic</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {activeLesson.chapter} ?" {activeLesson.topic}
                  </p>
                </div>
              )}

              {activeLesson.teachingAids && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Teaching Aids & Tools</span>
                  <p className="text-xs text-slate-700 mt-0.5">{activeLesson.teachingAids}</p>
                </div>
              )}

              {activeLesson.activities && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Planned Classroom Activities</span>
                  <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap">{activeLesson.activities}</p>
                </div>
              )}

              {activeLesson.learningOutcomes && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Target Learning Outcomes</span>
                  <p className="text-xs text-slate-700 mt-0.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-950 font-medium">
                    {activeLesson.learningOutcomes}
                  </p>
                </div>
              )}

              {activeLesson.homework && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Homework Assigned</span>
                  <p className="text-xs text-slate-700 mt-0.5 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-indigo-950">
                    {activeLesson.homework}
                  </p>
                </div>
              )}

              {/* Comments / Admin Feedback Thread */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  Admin Review & Teacher Discussion ({activeLesson.comments?.length || 0})
                </span>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(!activeLesson.comments || activeLesson.comments.length === 0) ? (
                    <p className="text-xs text-slate-400 italic">No feedback comments recorded yet.</p>
                  ) : (
                    activeLesson.comments.map((comm) => (
                      <div key={comm.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{comm.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {comm.createdAt ? new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-slate-600">{comm.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Write a feedback or approval note..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonPlanningPage;
