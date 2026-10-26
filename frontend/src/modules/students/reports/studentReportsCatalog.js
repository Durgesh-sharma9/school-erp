import {
  Users,
  UserX,
  Users2,
  PhoneCall,
  FileSpreadsheet,
  CalendarCheck,
  BarChart3,
  Calendar,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  CalendarRange,
  BookOpen,
  BookMarked,
  Receipt,
  Award,
  XCircle,
  IndianRupee,
  LayoutGrid
} from 'lucide-react';

export const STUDENT_REPORT_CATEGORIES = [
  {
    id: 'students',
    title: 'Students & Enrollment',
    shortTitle: 'Students',
    icon: Users,
    color: 'blue',
    description: 'Master rosters, inactive lists, family mappings, phone registries & consolidated profiles'
  },
  {
    id: 'attendance',
    title: 'Attendance Reports',
    shortTitle: 'Attendance',
    icon: CalendarCheck,
    color: 'purple',
    description: 'Daily attendance logs, day-wise aggregate summaries & monthly registers'
  },
  {
    id: 'academic',
    title: 'Academics & Board',
    shortTitle: 'Academic',
    icon: GraduationCap,
    color: 'emerald',
    description: 'Promotion registers, CBSE / state board registration data, date sheets & subject allocations'
  },
  {
    id: 'certificates',
    title: 'TC, Slips & Fees',
    shortTitle: 'TC & Slips',
    icon: Award,
    color: 'amber',
    description: 'Transfer certificates, cancel logs, receipt slips & donation records'
  }
];

export const ALL_STUDENT_REPORTS = [
  // Category: students
  {
    id: 'student-list',
    categoryId: 'students',
    title: 'Student List',
    shortTitle: 'Student List',
    path: '/students-report',
    aliasPaths: ['/students-report'],
    icon: Users,
    color: 'blue',
    badge: 'Master Directory',
    description: 'Class-wise student roster, admission numbers, parents info, category & contact details.'
  },
  {
    id: 'inactive-students',
    categoryId: 'students',
    title: 'Inactive Student List',
    shortTitle: 'Inactive Students',
    path: '/inactive-student-list',
    aliasPaths: ['/inactive-student-list'],
    icon: UserX,
    color: 'slate',
    badge: 'Archived / Left',
    description: 'List of withdrawn, struck off, or inactive student records with reasons.'
  },
  {
    id: 'sibling-report',
    categoryId: 'students',
    title: 'Sibling Report',
    shortTitle: 'Sibling Report',
    path: '/sibling-report',
    aliasPaths: ['/sibling-report'],
    icon: Users2,
    color: 'indigo',
    badge: 'Family Mapping',
    description: 'Family & sibling mapping for fee concession eligibility and parent communications.'
  },
  {
    id: 'student-call-list',
    categoryId: 'students',
    title: 'Student Call List',
    shortTitle: 'Call List',
    path: '/student-call-list',
    aliasPaths: ['/student-call-list'],
    icon: PhoneCall,
    color: 'teal',
    badge: 'Outreach',
    description: 'Direct telephonic outreach register with parent contacts and follow-up call status.'
  },
  {
    id: 'student-consolidated',
    categoryId: 'students',
    title: 'Student Consolidated Report',
    shortTitle: 'Consolidated',
    path: '/student-consolidated-report',
    aliasPaths: ['/student-consolidated-report'],
    icon: FileSpreadsheet,
    color: 'cyan',
    badge: 'Full Matrix',
    description: 'All-in-one comprehensive student master matrix with personal and academic data.'
  },

  // Category: attendance
  {
    id: 'attendance-report',
    categoryId: 'attendance',
    title: 'Student Attendance Report',
    shortTitle: 'Daily Attendance',
    path: '/attendance-report',
    aliasPaths: ['/attendance-report'],
    icon: CalendarCheck,
    color: 'purple',
    badge: 'Daily Register',
    description: 'Daily student attendance register with present, absent, leave tracking and filters.'
  },
  {
    id: 'daywise-attendance',
    categoryId: 'attendance',
    title: 'Day Wise Attendance Summary',
    shortTitle: 'Day-Wise Summary',
    path: '/student-attedance-summary',
    aliasPaths: ['/student-attedance-summary'],
    icon: BarChart3,
    color: 'violet',
    badge: 'Daily Metrics',
    description: 'Class-by-class aggregate count of present, absent, and percentage attendance per day.'
  },
  {
    id: 'monthly-attendance',
    categoryId: 'attendance',
    title: 'Monthly Attendance Report',
    shortTitle: 'Monthly Register',
    path: '/monthly-attendance-report',
    aliasPaths: ['/monthly-attendance-report'],
    icon: Calendar,
    color: 'fuchsia',
    badge: '1-to-31 Day Grid',
    description: 'Comprehensive 1-to-31 day monthly attendance grid with totals and percentage.'
  },

  // Category: academic
  {
    id: 'student-promotion',
    categoryId: 'academic',
    title: 'Student Promotion List',
    shortTitle: 'Promotion List',
    path: '/students-promotion-report',
    aliasPaths: ['/students-promotion-report'],
    icon: GraduationCap,
    color: 'emerald',
    badge: 'Promotion',
    description: 'End-of-session grade promotion and class progression status register.'
  },
  {
    id: 'board-registration',
    categoryId: 'academic',
    title: 'Student Board Registration',
    shortTitle: 'Board Registration',
    path: '/student-board-registration',
    aliasPaths: ['/student-board-registration'],
    icon: FileCheck,
    color: 'emerald',
    badge: 'CBSE / LOC',
    description: 'CBSE / State Board candidate registration forms with LOC subjects and verification.'
  },
  {
    id: 'board-data-summary',
    categoryId: 'academic',
    title: 'Student Board Data Summary',
    shortTitle: 'Board Data Summary',
    path: '/student-upload-data-summary',
    aliasPaths: ['/student-upload-data-summary'],
    icon: CheckCircle2,
    color: 'green',
    badge: 'Doc Checklist',
    description: 'Board enrollment verification summary, uploaded photos, signatures, and document checklists.'
  },
  {
    id: 'date-sheet-report',
    categoryId: 'academic',
    title: 'Date Sheet Report',
    shortTitle: 'Date Sheet',
    path: '/date-sheet-report',
    aliasPaths: ['/date-sheet-report'],
    icon: CalendarRange,
    color: 'teal',
    badge: 'Exam Schedule',
    description: 'Published examination timetables, subject dates, timings, and hall allotments.'
  },
  {
    id: 'student-wise-subjects',
    categoryId: 'academic',
    title: 'Student Wise Subject List',
    shortTitle: 'Student Subjects',
    path: '/student-wise-subject-list',
    aliasPaths: ['/student-wise-subject-list'],
    icon: BookOpen,
    color: 'lime',
    badge: 'Electives',
    description: 'Detailed mapped subject combinations, optional choices, and language allotments per student.'
  },
  {
    id: 'subject-wise-students',
    categoryId: 'academic',
    title: 'Subject Wise Student List',
    shortTitle: 'Subject Students',
    path: '/subject-wise-student-details',
    aliasPaths: ['/subject-wise-student-details'],
    icon: BookMarked,
    color: 'emerald',
    badge: 'Batches',
    description: 'Roster of students enrolled in each subject for elective sections and practical batches.'
  },

  // Category: certificates
  {
    id: 'generate-slips',
    categoryId: 'certificates',
    title: 'Generate Slips',
    shortTitle: 'Generate Slips',
    path: '/generate-slips-report',
    aliasPaths: ['/generate-slips-report'],
    icon: Receipt,
    color: 'amber',
    badge: 'Receipts / Slips',
    description: 'Printable fee receipt slips, exam admit tokens, and student counter slips.'
  },
  {
    id: 'tc-report',
    categoryId: 'certificates',
    title: 'TC Report',
    shortTitle: 'TC Report',
    path: '/tc-report',
    aliasPaths: ['/tc-report'],
    icon: Award,
    color: 'orange',
    badge: 'Issued TC',
    description: 'Record of all issued Transfer Certificates (TC) with serial number, reason, and date.'
  },
  {
    id: 'cancel-tc-report',
    categoryId: 'certificates',
    title: 'Cancel Tc Report',
    shortTitle: 'Cancelled TC',
    path: '/cancel-tc-report',
    aliasPaths: ['/cancel-tc-report'],
    icon: XCircle,
    color: 'rose',
    badge: 'Revoked TC',
    description: 'Audit trail of cancelled or revoked transfer certificates with re-admission notes.'
  },
  {
    id: 'donation-report',
    categoryId: 'certificates',
    title: 'Donation Report',
    shortTitle: 'Donation Report',
    path: '/donation-collection-report',
    aliasPaths: ['/donation-collection-report'],
    icon: IndianRupee,
    color: 'amber',
    badge: 'Funds / Trust',
    description: 'Special trust contributions, building donations, paid amounts, and outstanding dues.'
  }
];

export const STUDENT_REPORT_PATHS = ALL_STUDENT_REPORTS.map(r => r.path).concat(['/student-reports']);
