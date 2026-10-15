import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES, MOCK_STUDENTS } from './studentReportsData';
import { Search } from 'lucide-react';

export function SubjectWiseStudentListPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Expand students by subject
  const rows = [];
  MOCK_STUDENTS.forEach(s => {
    if (selectedClass !== 'All' && s.className !== selectedClass) return;
    if (selectedSection !== 'All' && s.section !== selectedSection) return;

    s.subjects.forEach(sub => {
      if (selectedSubject !== 'All' && sub !== selectedSubject) return;
      rows.push({
        id: `${s.sNo}-${sub}`,
        name: s.name,
        className: s.className,
        section: s.section,
        rollNo: s.rollNo,
        subject: sub,
        admNo: s.admNo
      });
    });
  });

  const filtered = rows.filter(r =>
    !searchQuery ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    toast.success(`Filtered ${filtered.length} record(s)`);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO,CLASS,SECTION,NAME,SUBJECT,ROLL NO.']
        .concat(
          filtered.map(
            (r, i) =>
              `${i + 1},"${r.className}","${r.section}","${r.name}","${r.subject}","${r.rollNo}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'subject_wise_student_details.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Subject wise Student List"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
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

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Subjects</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Science">Social Science</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
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
              Total Subject Linkings: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject or student..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTION</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">SUBJECT</th>
                  <th className="py-3 px-4 text-center">ROLL NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.className}</td>
                    <td className="py-3 px-4 text-slate-600">{r.section}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4 font-medium text-indigo-600">{r.subject}</td>
                    <td className="py-3 px-4 text-center font-mono">{r.rollNo}</td>
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
