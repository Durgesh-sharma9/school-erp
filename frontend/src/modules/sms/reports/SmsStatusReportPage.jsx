import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Home,
  Printer,
  FileDown,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

export function SmsStatusReportPage({ onNavigate }) {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ total: 0, success: 0, failed: 0, pending: 0 });
  const [msgType, setMsgType] = useState('All');
  const [status, setStatus] = useState('All');
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-10-31');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReport = () => {
    const params = new URLSearchParams({
      msgType,
      status,
      fromDate,
      toDate
    });
    fetch(`/api/sms/reports/status?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setRecords(d.data || []);
          setSummary(d.summary || { total: 0, success: 0, failed: 0, pending: 0 });
        }
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
    r.mobileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.msgId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'MSG ID', 'MOBILE NO.', 'TYPE', 'MESSAGE', 'STATUS', 'ERROR MESSAGE'];
    const rows = filteredRecords.map((r, i) => [
      i + 1,
      r.msgId,
      `"${r.mobileNo}"`,
      r.type,
      `"${r.message.replace(/"/g, '""')}"`,
      r.status,
      `"${r.errorMessage}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sms_status_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Message Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Student
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/sms-reports')}
            >
              SMS
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Message Report</span>
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

      {/* Filter Card matching UAB: Msg Type, Status, From Date, To Date, Search button */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Msg Type</label>
            <select
              value={msgType}
              onChange={e => setMsgType(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Text">Text</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

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

          <div>
            <button
              type="submit"
              className="w-full py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </form>

        {/* Metric Badges matching UAB: Total : 0 | Success : 0 | Failed : 0 | Pending : 0 */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <div className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700">
            Total : <span className="text-indigo-600">{summary.total}</span>
          </div>
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Success : <span>{summary.success}</span>
          </div>
          <div className="px-3 py-1 bg-rose-50 border border-rose-200 rounded text-xs font-bold text-rose-800 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Failed : <span>{summary.failed}</span>
          </div>
          <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-bold text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending : <span>{summary.pending}</span>
          </div>

          <div className="ml-auto w-full md:w-64">
            <input
              type="text"
              placeholder="Search by Mobile, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-3 pr-3 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table matching UAB columns */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-16">S.NO.</th>
                <th className="py-2.5 px-3">MSG ID</th>
                <th className="py-2.5 px-3">MOBILE NO.</th>
                <th className="py-2.5 px-3 text-center">TYPE</th>
                <th className="py-2.5 px-3">MESSAGE</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3">ERROR MESSAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No message records found for selected filters
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3 font-mono text-indigo-600 text-[11px] font-semibold">{r.msgId}</td>
                    <td className="py-2 px-3 font-mono text-slate-700 font-medium">{r.mobileNo}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.type === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-800 max-w-md truncate" title={r.message}>
                      {r.message}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'Failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status === 'Success' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {r.status === 'Failed' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">{r.errorMessage || '-'}</td>
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
export default SmsStatusReportPage;
