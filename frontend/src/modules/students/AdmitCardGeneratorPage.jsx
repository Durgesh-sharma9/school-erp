import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Printer,
  ChevronDown,
  Calendar,
  X
} from 'lucide-react';

const CLASSES = [
  'Nursery - PP3+',
  'Lower Kindergarten - PP4+',
  'Upper Kindergarten - PP5+',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI- HUMANITIES',
  'XII-HUMANITIES',
  'XI-MEDICAL',
  'XII-MEDICAL',
  'XI-NON-MEDICAL',
  'XII-NON-MEDICAL',
  'XI-COMMERCE'
];

const SECTIONS = ['A', 'B', 'C', 'D'];
const TERMS = ['Term 1', 'Term 2', 'Annual Exam'];
const EXAMS = ['None', 'Mid Term Examination 2026', 'Final Board Examination 2027'];

export function AdmitCardGeneratorPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedExam, setSelectedExam] = useState('Mid Term Examination 2026');
  const [examDate, setExamDate] = useState('2026-11-02');
  const [format, setFormat] = useState('Format 1');
  const [content, setContent] = useState(
    'It is allowed to appear in the [exam_term_name] commencing from [date]'
  );
  const [dateSheetType, setDateSheetType] = useState('Without Date Sheet');
  const [printNo, setPrintNo] = useState('2');

  const [printWithoutTime, setPrintWithoutTime] = useState(false);
  const [printLinkedSubjectsOnly, setPrintLinkedSubjectsOnly] = useState(false);
  const [groupBySub, setGroupBySub] = useState(true);

  const [showPrintModal, setShowPrintModal] = useState(false);

  // Dynamic students list from tenantStore (NO SEEDED MOCK DATA)
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const rawList = tenantStore.getStudents(schoolId) || [];
    const filtered = rawList.filter((s) => {
      const cls = (s.className || s.class_id || '').toLowerCase().trim();
      const sec = (s.section || s.division_id || 'A').toLowerCase().trim();
      return (
        (!selectedClass || cls === selectedClass.toLowerCase().trim()) &&
        (!selectedSection || sec === selectedSection.toLowerCase().trim())
      );
    });

    setStudents(
      filtered.map((s, idx) => ({
        id: s.id || `adm_${idx}`,
        rollNo: s.rollNo || String(idx + 1),
        admNo: s.admNo || '',
        srNo: s.srNo || s.admNo || '',
        name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toUpperCase().trim() || 'STUDENT',
        fatherName: (s.fatherName || s.fathers_name || '').toUpperCase().trim() || '-',
        selected: true
      }))
    );
  }, [schoolId, selectedClass, selectedSection]);

  const toggleSelectAll = (checked) => {
    setStudents((prev) => prev.map((s) => ({ ...s, selected: checked })));
  };

  const toggleStudent = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const selectedCount = students.filter((s) => s.selected).length;

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Breadcrumbs matching Live UAB */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Admit Card Generator</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Students</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">Admit Card Generator</span>
        </span>
      </div>

      {/* Main Filter Card matching Live UAB Screenshot Step 1930 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5 mb-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3">
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Class
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Section
            </label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Term
            </label>
            <div className="relative">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Exam
            </label>
            <div className="relative">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                {EXAMS.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-2">
          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Format
            </label>
            <div className="relative">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option>Format 1</option>
                <option>Format 2</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Content
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Type
            </label>
            <div className="relative">
              <select
                value={dateSheetType}
                onChange={(e) => setDateSheetType(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option>Without Date Sheet</option>
                <option>With Date Sheet</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
              Print No.
            </label>
            <div className="relative">
              <select
                value={printNo}
                onChange={(e) => setPrintNo(e.target.value)}
                className="w-full px-3 py-2 text-xs md:text-sm bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Small Caption below Content */}
        <p className="text-[10px] text-gray-400 mb-3 font-mono">
          [exam_term_name] = Exam & Term Name &nbsp;|&nbsp; [date] = Exam Date.
        </p>

        {/* Row 3: Checkboxes & Print button matching Live UAB */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center flex-wrap gap-4 text-xs font-medium text-gray-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={printWithoutTime}
                onChange={(e) => setPrintWithoutTime(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
              <span>Print Date Sheet Without Time.</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={printLinkedSubjectsOnly}
                onChange={(e) => setPrintLinkedSubjectsOnly(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
              <span>Print only student wise linked subject.</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={groupBySub}
                onChange={(e) => setGroupBySub(e.target.checked)}
                className="w-4 h-4 rounded text-red-500 accent-red-500 cursor-pointer"
              />
              <span>group by (Sub1/Sub2)</span>
            </label>
          </div>

          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => setShowPrintModal(true)}
            className={`px-6 py-2 rounded text-xs md:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              selectedCount > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Printer className="w-4 h-4" />
            Print ({selectedCount})
          </button>
        </div>
      </div>

      {/* Table matching Live UAB Screenshot Step 1930 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-400 text-gray-900 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={students.length > 0 && selectedCount === students.length}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-4">ROLL NO. ↑</th>
                <th className="py-2.5 px-4">ADM. NO.</th>
                <th className="py-2.5 px-4">SR. NO.</th>
                <th className="py-2.5 px-4">NAME</th>
                <th className="py-2.5 px-4">FATHER'S NAME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No students registered in Class {selectedClass}-{selectedSection}. Register students under Student Registration to generate admit cards.
                  </td>
                </tr>
              ) : (
                students.map((std) => (
                  <tr key={std.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-4">
                      <input
                        type="checkbox"
                        checked={std.selected}
                        onChange={() => toggleStudent(std.id)}
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-gray-900">{std.rollNo}</td>
                    <td className="py-2.5 px-4 font-semibold text-indigo-600">{std.admNo}</td>
                    <td className="py-2.5 px-4">{std.srNo}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-800">{std.name}</td>
                    <td className="py-2.5 px-4 text-gray-600">{std.fatherName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Admit Card Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
              <h2 className="text-sm md:text-base font-bold text-gray-800">
                Print Preview: Student Admit Cards ({selectedCount})
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {students
                .filter((s) => s.selected)
                .map((std) => (
                  <div
                    key={std.id}
                    className="border-2 border-gray-800 rounded-lg p-5 bg-white text-gray-800 relative font-serif"
                  >
                    <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
                      <h3 className="text-base font-bold tracking-wider">
                        J D INTERNATIONAL SCHOOL
                      </h3>
                      <p className="text-xs uppercase font-sans text-gray-600">
                        Admit Card - {selectedExam} ({selectedTerm})
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-4">
                      <div>
                        <p><span className="font-bold">Student Name:</span> {std.name}</p>
                        <p><span className="font-bold">Roll No:</span> {std.rollNo}</p>
                        <p><span className="font-bold">Class & Section:</span> {selectedClass} - {selectedSection}</p>
                      </div>
                      <div>
                        <p><span className="font-bold">Admission No:</span> {std.admNo}</p>
                        <p><span className="font-bold">Father's Name:</span> {std.fatherName}</p>
                        <p><span className="font-bold">Exam Date:</span> {examDate}</p>
                      </div>
                    </div>

                    {/* Schedule */}
                    <table className="w-full border border-gray-400 text-xs text-left mb-6 font-sans">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border border-gray-400">Date</th>
                          <th className="p-2 border border-gray-400">Subject</th>
                          <th className="p-2 border border-gray-400">Time</th>
                          <th className="p-2 border border-gray-400">Sign</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border border-gray-400">02-Nov-2026</td>
                          <td className="p-2 border border-gray-400">English</td>
                          <td className="p-2 border border-gray-400">09:00 AM - 12:00 PM</td>
                          <td className="p-2 border border-gray-400"></td>
                        </tr>
                        <tr>
                          <td className="p-2 border border-gray-400">04-Nov-2026</td>
                          <td className="p-2 border border-gray-400">Mathematics</td>
                          <td className="p-2 border border-gray-400">09:00 AM - 12:00 PM</td>
                          <td className="p-2 border border-gray-400"></td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex justify-between items-center text-xs font-sans pt-4 border-t border-gray-300">
                      <span>Candidate Signature</span>
                      <span>Center Superintendent</span>
                      <span className="font-bold">Principal Signature</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
