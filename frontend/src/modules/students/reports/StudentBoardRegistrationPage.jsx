import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { MOCK_STUDENTS } from './studentReportsData';
import { Printer, X } from 'lucide-react';

export function StudentBoardRegistrationPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [group, setGroup] = useState('All');
  const [format, setFormat] = useState('Multiple');
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const boardStudents = MOCK_STUDENTS.filter(s => s.className === selectedClass || selectedClass === 'All');

  const handlePrintSlip = (student = null) => {
    setSelectedStudent(student || boardStudents[0]);
    setShowSlipModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Student Board Registration Form"
        onNavigate={onNavigate}
        onPrint={() => handlePrintSlip()}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="X">X</option>
                <option value="XII-HUMANITIES">XII-HUMANITIES</option>
                <option value="XII-MEDICAL">XII-MEDICAL</option>
                <option value="XII-NON-MEDICAL">XII-NON-MEDICAL</option>
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Group
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Groups</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Multiple">Multiple Slips</option>
                <option value="Single">Single Slip</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => handlePrintSlip()}
                className="w-full bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">
              Board Candidates: <strong className="text-slate-900">{boardStudents.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ROLL NO.</th>
                  <th className="py-3 px-4">ADM. NO.</th>
                  <th className="py-3 px-4">SR. NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {boardStudents.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.rollNo}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">{r.className} - {r.section}</td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handlePrintSlip(r)}
                        className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-medium transition-colors"
                      >
                        Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CBSE Board Registration Slip Modal */}
      {showSlipModal && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSlipModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slip Design */}
            <div className="border-2 border-slate-900 p-6 rounded-lg space-y-4">
              <div className="text-center border-b pb-3 border-slate-300">
                <h2 className="text-xl font-black text-slate-900 tracking-wide uppercase">J D INTERNATIONAL SCHOOL</h2>
                <p className="text-xs text-slate-600">CBSE Affiliation No: 1730000 • School Code: 20000</p>
                <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
                  CBSE BOARD REGISTRATION CONFIRMATION SLIP (2026-2027)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-500">Candidate Name:</span> <strong className="text-slate-900">{selectedStudent.name}</strong></div>
                <div><span className="text-slate-500">Board Roll No:</span> <strong className="text-slate-900">{selectedStudent.rollNo}</strong></div>
                <div><span className="text-slate-500">Father's Name:</span> <strong className="text-slate-900">{selectedStudent.fatherName}</strong></div>
                <div><span className="text-slate-500">Mother's Name:</span> <strong className="text-slate-900">{selectedStudent.motherName}</strong></div>
                <div><span className="text-slate-500">Class & Section:</span> <strong className="text-slate-900">{selectedStudent.className} - {selectedStudent.section}</strong></div>
                <div><span className="text-slate-500">Admission No:</span> <strong className="text-slate-900">{selectedStudent.admNo}</strong></div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700">Registered Subjects:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedStudent.subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex justify-between items-end text-xs text-slate-600">
                <div className="text-center border-t border-slate-400 pt-1 w-36">
                  Candidate Signature
                </div>
                <div className="text-center border-t border-slate-400 pt-1 w-36">
                  Principal Signature
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
