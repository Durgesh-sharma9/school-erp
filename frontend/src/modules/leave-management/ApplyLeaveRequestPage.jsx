import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  GraduationCap,
  Calendar,
  Send,
  RotateCcw,
  Trash2,
  ArrowLeft,
  Eye,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ALL_CLASSES = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ALL_SECTIONS = ['A', 'B', 'C', 'D'];

const LEAVE_TYPES = [
  'Casual Leave (CL)',
  'Medical / Sick Leave (ML)',
  'Earned Leave (EL)',
  'Maternity Leave',
  'Duty Leave',
  'Academic Leave',
  'Special Casual Leave',
  'Emergency Personal Leave'
];

export function ApplyLeaveRequestPage({ onNavigate }) {
  const [applicantType, setApplicantType] = useState('Staff'); // 'Staff' or 'Student'
  const [applicantName, setApplicantName] = useState('');
  const [className, setClassName] = useState('X');
  const [section, setSection] = useState('A');
  const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('2026-04-20');
  const [toDate, setToDate] = useState('2026-04-21');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [selectedFeedItem, setSelectedFeedItem] = useState(null);

  const calculateDays = () => {
    try {
      const d1 = new Date(fromDate);
      const d2 = new Date(toDate);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 1;
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const totalDays = calculateDays();

  const fetchMyLeaves = () => {
    const url = applicantType === 'Staff'
      ? '/api/leave-management/staff-leaves?type=All'
      : '/api/leave-management/student-leaves?type=All';
    fetch(url)
      .then(res => res.json())
      .then(d => {
        if (d.success) setMyLeaves(d.data || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [applicantType]);

  const handleReset = () => {
    setApplicantName('');
    setReason('');
    setLeaveType('Casual Leave (CL)');
    setFromDate('2026-04-20');
    setToDate('2026-04-21');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      toast.error('Please enter applicant name');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for the leave');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leave-management/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantType,
          applicantName,
          className,
          section,
          fromDate,
          toDate,
          leaveType,
          reason
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Leave application submitted successfully!');
        handleReset();
        fetchMyLeaves();
      } else {
        toast.error(data.message || 'Failed to submit leave');
      }
    } catch {
      toast.error('Network error. Failed to reach server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeedItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave application?')) return;
    try {
      const endpoint = applicantType === 'Staff'
        ? `/api/leave-management/staff-leaves/${id}`
        : `/api/leave-management/student-leaves/${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Leave application removed');
        fetchMyLeaves();
        if (selectedFeedItem && selectedFeedItem.id === id) {
          setSelectedFeedItem(null);
        }
      }
    } catch {
      toast.error('Failed to delete application');
    }
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FilePlus className="w-6 h-6 text-indigo-600" />
            Add Leave Request
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate(applicantType === 'Staff' ? '/staff-leave-requests' : '/all-leave-requests')}
            >
              Leave Management
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Add Leave Request</span>
          </div>
        </div>

        {/* Quick link button to view requests */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={() => onNavigate && onNavigate(applicantType === 'Staff' ? '/staff-leave-requests' : '/all-leave-requests')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> View {applicantType} Requests
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Form: Apply Leave */}
        <div className="lg:col-span-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-indigo-600" />
            Submit New Leave Application
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Applicant Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Applicant Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setApplicantType('Staff')}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    applicantType === 'Staff'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Staff Member
                </button>
                <button
                  type="button"
                  onClick={() => setApplicantType('Student')}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    applicantType === 'Student'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" /> Student
                </button>
              </div>
            </div>

            {/* Applicant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {applicantType === 'Staff' ? 'Staff Full Name *' : 'Student Full Name *'}
              </label>
              <input
                type="text"
                placeholder={`Enter ${applicantType.toLowerCase()} name...`}
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            {/* If Student, Class and Section */}
            {applicantType === 'Student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                  <select
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    {ALL_CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Section</label>
                  <select
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    {ALL_SECTIONS.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Leave Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Leave Type *</label>
              <select
                value={leaveType}
                onChange={e => setLeaveType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                {LEAVE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">From Date *</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">To Date *</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Total Days computed badge */}
            <div className="p-2.5 bg-slate-100 rounded text-xs flex justify-between items-center text-slate-700">
              <span className="font-semibold">Calculated Leave Duration:</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Reason / Description *</label>
              <textarea
                rows={3}
                placeholder="Explain the detailed purpose or medical condition..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Form
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Leave Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Right List: Recent Applications */}
        <div className="lg:col-span-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Recent {applicantType} Applications ({myLeaves.length})
            </h3>
            <span className="text-[11px] text-slate-400">Live Status Feed</span>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto max-h-[580px]">
            {myLeaves.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No recent leave requests found for {applicantType.toLowerCase()}.
              </div>
            ) : (
              myLeaves.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-200 transition-colors shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {item.staffName || item.studentName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {item.leaveType} &bull; {item.totalDays} {item.totalDays === 1 ? 'Day' : 'Days'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {item.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {item.status}
                      </span>
                      <button
                        onClick={() => handleDeleteFeedItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete this request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">
                    "{item.reason}"
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Duration: <strong className="text-slate-700">{item.fromDate} to {item.toDate}</strong></span>
                    <span>Applied: {item.appliedDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeaveRequestPage;
