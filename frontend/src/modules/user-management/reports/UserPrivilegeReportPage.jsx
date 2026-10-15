import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Home,
  Printer,
  FileDown,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

const DIVISIONS = ['All', 'Primary', 'Secondary', 'Senior Secondary'];

export function UserPrivilegeReportPage({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReport = () => {
    const params = new URLSearchParams({ division: selectedDivision });
    fetch(`/api/user-management/reports/privilege?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setUsers(d.data || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery) ||
    (u.modules && u.modules.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (u.classes && u.classes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'NAME', 'MOBILE', 'MODULE', 'CLASS', 'SUBJECT', 'EXAM NAME'];
    const rows = filteredUsers.map((u, i) => [
      i + 1,
      `"${u.name}"`,
      u.phone,
      `"${(u.modules || []).join(', ')}"`,
      `"${(u.classes || []).join(', ')}"`,
      `"${(u.subjects || []).join(', ')}"`,
      `"${(u.examNames || []).join(', ')}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `user_privilege_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            User Privilege Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> User Management
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/user-privilege')}
            >
              Manage Users
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">User Privilege Report</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Export CSV"
          >
            <FileDown className="w-4 h-4" /> CSV Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Print Report"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Card matching UAB: Division & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="w-full md:w-56">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Division</label>
            <select
              value={selectedDivision}
              onChange={e => setSelectedDivision(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DIVISIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>

          <div className="relative flex-1 md:max-w-xs md:ml-auto">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search user, mobile, module..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>

      {/* Main Table matching UAB columns: S.NO. | NAME | MOBILE | MODULE | CLASS | SUBJECT | EXAM NAME */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-16">S.NO.</th>
                <th className="py-2.5 px-3">NAME</th>
                <th className="py-2.5 px-3">MOBILE</th>
                <th className="py-2.5 px-3">MODULE</th>
                <th className="py-2.5 px-3">CLASS</th>
                <th className="py-2.5 px-3">SUBJECT</th>
                <th className="py-2.5 px-3">EXAM NAME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No privilege records found matching criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-800 flex items-center gap-2">
                      <img
                        src={u.pic}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600">{u.phone}</td>
                    <td className="py-2 px-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(u.modules || []).map(m => (
                          <span key={m} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {(u.classes || []).map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      {(u.subjects || []).join(', ') || '-'}
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">
                      {(u.examNames || []).join(', ') || '-'}
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
export default UserPrivilegeReportPage;
