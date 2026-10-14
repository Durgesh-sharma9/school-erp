import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES } from './studentReportsData';
import { Search, Building2, ShieldCheck } from 'lucide-react';

export function StudentListPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  const [reportType, setReportType] = useState('All');
  const [sorting, setSorting] = useState('Admission No.');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState(() => tenantStore.getStudents(schoolId));

  useEffect(() => {
    setRecords(tenantStore.getStudents(schoolId));
  }, [schoolId]);

  const handleSearch = () => {
    const rawStudents = tenantStore.getStudents(schoolId);
    let result = [...rawStudents];

    if (reportType === 'Class Wise' && selectedClass !== 'All') {
      result = result.filter(s => s.className === selectedClass);
    } else if (reportType === 'New Student') {
      result = result.filter(s => s.isNew);
    } else if (reportType === 'RTE') {
      result = result.filter(s => s.isRte);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.firstName && s.firstName.toLowerCase().includes(q)) ||
        (s.admNo && s.admNo.toLowerCase().includes(q)) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(q)) ||
        (s.contactNo && s.contactNo.includes(q))
      );
    }

    // Sort
    if (sorting === 'Name') {
      result.sort((a, b) => (a.name || a.firstName).localeCompare(b.name || b.firstName));
    } else if (sorting === 'Roll No.') {
      result.sort((a, b) => parseInt(a.rollNo || '0') - parseInt(b.rollNo || '0'));
    } else if (sorting === 'Admission No.') {
      result.sort((a, b) => String(a.admNo).localeCompare(String(b.admNo)));
    }

    setRecords(result);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,ENROLL NO.,ADM.NO. / SR.NO,SR.NO.,NAME,CLASS,FATHER\'S NAME,MOTHER\'S NAME,CONTACT SMS NO.']
        .concat(
          records.map(
            (r, i) =>
              `${i + 1},"${r.enrollNo}","${r.admNo}","${r.srNo}","${r.name}","${r.className} - ${r.section}","${r.fatherName}","${r.motherName}","${r.contactNo}"`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'student_list_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Student List"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Multi-Tenant Active Sandbox Header */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
              schoolId === 'sch_dps_branch2'
                ? 'bg-emerald-600'
                : schoolId === 'sch_jd_intl'
                ? 'bg-blue-600'
                : 'bg-amber-600'
            }`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {schoolName} &bull; <span className="font-normal text-slate-500">Student Directory ({records.length} Students)</span>
              </p>
              <p className="text-[11px] text-slate-400">
                🔒 Strict Tenant Isolation: Only students belonging to this school are displayed.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono">
            Tenant: {schoolId || 'NEW'}
          </span>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All</option>
                <option value="Class Wise">Class Wise</option>
                <option value="City/Village">City/Village</option>
                <option value="New Student">New Student</option>
                <option value="RTE">RTE</option>
                <option value="FREE">FREE</option>
                <option value="Repeater">Repeater</option>
              </select>
            </div>

            {reportType === 'Class Wise' && (
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
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sorting
              </label>
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Admission No.">Admission No.</option>
                <option value="Sr. No.">Sr. No.</option>
                <option value="Enroll. No.">Enroll. No.</option>
                <option value="Roll No.">Roll No.</option>
                <option value="Feebook No.">Feebook No.</option>
                <option value="Name">Name</option>
                <option value="Gender">Gender</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSearch}
                className="w-full bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total Records: <strong className="text-slate-900">{records.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by name, adm no..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ENROLL NO.</th>
                  <th className="py-3 px-4">ADM.NO. / SR.NO</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">MOTHER'S NAME</th>
                  <th className="py-3 px-4">CONTACT SMS NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {records.length > 0 ? (
                  records.map((r, i) => (
                    <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{r.enrollNo}</td>
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
                      <td className="py-3 px-4 font-mono text-slate-600">{r.contactNo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                        <span className="text-3xl">📋</span>
                        <p className="font-semibold text-slate-700 text-sm">No Student Records Found</p>
                        <p className="text-xs text-slate-400">
                          This school has 0 enrolled students. No dummy data or other schools' students are shown.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate && onNavigate('/student-admission')}
                          className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-xs cursor-pointer"
                        >
                          + Register First Student
                        </button>
                      </div>
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
