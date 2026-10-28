import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Printer,
  ChevronDown,
  Calendar,
  X,
  Users
} from 'lucide-react';

const SECTIONS = ['A', 'B', 'C', 'D'];
const TERMS = ['Term 1', 'Term 2', 'Annual Exam'];
const EXAMS = ['None', 'Mid Term Examination 2026', 'Final Board Examination 2027'];

export function AdmitCardGeneratorPage({ onNavigate }) {
  const { schoolId: authSchoolId } = useAuth();
  const schoolId = authSchoolId || 'sch_jd_intl';

  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
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

  const [students, setStudents] = useState([]);

  // Load real classes dynamically strictly for active school
  useEffect(() => {
    const loadClasses = async () => {
      let realClasses = [];
      try {
        const res = await fetch('/api/academics/classes', {
          headers: { 'x-school-id': schoolId }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            realClasses = json.data;
          }
        }
      } catch (e) {}

      const localClasses = tenantStore.getClasses(schoolId);
      if (realClasses.length === 0 && localClasses?.length > 0) {
        realClasses = localClasses;
      }

      let apiStudents = [];
      try {
        const sRes = await fetch('/api/students', { headers: { 'x-school-id': schoolId } });
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (sJson.success && Array.isArray(sJson.data)) {
            apiStudents = sJson.data;
            tenantStore.setStudents(schoolId, apiStudents);
          }
        }
      } catch (e) {}

      const enrolled = apiStudents.length > 0 ? apiStudents : tenantStore.getStudents(schoolId);
      const studentClasses = [...new Set(enrolled.map(s => s.className).filter(Boolean))];

      const names = [...new Set([
        ...realClasses.map(c => typeof c === 'string' ? c : c.name).filter(Boolean),
        ...studentClasses
      ])];

      setClassList(names);
      if (names.length > 0) {
        setSelectedClass(prev => prev && names.includes(prev) ? prev : names[0]);
      } else {
        setSelectedClass('');
      }
    };
    loadClasses();
  }, [schoolId]);

  // Load real students matching selectedClass & selectedSection
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    const norm = (str) => (str || '').toLowerCase().replace(/^(class|grade)\\s*/i, '').trim();
    let enrolled = tenantStore.getStudents(schoolId) || [];
    let matched = enrolled.filter(s => {
      const matchClass = (s.className || '').trim().toLowerCase() === selectedClass.trim().toLowerCase() ||
                         norm(s.className) === norm(selectedClass);
      const matchSection = selectedSection ? (s.section || 'A').trim().toUpperCase() === selectedSection.trim().toUpperCase() : true;
      return matchClass && matchSection;
    });

    if (matched.length === 0) {
      fetch('/api/students', { headers: { 'x-school-id': schoolId } })
        .then(r => r.json())
        .then(j => {
          if (j.data && Array.isArray(j.data)) {
            const apiMatch = j.data.filter(s => {
              const matchClass = (s.className || '').trim().toLowerCase() === selectedClass.trim().toLowerCase() ||
                                 norm(s.className) === norm(selectedClass);
              const matchSection = selectedSection ? (s.section || 'A').trim().toUpperCase() === selectedSection.trim().toUpperCase() : true;
              return matchClass && matchSection;
            });
            if (apiMatch.length > 0) {
              setStudents(apiMatch.map((s, idx) => ({
                id: s.id || `std_${idx}`,
                rollNo: s.rollNo || `${idx + 1}`,
                admNo: s.admNo || `${idx + 1}`,
                srNo: s.srNo || s.admNo || `${idx + 1}`,
                name: (s.name || `${s.firstName || "" } ${s.lastName || ""}`).trim().toUpperCase() || "STUDENT",
                className: s.className || selectedClass,
                section: s.section || selectedSection,
                fatherName: (s.fatherName || s.fathers_name || '').toUpperCase() || '-',
                dob: s.dob || '01-01-2019',
                mobile: s.contactNo || s.fatherMobile || s.fathers_mobile_no || '',
                address: s.address || s.present_address || 'Jaipur',
                selected: true
              })));
            }
          }
        }).catch(() => {});
    }

    const formatted = matched.map((s, idx) => ({
      id: s.id || `std_${idx}`,
      rollNo: s.rollNo || `${idx + 1}`,
      admNo: s.admNo || `${idx + 1}`,
      srNo: s.srNo || s.admNo || `${idx + 1}`,
      name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim().toUpperCase() || 'STUDENT',
      fatherName: (s.fatherName || s.fathers_name || '').toUpperCase() || '-',
      selected: true
    }));

    setStudents(formatted);
  }, [selectedClass, selectedSection, schoolId]);

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
                {classList.map((c) => (
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
              {students.map((std) => (
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
              ))}
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
