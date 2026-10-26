import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Calendar,
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  Edit3,
  Download,
  Printer,
  RefreshCw,
  BookOpen,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function TimetableHomeworkPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [dateFilter, setDateFilter] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    classId: 'c_10a',
    teacherId: 't_sharma',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: 'SENT_TO_ADMIN'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/timetable/homework?';
      if (dateFilter) url += `date=${dateFilter}&`;
      if (classFilter !== 'all') url += `classId=${classFilter}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;

      const res = await fetch(url, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setHomeworkList(json.data || []);
      }
    } catch {
      toast.error('Could not load homework assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, [schoolId, dateFilter, classFilter, statusFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/timetable/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Homework assignment recorded');
        setCreateModalOpen(false);
        setForm({
          title: '',
          description: '',
          classId: 'c_10a',
          teacherId: 't_sharma',
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          status: 'SENT_TO_ADMIN'
        });
        fetchHomework();
      } else {
        toast.error('Failed to create homework');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/homework/${editingItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success('Homework updated successfully');
        setEditModalOpen(false);
        setEditingItem(null);
        fetchHomework();
      } else {
        toast.error('Failed to update homework');
      }
    } catch {
      toast.error('Network request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework assignment?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/homework/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        toast.success('Homework deleted');
        fetchHomework();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleOpenEdit = (hw) => {
    setEditingItem(hw);
    setForm({
      title: hw.title,
      description: hw.description,
      classId: hw.classId,
      teacherId: hw.teacherId,
      dueDate: hw.dueDate || '',
      status: hw.status
    });
    setEditModalOpen(true);
  };

  const handleExportCSV = () => {
    if (!homeworkList.length) return;
    let csv = 'Class,Faculty,Title,Description,Due Date,Status\n';
    homeworkList.forEach((hw) => {
      csv += `"${hw.class?.name || ''}","${hw.teacher?.name || ''}","${hw.title}","${hw.description.replace(/"/g, '""')}","${hw.dueDate || ''}","${hw.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Homework_Registry_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported homework records to CSV');
  };

  // Filtered List
  const filteredList = useMemo(() => {
    if (!searchQuery) return homeworkList;
    const q = searchQuery.toLowerCase();
    return homeworkList.filter(
      (h) => h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q)
    );
  }, [homeworkList, searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" /> Homework Pro & Daily Assignment Registry
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Class Homework & Self-Study Central</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily assignments assigned by subject teachers, submission due dates and student homework load
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchHomework}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Homework"
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
            onClick={() => {
              setEditingItem(null);
              setForm({
                title: '',
                description: '',
                classId: 'c_10a',
                teacherId: 't_sharma',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                status: 'SENT_TO_ADMIN'
              });
              setCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Assign Homework
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Homework Records</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{homeworkList.length}</p>
            <span className="text-[11px] text-slate-500">Across current curriculum</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved & Sent to Admin</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {homeworkList.filter((h) => h.status === 'SENT_TO_ADMIN').length}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Visible to students</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Drafts in Progress</span>
            <p className="text-2xl font-black text-amber-600 mt-0.5">
              {homeworkList.filter((h) => h.status === 'DRAFT').length}
            </p>
            <span className="text-[11px] text-slate-500">Pending submission</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, chapter or homework keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="SENT_TO_ADMIN">Sent to Admin / Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Homework Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map((hw) => (
          <div
            key={hw.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {hw.class?.name || 'Class'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    hw.status === 'SENT_TO_ADMIN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {hw.status === 'SENT_TO_ADMIN' ? 'Active' : 'Draft'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{hw.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {hw.description}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span>Assigned By:</span>
                  <strong className="text-slate-700">{hw.teacher?.name || 'Faculty'}</strong>
                </div>
                {hw.dueDate && (
                  <div className="flex items-center justify-between">
                    <span>Due Date:</span>
                    <strong className="text-rose-700 font-bold">{hw.dueDate}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(hw.id)}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>

              <button
                onClick={() => handleOpenEdit(hw)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">No Homework Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              There are no homework tasks matching your current filters.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700 transition-colors"
            >
              Assign Homework
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(createModalOpen || editModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editModalOpen ? 'Edit Homework Assignment' : 'Assign Homework to Class'}
                </h3>
                <p className="text-xs text-slate-500">Provide assignment details and submission deadline</p>
              </div>
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editModalOpen ? handleEditSubmit : handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Homework Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics - Quadratic Equations Exercise 4.3"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Instructions *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Solve problems 1 to 8 in homework notebook. Highlight roots with negative discriminant."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
                  >
                    <option value="SENT_TO_ADMIN">Sent to Admin / Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
                >
                  {submitting ? 'Saving...' : editModalOpen ? 'Update Homework' : 'Assign Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetableHomeworkPage;
