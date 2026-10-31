import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import { smartSearch } from '../../utils/smartSearch';
import {
  Search,
  X,
  Command,
  ArrowRight,
  GraduationCap,
  Users,
  UserCheck,
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
  LayoutGrid,
  ChevronRight,
  Sparkles,
  Clock,
  FileText,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';

// Domain-specific color styles for categories
const CATEGORY_STYLES = {
  'Overview': { badge: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300', icon: 'bg-blue-50 text-blue-600 border-blue-200/60 dark:bg-blue-950/60' },
  'Daily Test': { badge: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300', icon: 'bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/60' },
  'Performance': { badge: 'bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/60 dark:text-violet-300', icon: 'bg-violet-50 text-violet-600 border-violet-200/60 dark:bg-violet-950/60' },
  'Fee': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300', icon: 'bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/60' },
  'Student': { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300', icon: 'bg-indigo-50 text-indigo-600 border-indigo-200/60 dark:bg-indigo-950/60' },
  'Attendance': { badge: 'bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300', icon: 'bg-teal-50 text-teal-600 border-teal-200/60 dark:bg-teal-950/60' },
  'Examination': { badge: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300', icon: 'bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/60' },
  'Communication': { badge: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300', icon: 'bg-purple-50 text-purple-600 border-purple-200/60 dark:bg-purple-950/60' },
  'Accounts': { badge: 'bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-950/60 dark:text-cyan-300', icon: 'bg-cyan-50 text-cyan-600 border-cyan-200/60 dark:bg-cyan-950/60' },
  'Timetable Pro': { badge: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300', icon: 'bg-sky-50 text-sky-600 border-sky-200/60 dark:bg-sky-950/60' },
  'Master': { badge: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300', icon: 'bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-slate-800' },
  'Logistics': { badge: 'bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/60 dark:text-orange-300', icon: 'bg-orange-50 text-orange-600 border-orange-200/60 dark:bg-orange-950/60' },
  'Library': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300', icon: 'bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/60' },
  'Inventory': { badge: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300', icon: 'bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/60' },
  'Leave': { badge: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/60 dark:text-red-300', icon: 'bg-red-50 text-red-600 border-red-200/60 dark:bg-red-950/60' },
  'HR': { badge: 'bg-green-50 text-green-700 border-green-200/80 dark:bg-green-950/60 dark:text-green-300', icon: 'bg-green-50 text-green-600 border-green-200/60 dark:bg-green-950/60' }
};

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
    keywords: ['dashboard', 'asboard', 'dashbord', 'deshboard', 'home', 'overview', 'stats', 'analytics', 'kpi', 'mukhya']
  },

  // Daily Test & TestMaster Pro
  {
    id: 'm-dt-entry',
    title: 'Daily Test Marks Entry Pro',
    path: '/daily-test-entry',
    category: 'Daily Test',
    icon: Award,
    desc: 'Record and edit daily test marks by subject, date and roll number (TestMaster Flow)',
    keywords: ['daily test', 'daly test', 'testmaster', 'test master', 'marks entry', 'teacher marks', 'daily test entry', 'unit test', 'dt']
  },
  {
    id: 'm-dt-results',
    title: 'Daily Test Class Results Matrix',
    path: '/daily-test-ranking',
    category: 'Daily Test',
    icon: FileSpreadsheet,
    desc: 'Class-wide multi-test spreadsheet matrix with Total, Avg, %, and Rank',
    keywords: ['class results', 'results matrix', 'spreadsheet', 'rank', 'ranking', 'daily test ranking', 'topper', 'parinam']
  },
  {
    id: 'm-dt-create',
    title: 'Daily Test Setup & Master',
    path: '/daily-test-create',
    category: 'Daily Test',
    icon: CalendarDays,
    desc: 'Schedule new daily tests, set maximum marks, select test dates and subjects',
    keywords: ['create test', 'daily test setup', 'max marks', 'test date', 'schedule test']
  },
  {
    id: 'm-student-perf',
    title: 'Student Performance Analytics',
    path: '/student-performance',
    category: 'Performance',
    icon: TrendingUp,
    desc: 'Top 3 rank holders, student progress trajectory, subject strength and test scores',
    keywords: ['student performance', 'performance', 'pradarshan', 'topper', 'top 3', 'student rank', 'subject marks', 'trend']
  },
  {
    id: 'm-teacher-perf',
    title: 'Teacher Performance Analytics',
    path: '/teacher-performance',
    category: 'Performance',
    icon: Users,
    desc: 'Faculty evaluation, subject pass percentages, syllabus tracking and class averages',
    keywords: ['teacher performance', 'performance', 'faculty rating', 'pass percentage', 'class average', 'adhyapak', 'guru']
  },

  // Fee & Finance
  {
    id: 'm-fees',
    title: 'Fee Collection (Counter POS)',
    path: '/fee-collection',
    category: 'Fee',
    icon: IndianRupee,
    desc: 'Student fee counter collection, dual receipts, installment clearing and dues list',
    keywords: ['fee', 'fees', 'fess', 'feee', 'paisa', 'rupaye', 'shulk', 'fee collection', 'dues', 'receipt', 'pos', 'tuition fee', 'challan']
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
    keywords: ['fee structure', 'fee amount', 'class fee', 'annual fee', 'monthly fee']
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
    keywords: ['admission', 'admissoin', 'admision', 'addmission', 'dakhila', 'bharti', 'registration', 'enrollment', 'new student', 'sis', 'chhatra']
  },
  {
    id: 'm-student-portfolio',
    title: 'Student Portfolio & Directory',
    path: '/student-portfolio',
    category: 'Student',
    icon: Folder,
    desc: 'Student comprehensive profiles, parent details, fee ledger, and academic track',
    keywords: ['student portfolio', 'student list', 'student directory', 'student profile', 'chhatra', 'bachhe']
  },
  {
    id: 'm-promotion',
    title: 'Student Class Promotion',
    path: '/promotion',
    category: 'Student',
    icon: GraduationCap,
    desc: 'Annual session migration, promote students to next class and rollover sections',
    keywords: ['promotion', 'class promotion', 'next class', 'upgrade class', 'session migration']
  },
  {
    id: 'm-id-cards',
    title: 'Student ID Cards Generator',
    path: '/id-card-generator',
    category: 'Student',
    icon: Award,
    desc: 'Print bulk student ID cards with QR codes, barcode, and school branding',
    keywords: ['id card', 'icard', 'identity card', 'pehechan patra', 'barcode id']
  },
  {
    id: 'm-admit-card',
    title: 'Exam Admit Card Generator',
    path: '/admit-card-generator',
    category: 'Examination',
    icon: FileText,
    desc: 'Generate printable term examination hall tickets and admit cards with roll nos',
    keywords: ['admit card', 'hall ticket', 'exam pass', 'roll number card']
  },
  {
    id: 'm-tc',
    title: 'Transfer Certificate (TC) Generator',
    path: '/tc-generation',
    category: 'Student',
    icon: FileText,
    desc: 'Issue official school leaving certificate (TC) and character certificates',
    keywords: ['tc', 'transfer certificate', 'leaving certificate', 'character certificate', 'praman patra']
  },

  // Attendance
  {
    id: 'm-attendance',
    title: 'Student Attendance Register',
    path: '/student-attendance',
    category: 'Attendance',
    icon: ClipboardList,
    desc: 'Daily attendance marking, holiday registers, absence SMS alerts, and monthly registers',
    keywords: ['attendance', 'atendance', 'attandance', 'attendence', 'haziri', 'hazri', 'upsthiti', 'absent', 'present', 'attendance register']
  },
  {
    id: 'm-staff-attendance',
    title: 'Staff & Faculty Attendance',
    path: '/staff-attendance',
    category: 'Attendance',
    icon: UserCheck,
    desc: 'Teacher and staff check-in/out records, leave tracking, and muster roll',
    keywords: ['staff attendance', 'teacher attendance', 'faculty attendance', 'muster roll']
  },
  {
    id: 'm-biometric',
    title: 'Biometric & RFID Machine Sync',
    path: '/biometric-sync',
    category: 'Attendance',
    icon: Cpu,
    desc: 'Campus gate facial recognition, turnstile, and punch telemetry',
    keywords: ['biometric', 'rfid', 'punch', 'machine', 'face recognition', 'turnstile', 'late arrival', 'punching']
  },

  // Examination
  {
    id: 'm-reportcard',
    title: 'Marksheet Generator (CBSE Holistic Progress Card)',
    path: '/report-card',
    category: 'Examination',
    icon: FileSpreadsheet,
    desc: 'Generate & customize CBSE Holistic Progress Card marksheet with manual marks entry',
    keywords: ['marksheet', 'report card', 'jd international', 'marksheet generator', 'progress report', 'cbse report card', 'cce', 'parinam', 'result', 'makrs']
  },
  {
    id: 'm-marks',
    title: 'Exam Marks Entry Grid',
    path: '/marks-entry',
    category: 'Examination',
    icon: Award,
    desc: 'Periodic tests and term exam marks grading entry matrix',
    keywords: ['marks', 'exam marks', 'grading', 'test score', 'periodic test', 'makrs']
  },
  {
    id: 'm-datesheet',
    title: 'Exam Date Sheet Schedule',
    path: '/exam-date-sheet',
    category: 'Examination',
    icon: CalendarDays,
    desc: 'Term exam timetable schedule, timings, and syllabus date sheet',
    keywords: ['datesheet', 'exam datesheet', 'exam routine', 'exam schedule', 'pariksha']
  },

  // Communication
  {
    id: 'm-announcements',
    title: 'Targeted Announcements Hub',
    path: '/targeted-announcements',
    category: 'Communication',
    icon: Megaphone,
    desc: 'Broadcast circulars to teachers, groups, classes, or students',
    keywords: ['announcement', 'broadcast', 'circular', 'message', 'alert', 'notice', 'teacher notice', 'soochana', 'suchna']
  },
  {
    id: 'm-notices',
    title: 'Official Notice Board & Circulars',
    path: '/school-notices',
    category: 'Communication',
    icon: Bell,
    desc: 'School-wide institutional circulars and CBSE notifications',
    keywords: ['notice', 'circular', 'board', 'ptm', 'holiday', 'notis', 'notic']
  },
  {
    id: 'm-sms',
    title: 'SMS & WhatsApp Broadcast Alerts',
    path: '/student-sms',
    category: 'Communication',
    icon: Megaphone,
    desc: 'Send fee reminders, attendance SMS, and emergency alerts to parents',
    keywords: ['sms', 'whatsapp', 'alerts', 'message parents', 'broadcast', 'sandesh']
  },

  // Accounts & Expenses
  {
    id: 'm-expenses',
    title: 'School Expenses & Vouchers',
    path: '/school-expenses',
    category: 'Accounts',
    icon: Receipt,
    desc: 'Record expense vouchers, vendor bills, maintenance heads, and petty cash',
    keywords: ['expense', 'voucher', 'spending', 'cost', 'bill', 'vendor', 'diesel', 'kharcha', 'kharch', 'expence']
  },
  {
    id: 'm-daybook',
    title: 'Daily Cash Day Book Ledger',
    path: '/day-book',
    category: 'Accounts',
    icon: Receipt,
    desc: 'Daily fee inflow vs expense outflow cash-in-hand reconciliation',
    keywords: ['day book', 'cash book', 'reconciliation', 'cash in hand', 'closing balance', 'ledger', 'rozkird', 'roznama']
  },
  {
    id: 'm-summary',
    title: 'Income & Expense Annual Summary',
    path: '/income-expense-summary',
    category: 'Accounts',
    icon: IndianRupee,
    desc: 'Financial health, operating surplus and P&L charts',
    keywords: ['p&l', 'profit', 'loss', 'balance sheet', 'audit', 'summary', 'hisab']
  },

  // Timetable Pro
  {
    id: 'm-tt-dashboard',
    title: 'Timetable Pro Dashboard',
    path: '/timetable-dashboard',
    category: 'Timetable Pro',
    icon: CalendarDays,
    desc: 'Real-time timetable operations, faculty workload, and daily replacement metrics',
    keywords: ['timetable dashboard', 'workload', 'analytics', 'timetable stats', 'timtable', 'time table']
  },
  {
    id: 'm-tt-timetables',
    title: 'Time Tables & Weekly Routines',
    path: '/timetables',
    category: 'Timetable Pro',
    icon: CalendarDays,
    desc: 'Master weekly timetable schedules, period duration and conflict-free builder',
    keywords: ['timetables', 'routine', 'master timetable', 'schedule builder', 'auto generate', 'timtable']
  },
  {
    id: 'm-tt-dailydesk',
    title: 'Daily Desk Operational Matrix',
    path: '/daily-desk',
    category: 'Timetable Pro',
    icon: Clock,
    desc: 'Live daily operations matrix, absent teacher coverage and 1-tap substitute assignment',
    keywords: ['daily desk', 'substitutions', 'proxy', 'absent faculty', 'period replacement']
  },
  {
    id: 'm-substitution',
    title: 'Smart Teacher Substitution',
    path: '/teacher-substitution',
    category: 'Timetable Pro',
    icon: Users,
    desc: 'Absent teacher detector and 1-tap substitute teacher assigner',
    keywords: ['substitution', 'proxy', 'absent teacher', 'leave replacement', 'free teacher', 'badli']
  },
  {
    id: 'm-tt-lessonplanning',
    title: 'Lesson Planning & Pedagogy',
    path: '/lesson-planning',
    category: 'Timetable Pro',
    icon: BookOpen,
    desc: 'Standardized chapter lesson plans, learning outcomes, teaching aids and principal review',
    keywords: ['lesson planning', 'lesson plan', 'curriculum', 'pedagogy', 'chapter plan']
  },
  {
    id: 'm-tt-homework',
    title: 'Homework Central & Study Tasks',
    path: '/timetable-homework',
    category: 'Timetable Pro',
    icon: GraduationCap,
    desc: 'Class-wise homework assignments, teacher task tracking and submission due dates',
    keywords: ['timetable homework', 'homework', 'assignments', 'self study', 'due date']
  },

  // Leave & HR
  {
    id: 'm-leave-student',
    title: 'Student Leave Requests',
    path: '/all-leave-requests',
    category: 'Leave',
    icon: ClipboardList,
    desc: 'Approve or reject parent-submitted leave applications',
    keywords: ['student leave', 'leave request', 'medical leave', 'chhutti', 'chutti']
  },
  {
    id: 'm-leave-staff',
    title: 'Staff & Faculty Leave Requests',
    path: '/staff-leave-requests',
    category: 'Leave',
    icon: Users,
    desc: 'Teacher leave approvals, casual leave and duty roster balance',
    keywords: ['staff leave', 'teacher leave', 'cl', 'el', 'avkaash']
  },
  {
    id: 'm-payroll',
    title: 'Staff Payroll & Salary Slips',
    path: '/payroll',
    category: 'HR',
    icon: IndianRupee,
    desc: 'Monthly salary calculation, allowances, and payslips',
    keywords: ['payroll', 'salary', 'payslip', 'staff salary', 'tankhwah']
  },

  // Transport & Library & Inventory
  {
    id: 'm-transport',
    title: 'Transport & Fleet Management',
    path: '/transport',
    category: 'Logistics',
    icon: Bus,
    desc: 'Bus route stops, vehicle tracking, driver directory, and transport fee',
    keywords: ['transport', 'bus', 'van', 'route', 'pickup', 'driver', 'gaadi', 'gadi', 'vahan']
  },
  {
    id: 'm-library',
    title: 'Library Book Circulation',
    path: '/library-master',
    category: 'Library',
    icon: BookOpen,
    desc: 'Issue, return, barcode scanning, and book inventory catalog',
    keywords: ['library', 'books', 'issue book', 'return book', 'pustak', 'kitab', 'pustakalaya']
  },
  {
    id: 'm-inventory',
    title: 'Inventory Hub & Stationery Stock',
    path: '/inventory-hub',
    category: 'Inventory',
    icon: Building,
    desc: 'Stock purchase, stationery kit issuance, and low stock warnings',
    keywords: ['inventory', 'stock', 'stationery', 'items', 'store', 'samagri']
  },

  // Master Setup
  {
    id: 'm-class-master',
    title: 'Class & Section Master',
    path: '/class-master',
    category: 'Master',
    icon: Building,
    desc: 'Define grades, standards, sections, and class teacher allocations',
    keywords: ['class master', 'section', 'kaksha', 'grades', 'class teacher']
  },
  {
    id: 'm-subject-master',
    title: 'Subject Master & Curriculum',
    path: '/subject-master',
    category: 'Master',
    icon: BookOpen,
    desc: 'Add core and elective subjects, theory/practical grading rules',
    keywords: ['subject master', 'subjects', 'vishay', 'theory', 'practical']
  },
  {
    id: 'm-school-info',
    title: 'School Profile & Settings',
    path: '/school-info',
    category: 'Master',
    icon: Building,
    desc: 'Affiliation code, logo, contact addresses, and principal signature upload',
    keywords: ['school info', 'school profile', 'settings', 'affiliation', 'logo']
  }
];

// Teachers & Staff Database
const TEACHERS_INDEX = [
  { id: 't_1', name: 'Mr. Rakesh Sharma', subject: 'Mathematics (PGT)', department: 'Mathematics Faculty', phone: '9829989330', path: '/teacher-substitution', keywords: ['rakesh', 'sharma', 'maths', 'mathematics', 'pgt', 'adhyapak', 'guru', 'sir'] },
  { id: 't_2', name: 'Mrs. Kavita Verma', subject: 'Science (TGT)', department: 'Science & Technology', phone: '9870943695', path: '/teacher-substitution', keywords: ['kavita', 'verma', 'science', 'tgt', 'madam', 'mam'] },
  { id: 't_3', name: 'Dr. Arun Joshi', subject: 'Physics (PGT)', department: 'Science & Technology', phone: '9414023456', path: '/teacher-substitution', keywords: ['arun', 'joshi', 'physics', 'pgt', 'dr', 'sir'] },
  { id: 't_4', name: 'Ms. Neha Gupta', subject: 'English (TGT)', department: 'Languages & Humanities', phone: '9829012345', path: '/teacher-substitution', keywords: ['neha', 'gupta', 'english', 'tgt', 'madam'] },
  { id: 't_5', name: 'Mrs. Monika Rani Verma', subject: 'Social Science (PRT)', department: 'Primary Wing Faculty', phone: '9511719644', path: '/teacher-substitution', keywords: ['monika', 'rani', 'social science', 'sst', 'prt'] },
  { id: 't_6', name: 'Mr. Vikram Rathore', subject: 'Physical Education (PTI)', department: 'Sports & Activities', phone: '8107187618', path: '/teacher-substitution', keywords: ['vikram', 'rathore', 'sports', 'pti', 'physical education', 'coach', 'sir'] },
  { id: 't_7', name: 'Ms. Pooja Saxena', subject: 'Computer Science (PGT)', department: 'Science & Tech', phone: '9079909813', path: '/teacher-substitution', keywords: ['pooja', 'saxena', 'computer', 'ip', 'cs'] },
  { id: 't_8', name: 'Mrs. Sunita Kumari', subject: 'Hindi (TGT)', department: 'Languages & Humanities', phone: '9672992836', path: '/teacher-substitution', keywords: ['sunita', 'kumari', 'hindi', 'tgt'] },
  { id: 't_9', name: 'Mr. Rajesh Meena', subject: 'Art & Craft (PRT)', department: 'Primary Wing Faculty', phone: '9636644293', path: '/teacher-substitution', keywords: ['rajesh', 'meena', 'art', 'craft'] },
  { id: 't_10', name: 'Mrs. Deepa Bhatt', subject: 'Chemistry (PGT)', department: 'Science & Technology', phone: '9829112233', path: '/teacher-substitution', keywords: ['deepa', 'bhatt', 'chemistry'] },
  { id: 't_11', name: 'Abhilasha Bhatt', subject: 'School Principal', department: 'Leadership & Administration', phone: '9672992836', path: '/school-info', keywords: ['abhilasha', 'principal', 'head'] },
  { id: 't_12', name: 'Priti Verma', subject: 'Head Administrator', department: 'Front Office & Operations', phone: '9079909813', path: '/school-info', keywords: ['priti', 'admin', 'administrator'] }
];

// Quick Instant Actions
const QUICK_ACTIONS = [
  { id: 'a-daily-test', title: 'Enter Daily Test Marks', subtitle: 'Quick record daily test marks (TestMaster style)', path: '/daily-test-entry', icon: Award, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
  { id: 'a-fee-pos', title: 'Collect Student Fee (POS)', subtitle: 'Issue instant fee collection receipt & settle dues', path: '/fee-collection', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
  { id: 'a-announcement', title: 'Compose Targeted Announcement', subtitle: 'Send to teachers, class, or individual student', path: '/targeted-announcements', icon: Megaphone, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' },
  { id: 'a-expense', title: 'Record School Expense Voucher', subtitle: 'Add new expenditure with category & payee', path: '/school-expenses', icon: Receipt, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' },
  { id: 'a-daybook', title: 'Open Today\'s Day Book Ledger', subtitle: 'Reconcile daily cash in hand & fee receipts', path: '/day-book', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
  { id: 'a-substitute', title: 'Assign Teacher Substitution', subtitle: 'Find free teachers for absent faculty slots', path: '/teacher-substitution', icon: Users, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
  { id: 'a-biometric', title: 'Live Biometric Punch Telemetry', subtitle: 'Check gate face scanners & late arrivals', path: '/biometric-sync', icon: Cpu, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60' },
  { id: 'a-notice', title: 'Publish School Circular', subtitle: 'Official CBSE notice board announcement', path: '/school-notices', icon: Bell, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60' }
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
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-10 sm:pt-16 p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop dismiss */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Main Spotlight Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-indigo-950/25 overflow-hidden flex flex-col max-h-[84vh] ring-1 ring-slate-900/5 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-indigo-500/10 before:via-indigo-500 before:to-violet-500/10">
        
        {/* Top Search Input Bar */}
        <div className="flex items-center px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 gap-3.5 shrink-0 bg-white dark:bg-slate-900">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/25">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search modules, teachers, students, fees, or instant actions..."
            className="w-full text-base sm:text-[17px] font-semibold bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none tracking-tight"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/80 dark:border-slate-700">
              <kbd>ESC</kbd>
            </div>
          )}
        </div>

        {/* Typo Correction / Did You Mean Banner */}
        {activeSuggestion && query.trim() && query.toLowerCase().trim() !== activeSuggestion.toLowerCase() && (
          <div className="mx-4 my-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-violet-50/80 to-purple-50/60 dark:from-indigo-950/60 dark:to-violet-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                Did you mean: <strong className="font-extrabold underline cursor-pointer hover:text-indigo-700" onClick={() => setQuery(activeSuggestion)}>{activeSuggestion}</strong>? Showing intelligent fuzzy matches.
              </span>
            </div>
            <button
              onClick={() => setQuery(activeSuggestion)}
              className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-0.5 rounded-lg shadow-2xs transition cursor-pointer"
            >
              Apply
            </button>
          </div>
        )}

        {/* Segmented Filter Pills Bar */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: 'ALL', label: 'All Results', icon: Command, count: combinedResults.length },
              { id: 'MODULES', label: 'Modules', icon: Folder, count: matchedModules.length },
              { id: 'TEACHERS', label: 'Teachers', icon: Users, count: matchedTeachers.length },
              { id: 'STUDENTS', label: 'Students', icon: GraduationCap, count: matchedStudents.length },
              { id: 'ACTIONS', label: 'Quick Actions', icon: Zap, count: matchedActions.length }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setSelectedIndex(0);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {combinedResults.length === 0 ? (
            <div className="py-14 px-4 text-center text-slate-400">
              <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3.5 shadow-inner">
                <Search className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Try searching for a module (e.g. <em>Dashboard</em>, <em>Daily Test</em>, <em>Fee Collection</em>, <em>Attendance</em>), teacher name, or student admission no.
              </p>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = item.icon || ChevronRight;
              const catConfig = CATEGORY_STYLES[item.category] || { badge: 'bg-slate-100 text-slate-700 border-slate-200/80', icon: 'bg-indigo-50 text-indigo-600 border-indigo-200/60' };

              return (
                <div
                  key={`${item.type}-${item.id || idx}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`search-result-item p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-50/90 via-violet-50/70 to-indigo-50/40 dark:from-indigo-950/70 dark:via-violet-950/50 dark:to-indigo-950/30 border border-indigo-200/90 dark:border-indigo-800/80 shadow-xs border-l-4 border-l-indigo-600'
                      : 'hover:bg-slate-50/90 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Item Icon Box with contextual color */}
                    <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${
                      item.type === 'module'
                        ? catConfig.icon
                        : item.type === 'teacher'
                        ? 'bg-blue-50 text-blue-600 border-blue-200/60 dark:bg-blue-950/60'
                        : item.type === 'student'
                        ? 'bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/60'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/60'
                    }`}>
                      {item.type === 'teacher' ? (
                        <Users className="w-4.5 h-4.5" />
                      ) : item.type === 'student' ? (
                        <GraduationCap className="w-4.5 h-4.5" />
                      ) : (
                        <IconComp className="w-4.5 h-4.5" />
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="min-w-0 leading-snug">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                          isSelected
                            ? 'text-indigo-950 dark:text-white'
                            : 'text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}>
                          {item.title || item.name}
                        </h4>

                        {/* Badges according to type */}
                        {item.type === 'module' && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${catConfig.badge}`}>
                            {item.category}
                          </span>
                        )}
                        {item.type === 'teacher' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                            {item.subject}
                          </span>
                        )}
                        {item.type === 'student' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                            Class {item.className}-{item.section} • Roll: #{item.rollNo}
                          </span>
                        )}
                        {item.type === 'action' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950 dark:text-emerald-300 shrink-0 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-emerald-500" /> Action
                          </span>
                        )}
                      </div>

                      {/* Subtitle / Description */}
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.type === 'module' && item.desc}
                        {item.type === 'teacher' && `${item.department} • Contact: ${item.phone}`}
                        {item.type === 'student' && `Adm No: ${item.admNo} • Father: ${item.fatherName} • Phone: ${item.phone}`}
                        {item.type === 'action' && item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right side navigation indicator */}
                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-indigo-600 px-2.5 py-1 rounded-lg shadow-sm animate-in fade-in">
                        Open <kbd className="font-mono text-[10px]">↵</kbd>
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Helper Bar */}
        <div className="px-5 py-3 bg-slate-50/90 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11.5px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs text-[10px] font-bold">↑</kbd>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs text-[10px] font-bold">↓</kbd>
              <span className="ml-0.5">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs text-[10px] font-bold">↵</kbd>
              <span className="ml-0.5">Open</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs text-[10px] font-bold">Esc</kbd>
              <span className="ml-0.5">Close</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Spotlight 2.0 • <strong>School ERP Enterprise</strong></span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
}
