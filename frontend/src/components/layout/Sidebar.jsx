import React, { useState } from 'react';
import {
  PieChart,
  Home,
  GraduationCap,
  User,
  Award,
  BookOpen,
  Gift,
  FileEdit,
  IndianRupee,
  Bus,
  Building,
  FileSpreadsheet,
  Users,
  UserCheck,
  BookMarked,
  Package,
  MessageSquare,
  Settings,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Contact,
  X,
  Crown,
  CalendarDays,
  CalendarCheck,
  Calendar,
  Receipt,
  Bell,
  Cpu,
  Megaphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { STUDENT_REPORT_PATHS } from '../../modules/students/reports/studentReportsCatalog';

export const studentMenuCategories = [
  {
    id: 'std-dashboard',
    title: 'Dashboard',
    icon: PieChart,
    path: '/dashboard'
  },
  {
    id: 'std-academics',
    title: 'Academics',
    icon: BookOpen,
    subItems: [
      { title: 'Homework', path: '/get-homework' },
      { title: 'Syllabus', path: '/get-syllabus' },
      { title: 'Study Material', path: '/get-study-material' },
      { title: 'Assignment', path: '/get-assignment' }
    ]
  },
  {
    id: 'std-fees',
    title: 'Fees & Payments',
    icon: IndianRupee,
    subItems: [
      { title: 'Fee', path: '/get-fee' },
      { title: 'Fee Receipt', path: '/get-fee-receipt' }
    ]
  },
  {
    id: 'std-exam',
    title: 'Exam & Result',
    icon: Award,
    subItems: [
      { title: 'DateSheet', path: '/get-datesheet' },
      { title: 'Admit Card', path: '/student-admit-card' },
      { title: 'Result', path: '/get-result' }
    ]
  },
  {
    id: 'std-attendance',
    title: 'Attendance & Discipline',
    icon: CalendarCheck,
    subItems: [
      { title: 'Attendance', path: '/get-attendance' },
      { title: 'Gate Pass', path: '/get-gate-pass' },
      { title: 'Leave Request', path: '/leave-request' }
    ]
  },
  {
    id: 'std-comm',
    title: 'Communication',
    icon: MessageSquare,
    subItems: [
      { title: 'Sms', path: '/get-sms' },
      { title: 'Notifications', path: '/all-notifications' },
      { title: 'Voice Sms', path: '/get-voice-sms' },
      { title: 'Circular', path: '/get-circular' },
      { title: 'Complaint', path: '/get-complaint' }
    ]
  },
  {
    id: 'std-info',
    title: 'Student Information',
    icon: User,
    subItems: [
      { title: 'Profile', path: '/profile' },
      { title: 'Id Card', path: '/student-id-card' },
      { title: 'Transport', path: '/get-transport' }
    ]
  },
  {
    id: 'std-planning',
    title: 'Planning & Scheduling',
    icon: CalendarDays,
    subItems: [
      { title: 'Calendar Planing', path: '/get-calendar-planing' }
    ]
  },
  {
    id: 'std-social',
    title: 'Social & Community',
    icon: Users,
    subItems: [
      { title: 'Student Birthday', path: '/student-birthday' },
      { title: 'Birthday', path: '/get-birthday' },
      { title: 'Batchmate', path: '/get-batch-mate' },
      { title: 'News', path: '/get-news' },
      { title: 'Gallery', path: '/get-gallary' },
      { title: 'Social Media', path: '/get-social-media' }
    ]
  }
];

export const staffMenuCategories = [
  { id: 'staff-dashboard', title: 'Staff Dashboard', icon: PieChart, path: '/dashboard' },
  { id: 'staff-attendance', title: 'Student Attendance', icon: ClipboardList, path: '/student-attendance' },
  { id: 'staff-homework', title: 'Homework Management', icon: BookOpen, path: '/homework' },
  { id: 'staff-marks', title: 'Marks Entry Grid', icon: Award, path: '/marks-entry' },
  { id: 'staff-studymaterial', title: 'Study Material', icon: BookMarked, path: '/study-material' },
  { id: 'staff-datesheet', title: 'Exam Date Sheet', icon: FileSpreadsheet, path: '/exam-date-sheet' },
  { id: 'staff-portfolio', title: 'Student Portfolio', icon: Contact, path: '/student-portfolio' },
  { id: 'staff-registration', title: 'Student Registration', icon: User, path: '/student-registration' },
  { id: 'staff-school', title: 'School Info', icon: Home, path: '/school-info' }
];

export const menuCategories = [
  {
    id: 'superadmin-analytics',
    title: 'SuperAdmin Analytics',
    icon: Crown,
    path: '/superadmin-analytics'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: PieChart, // donut_small in UAB
    path: '/dashboard'
  },
  {
    id: 'school',
    title: 'School',
    icon: Home, // home in UAB
    subItems: [
      { title: 'Edit School', path: '/school-info' },
      { title: 'Whatsapp Link', path: '/whatsapp-qr-settings' },
      { title: 'Settings & Permissions', path: '/settings-and-permissions' }
    ]
  },
  {
    id: 'master',
    title: 'Master',
    icon: GraduationCap, // school in UAB
    subItems: [
      { title: 'Class Master', path: '/class' },
      { title: 'Group Subject Master', path: '/subject-group' },
      { title: 'Subject Master', path: '/subject' },
      { title: 'Subject Link', path: '/subject-link' },
      { title: 'Stream Master', path: '/add-update-stream' },
      {
        id: 'master-reports',
        title: 'Reports',
        children: [
          { title: 'Class List', path: '/class-list' },
          { title: 'Subject List', path: '/subject-list' }
        ]
      }
    ]
  },
  {
    id: 'timetable',
    title: 'Timetable Pro',
    icon: CalendarDays,
    subItems: [
      { title: 'Class Timetable', path: '/class-timetable' },
      { title: 'Teacher Substitution', path: '/teacher-substitution' }
    ]
  },
  {
    id: 'student',
    title: 'Student',
    icon: User, // person in UAB
    subItems: [
      { title: 'Registration', path: '/student-registration' },
      { title: 'Assign Roll/Feebook No.', path: '/assign-roll-number' },
      { title: 'Attendance', path: '/student-attendance' },
      { title: 'Biometric Machine Sync', path: '/biometric-sync' },
      { title: 'Promotion', path: '/promotion' },
      { title: 'Student Portfolio', path: '/student-portfolio' },
      { title: 'ID Card Generator', path: '/id-card-generator' },
      { title: 'Admit Card Generator', path: '/admit-card-generator' },
      { title: 'Exam Date Sheet', path: '/exam-date-sheet' },
      { title: 'Reports', path: '/student-reports' }
    ]
  },
  {
    id: 'users',
    title: 'Users',
    icon: Users,
    subItems: [
      { title: 'All Users', path: '/users' },
      { title: 'Staff & Teachers', path: '/staff-users' },
      { title: 'Drivers', path: '/driver-users' },
      { title: 'User Privileges', path: '/user-privilege' },
      {
        id: 'users-reports',
        title: 'Reports',
        children: [
          { title: 'User Privilege Report', path: '/user-privilege-report' },
          { title: 'Staff List Report', path: '/user-staff-list' }
        ]
      }
    ]
  },
  {
    id: 'crm',
    title: 'CRM',
    icon: Contact,
    path: '/crm',
    subItems: [
      { title: 'Dashboard', path: '/crm' },
      { title: 'Enquiries', path: '/crm/enquiries' },
      { title: "Today's Tasks", path: '/crm/tasks' },
      { title: 'Assessments', path: '/crm/assessments' },
      { title: 'Admission Form', path: '/crm/admission-form' },
      { title: 'QR Code / Links', path: '/crm/qr-code' },
      { title: 'Enquiry Banner', path: '/crm/thankyou-cms' }
    ]
  },
  {
    id: 'certificates',
    title: 'Certificates',
    icon: Award, // card_membership in UAB
    subItems: [
      { title: 'CC/BC/TF', path: '/certificate-generater-new' },
      { title: 'TC Generation', path: '/transfer-certificate' },
      { title: 'Gen Manual TC', path: '/generate-manual-tc' },
      { title: 'Bulk TC Gen', path: '/add-update-tc-bulk' },
      { title: 'Manual CC/BC/TF', path: '/manual-cc-bc' }
    ]
  },
  {
    id: 'studyMaterial',
    title: 'Study Material',
    icon: BookOpen, // local_library in UAB
    subItems: [
      { title: 'Study Material', path: '/study-material' },
      { title: 'Homework', path: '/homework' },
      { title: 'Upload Pre Year Paper', path: '/upload-pre-year-paper' },
      { title: 'Reports', path: '/study-material-reports' }
    ]
  },
  {
    id: 'greetingCard',
    title: 'Greeting Card',
    icon: Gift, // redeem in UAB
    subItems: [
      { title: 'Send Greeting Card', path: '/send-greeting-card-msg' },
      { title: 'Reports', path: '/greeting-card-reports' }
    ]
  },
  {
    id: 'bulkEditing',
    title: 'Bulk Editing',
    icon: FileEdit, // edit_note in UAB
    subItems: [
      { title: 'Edit Bulk Student', path: '/add-edit-bulk-students' },
      { title: 'Student Photo Management', path: '/student-photo-management' }
    ]
  },
  {
    id: 'fee',
    title: 'Fee',
    icon: IndianRupee, // currency_rupee in UAB
    subItems: [
      { title: 'Fee Group', path: '/fee-head-group' },
      { title: 'Fee Head', path: '/fee-head' },
      { title: 'Concession Category', path: '/fee-concession-type' },
      { title: 'Fee Fine Master', path: '/fee-fine-master' },
      { title: 'Fee Structure', path: '/fee-structure' },
      { title: 'Fee Edit Manual', path: '/fee-edit-manual' },
      { title: 'Fee Concession', path: '/fee-concession' },
      { title: 'Fee Entry', path: '/fee-collection' },
      { title: 'Sibling Fee Entry', path: '/sibling-fee-collection' },
      { title: 'Cancel Fee', path: '/fee-refund' },
      { title: 'Board Fee Manual Entry', path: '/board-fee-manual-collection' },
      {
        id: 'fee-reports',
        title: 'Reports',
        children: [
          { title: 'Fee Collection Summary', path: '/fee-collection-summary' },
          { title: 'Online Collection Summary', path: '/online-collection-summary' },
          { title: 'Board Collection Summary', path: '/board-online-collection-summary' },
          { title: 'Board Fee Due List', path: '/board-fee-due-list' },
          { title: 'Fee Due List', path: '/fee-due-list-month-wise' },
          { title: 'Fee Concession Summary', path: '/fee-concession-summary' },
          { title: 'Advance Report', path: '/fee-advance-report' },
          { title: 'Fee Structure Report', path: '/fee-structure-report' },
          { title: 'Fee Opening Balance Report', path: '/fee-opening-balance-report' },
          { title: 'Student Fees Statement', path: '/student-fees-statement' },
          { title: 'Fee Book Report', path: '/fee-book-report' },
          { title: 'Cancel Fee Receipt Report', path: '/cancel-fee-receipt-report' },
          { title: 'Discount Fee Receipt Report', path: '/discount-fee-receipt-report' }
        ]
      }
    ]
  },
  {
    id: 'accounts',
    title: 'Accounts & Expense',
    icon: Receipt,
    subItems: [
      { title: 'Expense Vouchers', path: '/school-expenses' },
      { title: 'Daily Cash Book', path: '/day-book' },
      { title: 'P&L Surplus Summary', path: '/income-expense-summary' }
    ]
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: Bus, // airport_shuttle in UAB
    subItems: [
      { title: 'Transport Dashboard', path: '/transport-dashboard' },
      { title: 'Transport Vehicle', path: '/transport-vehicle' },
      { title: 'Transport Route & Destination', path: '/transport-route' },
      { title: 'Edit Transport Fee', path: '/edit-transport-fee' },
      {
        id: 'transport-reports',
        title: 'Reports',
        children: [
          { title: 'Transport Summary', path: '/transport-summary' },
          { title: 'Transport Students', path: '/transport-students' },
          { title: 'Transport Due Report', path: '/transport-due-report' },
          { title: 'Transport Vehicle Report', path: '/transport-vehicle-report' }
        ]
      }
    ]
  },
  {
    id: 'hostel',
    title: 'Hostel',
    icon: Building, // apartment in UAB
    subItems: [
      { title: 'Hostel Master', path: '/add-update-hostel' },
      { title: 'Block Master', path: '/add-update-block' },
      { title: 'Hostel Floor', path: '/add-update-floor' },
      { title: 'Room Type', path: '/add-update-room-type' },
      { title: 'Room Master', path: '/add-update-room' },
      {
        id: 'hostel-reports',
        title: 'Reports',
        children: [
          { title: 'Hostel Room List', path: '/hostel-report' },
          { title: 'Hostel Students Report', path: '/hostel-students-report' },
          { title: 'Hostel Due Report', path: '/hostel-due-report' }
        ]
      }
    ]
  },
  {
    id: 'examination',
    title: 'Examination',
    icon: FileSpreadsheet, // description in UAB
    subItems: [
      { title: 'Exam Term', path: '/exam-terms' },
      { title: 'Exam Names', path: '/exam-names' },
      { title: 'Group Master', path: '/group-master' },
      { title: 'Grade Master', path: '/grade-master' },
      { title: 'Link Student With Subject', path: '/link-student-with-subject' },
      { title: 'Marks Entry', path: '/marks-entry' },
      { title: 'Student Wise Marks Entry', path: '/student-wise-marks-entry' },
      { title: 'PRC Comment', path: '/prc-comment' },
      { title: 'Lock Marks Entry', path: '/marks-entry-locking' },
      {
        id: 'examination-reports',
        title: 'Reports',
        children: [
          { title: 'Blank Exam Format', path: '/blank-exam-format' },
          { title: 'Student Signature Sheet', path: '/student-signature-sheet' },
          { title: 'Toppers List', path: '/toppers-list' },
          { title: 'Consolidated Report', path: '/consolidated-report' },
          { title: 'Progress Report Card', path: '/progress-report-card' },
          { title: 'Performance Sheet', path: '/performance-sheet' },
          { title: 'Report Card Remarks', path: '/report-card-remark-report' }
        ]
      }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll',
    icon: Users, // people in UAB
    subItems: [
      { title: 'Branch', path: '/payroll-branch' },
      { title: 'Department', path: '/payroll-department' },
      { title: 'Designation', path: '/payroll-designation' },
      { title: 'Allowances', path: '/payroll-allowances' },
      { title: 'Leave Setup', path: '/payroll-leave-setup' },
      { title: 'Shift Master', path: '/shift-master' },
      { title: 'Staff Registration', path: '/payroll-registration' },
      { title: 'Staff Attendance', path: '/staff-attendance' },
      { title: 'Generate Salary', path: '/generate-staff-salary' },
      { title: 'Advance Salary', path: '/payroll-advance-payment' },
      { title: 'Staff ID Card', path: '/staff-id-card-generator' },
      {
        id: 'payroll-reports',
        title: 'Reports',
        children: [
          { title: 'Staff Salary', path: '/payroll-staff-salary' },
          { title: 'Staff List', path: '/staff-list' },
          { title: 'Staff Attendance Report', path: '/staff-attendance-report' },
          { title: 'Staff Attendance Time Report', path: '/staff-attendance-time-report' }
        ]
      }
    ]
  },
  {
    id: 'frontOffice',
    title: 'Front Office',
    icon: UserCheck, // account_circle in UAB
    subItems: [
      { title: 'App Users', path: '/app-users' },
      { title: 'Reminder', path: '/reminder' },
      { title: 'Student Gate Pass', path: '/gate-pass' },
      { title: 'Visitor Enquiry', path: '/visitor-enquiry' },
      { title: 'Pre-Admission', path: '/pre-admission' },
      { title: 'Calendar Planning', path: '/calendar-planning' },
      { title: 'Student App Popup', path: '/student-app-popup' },
      { title: 'Staff Gate Pass', path: '/staff-gate-pass' },
      { title: 'Visit Staff Meeting', path: '/payroll-visit-staff-meeting' },
      { title: 'Student Complaint', path: '/get-complaint' },
      { title: 'Staff Complaint', path: '/manual-complaint' },
      {
        id: 'front-office-reports',
        title: 'Reports',
        children: [
          { title: 'Staff Complaint Report', path: '/manual-complaint-reports' },
          { title: 'Notification Count Report', path: '/class-wise-notification-count-report' },
          { title: 'Visitor Report', path: '/visitor-enquiry-report' },
          { title: 'Pre Admission Report', path: '/pre-admission-report' },
          { title: 'Visit Staff Meeting Report', path: '/payroll-visit-staff-meeting-report' },
          { title: 'Gate Pass Report', path: '/gate-pass-report' },
          { title: 'Calendar Planning Report', path: '/calendar-planning-report' },
          { title: 'Reminder Report', path: '/reminder-report' },
          { title: 'Student Complaint Report', path: '/complaint-report' },
          { title: 'Staff Gate Pass Report', path: '/staff-gate-pass-report' }
        ]
      }
    ]
  },
  {
    id: 'library',
    title: 'Library',
    icon: BookMarked, // menu_book in UAB
    subItems: [
      { title: 'Library Master', path: '/library-master' },
      { title: 'Add Books', path: '/add-books' },
      { title: 'Issue Books', path: '/issue-book' },
      { title: 'Return Books', path: '/return-book' },
      { title: 'Purchase Books', path: '/purchase-book' },
      { title: 'Damaged Books', path: '/damaged-book' },
      { title: 'Library Supplier Master', path: '/library-supplier-master' },
      {
        id: 'library-reports',
        title: 'Reports',
        children: [
          { title: 'Books Summary', path: '/get-books-report' },
          { title: 'Issued Books Report', path: '/get-issued-books-report' },
          { title: 'Pending Books Report', path: '/get-pending-books-report' },
          { title: 'Books Stock Report', path: '/get-books-stock-report' },
          { title: 'Purchased Books Report', path: '/get-purchase-books-report' },
          { title: 'Damaged Books Report', path: '/get-damaged-books-report' }
        ]
      }
    ]
  },
  {
    id: 'stationary',
    title: 'Stationary',
    icon: Package, // inventory_2 in UAB
    subItems: [
      { title: 'School Shop Info', path: '/shop-info' },
      { title: 'Supplier Shop Master', path: '/supplier-master' },
      { title: 'Category Master', path: '/category-master' },
      { title: 'Items Master', path: '/items-master' },
      { title: 'Set Master', path: '/set-master' },
      { title: 'Issue Items', path: '/issue-items' },
      { title: 'Due Payment', path: '/due-payment' },
      { title: 'Purchase Items', path: '/purchase-items' },
      {
        id: 'stationary-reports',
        title: 'Reports',
        children: [
          { title: 'Category Items Report', path: '/category-items-report' },
          { title: 'Set Master Report', path: '/set-master-report' },
          { title: 'Issue Sets Report', path: '/issue-sets-report' },
          { title: 'Supplier Report', path: '/supplier-report' },
          { title: 'Purchase Items Report', path: '/purchase-items-report' },
          { title: 'Stock Report', path: '/stock-report' },
          { title: 'Low Stock Report', path: '/low-stock-report' }
        ]
      }
    ]
  },
  {
    id: 'sms',
    title: 'SMS',
    icon: MessageSquare, // textsms in UAB
    subItems: [
      { title: 'Student SMS', path: '/student-sms' },
      { title: 'Staff SMS', path: '/staff-sms' },
      { title: 'Birthday SMS', path: '/birthday-sms' },
      { title: 'Individual SMS', path: '/individual-sms' },
      { title: 'Visitor SMS', path: '/visitor-sms' },
      { title: 'Create Whatsapp Templates', path: '/create-whatsapp-templates' },
      {
        id: 'sms-reports',
        title: 'Reports',
        children: [
          { title: 'Message Report', path: '/sms-status-report' },
          { title: 'Birthday Report', path: '/birthday-report' }
        ]
      }
    ]
  },
  {
    id: 'notices',
    title: 'Notice Board',
    icon: Bell,
    path: '/school-notices'
  },
  {
    id: 'announcements',
    title: 'Announcements Hub',
    icon: Megaphone,
    path: '/targeted-announcements'
  },
  {
    id: 'leaveManagement',
    title: 'Leave Management',
    icon: ClipboardList, // receipt_long in UAB
    subItems: [
      { title: 'Student Leave Requests', path: '/all-leave-requests' },
      { title: 'Staff Leave Requests', path: '/staff-leave-requests' },
      { title: 'Apply Leave Request', path: '/apply-leave-request' }
    ]
  }
];

export function Sidebar({ currentPath = '/', onNavigate, isOpen = true, onClose }) {
  const getInitialActiveDropdown = (path) => {
    if (path.includes('transport')) return { transport: true };
    if (path.includes('student') || path.includes('admission') || STUDENT_REPORT_PATHS.includes(path)) return { student: true };
    if (path.includes('user')) return { users: true };
    if (path.includes('fee')) return { fee: true };
    if (path.includes('hostel')) return { hostel: true };
    if (path.includes('exam')) return { examination: true };
    if (path.includes('payroll')) return { payroll: true };
    if (path.includes('library')) return { library: true };
    if (path.includes('stationary')) return { stationary: true };
    if (path.includes('sms')) return { sms: true };
    if (path.includes('leave')) return { leaveManagement: true };
    if (path === '/class-list' || path === '/subject-list' || path.includes('master')) return { master: true };
    return {};
  };

  const [openDropdowns, setOpenDropdowns] = useState(() => {
    const initial = getInitialActiveDropdown(currentPath);
    menuCategories.forEach(item => {
      if (item.subItems?.some(sub => sub.path === currentPath || (sub.path === '/student-reports' && STUDENT_REPORT_PATHS.includes(currentPath)) || sub.children?.some(c => c.path === currentPath))) {
        initial[item.id] = true;
      }
    });
    return initial;
  });
  const [openSubDropdowns, setOpenSubDropdowns] = useState({
    'master-reports': true,
    'transport-reports': true
  });
  const sidebarNavRef = React.useRef(null);

  const toggleDropdown = (id) => {
    setOpenDropdowns(prev => {
      const isCurrentlyOpen = !!prev[id];
      return {
        ...prev,
        [id]: !isCurrentlyOpen
      };
    });
  };

  const toggleSubDropdown = (id) => {
    setOpenSubDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { role, user } = useAuth();

  const activeCategories = role === 'STUDENT'
    ? studentMenuCategories
    : role === 'STAFF'
    ? staffMenuCategories
    : menuCategories;

  React.useEffect(() => {
    let activeKey = null;
    let activeSubKey = null;

    const normCurrent = currentPath === '/' ? '/dashboard' : currentPath;

    // Dynamically search activeCategories for currentPath to expand parent and sub-reports
    for (const item of activeCategories) {
      if (item.path && item.path === normCurrent) {
        activeKey = item.id;
        break;
      }
      if (item.subItems && item.subItems.length > 0) {
        for (const sub of item.subItems) {
          if (sub.path === normCurrent || (sub.path === '/student-reports' && STUDENT_REPORT_PATHS.includes(normCurrent))) {
            activeKey = item.id;
            break;
          }
          if (sub.children && sub.children.length > 0) {
            for (const child of sub.children) {
              if (child.path === normCurrent) {
                activeKey = item.id;
                activeSubKey = sub.id || `${item.id}-${sub.title}`;
                break;
              }
            }
          }
          if (activeKey) break;
        }
      }
      if (activeKey) break;
    }

    if (activeKey) {
      setOpenDropdowns(prev => ({ ...prev, [activeKey]: true }));
    }
    if (activeSubKey) {
      setOpenSubDropdowns(prev => ({ ...prev, [activeSubKey]: true }));
    }

    // Auto-scroll active item within the sidebar ONLY (never scroll window or main content)
    setTimeout(() => {
      const navContainer = sidebarNavRef.current;
      if (navContainer) {
        const activeBtn = navContainer.querySelector('[data-sidebar-active="true"]');
        if (activeBtn) {
          const navRect = navContainer.getBoundingClientRect();
          const btnRect = activeBtn.getBoundingClientRect();
          if (btnRect.bottom > navRect.bottom || btnRect.top < navRect.top) {
            navContainer.scrollTop += (btnRect.top - navRect.top) - (navRect.height / 3);
          }
        }
      }
    }, 50);
  }, [currentPath, activeCategories]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
      />

      {/* Modern Light ERP Sidenav (Width 272px, clean border, soft light theme) */}
      <aside className="fixed md:sticky top-0 inset-y-0 left-0 z-50 md:z-30 w-[272px] bg-white border-r border-slate-200/90 h-screen flex flex-col shrink-0 select-none text-slate-800 shadow-lg md:shadow-none transition-all duration-300">
        
        {/* Mobile Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 shrink-0 md:hidden">
          <span className="font-bold text-sm text-slate-900 tracking-tight">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items List */}
        <div ref={sidebarNavRef} className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 text-sm font-medium custom-scrollbar">
          {activeCategories.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.subItems && item.subItems.length > 0;
            const isOpen = Boolean(openDropdowns[item.id]);
            const normCurrent = currentPath === '/' ? '/dashboard' : currentPath;
            const isActive = normCurrent === item.path || (hasChildren && item.subItems.some(sub => {
              if (sub.path === normCurrent) return true;
              if (sub.path === '/student-reports' && STUDENT_REPORT_PATHS.includes(normCurrent)) return true;
              if (sub.children && sub.children.some(c => c.path === normCurrent)) return true;
              return false;
            }));

            return (
              <div key={item.id} className="space-y-0.5">
                {/* Parent Navigation Item */}
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      toggleDropdown(item.id);
                    } else if (onNavigate) {
                      onNavigate(item.path);
                      if (window.innerWidth < 768 && onClose) onClose();
                    }
                  }}
                  data-sidebar-active={(!hasChildren && isActive) ? "true" : undefined}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 outline-none focus:outline-none group ${
                    isActive || isOpen
                      ? 'bg-slate-100/90 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive || isOpen ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className="truncate tracking-tight">{item.title}</span>
                  </div>
                  {hasChildren && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-0 text-slate-700' : '-rotate-90'
                      }`}
                    />
                  )}
                </button>

                {/* Submenu Dropdown Tree */}
                {hasChildren && isOpen && (
                  <div className="ml-4 pl-2.5 my-0.5 space-y-0.5 border-l border-slate-200">
                    {item.subItems.map((sub) => {
                      const hasSubChildren = sub.children && sub.children.length > 0;
                      if (hasSubChildren) {
                        const subId = sub.id || `${item.id}-${sub.title}`;
                        const isSubOpen = openSubDropdowns[subId] ?? true;
                        const isAnyChildActive = sub.children.some(c => c.path === normCurrent);
                        return (
                          <div key={subId} className="space-y-0.5">
                            {/* Expandable Sub-Item (e.g. Reports) */}
                            <button
                              onClick={() => toggleSubDropdown(subId)}
                              className={`w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors group ${
                                isSubOpen || isAnyChildActive
                                  ? 'text-indigo-900 bg-indigo-50/50 font-semibold'
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{sub.title}</span>
                              <ChevronDown
                                className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                                  isSubOpen ? 'rotate-0 text-indigo-600' : '-rotate-90'
                                }`}
                              />
                            </button>

                            {/* Nested Level 2 Children (e.g. Transport Reports List) */}
                            {isSubOpen && (
                              <div className="ml-2 pl-2 my-0.5 space-y-0.5 border-l border-slate-200">
                                {sub.children.map((child) => {
                                  const isChildActive = normCurrent === child.path;
                                  return (
                                    <button
                                      key={child.path}
                                      onClick={() => {
                                        if (onNavigate) onNavigate(child.path);
                                        if (window.innerWidth < 768 && onClose) onClose();
                                      }}
                                      data-sidebar-active={isChildActive ? "true" : undefined}
                                      className={`w-full flex items-center rounded-md px-2 py-1.5 text-[12px] transition-all text-left ${
                                        isChildActive
                                          ? 'text-indigo-700 bg-indigo-50 font-semibold border-l-2 border-indigo-600 rounded-l-none pl-2'
                                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                                      }`}
                                    >
                                      <span className="truncate">{child.title}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      const isSubActive = normCurrent === sub.path || (sub.path === '/student-reports' && STUDENT_REPORT_PATHS.includes(normCurrent));
                      return (
                        <button
                          key={sub.path}
                          onClick={() => {
                            if (onNavigate) onNavigate(sub.path);
                            if (window.innerWidth < 768 && onClose) onClose();
                          }}
                          data-sidebar-active={isSubActive ? "true" : undefined}
                          className={`w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-[12.5px] transition-all text-left ${
                            isSubActive
                              ? 'text-indigo-700 bg-indigo-50/90 font-semibold border border-indigo-100 shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span className="truncate">{sub.title}</span>
                          {isSubActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Student Bottom Profile Card */}
        {role === 'STUDENT' && (
          <div 
            onClick={() => onNavigate && onNavigate('/profile')}
            className="p-3 mx-2 mb-2 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer transition-all flex items-center justify-between shrink-0 shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150'}
                  alt={user?.name || 'Student'}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-200 shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div className="truncate min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'AADHYA CHOUDHARY'}</p>
                <p className="text-[11px] text-slate-500 truncate font-medium">{user?.className || 'Nursery - PP3+ - A'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        )}
      </aside>
    </>
  );
}
