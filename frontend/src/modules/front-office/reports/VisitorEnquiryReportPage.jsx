import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Home,
  Printer,
  FileDown,
  Filter,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';

const INITIAL_VISITOR_REPORTS = [
  {
    id: '1',
    date: '2026-10-15',
    visitor: 'Dr. Alok Nath',
    contactNo: '9828012345',
    purpose: 'Admission Query',
    type: 'Prospective Parent',
    studentName: 'Aarav Nath',
    className: 'Nursery',
    gender: 'Male',
    address: 'Flat 402, Royal Palms, C-Scheme, Jaipur'
  },
  {
    id: '2',
    date: '2026-10-14',
    visitor: 'Sanjay Mathur',
    contactNo: '9414088990',
    purpose: 'Document Verification',
    type: 'Official / Education Board',
    studentName: 'N/A',
    className: 'CBSE Secondary',
    gender: 'Male',
    address: 'CBSE Regional Office, Sector 5, Mansarovar, Jaipur'
  },
  {
    id: '3',
    date: '2026-10-12',
    visitor: 'Sunil Agarwal',
    contactNo: '9829033445',
    purpose: 'Fee Discussion & Transport Route',
    type: 'Existing Parent',
    studentName: 'Priya Agarwal',
    className: 'Class VI-A',
    gender: 'Female',
    address: 'B-14, Vaishali Nagar, Jaipur'
  },
  {
    id: '4',
    date: '2026-10-10',
    visitor: 'Rajendra Pareek',
    contactNo: '9460012345',
    purpose: 'Stationery & Book Supply',
    type: 'Vendor / Contractor',
    studentName: 'N/A',
    className: 'N/A',
    gender: 'Male',
    address: 'Chaura Rasta, Jaipur'
  }
];

export function VisitorEnquiryReportPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_VISITOR_REPORTS);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'Prospective Parent', 'Existing Parent', 'Official / Education Board', 'Vendor / Contractor'];

  const filteredData = data.filter(d => {
    const matchesType = selectedType === 'All' || d.type === selectedType;
    const matchesSearch =
      d.visitor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactNo.includes(searchQuery) ||
      d.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'DATE', 'VISITOR', 'CONTACT NO.', 'PURPOSE', 'TYPE', 'STUDENT NAME', 'CLASS', 'GENDER', 'ADDRESS'];
    const rows = filteredData.map((d, i) => [
      i + 1,
      `"${d.date}"`,
      `"${d.visitor}"`,
      `"${d.contactNo}"`,
      `"${d.purpose}"`,
      `"${d.type}"`,
      `"${d.studentName}"`,
      `"${d.className}"`,
      `"${d.gender}"`,
      `"${d.address}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Visitor_Enquiry_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Visitor Enquiry Report
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <button onClick={() => onNavigate && onNavigate('front-office-reports')} className="hover:text-blue-600 transition-colors">
              Front Office Reports
            </button>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Visitor Enquiry Report</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
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
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Visitor Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Visitor / Purpose</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Visitor Name, Phone, Purpose, Address..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Printable Header */}
        <div className="hidden print:block text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">J D International School</h2>
          <p className="text-xs text-slate-500">VISITOR ENQUIRY & REGISTER REPORT</p>
          <p className="text-xs text-slate-400">Type: {selectedType} | Generated: {new Date().toLocaleString()}</p>
        </div>

        {/* Table 1:1 matching UAB columns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">VISITOR</th>
                  <th className="py-3 px-4">CONTACT NO.</th>
                  <th className="py-3 px-4">PURPOSE</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">GENDER</th>
                  <th className="py-3 px-4">ADDRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((d, index) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{d.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.visitor}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{d.contactNo}</td>
                    <td className="py-3 px-4 text-slate-800">{d.purpose}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {d.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{d.studentName}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{d.className}</td>
                    <td className="py-3 px-4 text-slate-600">{d.gender}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={d.address}>{d.address}</td>
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
