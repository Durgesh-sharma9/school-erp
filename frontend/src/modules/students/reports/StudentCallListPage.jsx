import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES, MOCK_STUDENTS } from './studentReportsData';
import { Phone, PhoneCall, Search } from 'lucide-react';

export function StudentCallListPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [callList, setCallList] = useState(MOCK_STUDENTS);

  const filtered = callList.filter(s => {
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesQuery = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactNo.includes(searchQuery);
    return matchesClass && matchesSection && matchesQuery;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setCallList(prev =>
      prev.map(s => s.sNo === id ? { ...s, callStatus: newStatus } : s)
    );
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,STUDENT NAME,FATHER\'S NAME,CONTACT NO.,CLASS,CALL STATUS,REMARKS']
        .concat(
          filtered.map(
            (r, i) =>
              `${i + 1},"${r.name}","${r.fatherName}","${r.contactNo}","${r.className} - ${r.section}","${r.callStatus}","${r.callRemark}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'student_call_list.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Student Call List"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Classes</option>
                {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Quick Filter
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, phone..."
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              Total Calling Contacts: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">CONTACT NO.</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">CALL STATUS</th>
                  <th className="py-3 px-4">REMARKS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    <td className="py-3 px-4 font-mono font-medium text-indigo-600">
                      <a href={`tel:${r.contactNo}`} className="hover:underline flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400 inline" />
                        <span>{r.contactNo}</span>
                      </a>
                    </td>
                    <td className="py-3 px-4">{r.className} - {r.section}</td>
                    <td className="py-3 px-4">
                      <select
                        value={r.callStatus}
                        onChange={(e) => handleUpdateStatus(r.sNo, e.target.value)}
                        className={`text-[11px] font-semibold py-1 px-2 rounded-md border border-slate-200 focus:outline-hidden ${
                          r.callStatus === 'Connected' ? 'bg-emerald-50 text-emerald-700' :
                          r.callStatus === 'Ringing / No Answer' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-50 text-slate-700'
                        }`}
                      >
                        <option value="Connected">Connected</option>
                        <option value="Ringing / No Answer">Ringing / No Answer</option>
                        <option value="Switched Off">Switched Off</option>
                        <option value="Left School">Left School</option>
                        <option value="Follow-up Required">Follow-up Required</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">{r.callRemark}</td>
                    <td className="py-3 px-4 text-center">
                      <a
                        href={`tel:${r.contactNo}`}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-[#5c67f6] hover:bg-indigo-600 text-white text-[11px] font-medium shadow-2xs"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </a>
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
