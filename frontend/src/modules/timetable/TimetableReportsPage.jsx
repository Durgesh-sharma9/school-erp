import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Search,
  Filter,
  Users,
  Eye,
  Download,
  Printer,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Plus,
  X,
  BookmarkCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function TimetableReportsPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [dateFilter, setDateFilter] = useState(todayStr);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Report Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // New Submission Modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submissionForm, setSubmissionForm] = useState({
    teacherId: 't_sharma',
    reportDate: todayStr,
    description: '',
    entryType: 'LESSON',
    activityCategory: 'Scholastic',
    activityDescription: '',
    learningOutcome: '',
    isCompleted: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/api/timetable/reports?';
      if (dateFilter) url += `date=${dateFilter}&`;
      if (teacherSearch) url += `teacherName=${encodeURIComponent(teacherSearch)}&`;

      const res = await fetch(url, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setReports(json.data || []);
      }
    } catch {
      toast.error('Failed to load daily reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [schoolId, dateFilter, teacherSearch]);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!submissionForm.description.trim()) {
      toast.error('Please describe what was covered in class');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        teacherId: submissionForm.teacherId,
        reportDate: submissionForm.reportDate,
        entries: [
          {
            classId: 'c_10a',
            subjectId: 'sub_math',
            description: submissionForm.description,
            isCompleted: submissionForm.isCompleted,
            entryType: submissionForm.entryType,
            activityCategory: submissionForm.activityCategory,
            activityDescription: submissionForm.activityDescription,
            learningOutcome: submissionForm.learningOutcome
          }
        ]
      };

      const res = await fetch('/api/timetable/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Daily report submitted successfully!');
        setSubmitModalOpen(false);
        setSubmissionForm({
          teacherId: 't_sharma',
          reportDate: todayStr,
          description: '',
          entryType: 'LESSON',
          activityCategory: 'Scholastic',
          activityDescription: '',
          learningOutcome: '',
          isCompleted: true
        });
        fetchReports();
      } else {
        toast.error('Could not submit report');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (!reports.length) return;
    let csv = 'Report Date,Teacher,Email,Sessions Logged,Proxy Sessions,Status\n';
    reports.forEach((r) => {
      csv += `"${r.reportDate}","${r.teacherName}","${r.teacherEmail}",${r.totalSessions || 0},${r.proxyCount || 0},"${r.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daily_Teacher_Reports_${dateFilter || todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reports exported to CSV');
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalReports = reports.length;
    let totalSessions = 0;
    let totalProxies = 0;
    reports.forEach((r) => {
      totalSessions += r.totalSessions || 0;
      totalProxies += r.proxyCount || 0;
    });
    return { totalReports, totalSessions, totalProxies };
  }, [reports]);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Daily Faculty Teaching Reports
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
              <FileText className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/timetable-dashboard')} className="hover:text-indigo-600 transition-colors">
              Timetable Pro
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Reports</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            />
          </div>

          <button
            onClick={fetchReports}
            title="Refresh Reports"
            className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="h-9 px-3 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-xs text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>File Daily Log</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Faculty Reports</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <FileText className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{stats.totalReports}</h3>
            <p className="text-[11px] text-cyan-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> Logged for selected date
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Classroom Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-600 mt-2">{stats.totalSessions}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> Topics delivered in class
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Proxy Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-600 mt-2">{stats.totalProxies}</h3>
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> Substitution periods covered
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Compliance Rate</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookmarkCheck className="w-4.5 h-4.5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-purple-600 mt-2">100%</h3>
            <p className="text-[11px] text-purple-500 font-semibold flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" /> End-of-day signoffs completed
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
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Dashboard</p>
              <p className="text-[10px] text-slate-400 truncate">Live Metrics</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetables')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Time Tables</p>
              <p className="text-[10px] text-slate-400 truncate">Master routines</p>
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
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
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
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Lesson Plans</p>
              <p className="text-[10px] text-slate-400 truncate">Curriculum tracker</p>
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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Select Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-medium"
            />
          </div>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by faculty name..."
              value={teacherSearch}
              onChange={(e) => setTeacherSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Show All Dates
          </button>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5 w-32">Report Date</th>
                <th className="p-3.5">Faculty Member</th>
                <th className="p-3.5 w-36 text-center">Sessions Logged</th>
                <th className="p-3.5 w-36 text-center">Proxy Duties</th>
                <th className="p-3.5 w-32 text-center">Status</th>
                <th className="p-3.5 w-28 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-800">{rep.reportDate}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{rep.teacherName}</div>
                    <div className="text-[11px] text-slate-400">{rep.teacherEmail}</div>
                  </td>
                  <td className="p-3.5 text-center font-bold text-slate-800">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                      {rep.totalSessions || rep.entries?.length || 0} Periods
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {rep.proxyCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {rep.proxyCount} Proxy
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">None</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {rep.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedReport(rep);
                        setDetailModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-xs text-slate-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}

              {reports.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    No teaching reports filed for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* View Full Report Modal */}
      {detailModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedReport.teacherName} ?" Daily Log</h3>
                <p className="text-xs text-slate-500">Filed on {selectedReport.reportDate} (Status: {selectedReport.status})</p>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Periods & Curriculum Delivered:</h4>

              <div className="space-y-3">
                {(selectedReport.entries || []).map((ent, idx) => (
                  <div
                    key={ent.id || idx}
                    className={`p-4 rounded-xl border space-y-2 ${
                      ent.isProxy ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ent.className}</span>
                        <span className="text-slate-400">|</span>
                        <span className="font-bold text-indigo-700">{ent.subjectName}</span>
                        {ent.isProxy && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-bold">
                            Proxy / Substitution
                          </span>
                        )}
                      </div>
                      <span className="text-emerald-700 font-bold inline-flex items-center gap-1 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                      {ent.description}
                    </p>

                    {ent.learningOutcome && (
                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800">Outcome: </strong> {ent.learningOutcome}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Daily Log Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">File Daily Teaching Log</h3>
                <p className="text-xs text-slate-500">Record classroom progress for today</p>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={submissionForm.reportDate}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, reportDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What did you cover in class today? *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Completed Chapter 4 Exercise 4.3; explained discriminant rules with practical blackboard problems..."
                  value={submissionForm.description}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Learning Outcome Verified</label>
                <input
                  type="text"
                  placeholder="e.g. 95% of students solved question 4 accurately"
                  value={submissionForm.learningOutcome}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, learningOutcome: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#5c67f6] hover:bg-indigo-600 rounded-lg shadow-xs transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetableReportsPage;
