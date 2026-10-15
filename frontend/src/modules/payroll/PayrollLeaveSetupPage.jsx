import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Home,
  X,
  Edit2,
  Trash2,
  FileDown
} from 'lucide-react';

const INITIAL_LEAVE_SETUPS = [
  { id: '1', department: 'TEACHING', employeeType: 'Permanent', gender: 'All', casualLeave: 12, earnedLeave: 15, medicalLeave: 10 },
  { id: '2', department: 'ADMINISTRATIVE & MANAGEMENT', employeeType: 'Permanent', gender: 'All', casualLeave: 12, earnedLeave: 18, medicalLeave: 10 },
  { id: '3', department: 'TRANSPORT', employeeType: 'Permanent', gender: 'Male', casualLeave: 10, earnedLeave: 12, medicalLeave: 8 },
  { id: '4', department: 'ACCOUNTS', employeeType: 'Permanent', gender: 'All', casualLeave: 12, earnedLeave: 15, medicalLeave: 10 },
  { id: '5', department: 'NON TEACHING', employeeType: 'Probation', gender: 'All', casualLeave: 8, earnedLeave: 10, medicalLeave: 6 }
];

export function PayrollLeaveSetupPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('common');
  const [data, setData] = useState(INITIAL_LEAVE_SETUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formDept, setFormDept] = useState('TEACHING');
  const [formEmpType, setFormEmpType] = useState('Permanent');
  const [formGender, setFormGender] = useState('All');
  const [formCL, setFormCL] = useState(12);
  const [formEL, setFormEL] = useState(15);
  const [formML, setFormML] = useState(10);

  const filteredData = data.filter(item =>
    item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employeeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormDept('TEACHING');
    setFormEmpType('Permanent');
    setFormGender('All');
    setFormCL(12);
    setFormEL(15);
    setFormML(10);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormDept(item.department);
    setFormEmpType(item.employeeType);
    setFormGender(item.gender);
    setFormCL(item.casualLeave);
    setFormEL(item.earnedLeave);
    setFormML(item.medicalLeave);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        department: formDept,
        employeeType: formEmpType,
        gender: formGender,
        casualLeave: Number(formCL),
        earnedLeave: Number(formEL),
        medicalLeave: Number(formML)
      } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        department: formDept,
        employeeType: formEmpType,
        gender: formGender,
        casualLeave: Number(formCL),
        earnedLeave: Number(formEL),
        medicalLeave: Number(formML)
      };
      setData(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Department,Employee Type,Gender,Casual Leave,Earned Leave,Medical Leave"].concat(
        data.map((d, i) => `"${i + 1}","${d.department}","${d.employeeType}","${d.gender}","${d.casualLeave}","${d.earnedLeave}","${d.medicalLeave}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_leave_setup.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Leave Setup
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/payroll-leave-setup')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Leave Setup</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Tabs Bar matching UAB 1:1 */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('common')}
            className={`pb-2.5 transition-colors ${
              activeTab === 'common'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Common Leave
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`pb-2.5 transition-colors ${
              activeTab === 'individual'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Individual Leave
          </button>
          <button
            onClick={() => setActiveTab('maternity')}
            className={`pb-2.5 transition-colors ${
              activeTab === 'maternity'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Maternity Leave
          </button>
        </div>

        {/* Search Bar & FAB */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search department or employee type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
            title="Add Leave Setup"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Employee Type</th>
                  <th className="py-3 px-4 text-center">Gender</th>
                  <th className="py-3 px-4 text-center">Casual Leave</th>
                  <th className="py-3 px-4 text-center">Earned Leave</th>
                  <th className="py-3 px-4 text-center">Medical Leave</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.department}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">{item.employeeType}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {item.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">{item.casualLeave} Days</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{item.earnedLeave} Days</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-700">{item.medicalLeave} Days</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setData(prev => prev.filter(d => d.id !== item.id))}
                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? 'Edit Leave Setup' : 'Add Leave Setup'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Department *</label>
                <select
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                >
                  <option value="TEACHING">TEACHING</option>
                  <option value="ADMINISTRATIVE & MANAGEMENT">ADMINISTRATIVE & MANAGEMENT</option>
                  <option value="ACCOUNTS">ACCOUNTS</option>
                  <option value="TRANSPORT">TRANSPORT</option>
                  <option value="NON TEACHING">NON TEACHING</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Employee Type</label>
                  <select
                    value={formEmpType}
                    onChange={(e) => setFormEmpType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Probation">Probation</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                  >
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Casual Leave</label>
                  <input
                    type="number"
                    value={formCL}
                    onChange={(e) => setFormCL(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Earned Leave</label>
                  <input
                    type="number"
                    value={formEL}
                    onChange={(e) => setFormEL(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Medical Leave</label>
                  <input
                    type="number"
                    value={formML}
                    onChange={(e) => setFormML(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-center"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Leave Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
