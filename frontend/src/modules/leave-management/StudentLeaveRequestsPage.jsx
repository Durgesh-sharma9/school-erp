import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  FileText,
  Calendar,
  Filter,
  User,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

const ALL_CLASSES = ['All', 'Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export function StudentLeaveRequestsPage({ onNavigate }) {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [filterType, setFilterType] = useState('All'); // 'All', 'Date Wise', 'Class Wise'
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-04-30');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaves = () => {
    const params = new URLSearchParams({
      type: filterType,
      fromDate,
      toDate,
      className: selectedClass
    });
    fetch(`/api/leave-management/student-leaves?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setLeaves(d.data || []);
          setSummary(d.summary || { total: 0, approved: 0, pending: 0, rejected: 0 });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeaves();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/leave-management/student-leaves/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Leave request ${status.toLowerCase()}`);
        fetchLeaves();
      }
    } catch {
      toast.error('Failed to update leave status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;
    try {
      const res = await fetch(`/api/leave-management/student-leaves/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Leave record deleted');
        fetchLeaves();
      }
    } catch {
      toast.error('Failed to delete leave');
    }
  };

  const filteredLeaves = leaves.filter(l =>
    l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            Student Leave Requests
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Student Leave Requests</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={() => onNavigate && onNavigate('apply-leave-request')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Apply Leave
          </button>
        </div>
      </div>

      {/* Filter Card matching UAB: Type (All, Date Wise, Class Wise) */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="All">All</option>
              <option value="Date Wise">Date Wise</option>
              <option value="Class Wise">Class Wise</option>
            </select>
          </div>

          {filterType === 'Date Wise' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          {filterType === 'Class Wise' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {ALL_CLASSES.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Students</label>
                <select
                  defaultValue="All"
                  className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Students</option>
                </select>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="py-1.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </form>

        {/* Status Count Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">
            Total : <span className="text-indigo-600">{summary.total}</span>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved : <span>{summary.approved}</span>
          </div>
          <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-bold text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending : <span>{summary.pending}</span>
          </div>
          <div className="px-3 py-1 bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-800 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected : <span>{summary.rejected}</span>
          </div>

          <div className="ml-auto w-full md:w-64">
            <input
              type="text"
              placeholder="Search student, reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-3 pr-3 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-14">S.NO.</th>
                <th className="py-2.5 px-3">STUDENT NAME</th>
                <th className="py-2.5 px-3">CLASS & SEC</th>
                <th className="py-2.5 px-3">LEAVE TYPE</th>
                <th className="py-2.5 px-3 text-center">FROM DATE</th>
                <th className="py-2.5 px-3 text-center">TO DATE</th>
                <th className="py-2.5 px-3 text-center">DAYS</th>
                <th className="py-2.5 px-3">REASON</th>
                <th className="py-2.5 px-3 text-center">ATTACHMENT</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400">
                    No Data Found
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave, index) => (
                  <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{leave.studentName}</div>
                      <div className="text-[10px] text-slate-400">Roll No: {leave.rollNo}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-semibold">
                      {leave.className} - {leave.section}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">{leave.fromDate}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">{leave.toDate}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">{leave.totalDays}</td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {leave.attachment ? (
                        <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer flex items-center justify-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> View
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        leave.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : leave.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {leave.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {leave.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {leave.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(leave.id, 'Approved')}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                              title="Approve Leave"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(leave.id, 'Rejected')}
                              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                              title="Reject Leave"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(leave.id)}
                          className="p-1 hover:bg-slate-200 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default StudentLeaveRequestsPage;
