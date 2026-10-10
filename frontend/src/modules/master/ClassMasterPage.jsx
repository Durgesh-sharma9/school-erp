import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  ListFilter,
  Plus,
  Trash2,
  X
} from 'lucide-react';

export function ClassMasterPage() {
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newNumSections, setNewNumSections] = useState('1');

  // Fetch from backend
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/academics/classes');
      const data = await res.json();
      if (data.success && data.data) {
        setClasses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName) return;

    try {
      const res = await fetch('http://localhost:5000/api/academics/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName,
          sections: Array.from({ length: Number(newNumSections) || 1 }, (_, i) => String.fromCharCode(65 + i)),
          priority: classes.length + 1
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchClasses();
        setAddModalOpen(false);
        setNewClassName('');
        setNewNumSections('1');
      }
    } catch (err) {
      console.error('Error adding class:', err);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/academics/classes/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchClasses();
      }
    } catch (err) {
      console.error('Error deleting class:', err);
    }
  };

  const filteredClasses = classes.filter((c) =>
    searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 Secondary Toolbar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <h1 className="text-xl font-bold text-slate-800 pr-3 border-r border-slate-300">
            Class Master
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Masters</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Class Master</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          {/* Action Bar (Search, Checklist filter, Add FAB) */}
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
              <button
                type="button"
                title="Filter Columns"
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ListFilter className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                title="Add Class"
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
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTIONS</th>
                  <th className="py-3 px-4">PRIORITY</th>
                  <th className="py-3 px-4 text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4">{Array.isArray(item.sections) ? item.sections.length : 1}</td>
                      <td className="py-3 px-4 font-mono">{item.priority || idx + 1}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteClass(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            <span>1 – {filteredClasses.length} of {filteredClasses.length}</span>
            <div className="flex items-center space-x-1">
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&lt;</button>
              <button disabled className="p-1 text-slate-300 cursor-not-allowed">&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 ADD CLASS MODAL (Matches UAB CLASS MASTER exactly) */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">CLASS MASTER</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Class Name*
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. XI - COMMERCE"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  No. of Sections*
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newNumSections}
                  onChange={(e) => setNewNumSections(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassMasterPage;
