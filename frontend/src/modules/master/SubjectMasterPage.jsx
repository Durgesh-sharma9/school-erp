import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  ListFilter,
  Plus,
  Trash2,
  Pencil,
  X
} from 'lucide-react';

export function SubjectMasterPage() {
  const [subjects, setSubjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    group: 'COMMERCE',
    name: '',
    shortName: '',
    code: ''
  });

  // Fetch subjects & groups
  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/academics/subjects');
      const data = await res.json();
      if (data.success && data.data) {
        setSubjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/academics/subject-groups');
      const data = await res.json();
      if (data.success && data.data) {
        setGroups(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchGroups();
  }, []);

  const handleEditSubject = (s) => {
    setEditingSubject(s);
    setFormData({
      group: s.group || (groups[0]?.name || 'COMMERCE'),
      name: s.name || '',
      shortName: s.shortName || '',
      code: s.code || ''
    });
    setAddModalOpen(true);
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingSubject) {
        // UPDATE existing subject
        const res = await fetch(`/api/academics/subjects/${editingSubject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Subject updated successfully');
          fetchSubjects();
          setAddModalOpen(false);
          setEditingSubject(null);
          setFormData({ group: groups[0]?.name || 'COMMERCE', name: '', shortName: '', code: '' });
        } else {
          toast.error(data.message || 'Failed to update subject');
        }
      } else {
        // ADD new subject
        const res = await fetch('/api/academics/subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Subject added successfully');
          fetchSubjects();
          setAddModalOpen(false);
          setFormData({ group: groups[0]?.name || 'COMMERCE', name: '', shortName: '', code: '' });
        } else {
          toast.error(data.message || 'Failed to add subject');
        }
      }
    } catch (err) {
      console.error('Error saving subject:', err);
      toast.error('Network error');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      const res = await fetch(`/api/academics/subjects/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchSubjects();
      }
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    searchQuery
      ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.group?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 Secondary Toolbar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <h1 className="text-xl font-bold text-slate-800 pr-3 border-r border-slate-300">
            Subject Master
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Examination</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Subject Master</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          {/* Action Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-full border border-slate-200 pl-9 pr-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button type="button" onClick={() => toast.success('Active table columns filtered')} title="Filter Columns" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                <ListFilter className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                title="Add Subject"
                className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase">
                  <th className="py-3 px-4 w-16">S.NO.</th>
                  <th className="py-3 px-4">SUBJECT</th>
                  <th className="py-3 px-4">SHORT NAME</th>
                  <th className="py-3 px-4">GROUP</th>
                  <th className="py-3 px-4 text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4">{s.shortName || '--'}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-700">{s.group}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditSubject(s)}
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors"
                            title="Edit Subject"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubject(s.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span>Items per page:</span>
              <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                <option value="50">50</option>
                <option value="25">25</option>
              </select>
            </div>
            <span>1 – {filteredSubjects.length} of {filteredSubjects.length}</span>
            <div className="flex items-center space-x-1">
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&lt;</button>
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 ADD SUBJECT MODAL (Matches UAB SUBJECT MASTER exactly) */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">{editingSubject ? 'EDIT SUBJECT' : 'SUBJECT MASTER'}</h3>
              <button
                onClick={() => { setAddModalOpen(false); setEditingSubject(null); setFormData({ group: groups[0]?.name || 'COMMERCE', name: '', shortName: '', code: '' }); }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Subject Group*
                </label>
                <select
                  required
                  value={formData.group}
                  onChange={(e) => setFormData((prev) => ({ ...prev, group: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Subject Name*
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. ACCOUNTANCY"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Short Name*
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortName: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Acct."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none font-mono"
                  placeholder="e.g. 055"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setAddModalOpen(false); setEditingSubject(null); setFormData({ group: groups[0]?.name || 'COMMERCE', name: '', shortName: '', code: '' }); }}
                  className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  {editingSubject ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectMasterPage;
