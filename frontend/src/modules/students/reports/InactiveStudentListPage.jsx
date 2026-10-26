import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES, MOCK_INACTIVE_STUDENTS } from './studentReportsData';
import { Search, UserX, AlertCircle, FileText, Calendar, Filter, Phone, CheckCircle2 } from 'lucide-react';

export function InactiveStudentListPage({ onNavigate }) {
  const [type, setType] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_INACTIVE_STUDENTS.filter(r => {
    const matchesClass = selectedClass === 'All' || r.className === selectedClass;
    const matchesType = type === 'All' || r.type === type;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.admNo.toLowerCase().includes(q) ||
      r.srNo.toLowerCase().includes(q) ||
      r.fatherName.toLowerCase().includes(q) ||
      (r.reason && r.reason.toLowerCase().includes(q));

    return matchesClass && matchesType && matchesQuery;
  });

  const struckOffCount = MOCK_INACTIVE_STUDENTS.filter(s => s.type === 'Struck Off').length;
  const leftSchoolCount = MOCK_INACTIVE_STUDENTS.filter(s => s.type === 'Left School').length;
  const longAbsentCount = MOCK_INACTIVE_STUDENTS.filter(s => s.type === 'Long Absent').length;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    toast.success(`Found ${filtered.length} inactive student record(s)`);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,ADM.NO.,SR.NO.,STUDENT NAME,CLASS,FATHER\'S NAME,CONTACT NO.,INACTIVE TYPE,DATE,REASON']
        .concat(
          filtered.map(
            (r, i) =>
              `${i + 1},"${r.admNo}","${r.srNo}","${r.name}","${r.className} - ${r.section}","${r.fatherName}","${r.contactNo || ''}","${r.type}","${r.inactiveDate || ''}","${r.reason || 'Left School'}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'inactive_student_list.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ReportHeader
        title="Inactive Student List"
        subtitle="Student"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-5 flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inactive</span>
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <UserX className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {MOCK_INACTIVE_STUDENTS.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Session 2026-2027</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Struck Off</span>
              <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-rose-600 mt-2">
              {struckOffCount}
            </div>
            <span className="text-[11px] text-rose-500 mt-0.5 block">Dues / Disciplinary</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Left / TC Issued</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">
              {leftSchoolCount}
            </div>
            <span className="text-[11px] text-amber-500 mt-0.5 block">Relocation / Transfer</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Long Absent</span>
              <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-purple-600 mt-2">
              {longAbsentCount}
            </div>
            <span className="text-[11px] text-purple-500 mt-0.5 block">&gt; 45 Days Uninformed</span>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Inactive Category / Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Inactive Records</option>
                <option value="Struck Off">Struck Off</option>
                <option value="Left School">Left School (TC Issued)</option>
                <option value="Long Absent">Long Absent Without Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Filter by Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Classes</option>
                {SCHOOL_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Search Student
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, Adm No, Father, Reason..."
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleSearch}
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Apply Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="p-3.5 md:p-4 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800">
                Inactive Students Roster
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                {filtered.length} Record(s) Found
              </span>
            </div>

            <span className="text-[11px] text-slate-400">
              Session 2026-2027 &bull; Struck Off & TC Archive
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Adm. No.</th>
                  <th className="py-3 px-4">SR No.</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class & Sec</th>
                  <th className="py-3 px-4">Father's Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Inactive Type</th>
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((r, i) => {
                    const badgeStyles =
                      r.type === 'Struck Off'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : r.type === 'Left School'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200';

                    return (
                      <tr key={r.sNo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-medium text-slate-400">
                          {i + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-600">
                          {r.admNo}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {r.srNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {r.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80">
                            {r.className} - {r.section}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {r.fatherName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {r.contactNo ? (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {r.contactNo}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyles}`}>
                            {r.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {r.inactiveDate || '2026-08-01'}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={r.reason}>
                          {r.reason || 'Left School'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-12 text-slate-400 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <UserX className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">No Inactive Students Found</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        No students match the current filters. Try changing class or inactive category.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default InactiveStudentListPage;
