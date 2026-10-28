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
  const { schoolId: authSchoolId, schoolName } = useAuth();
  const schoolId = authSchoolId || 'sch_jd_intl';
  const [schoolProfile, setSchoolProfile] = useState(() => tenantStore.getSchoolProfile(schoolId) || {});

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/schools/profile', {
          headers: { 'x-school-id': schoolId }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            setSchoolProfile(json.data);
            tenantStore.updateSchoolProfile(schoolId, json.data);
            return;
          }
        }
      } catch (e) {}
      if (isMounted) {
        setSchoolProfile(tenantStore.getSchoolProfile(schoolId) || {});
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [schoolId]);

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
  const [dateSheetList, setDateSheetList] = useState([]);

  useEffect(() => {
    if (dateSheetType !== 'With Date Sheet' || !selectedClass) {
      setDateSheetList([]);
      return;
    }
    const fetchDateSheet = async () => {
      try {
        const res = await fetch(`/api/students/exam-date-sheets?className=${encodeURIComponent(selectedClass)}&examTerm=${encodeURIComponent(selectedTerm)}`, {
          headers: { 'x-school-id': schoolId }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            const matched = json.data.find(s => s.className === selectedClass);
            setDateSheetList(matched?.schedules || []);
          }
        }
      } catch (e) {
        setDateSheetList([]);
      }
    };
    fetchDateSheet();
  }, [dateSheetType, selectedClass, selectedTerm, schoolId]);
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

  // Load real students matching selectedClass & selectedSection dynamically
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    const loadRealStudents = async () => {
      let studentList = [];
      try {
        const res = await fetch(`/api/students?className=${encodeURIComponent(selectedClass)}&section=${encodeURIComponent(selectedSection)}`, {
          headers: { 'x-school-id': schoolId }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            studentList = json.data;
          }
        }
      } catch (e) {}

      if (studentList.length === 0) {
        try {
          const allRes = await fetch('/api/students', { headers: { 'x-school-id': schoolId } });
          if (allRes.ok) {
            const allJson = await allRes.json();
            if (allJson.data && Array.isArray(allJson.data)) {
              const norm = (str) => (str || '').toLowerCase().replace(/^(class|grade)\s*/i, '').trim();
              studentList = allJson.data.filter((s) => {
                const cMatch = (s.className || '').trim().toLowerCase() === selectedClass.trim().toLowerCase() ||
                               norm(s.className) === norm(selectedClass);
                const sMatch = !selectedSection || (s.section || 'A').trim().toUpperCase() === selectedSection.trim().toUpperCase();
                return cMatch && sMatch;
              });
            }
          }
        } catch (e) {}
      }

      if (studentList.length === 0) {
        studentList = tenantStore.getStudents(schoolId) || [];
      }

      const formatted = studentList.map((s, idx) => ({
        id: s.id || `std_${idx}`,
        rollNo: s.rollNo || '-',
        admNo: s.admNo || `${idx + 1001}`,
        srNo: s.srNo || s.admNo || `${idx + 1001}`,
        name: (s.name || [s.firstName, s.lastName].filter(Boolean).join(' ') || s.firstName || 'Student').trim().toUpperCase(),
        fatherName: (s.fatherName || s.fathers_name || '').trim().toUpperCase() || '-',
        dob: s.dob || '-',
        gender: s.gender || 'Boy',
        photoUrl: s.photoUrl || s.student_photo || '',
        mobile: s.contactNo || s.fatherMobile || s.smsWhatsappNo || '-',
        address: s.address || s.present_address || '',
        selected: true
      }));

      setStudents(formatted);
    };
    loadRealStudents();
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
                    className="border-2 border-purple-900 rounded-xl p-6 bg-gradient-to-b from-purple-50/30 to-white text-slate-800 relative shadow-md font-sans print:shadow-none print:border-purple-900 print:bg-white mb-8 overflow-hidden page-break-after"
                  >
                    {/* Background Faint Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                      {schoolProfile.logoUrl ? (
                        <img src={schoolProfile.logoUrl} alt="Watermark" className="w-80 h-80 object-contain grayscale" />
                      ) : (
                        <div className="text-8xl font-black text-purple-950 uppercase tracking-widest text-center">
                          {schoolProfile.schoolName || schoolName || 'ERP'}
                        </div>
                      )}
                    </div>

                    {/* Top Header: Logo + School Details + Photo Box */}
                    <div className="flex items-start justify-between gap-4 pb-3 border-b-2 border-purple-900 relative">
                      {/* Left: School Logo */}
                      <div className="w-20 h-24 flex items-center justify-center shrink-0">
                        {schoolProfile.logoUrl ? (
                          <img
                            src={schoolProfile.logoUrl}
                            alt="Logo"
                            className="max-h-20 max-w-full object-contain"
                            onError={(e) => { console.warn("Logo load error:", e.target.src); }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-800 flex items-center justify-center font-bold text-purple-900 text-xl shadow-xs">
                            {(schoolProfile.schoolName || schoolName || 'S').charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Center: School Details */}
                      <div className="text-center flex-1 px-2">
                        <h2 className="text-xl md:text-2xl font-black text-purple-950 tracking-wide uppercase border-b-2 border-purple-900 inline-block pb-0.5 mb-1 font-serif">
                          {schoolProfile.schoolName || schoolName || 'J D INTERNATIONAL SCHOOL'}
                        </h2>
                        <p className="text-[11px] font-semibold text-purple-900">
                          Affiliation No: {schoolProfile.affiliationNo || '1730619'} | School Code: {schoolProfile.schoolCode || '10964'}
                        </p>
                        <p className="text-[10px] text-slate-600 leading-tight mt-0.5">
                          {schoolProfile.address || 'Mahapura, Ajmer Road, Jaipur'}{schoolProfile.place ? `, ${schoolProfile.place}` : ''}{schoolProfile.pinCode ? ` - ${schoolProfile.pinCode}` : ''}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Phone: {schoolProfile.phone1 || '8947919195'} | Email: {schoolProfile.email || 'info@school.com'}
                        </p>
                      </div>

                      {/* Right: Passport Photo Box */}
                      <div className="w-24 h-28 border-2 border-dashed border-purple-900 rounded bg-white flex flex-col items-center justify-center text-center p-1 shadow-2xs shrink-0 overflow-hidden relative">
                        {std.photoUrl ? (
                          <img src={std.photoUrl} alt={std.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <span className="text-[9px] font-black text-purple-900 uppercase leading-tight">Picture Here</span>
                            <span className="text-[8px] text-slate-400 mt-1">Affix Photo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title Banner */}
                    <div className="text-center my-3 border-y border-purple-800/60 py-1.5 bg-purple-100/70 rounded">
                      <h3 className="text-sm md:text-base font-black text-purple-950 uppercase tracking-wider">
                        EXAMINATION ADMIT CARD &bull; {selectedExam}
                      </h3>
                      <p className="text-[10px] font-semibold text-purple-900 mt-0.5">
                        ACADEMIC SESSION: 2026-2027 &bull; TERM: {selectedTerm} &bull; EXAM DATE: {examDate}
                      </p>
                    </div>

                    {/* Section 1: Child's Personal & Examination Details Table (Grid matching requested format) */}
                    <div className="mb-4">
                      <div className="bg-purple-900 text-white font-bold text-[11px] px-3 py-1 uppercase tracking-wider rounded-t flex justify-between items-center">
                        <span>Section 1: Candidate Personal & Academic Details</span>
                        <span className="text-[10px] font-normal text-purple-200">Official Hall Ticket</span>
                      </div>
                      <table className="w-full border-collapse border border-purple-900 text-xs bg-white">
                        <tbody>
                          <tr className="border-b border-purple-800">
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 w-1/4 text-purple-950">Student Full Name:</td>
                            <td className="p-2 font-black text-slate-900 border-r border-purple-800 uppercase w-1/4">{std.name}</td>
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 w-1/4 text-purple-950">Father's Name:</td>
                            <td className="p-2 font-semibold text-slate-800 uppercase w-1/4">{std.fatherName || '-'}</td>
                          </tr>
                          <tr className="border-b border-purple-800">
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Roll No. / Seat No.:</td>
                            <td className="p-2 font-mono font-black text-indigo-700 border-r border-purple-800">{std.rollNo || '-'}</td>
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Admission No. / SR No.:</td>
                            <td className="p-2 font-mono font-semibold text-slate-800">{std.admNo} / {std.srNo}</td>
                          </tr>
                          <tr className="border-b border-purple-800">
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Class & Section:</td>
                            <td className="p-2 font-bold text-slate-900 border-r border-purple-800">{selectedClass} - Section {selectedSection}</td>
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Date of Birth:</td>
                            <td className="p-2 font-medium text-slate-800">{std.dob || '-'}</td>
                          </tr>
                          <tr className="border-b border-purple-800">
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Gender:</td>
                            <td className="p-2 text-slate-800 border-r border-purple-800">{std.gender || 'Boy'}</td>
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Exam Center:</td>
                            <td className="p-2 text-slate-800 font-medium">{schoolProfile.place || 'School Examination Hall'}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Emergency Contact:</td>
                            <td className="p-2 font-mono text-slate-800 border-r border-purple-800">{std.mobile || '-'}</td>
                            <td className="p-2 font-bold bg-purple-50/70 border-r border-purple-800 text-purple-950">Address:</td>
                            <td className="p-2 text-slate-700 text-[11px]">{std.address || schoolProfile.address || 'Jaipur'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Section 2: Examination Schedule & Timings Table (Dynamic if With Date Sheet is selected) */}
                    {dateSheetType === 'With Date Sheet' && (
                      <div className="mb-4">
                        <div className="bg-purple-900 text-white font-bold text-[11px] px-3 py-1 uppercase tracking-wider rounded-t">
                          Section 2: Examination Date Sheet & Time Schedule
                        </div>
                        {dateSheetList.length > 0 ? (
                          <table className="w-full border-collapse border border-purple-900 text-xs bg-white">
                            <thead className="bg-purple-100 font-bold text-purple-950 border-b border-purple-900">
                              <tr>
                                <th className="p-2 border border-purple-800 text-left">Exam Date</th>
                                <th className="p-2 border border-purple-800 text-left">Subject</th>
                                <th className="p-2 border border-purple-800 text-left">Timing</th>
                                <th className="p-2 border border-purple-800 text-center w-28">Invigilator Sign</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dateSheetList.map((item, idx) => (
                                <tr key={idx} className="border-b border-purple-800">
                                  <td className="p-2 border border-purple-800 font-medium">{item.examDate || item.date || '-'}</td>
                                  <td className="p-2 border border-purple-800 font-semibold">{item.subjectName || item.subject || '-'}</td>
                                  <td className="p-2 border border-purple-800">
                                    {printWithoutTime ? '-' : `${item.startTime || '09:00 AM'} - ${item.endTime || '12:00 PM'}`}
                                  </td>
                                  <td className="p-2 border border-purple-800"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-3 border border-purple-900 border-t-0 text-center text-slate-500 text-xs bg-white">
                            No datesheet scheduled yet for Class {selectedClass}. (Admit card issued under regular curriculum)
                          </div>
                        )}
                      </div>
                    )}

                    {/* Instructions Box */}
                    <div className="p-2.5 bg-purple-50/50 border border-purple-300 rounded mb-5 text-[10px] text-slate-700 leading-relaxed">
                      <strong className="text-purple-950 font-bold block mb-0.5 uppercase tracking-wide">Candidate Instructions:</strong>
                      <p>1. Candidate must be present in full school uniform with this official Admit Card 15 minutes prior to the exam.</p>
                      <p>2. Electronic calculators, mobile phones, smart watches, and unauthorized papers are strictly prohibited.</p>
                      <p>3. Do not fold or mutilate this card. Produce on demand before the invigilator.</p>
                    </div>

                    {/* Signatures Row matching official format */}
                    <div className="flex justify-between items-end pt-8 px-4 text-xs font-semibold text-purple-950">
                      <div className="text-center">
                        <div className="w-36 border-t-2 border-slate-800 pt-1">Candidate Signature</div>
                      </div>
                      <div className="text-center">
                        <div className="w-40 border-t-2 border-slate-800 pt-1">Center Superintendent</div>
                      </div>
                      <div className="text-center">
                        <div className="w-44 border-t-2 border-purple-950 pt-1 font-bold">Principal Signature & Seal</div>
                      </div>
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
