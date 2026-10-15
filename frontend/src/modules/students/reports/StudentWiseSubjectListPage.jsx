import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES, MOCK_STUDENTS } from './studentReportsData';
import { Search } from 'lucide-react';

export function StudentWiseSubjectListPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('All');
  const [division, setDivision] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    toast.success(`Filtered ${filtered.length} record(s)`);
  };
    const matchesDiv = division === 'All' || s.section === division;
    const matchesQuery = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesDiv && matchesQuery;
  });

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ROLL NO.,ADM.NO.,SR.NO.,STUDENT NAME,CLASS,FATHER\'S NAME,MOTHER\'S NAME,SUBJECTS']
        .concat(
          filtered.map(
            (r) =>
              `"${r.rollNo}","${r.admNo}","${r.srNo}","${r.name}","${r.className} - ${r.section}","${r.fatherName}","${r.motherName}","${r.subjects.join(', ')}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'student_wise_subject_list.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Student Wise Subject List"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
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
                Division
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Divisions</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div>
              <button
                className="w-full bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
               onClick={handleSearch} type="button">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total Students: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or adm no..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ROLL NO.</th>
                  <th className="py-3 px-4">ADM.NO.</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">MOTHER'S NAME</th>
                  <th className="py-3 px-4">SUBJECTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.rollNo}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {r.className} - {r.section}
                      </span>
                    </td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    <td className="py-3 px-4">{r.motherName}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {r.subjects.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
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
