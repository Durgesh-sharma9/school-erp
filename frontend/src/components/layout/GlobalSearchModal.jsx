import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import { smartSearch } from '../../utils/smartSearch';
import {
  Search,
  X,
  GraduationCap,
  Users,
  Megaphone,
  Bell,
  Receipt,
  CalendarDays,
  Cpu,
  IndianRupee,
  ClipboardList,
  BookOpen,
  Bus,
  Building,
  Award,
  FileSpreadsheet,
  Folder,
  Zap,
  TrendingUp,
  Percent,
  CornerDownLeft,
  Sparkles
} from 'lucide-react';

// Comprehensive search index of ERP modules
const MODULES_INDEX = [
  // Overview / Dashboard
  {
    id: 'm-dashboard',
    title: 'Principal & Admin Dashboard',
    path: '/dashboard',
    category: 'Overview',
    icon: Sparkles,
    desc: 'Real-time school stats, attendance, fee graphs & KPIs',
    keywords: ['dashboard', 'asboard', 'dashbord', 'deshboard', 'home', 'overview', 'stats', 'analytics', 'kpi']
  },

  // Daily Test & TestMaster Pro
  {
    id: 'm-dt-entry',
    title: 'Daily Test Marks Entry Pro',
    path: '/daily-test-entry',
    category: 'Daily Test',
    icon: Award,
    desc: 'Record and edit daily test marks by subject, date and roll number (TestMaster Flow)',
    keywords: ['daily test', 'daly test', 'testmaster', 'test master', 'marks entry', 'teacher marks', 'dt']
  },
  {
    id: 'm-dt-results',
    title: 'Daily Test Class Results Matrix',
    path: '/daily-test-ranking',
    category: 'Daily Test',
    icon: FileSpreadsheet,
    desc: 'Class-wide multi-test spreadsheet matrix with Total, Avg, %, and Rank',
    keywords: ['class results', 'results matrix', 'spreadsheet', 'rank', 'ranking', 'topper', 'parinam']
  },
  {
    id: 'm-dt-create',
    title: 'Daily Test Setup & Master',
    path: '/daily-test-create',
    category: 'Daily Test',
    icon: CalendarDays,
    desc: 'Schedule new daily tests, set maximum marks, select test dates and subjects',
    keywords: ['create test', 'daily test setup', 'max marks', 'test date']
  },
  {
    id: 'm-student-perf',
    title: 'Student Performance Analytics',
    path: '/student-performance',
    category: 'Performance',
    icon: TrendingUp,
    desc: 'Top 3 rank holders, student progress trajectory, subject strength and test scores',
    keywords: ['student performance', 'performance', 'pradarshan', 'topper', 'top 3', 'rank']
  },
  {
    id: 'm-teacher-perf',
    title: 'Teacher Performance Analytics',
    path: '/teacher-performance',
    category: 'Performance',
    icon: Users,
    desc: 'Faculty evaluation, subject pass percentages, syllabus tracking and class averages',
    keywords: ['teacher performance', 'performance', 'faculty rating', 'pass percentage', 'class average']
  },

  // Fee & Finance
  {
    id: 'm-fees',
    title: 'Fee Collection (Counter POS)',
    path: '/fee-collection',
    category: 'Fee',
    icon: IndianRupee,
    desc: 'Student fee counter collection, dual receipts, installment clearing and dues list',
    keywords: ['fee', 'fees', 'fess', 'feee', 'paisa', 'rupaye', 'shulk', 'fee collection', 'dues', 'receipt', 'pos']
  },
  {
    id: 'm-fee-voucher',
    title: 'Fee Voucher Entry',
    path: '/fee-voucher-entry',
    category: 'Fee',
    icon: Receipt,
    desc: 'Record manual fee vouchers, adjustment slips, and counter receipts',
    keywords: ['fee voucher', 'voucher entry', 'fee slip', 'receipt slip', 'manual voucher']
  },
  {
    id: 'm-fee-structure',
    title: 'Fee Structure Master',
    path: '/fee-structure',
    category: 'Fee',
    icon: IndianRupee,
    desc: 'Configure class-wise annual, quarterly, and monthly fee heads and amounts',
    keywords: ['fee structure', 'fee amount', 'class fee', 'annual fee']
  },
  {
    id: 'm-fee-head',
    title: 'Fee Head Master',
    path: '/fee-head',
    category: 'Fee',
    icon: IndianRupee,
    desc: 'Manage fee heads like Tuition, Examination, Transport, and Annual Charges',
    keywords: ['fee head', 'tuition fee', 'exam fee', 'head master']
  },
  {
    id: 'm-fee-group',
    title: 'Fee Group Master',
    path: '/fee-head-group',
    category: 'Fee',
    icon: IndianRupee,
    desc: 'Group fee heads into primary and secondary categories',
    keywords: ['fee group', 'fee head group', 'fee category']
  },
  {
    id: 'm-fee-concession',
    title: 'Fee Concession Categories',
    path: '/fee-concession-type',
    category: 'Fee',
    icon: Percent,
    desc: 'Manage scholarship, sibling discount, staff ward, and merit fee concessions',
    keywords: ['fee concession', 'scholarship', 'discount', 'sibling discount', 'chhoot']
  },
  {
    id: 'm-fee-fine',
    title: 'Fee Fine Master',
    path: '/fee-fine-master',
    category: 'Fee',
    icon: IndianRupee,
    desc: 'Configure late payment penalty rules, grace periods, and daily fine rates',
    keywords: ['fee fine', 'late fine', 'fine master', 'penalty', 'late fee']
  },
  {
    id: 'm-fee-edit-manual',
    title: 'Fee Edit Manual',
    path: '/fee-edit-manual',
    category: 'Fee',
    icon: Receipt,
    desc: 'Manual adjustment of student fee dues, opening balance, and ledger override',
    keywords: ['fee edit', 'manual fee', 'adjust dues', 'fee modification']
  },
  {
    id: 'm-fee-dues',
    title: 'Fee Due List & Reports',
    path: '/fee-due-list',
    category: 'Fee',
    icon: FileSpreadsheet,
    desc: 'Class-wise pending fee dues list, defaulter notices, and collection summaries',
    keywords: ['fee due list', 'defaulters', 'pending fee', 'due report', 'baki fees']
  },

  // Student & Admission
  {
    id: 'm-admission',
    title: 'Student Admission & Registration',
    path: '/student-registration',
    category: 'Student',
    icon: GraduationCap,
    desc: 'New admission enrollment, SIS records, parent KYC, and profile setup',
    keywords: ['admission', 'admissoin', 'admision', 'dakhila', 'bharti', 'registration', 'enrollment']
  },
  {
    id: 'm-student-portfolio',
    title: 'Student Portfolio & Directory',
    path: '/student-portfolio',
    category: 'Student',
    icon: Folder,
    desc: 'Student comprehensive profiles, parent details, fee ledger, and academic track',
    keywords: ['student portfolio', 'student list', 'student directory', 'student profile']
  },
  {
    id: 'm-promotion',
    title: 'Student Class Promotion',
    path: '/promotion',
    category: 'Student',
    icon: GraduationCap,
    desc: 'Annual session migration, promote students to next class and rollover sections',
    keywords: ['promotion', 'class promotion', 'next class', 'upgrade class']
  },
  {
    id: 'm-id-cards',
    title: 'Student ID Cards Generator',
    path: '/id-card-generator',
    category: 'Student',
    icon: Award,
    desc: 'Print bulk student ID cards with QR codes, barcode, and school branding',
    keywords: ['id card', 'icard', 'identity card', 'pehechan patra']
  },
  {
    id: 'm-admit-card',
    title: 'Exam Admit Card Generator',
    path: '/admit-card-generator',
    category: 'Examination',
    icon: FileSpreadsheet,
    desc: 'Generate printable term examination hall tickets and admit cards with roll nos',
    keywords: ['admit card', 'hall ticket', 'exam pass', 'roll number card']
  },
  {
    id: 'm-tc',
    title: 'Transfer Certificate (TC) Generator',
    path: '/tc-generation',
    category: 'Student',
    icon: FileSpreadsheet,
    desc: 'Issue official school leaving certificate (TC) and character certificates',
    keywords: ['tc', 'transfer certificate', 'leaving certificate', 'character certificate']
  },

  // Attendance
  {
    id: 'm-attendance',
    title: 'Student Attendance Register',
    path: '/student-attendance',
    category: 'Attendance',
    icon: ClipboardList,
    desc: 'Daily attendance marking, holiday registers, absence SMS alerts, and monthly registers',
    keywords: ['attendance', 'atendance', 'attandance', 'haziri', 'absent', 'present']
  },
  {
    id: 'm-staff-attendance',
    title: 'Staff & Faculty Attendance',
    path: '/staff-attendance',
    category: 'Attendance',
    icon: Users,
    desc: 'Teacher and staff check-in/out records, leave tracking, and muster roll',
    keywords: ['staff attendance', 'teacher attendance', 'faculty attendance']
  },
  {
    id: 'm-biometric',
    title: 'Biometric & RFID Machine Sync',
    path: '/biometric-sync',
    category: 'Attendance',
    icon: Cpu,
    desc: 'Campus gate facial recognition, turnstile, and punch telemetry',
    keywords: ['biometric', 'rfid', 'punch', 'machine', 'face recognition']
  },

  // Examination
  {
    id: 'm-reportcard',
    title: 'Marksheet Generator (CBSE Holistic Progress Card)',
    path: '/report-card',
    category: 'Examination',
    icon: FileSpreadsheet,
    desc: 'Generate & customize CBSE Holistic Progress Card marksheet with manual marks entry',
    keywords: ['marksheet', 'report card', 'jd international', 'cbse report card', 'parinam', 'result', 'makrs']
  },
  {
    id: 'm-marks',
    title: 'Exam Marks Entry Grid',
    path: '/marks-entry',
    category: 'Examination',
    icon: Award,
    desc: 'Periodic tests and term exam marks grading entry matrix',
    keywords: ['marks', 'exam marks', 'grading', 'test score', 'periodic test']
  },
  {
    id: 'm-datesheet',
    title: 'Exam Date Sheet Schedule',
    path: '/exam-date-sheet',
    category: 'Examination',
    icon: CalendarDays,
    desc: 'Term exam timetable schedule, timings, and syllabus date sheet',
    keywords: ['datesheet', 'exam datesheet', 'exam routine', 'exam schedule']
  },

  // Communication
  {
    id: 'm-announcements',
    title: 'Targeted Announcements Hub',
    path: '/targeted-announcements',
    category: 'Communication',
    icon: Megaphone,
    desc: 'Broadcast circulars to teachers, groups, classes, or students',
    keywords: ['announcement', 'broadcast', 'circular', 'message', 'alert', 'notice']
  },
  {
    id: 'm-notices',
    title: 'Official Notice Board & Circulars',
    path: '/school-notices',
    category: 'Communication',
    icon: Bell,
    desc: 'School-wide institutional circulars and CBSE notifications',
    keywords: ['notice', 'circular', 'board', 'ptm', 'holiday']
  },
  {
    id: 'm-sms',
    title: 'SMS & WhatsApp Broadcast Alerts',
    path: '/student-sms',
    category: 'Communication',
    icon: Megaphone,
    desc: 'Send fee reminders, attendance SMS, and emergency alerts to parents',
    keywords: ['sms', 'whatsapp', 'alerts', 'message parents', 'broadcast']
  },

  // Accounts & Expenses
  {
    id: 'm-expenses',
    title: 'School Expenses & Vouchers',
    path: '/school-expenses',
    category: 'Accounts',
    icon: Receipt,
    desc: 'Record expense vouchers, vendor bills, maintenance heads, and petty cash',
    keywords: ['expense', 'voucher', 'spending', 'cost', 'bill', 'vendor', 'kharcha']
  },
  {
    id: 'm-daybook',
    title: 'Daily Cash Day Book Ledger',
    path: '/day-book',
    category: 'Accounts',
    icon: Receipt,
    desc: 'Daily fee inflow vs expense outflow cash-in-hand reconciliation',
    keywords: ['day book', 'cash book', 'reconciliation', 'cash in hand', 'rozkird']
  },
  {
    id: 'm-summary',
    title: 'Income & Expense Annual Summary',
    path: '/income-expense-summary',
    category: 'Accounts',
    icon: IndianRupee,
    desc: 'Financial health, operating surplus and P&L charts',
    keywords: ['p&l', 'profit', 'loss', 'balance sheet', 'audit', 'summary']
  },

  // Timetable Pro
  {
    id: 'm-tt-dashboard',
    title: 'Timetable Pro Dashboard',
    path: '/timetable-dashboard',
    category: 'Timetable Pro',
    icon: CalendarDays,
    desc: 'Real-time timetable operations, faculty workload, and daily replacement metrics',
    keywords: ['timetable dashboard', 'workload', 'analytics', 'timetable stats']
  },
  {
    id: 'm-tt-timetables',
    title: 'Time Tables & Weekly Routines',
    path: '/timetables',
    category: 'Timetable Pro',
    icon: CalendarDays,
    desc: 'Master weekly timetable schedules, period duration and conflict-free builder',
    keywords: ['timetables', 'routine', 'master timetable', 'schedule builder']
  },
  {
    id: 'm-tt-dailydesk',
    title: 'Daily Desk Operational Matrix',
    path: '/daily-desk',
    category: 'Timetable Pro',
    icon: CalendarDays,
    desc: 'Live daily operations matrix, absent teacher coverage and 1-tap substitute assignment',
    keywords: ['daily desk', 'substitutions', 'proxy', 'absent faculty']
  },
  {
    id: 'm-substitution',
    title: 'Smart Teacher Substitution',
    path: '/teacher-substitution',
    category: 'Timetable Pro',
    icon: Users,
    desc: 'Absent teacher detector and 1-tap substitute teacher assigner',
    keywords: ['substitution', 'proxy', 'absent teacher', 'leave replacement']
  },
  {
    id: 'm-tt-lessonplanning',
    title: 'Lesson Planning & Pedagogy',
    path: '/lesson-planning',
    category: 'Timetable Pro',
    icon: BookOpen,
    desc: 'Standardized chapter lesson plans, learning outcomes, teaching aids and principal review',
    keywords: ['lesson planning', 'lesson plan', 'curriculum', 'pedagogy']
  },
  {
    id: 'm-tt-homework',
    title: 'Homework Central & Study Tasks',
    path: '/timetable-homework',
    category: 'Timetable Pro',
    icon: GraduationCap,
    desc: 'Class-wise homework assignments, teacher task tracking and submission due dates',
    keywords: ['timetable homework', 'homework', 'assignments', 'self study']
  },

  // Leave & HR
  {
    id: 'm-leave-student',
    title: 'Student Leave Requests',
    path: '/all-leave-requests',
    category: 'Leave',
    icon: ClipboardList,
    desc: 'Approve or reject parent-submitted leave applications',
    keywords: ['student leave', 'leave request', 'medical leave', 'chhutti']
  },
  {
    id: 'm-leave-staff',
    title: 'Staff & Faculty Leave Requests',
    path: '/staff-leave-requests',
    category: 'Leave',
    icon: Users,
    desc: 'Teacher leave approvals, casual leave and duty roster balance',
    keywords: ['staff leave', 'teacher leave', 'cl', 'el']
  },
  {
    id: 'm-payroll',
    title: 'Staff Payroll & Salary Slips',
    path: '/payroll',
    category: 'HR',
    icon: IndianRupee,
    desc: 'Monthly salary calculation, allowances, and payslips',
    keywords: ['payroll', 'salary', 'payslip', 'staff salary']
  },

  // Transport & Library & Inventory
  {
    id: 'm-transport',
    title: 'Transport & Fleet Management',
    path: '/transport',
    category: 'Logistics',
    icon: Bus,
    desc: 'Bus route stops, vehicle tracking, driver directory, and transport fee',
    keywords: ['transport', 'bus', 'van', 'route', 'pickup', 'driver']
  },
  {
    id: 'm-library',
    title: 'Library Book Circulation',
    path: '/library-master',
    category: 'Library',
    icon: BookOpen,
    desc: 'Issue, return, barcode scanning, and book inventory catalog',
    keywords: ['library', 'books', 'issue book', 'return book']
  },
  {
    id: 'm-inventory',
    title: 'Inventory Hub & Stationery Stock',
    path: '/inventory-hub',
    category: 'Inventory',
    icon: Building,
    desc: 'Stock purchase, stationery kit issuance, and low stock warnings',
    keywords: ['inventory', 'stock', 'stationery', 'items', 'store']
  },

  // Master Setup
  {
    id: 'm-class-master',
    title: 'Class & Section Master',
    path: '/class-master',
    category: 'Master',
    icon: Building,
    desc: 'Define grades, standards, sections, and class teacher allocations',
    keywords: ['class master', 'section', 'kaksha', 'grades']
  },
  {
    id: 'm-subject-master',
    title: 'Subject Master & Curriculum',
    path: '/subject-master',
    category: 'Master',
    icon: BookOpen,
    desc: 'Add core and elective subjects, theory/practical grading rules',
    keywords: ['subject master', 'subjects', 'vishay']
  },
  {
    id: 'm-school-info',
    title: 'School Profile & Settings',
    path: '/school-info',
    category: 'Master',
    icon: Building,
    desc: 'Affiliation code, logo, contact addresses, and principal signature upload',
    keywords: ['school info', 'school profile', 'settings']
  }
];

// Teachers & Staff Database
const TEACHERS_INDEX = [
  { id: 't_1', name: 'Mr. Rakesh Sharma', subject: 'Mathematics (PGT)', department: 'Mathematics Faculty', phone: '9829989330', path: '/teacher-substitution', keywords: ['rakesh', 'sharma', 'maths', 'pgt'] },
  { id: 't_2', name: 'Mrs. Kavita Verma', subject: 'Science (TGT)', department: 'Science & Technology', phone: '9870943695', path: '/teacher-substitution', keywords: ['kavita', 'verma', 'science', 'tgt'] },
  { id: 't_3', name: 'Dr. Arun Joshi', subject: 'Physics (PGT)', department: 'Science & Technology', phone: '9414023456', path: '/teacher-substitution', keywords: ['arun', 'joshi', 'physics', 'pgt'] },
  { id: 't_4', name: 'Ms. Neha Gupta', subject: 'English (TGT)', department: 'Languages & Humanities', phone: '9829012345', path: '/teacher-substitution', keywords: ['neha', 'gupta', 'english', 'tgt'] },
  { id: 't_5', name: 'Mrs. Monika Rani Verma', subject: 'Social Science (PRT)', department: 'Primary Wing Faculty', phone: '9511719644', path: '/teacher-substitution', keywords: ['monika', 'rani', 'social science', 'sst'] },
  { id: 't_6', name: 'Mr. Vikram Rathore', subject: 'Physical Education (PTI)', department: 'Sports & Activities', phone: '8107187618', path: '/teacher-substitution', keywords: ['vikram', 'rathore', 'sports', 'pti'] },
  { id: 't_7', name: 'Ms. Pooja Saxena', subject: 'Computer Science (PGT)', department: 'Science & Tech', phone: '9079909813', path: '/teacher-substitution', keywords: ['pooja', 'saxena', 'computer', 'cs'] },
  { id: 't_8', name: 'Mrs. Sunita Kumari', subject: 'Hindi (TGT)', department: 'Languages & Humanities', phone: '9672992836', path: '/teacher-substitution', keywords: ['sunita', 'kumari', 'hindi', 'tgt'] },
  { id: 't_9', name: 'Mr. Rajesh Meena', subject: 'Art & Craft (PRT)', department: 'Primary Wing Faculty', phone: '9636644293', path: '/teacher-substitution', keywords: ['rajesh', 'meena', 'art'] },
  { id: 't_10', name: 'Mrs. Deepa Bhatt', subject: 'Chemistry (PGT)', department: 'Science & Technology', phone: '9829112233', path: '/teacher-substitution', keywords: ['deepa', 'bhatt', 'chemistry'] },
  { id: 't_11', name: 'Abhilasha Bhatt', subject: 'School Principal', department: 'Leadership & Administration', phone: '9672992836', path: '/school-info', keywords: ['abhilasha', 'principal'] },
  { id: 't_12', name: 'Priti Verma', subject: 'Head Administrator', department: 'Front Office & Operations', phone: '9079909813', path: '/school-info', keywords: ['priti', 'admin'] }
];

// Quick Instant Actions
const QUICK_ACTIONS = [
  { id: 'a-daily-test', title: 'Enter Daily Test Marks', subtitle: 'Quick record daily test marks (TestMaster style)', path: '/daily-test-entry', icon: Award },
  { id: 'a-fee-pos', title: 'Collect Student Fee (POS)', subtitle: 'Issue instant fee collection receipt & settle dues', path: '/fee-collection', icon: IndianRupee },
  { id: 'a-announcement', title: 'Compose Targeted Announcement', subtitle: 'Send to teachers, class, or individual student', path: '/targeted-announcements', icon: Megaphone },
  { id: 'a-expense', title: 'Record School Expense Voucher', subtitle: 'Add new expenditure with category & payee', path: '/school-expenses', icon: Receipt },
  { id: 'a-daybook', title: 'Open Today\'s Day Book Ledger', subtitle: 'Reconcile daily cash in hand & fee receipts', path: '/day-book', icon: IndianRupee },
  { id: 'a-substitute', title: 'Assign Teacher Substitution', subtitle: 'Find free teachers for absent faculty slots', path: '/teacher-substitution', icon: Users },
  { id: 'a-biometric', title: 'Live Biometric Punch Telemetry', subtitle: 'Check gate face scanners & late arrivals', path: '/biometric-sync', icon: Cpu },
  { id: 'a-notice', title: 'Publish School Circular', subtitle: 'Official CBSE notice board announcement', path: '/school-notices', icon: Bell }
];

export function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'MODULES' | 'TEACHERS' | 'STUDENTS' | 'ACTIONS'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
      setActiveFilter('ALL');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { schoolId } = useAuth();

  const tenantStudents = (tenantStore.getStudents(schoolId) || []).map((s) => ({
    id: s.id || s.admNo,
    name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim() || 'Student',
    className: s.className || s.class_id || 'I',
    section: s.section || s.division_id || 'A',
    rollNo: s.rollNo || '-',
    admNo: s.admNo || '',
    fatherName: s.fatherName || s.fathers_name || '',
    phone: s.contactNo || s.fatherMobile || '',
    path: '/student-portfolio'
  }));

  // Intelligent Search using Damerau-Levenshtein, Typo Tolerance, and Synonyms
  const { results: matchedModules, didYouMean: modDidYouMean } = smartSearch(MODULES_INDEX, query, ['title', 'desc', 'category', 'keywords']);
  const { results: matchedTeachers } = smartSearch(TEACHERS_INDEX, query, ['name', 'subject', 'department', 'phone', 'keywords']);
  const { results: matchedStudents } = smartSearch(tenantStudents, query, ['name', 'admNo', 'rollNo', 'className', 'section', 'fatherName', 'phone']);
  const { results: matchedActions } = smartSearch(QUICK_ACTIONS, query, ['title', 'subtitle']);

  const activeSuggestion = modDidYouMean;

  // Aggregate based on active filter
  let combinedResults = [];
  if (activeFilter === 'ALL' || activeFilter === 'MODULES') {
    combinedResults.push(...matchedModules.map(m => ({ ...m, type: 'module' })));
  }
  if (activeFilter === 'ALL' || activeFilter === 'TEACHERS') {
    combinedResults.push(...matchedTeachers.map(t => ({ ...t, type: 'teacher' })));
  }
  if (activeFilter === 'ALL' || activeFilter === 'STUDENTS') {
    combinedResults.push(...matchedStudents.map(s => ({ ...s, type: 'student' })));
  }
  if (activeFilter === 'ALL' || activeFilter === 'ACTIONS') {
    combinedResults.push(...matchedActions.map(a => ({ ...a, type: 'action' })));
  }

  // Handle Selection & Navigation
  const handleSelect = (item) => {
    if (onNavigate && item.path) {
      onNavigate(item.path);
    }
    onClose();
  };

  // Keyboard navigation for results
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < combinedResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (combinedResults[selectedIndex]) {
        handleSelect(combinedResults[selectedIndex]);
      }
    }
  };

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Backdrop dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Main Spotlight Container - Clean, Minimal Raycast-style */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        
        {/* Simple & Clean Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3 shrink-0 bg-white dark:bg-slate-900">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or search..."
            className="w-full text-base font-normal bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Minimal Typo Suggestion Notice */}
        {activeSuggestion && query.trim() && query.toLowerCase().trim() !== activeSuggestion.toLowerCase() && (
          <div className="px-4 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100/80 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
            <span>
              Searching for <strong>"{activeSuggestion}"</strong> (matched from "{query}")
            </span>
            <button
              onClick={() => setQuery(activeSuggestion)}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Use "{activeSuggestion}"
            </button>
          </div>
        )}

        {/* Clean Filter Tabs (Simple Text Links, No bulky bar) */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'ALL', label: 'All', count: combinedResults.length },
            { id: 'MODULES', label: 'Modules', count: matchedModules.length },
            { id: 'TEACHERS', label: 'Teachers', count: matchedTeachers.length },
            { id: 'STUDENTS', label: 'Students', count: matchedStudents.length },
            { id: 'ACTIONS', label: 'Actions', count: matchedActions.length }
          ].map(tab => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setSelectedIndex(0);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Results List - Hidden Scrollbar & Clean Minimal Rows */}
        <div className="overflow-y-auto flex-1 p-2 space-y-0.5 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {combinedResults.length === 0 ? (
            <div className="py-12 px-4 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for dashboard, daily test, fees, or a student name.
              </p>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = item.icon || Folder;

              return (
                <div
                  key={`${item.type}-${item.id || idx}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`search-result-item px-3 py-2 rounded-xl cursor-pointer transition-colors flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Item Icon */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700'
                    }`}>
                      {item.type === 'teacher' ? (
                        <Users className="w-3.5 h-3.5" />
                      ) : item.type === 'student' ? (
                        <GraduationCap className="w-3.5 h-3.5" />
                      ) : (
                        <IconComp className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-medium truncate ${
                          isSelected ? 'font-semibold text-slate-900 dark:text-white' : ''
                        }`}>
                          {item.title || item.name}
                        </span>

                        {/* Subtle Minimal Badges */}
                        {item.type === 'module' && item.category && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded shrink-0">
                            {item.category}
                          </span>
                        )}
                        {item.type === 'teacher' && (
                          <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded shrink-0">
                            {item.subject}
                          </span>
                        )}
                        {item.type === 'student' && (
                          <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded shrink-0">
                            {item.className}-{item.section}
                          </span>
                        )}
                        {item.type === 'action' && (
                          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded shrink-0">
                            Action
                          </span>
                        )}
                      </div>

                      {/* Subtitle / Description */}
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {item.type === 'module' && item.desc}
                        {item.type === 'teacher' && `${item.department} • ${item.phone}`}
                        {item.type === 'student' && `Adm: ${item.admNo} • Roll: #${item.rollNo} • Phone: ${item.phone}`}
                        {item.type === 'action' && item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right side Enter Indicator ONLY on Selected */}
                  <div className="flex items-center shrink-0 pl-2">
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Simple & Quiet Bottom Helper Bar */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">↑↓</kbd> Navigate</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">↵</kbd> Open</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">esc</kbd> Dismiss</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Spotlight</span>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
}
