import React, { useState, useEffect } from 'react';
import {
  Cake,
  Search,
  Home,
  Printer,
  FileDown,
  Calendar,
  Users
} from 'lucide-react';

const MONTHS = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function BirthdayReportPage({ onNavigate }) {
  const [records, setRecords] = useState([]);
  const [selectedType, setSelectedType] = useState('Student');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [greetingType, setGreetingType] = useState('All');
  const [format, setFormat] = useState('Format 1');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReport = () => {
    const params = new URLSearchParams({
      type: selectedType,
      month: selectedMonth
    });
    fetch(`/api/sms/reports/birthdays?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setRecords(d.data || []);
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

  const filteredRecords = records.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.contactNo.includes(searchQuery) ||
    r.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['DATE', 'ADM.NO.', 'SR.NO.', 'NAME', 'CLASS', 'CONTACT NO.'];
    const rows = filteredRecords.map(r => [
      r.dob,
      r.admNo,
      r.srNo,
      `"${r.name}"`,
      `"${r.className}"`,
      r.contactNo
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birthday_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <Cake className="w-6 h-6 text-pink-600" />
            Birthday Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> SMS
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Birthday Report</span>
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

      {/* Filter Card matching UAB: Type, Month, Greeting Type, Format, Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Greeting Type</label>
            <select
              value={greetingType}
              onChange={e => setGreetingType(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="All">All</option>
              <option value="Text">SMS (Text)</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Format</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="Format 1">Format 1 (Standard)</option>
              <option value="Format 2">Format 2 (Compact)</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-1.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </form>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search by name, class, contact no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Celebrants Count: <span className="font-bold text-pink-600">{filteredRecords.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table matching UAB columns: DATE | ADM.NO. | SR.NO. | NAME | CLASS | CONTACT NO. */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">ADM.NO.</th>
                <th className="py-2.5 px-3">SR.NO.</th>
                <th className="py-2.5 px-3">NAME</th>
                <th className="py-2.5 px-3">CLASS</th>
                <th className="py-2.5 px-3">CONTACT NO.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No birthday records found for selected month and type
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-mono text-slate-600 font-semibold">{r.dob}</td>
                    <td className="py-2 px-3 font-mono text-indigo-600 text-[11px] font-medium">{r.admNo}</td>
                    <td className="py-2 px-3 font-mono text-slate-500">{r.srNo}</td>
                    <td className="py-2 px-3 font-bold text-slate-800 flex items-center gap-1.5">
                      <Cake className="w-3.5 h-3.5 text-pink-500" />
                      {r.name}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{r.className}</td>
                    <td className="py-2 px-3 font-mono text-slate-700">{r.contactNo}</td>
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
export default BirthdayReportPage;
