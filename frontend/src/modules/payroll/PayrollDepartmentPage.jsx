import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Home,
  X,
  Edit2,
  Trash2,
  FileDown,
  Building2
} from 'lucide-react';
import { salaryStorage, getActiveStaffRoster } from '../salary/salaryStore';

export function PayrollDepartmentPage({ onNavigate }) {
  const activeRoster = getActiveStaffRoster();
  const [data, setData] = useState(() => {
    const saved = salaryStorage.getDepartments();
    return saved.map(d => ({
      id: d.id,
      department: d.name,
      remark: d.code || ''
    }));
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formDept, setFormDept] = useState('');
  const [formRemark, setFormRemark] = useState('');

  const syncToSalaryStore = (items) => {
    const depts = items.map(item => ({
      id: item.id,
      name: item.department,
      code: item.remark,
      createdAt: '2026-11-03'
    }));
    salaryStorage.saveDepartments(depts);
  };

  const filteredData = data.filter(item =>
    item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.remark.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormDept('');
    setFormRemark('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormDept(item.department);
    setFormRemark(item.remark || '');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formDept.trim()) return;

    let nextData;
    if (editingItem) {
      nextData = data.map(item => item.id === editingItem.id ? {
        ...item,
        department: formDept.trim().toUpperCase(),
        remark: formRemark.trim().toUpperCase()
      } : item);
    } else {
      const newItem = {
        id: `dept_${Date.now()}`,
        department: formDept.trim().toUpperCase(),
        remark: formRemark.trim().toUpperCase()
      };
      nextData = [...data, newItem];
    }
    setData(nextData);
    syncToSalaryStore(nextData);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this department?')) {
      const nextData = data.filter(item => item.id !== id);
      setData(nextData);
      syncToSalaryStore(nextData);
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Department,Code"].concat(
        data.map((d, i) => `"${i + 1}","${d.department}","${d.remark}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "school_departments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Department Master
            </h1>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center transition">
                <Home className="w-3.5 h-3.5 mr-1" />
                Home
              </button>
              <span>•</span>
              <span className="hover:text-indigo-600 cursor-pointer transition" onClick={() => onNavigate?.('/class')}>Master</span>
              <span>•</span>
              <span className="text-slate-700 font-semibold">Department Master</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="px-3.5 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileDown className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Top Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {data.length} DEPARTMENTS REGISTERED
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">• Academic faculties, administrative branches, and operations</span>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by department name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-16 text-center">S.No.</th>
                  <th className="py-3.5 px-6">Department Name</th>
                  <th className="py-3.5 px-6">Department Code</th>
                  <th className="py-3.5 px-6 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400">
                      No departments found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 text-center font-bold text-slate-400">{index + 1}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                          <span>{item.department}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-indigo-700 text-[11px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {item.remark || item.department.slice(0, 4).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                            title="Edit Department"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Delete Department"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingItem ? 'Edit Department' : 'Add New Department'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Department Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. TEACHING, ACCOUNTS, TRANSPORT"
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Department Code / Short Abbreviation</label>
                <input
                  type="text"
                  placeholder="e.g. TEACH, ACC, TRANS"
                  value={formRemark}
                  onChange={(e) => setFormRemark(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 uppercase"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
                >
                  {editingItem ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
