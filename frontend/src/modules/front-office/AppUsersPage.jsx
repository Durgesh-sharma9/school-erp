import React, { useState } from 'react';
import {
  Users,
  Search,
  Home,
  Printer,
  FileDown,
  ShieldCheck,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  XCircle,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_USERS = [
  { id: '1', srNo: '1621', name: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', fatherName: 'RAMESH CHOUDHARY', userId: '8947919195', password: 'password123', appLoginPerm: true, notification: true },
  { id: '2', srNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', fatherName: 'RAMESH CHOUDHARY', userId: '6377281034', password: 'password123', appLoginPerm: true, notification: true },
  { id: '3', srNo: '2060', name: 'ROHAN SHARMA', className: 'Class X-A', fatherName: 'MUKESH SHARMA', userId: '9829012345', password: 'password123', appLoginPerm: true, notification: false },
  { id: '4', srNo: '2061', name: 'PRIYA MEENA', className: 'Class IX-A', fatherName: 'RAJESH MEENA', userId: '9829011111', password: 'password123', appLoginPerm: false, notification: true },
  { id: '5', srNo: '2062', name: 'ANSHUMAN JOSHI', className: 'Class VI-A', fatherName: 'SUNIL JOSHI', userId: '9414022222', password: 'password123', appLoginPerm: true, notification: true }
];

export function AppUsersPage({ onNavigate }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [filterMode, setFilterMode] = useState('classWise'); // 'classWise' | 'all'
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleLogin = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, appLoginPerm: !u.appLoginPerm } : u));
  };

  const handleToggleNotification = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, notification: !u.notification } : u));
  };

  const handleSaveAll = () => {
    toast.success('App user permissions updated successfully!');
  };

  const filteredUsers = users.filter(u => {
    const matchesClass = selectedClass === 'All' || u.className.startsWith(selectedClass);
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.srNo.includes(searchQuery) ||
      u.userId.includes(searchQuery) ||
      u.fatherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'SR.NO.', 'NAME', 'CLASS', "FATHER'S NAME", 'USER ID', 'PASSWORD', 'APP LOGIN PERM', 'NOTIFICATION'];
    const rows = filteredUsers.map((u, i) => [
      i + 1,
      `"${u.srNo}"`,
      `"${u.name}"`,
      `"${u.className}"`,
      `"${u.fatherName}"`,
      `"${u.userId}"`,
      `"${u.password}"`,
      u.appLoginPerm ? 'YES' : 'NO',
      u.notification ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `App_Users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <Smartphone size={18} className="text-blue-600" />
            <span>App Users Management</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">App Users</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Save size={14} />
            <span>Save Permissions</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-xs font-medium text-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="filterMode"
                  checked={filterMode === 'classWise'}
                  onChange={() => setFilterMode('classWise')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Class Wise</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="filterMode"
                  checked={filterMode === 'all'}
                  onChange={() => setFilterMode('all')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>All Students</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {filterMode === 'classWise' && (
                <div className="w-48">
                  <select
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All">All Classes</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Class I">Class I</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class X">Class X</option>
                  </select>
                </div>
              )}

              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Name, SR No, Phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.No.</th>
                  <th className="py-3 px-4">Sr.No.</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Father's Name</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Password</th>
                  <th className="py-3 px-4 text-center">App Login Perm.</th>
                  <th className="py-3 px-4 text-center">Notification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{u.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.className}</td>
                    <td className="py-3 px-4 text-slate-600">{u.fatherName}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{u.userId}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <span>{showPasswords[u.id] ? u.password : '••••••••'}</span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPasswords[u.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleLogin(u.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          u.appLoginPerm
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {u.appLoginPerm ? 'Allowed' : 'Blocked'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleNotification(u.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          u.notification
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {u.notification ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
