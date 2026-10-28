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
  UserCheck,
  Phone
} from 'lucide-react';

const INITIAL_STAFF = [];

export function PayrollRegistrationPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesig, setFormDesig] = useState('Teacher');
  const [formDept, setFormDept] = useState('TEACHING');
  const [formMobile, setFormMobile] = useState('');
  const [formDate, setFormDate] = useState('2026-01-05');
  const [formSalary, setFormSalary] = useState(30000);
  const [formAccNo, setFormAccNo] = useState('');
  const [formGender, setFormGender] = useState('Female');

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.includes(searchTerm) ||
      item.mobile.includes(searchTerm) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'All' || item.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormCode((data.length + 203).toString());
    setFormName('');
    setFormDesig('Teacher');
    setFormDept('TEACHING');
    setFormMobile('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormSalary(30000);
    setFormAccNo('');
    setFormGender('Female');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormDesig(item.designation);
    setFormDept(item.department);
    setFormMobile(item.mobile);
    setFormDate(item.appoinDate);
    setFormSalary(item.basicSalary);
    setFormAccNo(item.accNo);
    setFormGender(item.gender);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        code: formCode,
        name: formName.trim().toUpperCase(),
        designation: formDesig,
        department: formDept,
        mobile: formMobile.trim(),
        appoinDate: formDate,
        basicSalary: Number(formSalary),
        accNo: formAccNo.trim(),
        gender: formGender
      } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        code: formCode || (data.length + 203).toString(),
        name: formName.trim().toUpperCase(),
        designation: formDesig,
        department: formDept,
        mobile: formMobile.trim(),
        appoinDate: formDate,
        basicSalary: Number(formSalary),
        accNo: formAccNo.trim() || 'N/A',
        status: 'Active',
        gender: formGender
      };
      setData(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Employee Code,Employee Name,Designation,Department,Mobile No,Appointment Date,Basic Salary,Account No,Status"].concat(
        data.map((d, i) => `"${i + 1}","${d.code}","${d.name}","${d.designation}","${d.department}","${d.mobile}","${d.appoinDate}","${d.basicSalary}","${d.accNo}","${d.status}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "staff_registration_roster.csv");
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
            Staff Registration
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/payroll-registration')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Staff Registration</span>
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
        {/* Search & Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, name, designation, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-slate-500 font-semibold mr-1.5">Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Departments</option>
                <option value="TEACHING">TEACHING</option>
                <option value="ADMINISTRATIVE & MANAGEMENT">ADMINISTRATIVE & MANAGEMENT</option>
                <option value="TRANSPORT">TRANSPORT</option>
                <option value="ACCOUNTS">ACCOUNTS</option>
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
              title="Add Staff"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table View matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4 w-12 text-center">Photo</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Mobile No.</th>
                  <th className="py-3 px-4">Appoin. Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs mx-auto">
                        {item.name.charAt(0)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        [{item.code}] {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">{item.department}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.designation}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.mobile}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{item.appoinDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? 'Edit Staff Member' : 'Register New Staff Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Emp Code *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Gender *</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONIKA RANI VERMA"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Department *</label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                  >
                    <option value="TEACHING">TEACHING</option>
                    <option value="ADMINISTRATIVE & MANAGEMENT">ADMINISTRATIVE & MANAGEMENT</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                    <option value="ACCOUNTS">ACCOUNTS</option>
                    <option value="LIBRARY">LIBRARY</option>
                    <option value="NON TEACHING">NON TEACHING</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Designation *</label>
                  <select
                    value={formDesig}
                    onChange={(e) => setFormDesig(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Principal">Principal</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Director">Director</option>
                    <option value="Driver">Driver</option>
                    <option value="Accountant">Accountant</option>
                    <option value="LIBRARIAN">Librarian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Mobile No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digit mobile"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Basic Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Bank Account No.</label>
                  <input
                    type="text"
                    placeholder="e.g. SBI-489211029"
                    value={formAccNo}
                    onChange={(e) => setFormAccNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
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
                  Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
