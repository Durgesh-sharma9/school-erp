import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { SCHOOL_CLASSES, MOCK_STUDENTS } from './studentReportsData';
import { Printer, X } from 'lucide-react';

export function GenerateSlipsReportPage({ onNavigate }) {
  const [slipType, setSlipType] = useState('Gate Pass');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedStudents, setSelectedStudents] = useState([1, 2]);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const students = MOCK_STUDENTS.filter(s =>
    selectedClass === 'All' ? true : s.className === selectedClass
  );

  const toggleSelect = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.sNo));
    }
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Generate Slips"
        onNavigate={onNavigate}
        onPrint={handlePrint}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Slip Type
              </label>
              <select
                value={slipType}
                onChange={(e) => setSlipType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Gate Pass">Gate Pass Slip</option>
                <option value="Bus Pass">Transport Bus Pass</option>
                <option value="Library Slip">Library Borrow Slip</option>
                <option value="Fee Due Slip">Fee Due Reminder Slip</option>
              </select>
            </div>

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
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>

            <div>
              <button
                onClick={handlePrint}
                disabled={selectedStudents.length === 0}
                className="w-full bg-[#5c67f6] hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate & Print ({selectedStudents.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              Students List: <strong className="text-slate-900">{students.length}</strong> (Selected: {selectedStudents.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">SECTION</th>
                  <th className="py-3 px-4">ROLL NO.</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(r.sNo)}
                        onChange={() => toggleSelect(r.sNo)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">{r.className}</td>
                    <td className="py-3 px-4 text-slate-600">{r.section}</td>
                    <td className="py-3 px-4 font-mono">{r.rollNo}</td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slip Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900">
                Generated {slipType} Slips ({selectedStudents.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.filter(s => selectedStudents.includes(s.sNo)).map(s => (
                  <div key={s.sNo} className="border-2 border-dashed border-slate-300 p-4 rounded-xl bg-slate-50 space-y-3">
                    <div className="border-b border-slate-200 pb-2 text-center">
                      <h4 className="text-sm font-black text-slate-900 uppercase">J D INTERNATIONAL SCHOOL</h4>
                      <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{slipType}</p>
                    </div>
                    <div className="text-xs space-y-1 text-slate-700">
                      <div><span className="text-slate-400">Name:</span> <strong className="text-slate-900">{s.name}</strong></div>
                      <div><span className="text-slate-400">Class & Sec:</span> {s.className} - {s.section} (Roll: {s.rollNo})</div>
                      <div><span className="text-slate-400">Adm No:</span> {s.admNo}</div>
                      <div><span className="text-slate-400">Father:</span> {s.fatherName}</div>
                      <div><span className="text-slate-400">Issued On:</span> {new Date().toLocaleDateString('en-GB')}</div>
                    </div>
                    <div className="pt-4 flex justify-between text-[10px] text-slate-500">
                      <span>Parent Sign</span>
                      <span>Authorized Signatory</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs"
                >
                  Print All Slips
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
