import React, { useState, useEffect, useMemo } from 'react';
import {
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
  Trophy,
  Medal,
  Home,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'Social Science',
  'Hindi',
  'Computer Science',
  'General Knowledge',
  'Environmental Studies (EVS)'
];

export function DailyTestRankingPage({ onNavigate }) {
  const { schoolId } = useAuth();
  const effectiveSchoolId = schoolId || 'sch_jd_intl';

  // Active top tab: 'ranking' | 'entry' | 'history'
  const [activeTab, setActiveTab] = useState('ranking');

  // Loaded tests
  const [tests, setTests] = useState(() => {
    return tenantStore.getDailyTests(effectiveSchoolId) || [];
  });

  // Selected test to view/edit
  const [selectedTestId, setSelectedTestId] = useState(() => {
    const list = tenantStore.getDailyTests(effectiveSchoolId) || [];
    return list[0]?.id || null;
  });

  // Registered students for current class
  const [tenantStudents, setTenantStudents] = useState([]);

  // Create Test Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestForm, setNewTestForm] = useState({
    title: 'Weekly Mathematics Chapter 2 Test',
    className: 'Class I - A',
    subject: 'Mathematics',
    date: new Date().toISOString().split('T')[0],
    maxMarks: 20,
    passingMarks: 8
  });

  // Current active test object
  const activeTest = useMemo(() => {
    return tests.find(t => t.id === selectedTestId) || tests[0] || null;
  }, [tests, selectedTestId]);

  // Load students and sync
  useEffect(() => {
    const list = tenantStore.getStudents(effectiveSchoolId) || [];
    setTenantStudents(list);
    const testList = tenantStore.getDailyTests(effectiveSchoolId) || [];
    setTests(testList);
    if (!selectedTestId && testList.length > 0) {
      setSelectedTestId(testList[0].id);
    }
  }, [effectiveSchoolId]);

  // Students in active test with calculated percentage & ranks
  const rankedStudents = useMemo(() => {
    if (!activeTest || !activeTest.students) return [];
    const max = Number(activeTest.maxMarks) || 20;

    // Clone and sort descending by marks
    const sorted = [...activeTest.students].sort((a, b) => {
      if (a.attendance === 'A') return 1;
      if (b.attendance === 'A') return -1;
      return (Number(b.marks) || 0) - (Number(a.marks) || 0);
    });

    return sorted.map((s, idx) => {
      const marks = Number(s.marks) || 0;
      const pct = max > 0 ? ((marks / max) * 100).toFixed(1) : 0;
      const isAbsent = s.attendance === 'A';
      return {
        ...s,
        calculatedRank: isAbsent ? '-' : idx + 1,
        percentage: isAbsent ? '0.0' : pct,
        isPassed: marks >= (Number(activeTest.passingMarks) || 8)
      };
    });
  }, [activeTest]);

  // Update marks for student in active test
  const handleMarksChange = (admNo, field, val) => {
    if (!activeTest) return;
    const updatedStudents = activeTest.students.map(s => {
      if (s.admNo === admNo) {
        return { ...s, [field]: val };
      }
      return s;
    });

    const updatedTest = { ...activeTest, students: updatedStudents };
    const updatedTests = tests.map(t => t.id === activeTest.id ? updatedTest : t);
    setTests(updatedTests);
    tenantStore.saveDailyTests(effectiveSchoolId, updatedTests);
  };

  // Create new test
  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!newTestForm.title || !newTestForm.subject) {
      toast.error('Title and Subject are required');
      return;
    }

    // Populate roster from registered students
    const roster = tenantStudents.length > 0
      ? tenantStudents.map((s, idx) => ({
          admNo: s.admNo || s.admissionNo || `ADM-${1000 + idx}`,
          name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
          rollNo: String(s.srNo || idx + 1),
          marks: 0,
          attendance: 'P',
          remarks: ''
        }))
      : [
          { admNo: '1002', name: 'Dev Sharma', rollNo: '1', marks: 18, attendance: 'P', remarks: 'Good' },
          { admNo: '1621', name: 'Aaditya Singh', rollNo: '2', marks: 16, attendance: 'P', remarks: 'Well done' },
          { admNo: '2060', name: 'Rohan Sharma', rollNo: '3', marks: 15, attendance: 'P', remarks: '' },
          { admNo: '2061', name: 'Priya Meena', rollNo: '4', marks: 12, attendance: 'P', remarks: '' }
        ];

    const created = tenantStore.addDailyTest(effectiveSchoolId, {
      ...newTestForm,
      status: 'In Progress',
      students: roster
    });

    setTests(tenantStore.getDailyTests(effectiveSchoolId));
    setSelectedTestId(created.id);
    setIsCreateModalOpen(false);
    toast.success('New Daily Test schedule created successfully!');
  };

  // Quick stats
  const testStats = useMemo(() => {
    if (!rankedStudents.length) return { avg: 0, top: 0, passed: 0, total: 0 };
    const present = rankedStudents.filter(s => s.attendance !== 'A');
    const totalMarksSum = present.reduce((acc, s) => acc + (Number(s.marks) || 0), 0);
    const avg = present.length > 0 ? (totalMarksSum / present.length).toFixed(1) : 0;
    const top = present.length > 0 ? Math.max(...present.map(s => Number(s.marks) || 0)) : 0;
    const passed = present.filter(s => s.isPassed).length;

    return {
      avg,
      top,
      passed,
      total: rankedStudents.length,
      presentCount: present.length
    };
  }, [rankedStudents]);

  // Export CSV
  const exportCSV = () => {
    if (!activeTest) return;
    const headers = ['RANK', 'ROLL NO', 'ADM NO', 'STUDENT NAME', 'STATUS', `MARKS (/${activeTest.maxMarks})`, 'PERCENTAGE (%)', 'RESULT', 'REMARKS'];
    const rows = rankedStudents.map(s => [
      s.calculatedRank,
      s.rollNo,
      s.admNo,
      `"${s.name}"`,
      s.attendance === 'A' ? 'Absent' : 'Present',
      s.marks,
      `${s.percentage}%`,
      s.isPassed ? 'PASS' : 'NEEDS IMPROVEMENT',
      `"${s.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Daily_Test_Ranking_${activeTest.subject}_${activeTest.date}.csv`;
    link.click();
  };

  // WhatsApp Share simulation
  const handleShareWhatsApp = (student) => {
    const text = `Dear Parent, your ward ${student.name} secured Rank ${student.calculatedRank} with ${student.marks}/${activeTest.maxMarks} marks in today's ${activeTest.subject} Daily Test at J D International School. Keep encouraging them!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
            <span className="text-indigo-600 font-semibold">Daily Test Ranking</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            School Daily Test Ranking & Performance Leaderboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduct daily chapter/topic tests, record marks, and publish live classroom rank standings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-600" />
            CSV Export
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print Rank Sheet
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Daily Test
          </button>
        </div>
      </div>

      {/* Select Active Test Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Select Test:
          </span>
          <select
            value={selectedTestId || ''}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-md w-full"
          >
            {tests.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} &bull; {t.subject} ({t.date})
              </option>
            ))}
          </select>
        </div>

        {activeTest && (
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Class: <strong className="text-slate-800">{activeTest.className}</strong></span>
            <span>&bull;</span>
            <span>Max Marks: <strong className="text-indigo-700">{activeTest.maxMarks}</strong></span>
            <span>&bull;</span>
            <span>Passing Marks: <strong className="text-rose-600">{activeTest.passingMarks}</strong></span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Highest Score</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {testStats.top} <span className="text-xs text-slate-400 font-normal">/ {activeTest?.maxMarks || 20}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Class Average</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">
              {testStats.avg} <span className="text-xs text-slate-400 font-normal">marks</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Pass Percentage</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {testStats.presentCount > 0 ? `${((testStats.passed / testStats.presentCount) * 100).toFixed(0)}%` : '100%'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Students Appeared</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {testStats.presentCount} <span className="text-xs text-slate-400 font-normal">/ {testStats.total}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {rankedStudents.length >= 3 && rankedStudents[0].attendance !== 'A' && (
        <div className="bg-gradient-to-r from-amber-50/70 via-indigo-50/50 to-amber-50/70 rounded-2xl border border-amber-200/80 p-5 mb-6 shadow-sm">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-amber-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Classroom Top 3 Rank Holders
            <Sparkles className="w-4 h-4 text-amber-600" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Rank 2 (Silver) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center order-2 md:order-1 relative overflow-hidden">
              <span className="text-2xl">🥈</span>
              <span className="block text-[11px] font-bold text-slate-500 uppercase mt-1">Rank 2</span>
              <h4 className="text-sm font-bold text-slate-800 mt-0.5">{rankedStudents[1]?.name || 'Student 2'}</h4>
              <p className="text-xs font-semibold text-indigo-600 mt-1">{rankedStudents[1]?.marks} / {activeTest.maxMarks} ({rankedStudents[1]?.percentage}%)</p>
            </div>

            {/* Rank 1 (Gold - Center & Elevated) */}
            <div className="bg-white rounded-xl border-2 border-amber-400 shadow-md p-5 text-center order-1 md:order-2 transform md:-translate-y-2 relative overflow-hidden bg-gradient-to-b from-amber-50/40 to-white">
              <span className="text-3xl">🥇</span>
              <span className="block text-xs font-black text-amber-800 uppercase mt-1">Champion &bull; Rank 1</span>
              <h4 className="text-base font-black text-slate-900 mt-0.5">{rankedStudents[0]?.name || 'Student 1'}</h4>
              <p className="text-sm font-bold text-emerald-700 mt-1">{rankedStudents[0]?.marks} / {activeTest.maxMarks} ({rankedStudents[0]?.percentage}%)</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                Top Scorer 🏆
              </span>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center order-3 md:order-3 relative overflow-hidden">
              <span className="text-2xl">🥉</span>
              <span className="block text-[11px] font-bold text-amber-700 uppercase mt-1">Rank 3</span>
              <h4 className="text-sm font-bold text-slate-800 mt-0.5">{rankedStudents[2]?.name || 'Student 3'}</h4>
              <p className="text-xs font-semibold text-indigo-600 mt-1">{rankedStudents[2]?.marks} / {activeTest.maxMarks} ({rankedStudents[2]?.percentage}%)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 mb-4 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'ranking'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Rank Standings & Leaderboard
        </button>

        <button
          onClick={() => setActiveTab('entry')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'entry'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          Marks Entry & Live Scoring
        </button>
      </div>

      {/* TAB 1: Ranking Leaderboard View */}
      {activeTab === 'ranking' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center w-14">Rank</th>
                  <th className="py-3 px-3 text-center w-16">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-3">Adm No</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Score (/{activeTest?.maxMarks || 20})</th>
                  <th className="py-3 px-3 text-right">Percentage</th>
                  <th className="py-3 px-3 text-center">Performance Status</th>
                  <th className="py-3 px-3 text-center w-28">WhatsApp Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {rankedStudents.length > 0 ? (
                  rankedStudents.map((s) => (
                    <tr key={s.admNo} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center">
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
                      <td className="py-3 px-3 text-center font-mono text-slate-500">{s.rollNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {s.name}
                        {s.calculatedRank === 1 && (
                          <span className="ml-2 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                            TOPPER
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-indigo-700">{s.admNo}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.attendance === 'A' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {s.attendance === 'A' ? 'Absent' : 'Present'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono text-sm">
                        {s.marks}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold font-mono text-slate-700">
                        {s.percentage}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          s.attendance === 'A'
                            ? 'bg-slate-100 text-slate-500'
                            : s.isPassed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {s.attendance === 'A' ? 'ABSENT' : s.isPassed ? 'PASSED' : 'NEEDS HELP'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleShareWhatsApp(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          title="Share rank card on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Notify
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      No students found in this test roster.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Marks Entry & Live Scoring */}
      {activeTab === 'entry' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Live Scoring Sheet: {activeTest?.title}
              </h3>
              <p className="text-xs text-slate-500">
                Enter student marks below. Ranking and percentages update in real-time.
              </p>
            </div>
            <button
              onClick={() => toast.success('All daily test marks saved to school master record!')}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Save Marks
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-16 text-center">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3 w-28 text-center">Attendance</th>
                  <th className="py-2.5 px-3 w-32">Marks (Max: {activeTest?.maxMarks || 20})</th>
                  <th className="py-2.5 px-3">Teacher Remarks / Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTest?.students?.map(s => (
                  <tr key={s.admNo} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-center font-mono text-slate-500">{s.rollNo}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{s.name}</td>
                    <td className="py-2 px-3 text-center">
                      <select
                        value={s.attendance || 'P'}
                        onChange={(e) => handleMarksChange(s.admNo, 'attendance', e.target.value)}
                        className={`px-2 py-1 rounded font-bold text-[11px] border ${
                          s.attendance === 'A' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        }`}
                      >
                        <option value="P">Present</option>
                        <option value="A">Absent</option>
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min="0"
                        max={activeTest?.maxMarks || 20}
                        value={s.marks}
                        disabled={s.attendance === 'A'}
                        onChange={(e) => handleMarksChange(s.admNo, 'marks', Number(e.target.value))}
                        className="w-24 px-2 py-1 text-xs font-bold text-slate-900 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Remarks..."
                        value={s.remarks || ''}
                        onChange={(e) => handleMarksChange(s.admNo, 'remarks', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Create New Daily Test */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-indigo-600" />
                Schedule New Daily Test
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Title / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 3 Multiplication & Tables"
                  value={newTestForm.title}
                  onChange={(e) => setNewTestForm({ ...newTestForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newTestForm.subject}
                    onChange={(e) => setNewTestForm({ ...newTestForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {SUBJECTS.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={newTestForm.className}
                    onChange={(e) => setNewTestForm({ ...newTestForm, className: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newTestForm.date}
                    onChange={(e) => setNewTestForm({ ...newTestForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={newTestForm.maxMarks}
                    onChange={(e) => setNewTestForm({ ...newTestForm, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min="1"
                    value={newTestForm.passingMarks}
                    onChange={(e) => setNewTestForm({ ...newTestForm, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Create & Launch Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
