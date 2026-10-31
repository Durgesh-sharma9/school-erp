import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Trophy,
  Award,
  Search,
  Plus,
  Printer,
  FileDown,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  Share2,
  Users,
  BookOpen,
  Filter,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  Medal,
  Home,
  MessageCircle,
  Save,
  RotateCcw,
  SlidersHorizontal,
  ClipboardList,
  ClipboardCheck,
  Eye,
  Check,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

const DEFAULT_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Science',
  'Computer Science',
  'General Knowledge',
  'Sanskrit',
  'Environmental Studies (EVS)'
];

const DEFAULT_CLASSES = [
  'Class I - A',
  'Class I - B',
  'Class II - A',
  'Class III - A',
  'Class IV - A',
  'Class V - A',
  'Class VI - A',
  'Class VII - A',
  'Class VIII - A',
  'Class IX - A',
  'Class X - A'
];

// Helper to compute grade from percentage
const computeGrade = (pct) => {
  if (pct == null || isNaN(pct)) return '-';
  const val = Number(pct);
  if (val >= 90) return { grade: 'A+', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (val >= 80) return { grade: 'A', color: 'bg-green-100 text-green-800 border-green-300' };
  if (val >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-800 border-blue-300' };
  if (val >= 60) return { grade: 'B', color: 'bg-sky-100 text-sky-800 border-sky-300' };
  if (val >= 50) return { grade: 'C', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (val >= 33) return { grade: 'D', color: 'bg-orange-100 text-orange-800 border-orange-300' };
  return { grade: 'F', color: 'bg-rose-100 text-rose-800 border-rose-300' };
};

export function DailyTestRankingPage({ onNavigate, initialTab = 'ranking' }) {
  const { schoolId } = useAuth();
  const effectiveSchoolId = schoolId || 'sch_jd_intl';

  // Primary active tab: 'ranking' | 'entry' | 'history'
  const [activeTab, setActiveTab] = useState(initialTab || 'ranking');
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Master tests list from tenantStore
  const [tests, setTests] = useState(() => {
    return tenantStore.getDailyTests(effectiveSchoolId) || [];
  });

  // Selected test ID for Ranking view
  const [selectedTestId, setSelectedTestId] = useState(() => {
    const list = tenantStore.getDailyTests(effectiveSchoolId) || [];
    return list[0]?.id || null;
  });

  // Registered students in tenant
  const [registeredStudents, setRegisteredStudents] = useState([]);

  // Selected student for scorecard modal
  const [selectedScorecardStudent, setSelectedScorecardStudent] = useState(null);

  // -------------------------------------------------------------
  // TEACHER MARKS ENTRY STATE (Matching TestMaster MarksEntryForm)
  // -------------------------------------------------------------
  const [entryForm, setEntryForm] = useState({
    classId: 'Class I - A',
    subject: 'Mathematics',
    testDate: new Date().toISOString().split('T')[0],
    maxMarks: 20,
    passingMarks: 8,
    topic: 'Chapter 2: Decimals & Fractions'
  });
  const [entryLoaded, setEntryLoaded] = useState(false);
  const [entryRows, setEntryRows] = useState([]);
  const [entrySearch, setEntrySearch] = useState('');
  const [entrySaving, setEntrySaving] = useState(false);
  const [errorIndices, setErrorIndices] = useState([]);

  // -------------------------------------------------------------
  // RANKING FILTERS STATE (Matching TestMaster ResultManagement)
  // -------------------------------------------------------------
  const [rankingSortBy, setRankingSortBy] = useState('marks_desc'); // marks_desc | marks_asc | rollNo | name
  const [rankingSearch, setRankingSearch] = useState('');

  // Sync from tenantStore on school change
  useEffect(() => {
    const stList = tenantStore.getStudents(effectiveSchoolId) || [];
    setRegisteredStudents(stList);

    const tList = tenantStore.getDailyTests(effectiveSchoolId) || [];
    setTests(tList);
    if (!selectedTestId && tList.length > 0) {
      setSelectedTestId(tList[0].id);
    }
  }, [effectiveSchoolId]);

  // Available classes derived from students + defaults
  const classOptions = useMemo(() => {
    const fromStudents = registeredStudents
      .map(s => {
        if (!s.className) return null;
        return s.section ? `${s.className} - ${s.section}` : s.className;
      })
      .filter(Boolean);
    const set = new Set([...DEFAULT_CLASSES, ...fromStudents]);
    return Array.from(set);
  }, [registeredStudents]);

  // Current active test object for Ranking View
  const activeTest = useMemo(() => {
    return tests.find(t => t.id === selectedTestId) || tests[0] || null;
  }, [tests, selectedTestId]);

  // -------------------------------------------------------------
  // RANKING TAB DATA COMPUTATION
  // -------------------------------------------------------------
  const rankedStudents = useMemo(() => {
    if (!activeTest || !activeTest.students) return [];
    const max = Number(activeTest.maxMarks) || 20;

    let list = [...activeTest.students];

    // Search filter
    if (rankingSearch) {
      const q = rankingSearch.toLowerCase();
      list = list.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q) ||
        s.fatherName?.toLowerCase().includes(q) ||
        s.admNo?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (rankingSortBy === 'marks_desc') {
      list.sort((a, b) => {
        if (a.attendance === 'A' || a.status === 'absent') return 1;
        if (b.attendance === 'A' || b.status === 'absent') return -1;
        return (Number(b.marks ?? b.marksObtained) || 0) - (Number(a.marks ?? a.marksObtained) || 0);
      });
    } else if (rankingSortBy === 'marks_asc') {
      list.sort((a, b) => {
        if (a.attendance === 'A' || a.status === 'absent') return 1;
        if (b.attendance === 'A' || b.status === 'absent') return -1;
        return (Number(a.marks ?? a.marksObtained) || 0) - (Number(b.marks ?? b.marksObtained) || 0);
      });
    } else if (rankingSortBy === 'rollNo') {
      list.sort((a, b) => Number(a.rollNo || 0) - Number(b.rollNo || 0));
    } else if (rankingSortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    // Assign rank & percentage
    return list.map((s, idx) => {
      const isAbsent = s.attendance === 'A' || s.status === 'absent';
      const marks = isAbsent ? 0 : Number(s.marks ?? s.marksObtained ?? 0);
      const pct = max > 0 ? ((marks / max) * 100).toFixed(1) : 0;
      const gradeInfo = computeGrade(pct);
      const passing = Number(activeTest.passingMarks) || (max * 0.4);

      return {
        ...s,
        marks,
        maxMarks: max,
        isAbsent,
        calculatedRank: isAbsent ? '-' : idx + 1,
        percentage: isAbsent ? '0.0' : pct,
        grade: isAbsent ? 'AB' : gradeInfo.grade,
        gradeColor: isAbsent ? 'bg-rose-100 text-rose-800 border-rose-300' : gradeInfo.color,
        isPassed: !isAbsent && marks >= passing
      };
    });
  }, [activeTest, rankingSortBy, rankingSearch]);

  // Ranking stats
  const rankingStats = useMemo(() => {
    if (!rankedStudents.length) return { avg: 0, top: 0, passed: 0, total: 0, presentCount: 0, absentCount: 0 };
    const present = rankedStudents.filter(s => !s.isAbsent);
    const absent = rankedStudents.filter(s => s.isAbsent);
    const totalMarks = present.reduce((acc, s) => acc + (Number(s.marks) || 0), 0);
    const avg = present.length > 0 ? (totalMarks / present.length).toFixed(1) : 0;
    const top = present.length > 0 ? Math.max(...present.map(s => Number(s.marks) || 0)) : 0;
    const passed = present.filter(s => s.isPassed).length;

    return {
      avg,
      top,
      passed,
      total: rankedStudents.length,
      presentCount: present.length,
      absentCount: absent.length
    };
  }, [rankedStudents]);

  // Top 3 Podium
  const podiumToppers = useMemo(() => {
    if (!activeTest || !activeTest.students) return [];
    const present = activeTest.students
      .filter(s => s.attendance !== 'A' && s.status !== 'absent')
      .map(s => ({
        ...s,
        marks: Number(s.marks ?? s.marksObtained ?? 0),
        pct: (((Number(s.marks ?? s.marksObtained ?? 0)) / (Number(activeTest.maxMarks) || 20)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.marks - a.marks);

    return present.slice(0, 3);
  }, [activeTest]);

  // -------------------------------------------------------------
  // TEACHER MARKS ENTRY ACTIONS (TestMaster logic)
  // -------------------------------------------------------------
  const loadDailyTestEntry = () => {
    if (!entryForm.classId) {
      toast.error('Please select a class');
      return;
    }
    if (!entryForm.subject) {
      toast.error('Please select a subject');
      return;
    }
    if (!entryForm.testDate) {
      toast.error('Please select a test date');
      return;
    }

    // Check if an existing test matches this Class, Subject, and Date
    const existing = tests.find(
      t => t.className === entryForm.classId &&
           t.subject?.toLowerCase() === entryForm.subject?.toLowerCase() &&
           t.date === entryForm.testDate
    );

    if (existing && existing.students && existing.students.length > 0) {
      setEntryRows(existing.students.map(s => ({
        studentId: s.admNo || s.id,
        admNo: s.admNo,
        rollNo: s.rollNo,
        name: s.name,
        fatherName: s.fatherName || s.father_name || 'Mr. Sharma',
        status: (s.attendance === 'A' || s.status === 'absent') ? 'absent' : 'present',
        marksObtained: (s.attendance === 'A' || s.status === 'absent') ? 0 : (s.marks ?? s.marksObtained ?? ''),
        prevMarks: s.marks ?? s.marksObtained ?? ''
      })));
      setEntryForm(prev => ({
        ...prev,
        maxMarks: existing.maxMarks || prev.maxMarks,
        passingMarks: existing.passingMarks || prev.passingMarks,
        topic: existing.title || prev.topic
      }));
      setEntryLoaded(true);
      toast.success(`Existing Daily Test loaded for ${entryForm.classId} (${existing.students.length} students)`);
      return;
    }

    // Otherwise, generate roster from registered students for that class
    let roster = registeredStudents.filter(s => {
      const cls = s.section ? `${s.className} - ${s.section}` : s.className;
      return cls === entryForm.classId || s.className === entryForm.classId;
    });

    // Fallback students if tenant has 0 students in that class
    if (roster.length === 0) {
      roster = [
        { admNo: '1002', name: 'Dev Sharma', fatherName: 'Rajesh Sharma', rollNo: '1' },
        { admNo: '1621', name: 'Aaditya Singh', fatherName: 'Mahendra Singh', rollNo: '2' },
        { admNo: '2060', name: 'Rohan Sharma', fatherName: 'Mukesh Sharma', rollNo: '3' },
        { admNo: '2061', name: 'Priya Meena', fatherName: 'Suresh Meena', rollNo: '4' },
        { admNo: '2062', name: 'Ananya Gupta', fatherName: 'Deepak Gupta', rollNo: '5' },
        { admNo: '2063', name: 'Kavya Verma', fatherName: 'Dinesh Verma', rollNo: '6' }
      ];
    }

    const rows = roster.map((s, idx) => ({
      studentId: s.admNo || s.id || `st_${idx}`,
      admNo: s.admNo || `${1000 + idx}`,
      rollNo: s.rollNo || s.srNo || String(idx + 1),
      name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
      fatherName: s.fatherName || s.father_name || 'Father Name',
      status: 'present',
      marksObtained: '',
      prevMarks: ''
    }));

    setEntryRows(rows);
    setEntryLoaded(true);
    toast.success(`Students loaded! Ready to enter marks for ${entryForm.classId} (${rows.length} students).`);
  };

  // Toggle Absent / Present
  const toggleAbsent = (idx) => {
    setEntryRows(prev =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        const isCurrentlyAbsent = row.status === 'absent';
        return {
          ...row,
          status: isCurrentlyAbsent ? 'present' : 'absent',
          marksObtained: isCurrentlyAbsent ? (row.prevMarks ?? '') : 0,
          prevMarks: isCurrentlyAbsent ? row.prevMarks : row.marksObtained
        };
      })
    );
    setErrorIndices(prev => prev.filter(i => i !== idx));
  };

  // Keyboard navigation on Enter key
  const handleMarksKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.querySelector(`input[data-entry-idx="${idx + 1}"]`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select?.();
      }
    }
  };

  // Save Marks (matching TestMaster validation & saving)
  const handleSaveMarks = () => {
    if (!entryLoaded || entryRows.length === 0) {
      toast.error('Click "Load Daily Test" first to load students');
      return;
    }

    // Check empty marks for present students
    const empty = [];
    entryRows.forEach((r, idx) => {
      if (r.status !== 'absent' && (r.marksObtained === '' || r.marksObtained == null)) {
        empty.push(idx);
      }
    });

    if (empty.length > 0) {
      setErrorIndices(empty);
      toast.error('Marks are required for all present students.');
      const firstInput = document.querySelector(`input[data-entry-idx="${empty[0]}"]`);
      if (firstInput) {
        firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInput.focus();
      }
      return;
    }

    // Check excess marks
    const max = Number(entryForm.maxMarks) || 20;
    const excess = [];
    entryRows.forEach((r, idx) => {
      if (r.status !== 'absent') {
        const val = Number(r.marksObtained);
        if (val > max || val < 0) {
          excess.push(idx);
        }
      }
    });

    if (excess.length > 0) {
      setErrorIndices(excess);
      const studentName = entryRows[excess[0]]?.name;
      toast.error(`${studentName}'s marks exceed maximum marks (${max})!`);
      const firstExcess = document.querySelector(`input[data-entry-idx="${excess[0]}"]`);
      if (firstExcess) {
        firstExcess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstExcess.focus();
      }
      return;
    }

    setEntrySaving(true);
    try {
      // Build test student roster
      const studentsRoster = entryRows.map(r => ({
        admNo: r.admNo,
        rollNo: r.rollNo,
        name: r.name,
        fatherName: r.fatherName,
        status: r.status,
        attendance: r.status === 'absent' ? 'A' : 'P',
        marks: r.status === 'absent' ? 0 : Number(r.marksObtained),
        marksObtained: r.status === 'absent' ? 0 : Number(r.marksObtained),
        remarks: r.status === 'absent' ? 'Absent' : ''
      }));

      // Check if updating existing or adding new
      const existingIdx = tests.findIndex(
        t => t.className === entryForm.classId &&
             t.subject?.toLowerCase() === entryForm.subject?.toLowerCase() &&
             t.date === entryForm.testDate
      );

      let savedTest;
      let updatedTests;

      if (existingIdx >= 0) {
        savedTest = {
          ...tests[existingIdx],
          title: entryForm.topic || `${entryForm.subject} Daily Test`,
          maxMarks: max,
          passingMarks: Number(entryForm.passingMarks) || (max * 0.4),
          status: 'Evaluated',
          students: studentsRoster
        };
        updatedTests = [...tests];
        updatedTests[existingIdx] = savedTest;
      } else {
        savedTest = {
          id: 'dt_' + Date.now(),
          title: entryForm.topic || `${entryForm.subject} Daily Test`,
          className: entryForm.classId,
          subject: entryForm.subject,
          date: entryForm.testDate,
          maxMarks: max,
          passingMarks: Number(entryForm.passingMarks) || (max * 0.4),
          status: 'Evaluated',
          students: studentsRoster
        };
        updatedTests = [savedTest, ...tests];
      }

      tenantStore.saveDailyTests(effectiveSchoolId, updatedTests);
      setTests(updatedTests);
      setSelectedTestId(savedTest.id);
      setErrorIndices([]);
      toast.success('Daily Test marks saved successfully! Updated in rankings.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save daily test marks');
    } finally {
      setEntrySaving(false);
    }
  };

  // Filtered rows for entry table search
  const filteredEntryRows = useMemo(() => {
    if (!entrySearch) return entryRows;
    const q = entrySearch.toLowerCase();
    return entryRows.filter(r =>
      r.name?.toLowerCase().includes(q) ||
      r.rollNo?.toLowerCase().includes(q) ||
      r.fatherName?.toLowerCase().includes(q)
    );
  }, [entryRows, entrySearch]);

  // Export CSV of ranking
  const handleExportCSV = () => {
    if (!activeTest || !rankedStudents.length) {
      toast.error('No results to export');
      return;
    }
    const headers = ['Rank', 'Roll No', 'Adm No', 'Student Name', 'Father Name', 'Class', 'Subject', 'Date', `Marks (/${activeTest.maxMarks})`, 'Percentage (%)', 'Grade', 'Status'];
    const csvRows = rankedStudents.map(s => [
      s.calculatedRank,
      s.rollNo,
      s.admNo,
      `"${s.name}"`,
      `"${s.fatherName || ''}"`,
      `"${activeTest.className}"`,
      `"${activeTest.subject}"`,
      activeTest.date,
      s.marks,
      `${s.percentage}%`,
      s.grade,
      s.isAbsent ? 'Absent' : 'Present'
    ]);
    const content = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(content);
    link.download = `DailyTest_${activeTest.className}_${activeTest.subject}_${activeTest.date}.csv`;
    link.click();
    toast.success('Ranking spreadsheet exported!');
  };

  // WhatsApp notify parent
  const handleWhatsAppNotify = (s) => {
    const text = `*J D INTERNATIONAL SCHOOL, JAIPUR*\n*Daily Test Result Update*\n\nDear Parent, your ward *${s.name}* (Roll: ${s.rollNo}, Class: ${activeTest.className}) appeared in the *${activeTest.subject}* Daily Test on ${activeTest.date}.\n\n• Marks: *${s.marks}/${activeTest.maxMarks}*\n• Percentage: *${s.percentage}%*\n• Grade: *${s.grade}*\n• Class Rank: *${s.calculatedRank}*\n• Status: *${s.isPassed ? 'PASSED ✅' : 'NEEDS PRACTICE ✍️'}*\n\nKeep encouraging your child!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 p-3 sm:p-5 text-slate-800">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <span>/</span>
            <span>Examination & Academics</span>
            <span>/</span>
            <span className="text-orange-600 font-semibold">Daily Test Master</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Trophy className="w-6 h-6 text-amber-500" />
            School Daily Test System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Teacher marks entry, real-time keyboard navigation, live classroom rank standings, and WhatsApp report cards.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print Rank Sheet
          </button>
          <button
            onClick={() => {
              setActiveTab('entry');
              setEntryLoaded(false);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-sm transition-all shadow-orange-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Daily Test
          </button>
        </div>
      </div>

      {/* Top Mode Navigation Tabs */}
      <div className="flex items-center gap-2 mb-4 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-xs max-w-xl">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ranking'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Daily Test Ranking & Results
        </button>

        <button
          onClick={() => setActiveTab('entry')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'entry'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          Teacher Marks Entry
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Test Archives
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TEACHER MARKS ENTRY (Replicating TestMaster MarksEntryForm)        */}
      {/* ========================================================================= */}
      {activeTab === 'entry' && (
        <div className="space-y-4">
          {/* Setup Card (Orange theme matching TestMaster) */}
          <div className="rounded-2xl border border-orange-200/90 p-4 sm:p-5 bg-gradient-to-br from-[#FFFDF9] via-[#FFF6EC]/70 to-[#FFFDF9] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daily Test Session Setup</h3>
                  <p className="text-[11px] text-slate-500">Select class, subject, date and maximum marks to record student scores.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
                Daily Test Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Class Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Class & Section</label>
                <select
                  value={entryForm.classId}
                  onChange={(e) => {
                    setEntryForm({ ...entryForm, classId: e.target.value });
                    setEntryLoaded(false);
                  }}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 shadow-xs"
                >
                  {classOptions.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {/* Subject Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Subject</label>
                <select
                  value={entryForm.subject}
                  onChange={(e) => {
                    setEntryForm({ ...entryForm, subject: e.target.value });
                    setEntryLoaded(false);
                  }}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 shadow-xs"
                >
                  {DEFAULT_SUBJECTS.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Test Date</label>
                <input
                  type="date"
                  value={entryForm.testDate}
                  onChange={(e) => {
                    setEntryForm({ ...entryForm, testDate: e.target.value });
                    setEntryLoaded(false);
                  }}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 shadow-xs"
                />
              </div>

              {/* Max Marks */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={entryForm.maxMarks}
                  onChange={(e) => setEntryForm({ ...entryForm, maxMarks: Number(e.target.value) || 20 })}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 shadow-xs text-center"
                />
              </div>

              {/* Topic / Chapter Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Test Title / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 2: Fractions"
                  value={entryForm.topic}
                  onChange={(e) => setEntryForm({ ...entryForm, topic: e.target.value })}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 shadow-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 mt-1">
              <button
                type="button"
                onClick={loadDailyTestEntry}
                className="h-9 px-6 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] via-[#FF8C00] to-[#FFA000] hover:from-[#E66E00] hover:to-[#E68E00] shadow-sm shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ClipboardCheck className="w-4 h-4" />
                Load Daily Test
              </button>
            </div>
          </div>

          {/* Prompt card if not loaded */}
          {!entryLoaded && (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-orange-200/90 bg-gradient-to-b from-orange-50/40 via-white to-amber-50/20 text-center shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF7A00] to-[#FFA000] text-white mb-2 shadow-xs">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-0.5">
                Ready to enter Daily Test marks?
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                Select the class, subject, and date above, then click &quot;Load Daily Test&quot; to begin keyboard-speed marks entry.
              </p>
            </div>
          )}

          {/* Student Marks Table (When Loaded) */}
          {entryLoaded && entryRows.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              {/* Header with search & guidance */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-orange-50/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      Marks Entry Sheet: {entryForm.classId} &bull; {entryForm.subject}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">Enter</kbd> to quickly jump to next student.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search by name or roll..."
                      value={entrySearch}
                      onChange={(e) => setEntrySearch(e.target.value)}
                      className="h-8.5 pl-8 pr-3 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full sm:w-60"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl text-center">
                    Click <strong className="text-emerald-700">Present</strong> to toggle <strong className="text-red-600">ABSENT</strong>
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-16 text-center">Roll</th>
                      <th className="py-2.5 px-4">Student Details</th>
                      <th className="py-2.5 px-3 w-28 text-center">Attendance</th>
                      <th className="py-2.5 px-3 w-36 text-center">Marks (Max: {entryForm.maxMarks})</th>
                      <th className="py-2.5 px-3 w-24 text-center">Percentage</th>
                      <th className="py-2.5 px-3 w-20 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEntryRows.map((r) => {
                      const origIdx = entryRows.findIndex(row => row.studentId === r.studentId);
                      const isAbsent = r.status === 'absent';
                      const val = Number(r.marksObtained);
                      const hasError = errorIndices.includes(origIdx);
                      const max = Number(entryForm.maxMarks) || 20;
                      const pct = (!isAbsent && r.marksObtained !== '') ? ((val / max) * 100).toFixed(1) : '-';

                      return (
                        <tr key={r.studentId} className={`hover:bg-slate-50/80 transition-colors ${hasError ? 'bg-red-50/60' : ''}`}>
                          <td className="py-2.5 px-3 text-center font-mono text-xs font-bold text-slate-600">
                            {r.rollNo}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="font-bold text-slate-900 leading-tight">{r.name}</div>
                            {r.fatherName && (
                              <div className="text-[10px] text-slate-500 font-normal leading-tight mt-0.5">
                                Father: {r.fatherName}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAbsent(origIdx)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-xs select-none ${
                                isAbsent
                                  ? 'bg-red-500 hover:bg-red-600 text-white border border-red-600 shadow-red-500/20'
                                  : 'bg-emerald-50 hover:bg-red-50 text-emerald-700 hover:text-red-600 border border-emerald-200/80 hover:border-red-200'
                              }`}
                            >
                              {isAbsent ? 'ABSENT' : 'Present'}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isAbsent ? (
                              <div className="h-8 text-xs font-extrabold text-red-600 bg-red-50 border border-red-200/90 rounded-lg flex items-center justify-center mx-auto w-24 select-none">
                                AB
                              </div>
                            ) : (
                              <div className="relative inline-block w-24">
                                <input
                                  data-entry-idx={origIdx}
                                  type="number"
                                  min="0"
                                  max={entryForm.maxMarks}
                                  step="0.5"
                                  value={r.marksObtained}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEntryRows(prev =>
                                      prev.map((row, i) => (i === origIdx ? { ...row, marksObtained: val } : row))
                                    );
                                    if (errorIndices.includes(origIdx)) {
                                      setErrorIndices(prev => prev.filter(i => i !== origIdx));
                                    }
                                  }}
                                  onKeyDown={(e) => handleMarksKeyDown(e, origIdx)}
                                  className={`h-8 text-xs font-bold text-slate-900 text-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 w-full ${
                                    hasError
                                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                  placeholder="0"
                                />
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-xs font-semibold text-slate-700">
                            {pct !== '-' ? `${pct}%` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isAbsent
                                ? 'bg-slate-100 text-slate-500'
                                : Number(r.marksObtained) >= (Number(entryForm.passingMarks) || (max * 0.4))
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {isAbsent ? 'AB' : Number(r.marksObtained) >= (Number(entryForm.passingMarks) || (max * 0.4)) ? 'PASS' : 'RETEST'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Bar Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span>Total Students: <strong className="text-slate-900 font-bold">{entryRows.length}</strong></span>
                  <span>Present: <strong className="text-emerald-700 font-bold">{entryRows.filter(r => r.status !== 'absent').length}</strong></span>
                  <span>Absent: <strong className="text-red-600 font-bold">{entryRows.filter(r => r.status === 'absent').length}</strong></span>
                  <span>Marks Entered: <strong className="text-indigo-600 font-bold">{entryRows.filter(r => r.status !== 'absent' && r.marksObtained !== '').length}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveMarks}
                    disabled={entrySaving}
                    className="h-9 px-6 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    {entrySaving ? 'Saving Marks...' : 'Save Daily Test Marks'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY TEST RANKING & RESULTS (Replicating ResultManagement)       */}
      {/* ========================================================================= */}
      {activeTab === 'ranking' && (
        <div className="space-y-4">
          {/* Filters Section (Blue tone matching TestMaster) */}
          <div className="rounded-2xl border border-blue-200/80 p-4 bg-gradient-to-br from-[#F5F8FF] via-[#EEF2FF]/60 to-[#F5F8FF] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Classroom Results & Ranking Filters</h3>
                  <p className="text-[11px] text-slate-500">Filter test scores, sort classroom ranks, and export official reports.</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200">
                Evaluation Hub
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Select Test Record */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Select Daily Test</label>
                <select
                  value={selectedTestId || ''}
                  onChange={(e) => setSelectedTestId(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 shadow-xs"
                >
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} &bull; {t.className} &bull; {t.subject} ({t.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Sort Standings By</label>
                <select
                  value={rankingSortBy}
                  onChange={(e) => setRankingSortBy(e.target.value)}
                  className="w-full h-9 px-3 text-xs font-semibold rounded-xl bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 shadow-xs"
                >
                  <option value="marks_desc">Marks: High → Low (Rank 1 Topper)</option>
                  <option value="marks_asc">Marks: Low → High</option>
                  <option value="rollNo">Roll Number</option>
                  <option value="name">Student Name (A to Z)</option>
                </select>
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Quick Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, roll no, father..."
                    value={rankingSearch}
                    onChange={(e) => setRankingSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-xs font-semibold rounded-xl bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 shadow-xs"
                  />
                </div>
              </div>

              {/* Reset Action */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setRankingSortBy('marks_desc');
                    setRankingSearch('');
                  }}
                  className="w-full h-9 px-4 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Test Metadata Banner */}
          {activeTest && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{activeTest.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>Class: <strong className="text-slate-800">{activeTest.className}</strong></span>
                    <span>&bull;</span>
                    <span>Subject: <strong className="text-indigo-600">{activeTest.subject}</strong></span>
                    <span>&bull;</span>
                    <span>Date: <strong className="text-slate-800">{activeTest.date}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80">
                  Max Marks: {activeTest.maxMarks}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80">
                  Passing Marks: {activeTest.passingMarks || (Number(activeTest.maxMarks) * 0.4)}
                </span>
              </div>
            </div>
          )}

          {/* KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Total Students</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{rankingStats.total}</div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Appeared (Present)</span>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">{rankingStats.presentCount}</div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Check className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Absent</span>
                <div className="text-xl font-bold text-red-600 mt-0.5">{rankingStats.absentCount}</div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <XCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Class Average</span>
                <div className="text-xl font-bold text-indigo-600 mt-0.5">{rankingStats.avg} <span className="text-xs font-normal text-slate-400">/ {activeTest?.maxMarks || 20}</span></div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Top Score</span>
                <div className="text-xl font-bold text-amber-600 mt-0.5">{rankingStats.top} <span className="text-xs font-normal text-slate-400">marks</span></div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Top 3 Podium (Gold, Silver, Bronze) */}
          {podiumToppers.length >= 3 && (
            <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-xs">
              <h3 className="text-center text-xs font-black uppercase tracking-widest text-amber-900 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Classroom Top 3 Rank Holders &bull; Leaderboard
                <Sparkles className="w-4 h-4 text-amber-600" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {/* Rank 2 (Silver) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 text-center order-2 md:order-1 relative overflow-hidden">
                  <span className="text-2xl">🥈</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Rank 2</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5 truncate">{podiumToppers[1]?.name || 'Student 2'}</h4>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{podiumToppers[1]?.marks} / {activeTest.maxMarks} ({podiumToppers[1]?.pct}%)</p>
                </div>

                {/* Rank 1 (Gold - Center & Elevated) */}
                <div className="bg-white rounded-xl border-2 border-amber-400 shadow-md p-4 text-center order-1 md:order-2 transform md:-translate-y-2 relative overflow-hidden bg-gradient-to-b from-amber-50/40 to-white">
                  <span className="text-3xl">🥇</span>
                  <span className="block text-xs font-black text-amber-800 uppercase mt-0.5">Top Scorer &bull; Rank 1</span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5 truncate">{podiumToppers[0]?.name || 'Student 1'}</h4>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">{podiumToppers[0]?.marks} / {activeTest.maxMarks} ({podiumToppers[0]?.pct}%)</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 font-extrabold rounded-full text-[10px]">
                    Class Topper 🏆
                  </span>
                </div>

                {/* Rank 3 (Bronze) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 text-center order-3 md:order-3 relative overflow-hidden">
                  <span className="text-2xl">🥉</span>
                  <span className="block text-[10px] font-bold text-amber-700 uppercase mt-1">Rank 3</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5 truncate">{podiumToppers[2]?.name || 'Student 3'}</h4>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{podiumToppers[2]?.marks} / {activeTest.maxMarks} ({podiumToppers[2]?.pct}%)</p>
                </div>
              </div>
            </div>
          )}

          {/* Full Results & Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Official Rank Standings & Score Table ({rankedStudents.length} Students)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Click student row or Report button to view printable slip
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14">Rank</th>
                    <th className="py-2.5 px-3 text-center w-16">Roll No</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-3">Adm No</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Score (/{activeTest?.maxMarks || 20})</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Result</th>
                    <th className="py-2.5 px-3 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {rankedStudents.length > 0 ? (
                    rankedStudents.map((s) => (
                      <tr key={s.admNo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center">
                          {s.calculatedRank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs shadow-xs">
                              1
                            </span>
                          ) : s.calculatedRank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-xs">
                              2
                            </span>
                          ) : s.calculatedRank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-black text-xs shadow-xs">
                              3
                            </span>
                          ) : (
                            <span className="font-bold text-slate-500 font-mono">{s.calculatedRank}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600 font-bold">{s.rollNo}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {s.name}
                          {s.calculatedRank === 1 && (
                            <span className="ml-2 text-[9px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-black">
                              1st
                            </span>
                          )}
                          {s.fatherName && (
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                              Father: {s.fatherName}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-indigo-700 font-semibold">{s.admNo}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.isAbsent ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {s.isAbsent ? 'Absent' : 'Present'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono text-xs">
                          {s.marks}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold font-mono text-slate-700">
                          {s.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${s.gradeColor}`}>
                            {s.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.isAbsent
                              ? 'bg-slate-100 text-slate-500'
                              : s.isPassed
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {s.isAbsent ? 'AB' : s.isPassed ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedScorecardStudent(s)}
                              className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                              title="View Student Scorecard"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleWhatsAppNotify(s)}
                              className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                              title="Send WhatsApp Report"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        No students found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEST ARCHIVES & DIRECTORY                                          */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">All Saved Daily Tests ({tests.length})</h3>
              <p className="text-xs text-slate-500">History of all conducted daily assessments with class averages and topper scores.</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('entry');
                setEntryLoaded(false);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl"
            >
              + Create New Test
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tests.map(test => {
              const present = (test.students || []).filter(s => s.attendance !== 'A' && s.status !== 'absent');
              const top = present.length > 0 ? Math.max(...present.map(s => Number(s.marks ?? s.marksObtained ?? 0))) : 0;
              const avg = present.length > 0 ? (present.reduce((acc, s) => acc + Number(s.marks ?? s.marksObtained ?? 0), 0) / present.length).toFixed(1) : 0;

              return (
                <div key={test.id} className="rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      {test.className}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{test.date}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{test.title}</h4>
                  <p className="text-[11px] text-slate-600 font-semibold mt-0.5">Subject: {test.subject}</p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Max Marks</span>
                      <strong className="text-slate-800">{test.maxMarks}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Avg Score</span>
                      <strong className="text-indigo-600">{avg}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Topper</span>
                      <strong className="text-amber-600">{top}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTestId(test.id);
                        setActiveTab('ranking');
                      }}
                      className="flex-1 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-center"
                    >
                      View Ranking
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEntryForm({
                          classId: test.className,
                          subject: test.subject,
                          testDate: test.date,
                          maxMarks: test.maxMarks,
                          passingMarks: test.passingMarks || (test.maxMarks * 0.4),
                          topic: test.title
                        });
                        setEntryRows(test.students.map(s => ({
                          studentId: s.admNo || s.id,
                          admNo: s.admNo,
                          rollNo: s.rollNo,
                          name: s.name,
                          fatherName: s.fatherName || 'Father Name',
                          status: (s.attendance === 'A' || s.status === 'absent') ? 'absent' : 'present',
                          marksObtained: (s.attendance === 'A' || s.status === 'absent') ? 0 : (s.marks ?? s.marksObtained ?? ''),
                          prevMarks: s.marks ?? s.marksObtained ?? ''
                        })));
                        setEntryLoaded(true);
                        setActiveTab('entry');
                      }}
                      className="flex-1 py-1 text-xs font-semibold rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-center"
                    >
                      Edit Marks
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STUDENT SCORECARD POPUP MODAL                                             */}
      {/* ========================================================================= */}
      {selectedScorecardStudent && activeTest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 text-center relative">
              <button
                type="button"
                onClick={() => setSelectedScorecardStudent(null)}
                className="absolute right-3 top-3 text-white/80 hover:text-white text-base font-bold"
              >
                ✕
              </button>
              <h3 className="text-base font-black tracking-wide uppercase">J D INTERNATIONAL SCHOOL</h3>
              <p className="text-[10.5px] text-blue-100 font-medium">Affiliated to CBSE, New Delhi &bull; Jaipur, Rajasthan</p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-widest uppercase">
                DAILY TEST PERFORMANCE SLIP
              </div>
            </div>

            {/* Slip Content */}
            <div className="p-5 space-y-4 text-xs">
              {/* Student Metadata Table */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Student Name</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedScorecardStudent.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Father's Name</span>
                  <span className="font-semibold text-slate-800">{selectedScorecardStudent.fatherName || 'Mr. Rajesh Sharma'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Class & Section</span>
                  <span className="font-semibold text-slate-800">{activeTest.className}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Roll No &bull; Adm No</span>
                  <span className="font-mono font-bold text-indigo-700">{selectedScorecardStudent.rollNo} &bull; {selectedScorecardStudent.admNo}</span>
                </div>
              </div>

              {/* Assessment Particulars */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-bold text-slate-800 text-[11px] flex justify-between">
                  <span>Subject: {activeTest.subject}</span>
                  <span>Date: {activeTest.date}</span>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Test Topic:</span>
                    <span className="font-semibold text-slate-900">{activeTest.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Marks Obtained:</span>
                    <span className="font-black text-indigo-700 text-sm">{selectedScorecardStudent.marks} / {activeTest.maxMarks}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Percentage:</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedScorecardStudent.percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Class Rank:</span>
                    <span className="font-extrabold text-amber-600 font-mono">Rank {selectedScorecardStudent.calculatedRank}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Grade & Result:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedScorecardStudent.gradeColor}`}>
                      Grade {selectedScorecardStudent.grade} ({selectedScorecardStudent.isPassed ? 'PASSED' : 'RETEST'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80">
                <strong>Teacher Remark:</strong> {selectedScorecardStudent.remarks || 'Regular daily practice recommended in calculation speed.'}
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-4 text-[10px] text-slate-500">
                <div className="text-center">
                  <div className="w-24 border-b border-slate-300 mb-1"></div>
                  <span>Subject Teacher</span>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b border-slate-300 mb-1"></div>
                  <span>Parent Signature</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Slip
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppNotify(selectedScorecardStudent)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Send WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
