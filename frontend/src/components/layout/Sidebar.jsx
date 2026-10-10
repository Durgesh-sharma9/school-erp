import React, { useState } from 'react';
import {
  LayoutDashboard,
  School,
  Database,
  GraduationCap,
  Award,
  BookOpen,
  CreditCard,
  Bus,
  Building,
  FileSpreadsheet,
  Banknote,
  Headphones,
  BookMarked,
  Package,
  MessageSquare,
  Users,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ChevronLeft,
  X,
  HeartHandshake,
  Edit,
  Mail
} from 'lucide-react';

export const menuCategories = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/'
  },
  {
    id: 'school',
    title: 'School',
    icon: School,
    subItems: [
      { title: 'Edit School', path: '/school-info' },
      { title: 'Whatsapp Link', path: '/whatsapp-qr-settings' },
      { title: 'Settings & Permissions', path: '/settings-and-permissions' }
    ]
  },
  {
    id: 'master',
    title: 'Master',
    icon: Database,
    subItems: [
      { title: 'Class Master', path: '/class' },
      { title: 'Group Subject Master', path: '/subject-group' },
      { title: 'Subject Master', path: '/subject' },
      { title: 'Subject Link', path: '/subject-link' },
      { title: 'Stream Master', path: '/add-update-stream' },
      { title: 'Reports', path: '/master-reports' }
    ]
  },
  {
    id: 'student',
    title: 'Student',
    icon: GraduationCap,
    subItems: [
      { title: 'Registration', path: '/student-registration' },
      { title: 'Assign Roll/Feebook No.', path: '/assign-roll-number' },
      { title: 'Attendance', path: '/student-attendance' },
      { title: 'Online Classes', path: '/create-online-classes' },
      { title: 'Promotion', path: '/promotion' },
      { title: 'Student Portfolio', path: '/student-portfolio' },
      { title: 'ID Card Generator', path: '/id-card-generator' },
      { title: 'Admit Card Generator', path: '/admit-card-generator' },
      { title: 'Exam Date Sheet', path: '/exam-date-sheet' },
      { title: 'Reports', path: '/student-reports' }
    ]
  },
  {
    id: 'certificates',
    title: 'Certificates',
    icon: Award,
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
    icon: BookOpen,
    subItems: [
      { title: 'Homework', path: '/homework' },
      { title: 'Online Classes', path: '/create-online-classes' },
      { title: 'Upload Pre Year Paper', path: '/upload-pre-year-paper' },
      { title: 'Reports', path: '/study-material-reports' }
    ]
  },
  {
    id: 'greetingCard',
    title: 'Greeting Card',
    icon: HeartHandshake,
    subItems: [
      { title: 'Send Greeting Card', path: '/send-greeting-card-msg' },
      { title: 'Reports', path: '/greeting-card-reports' }
    ]
  },
  {
    id: 'bulkEditing',
    title: 'Bulk Editing',
    icon: Edit,
    subItems: [
      { title: 'Edit Bulk Student', path: '/add-edit-bulk-students' },
      { title: 'Student Photo Management', path: '/student-photo-management' }
    ]
  },
  {
    id: 'fee',
    title: 'Fee',
    icon: CreditCard,
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
      { title: 'Reports', path: '/fee-reports' }
    ]
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: Bus,
    subItems: [
      { title: 'Transport Vehicle', path: '/transport-vehicle' },
      { title: 'Transport Route', path: '/transport-route' },
      { title: 'Transport Destination', path: '/transport-destination' },
      { title: 'Transport Assign Routes', path: '/transport-assign-routes' },
      { title: 'Transport Assign Vehicle', path: '/transport-assign-vehicle' },
      { title: 'Edit Transport Fee', path: '/edit-transport-fee' },
      { title: 'Reports', path: '/transport-reports' }
    ]
  },
  {
    id: 'hostel',
    title: 'Hostel',
    icon: Building,
    subItems: [
      { title: 'Hostel Master', path: '/add-update-hostel' },
      { title: 'Block Master', path: '/add-update-block' },
      { title: 'Hostel Floor', path: '/add-update-floor' },
      { title: 'Room Type', path: '/add-update-room-type' },
      { title: 'Room Master', path: '/add-update-room' },
      { title: 'Reports', path: '/hostel-reports' }
    ]
  },
  {
    id: 'examination',
    title: 'Examination',
    icon: FileSpreadsheet,
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
      { title: 'Reports', path: '/examination-reports' }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll',
    icon: Banknote,
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
      { title: 'Reports', path: '/payroll-reports' }
    ]
  },
  {
    id: 'frontOffice',
    title: 'Front Office',
    icon: Headphones,
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
      { title: 'Reports', path: '/front-office-reports' }
    ]
  },
  {
    id: 'library',
    title: 'Library',
    icon: BookMarked,
    subItems: [
      { title: 'Library Master', path: '/library-master' },
      { title: 'Add Books', path: '/add-books' },
      { title: 'Issue Books', path: '/issue-book' },
      { title: 'Return Books', path: '/return-book' },
      { title: 'Purchase Books', path: '/purchase-book' },
      { title: 'Damaged Books', path: '/damaged-book' },
      { title: 'Library Supplier Master', path: '/library-supplier-master' },
      { title: 'Reports', path: '/library-reports' }
    ]
  },
  {
    id: 'stationary',
    title: 'Stationary',
    icon: Package,
    subItems: [
      { title: 'School Shop Info', path: '/shop-info' },
      { title: 'Supplier Shop Master', path: '/supplier-master' },
      { title: 'Category Master', path: '/category-master' },
      { title: 'Items Master', path: '/items-master' },
      { title: 'Set Master', path: '/set-master' },
      { title: 'Issue Items', path: '/issue-items' },
      { title: 'Due Payment', path: '/due-payment' },
      { title: 'Purchase Items', path: '/purchase-items' },
      { title: 'Reports', path: '/stationary-reports' }
    ]
  },
  {
    id: 'sms',
    title: 'SMS',
    icon: MessageSquare,
    subItems: [
      { title: 'Student SMS', path: '/student-sms' },
      { title: 'Staff SMS', path: '/staff-sms' },
      { title: 'Birthday SMS', path: '/birthday-sms' },
      { title: 'Individual SMS', path: '/individual-sms' },
      { title: 'Visitor SMS', path: '/visitor-sms' },
      { title: 'Create Whatsapp Templates', path: '/create-whatsapp-templates' },
      { title: 'Reports', path: '/sms-reports' }
    ]
  },
  {
    id: 'userManagement',
    title: 'User Management',
    icon: Users,
    subItems: [
      { title: 'Manage Users', path: '/user-privilege' },
      { title: 'Reports', path: '/user-reports' }
    ]
  },
  {
    id: 'leaveManagement',
    title: 'Leave Management',
    icon: CalendarCheck,
    subItems: [
      { title: 'Student Leave Requests', path: '/all-leave-requests' },
      { title: 'Staff Leave Requests', path: '/staff-leave-requests' },
      { title: 'Apply Leave Request', path: '/apply-leave-request' }
    ]
  }
];

export function Sidebar({ currentPath = '/', onNavigate, isOpen = true, onClose }) {
  const [openDropdowns, setOpenDropdowns] = useState({
    student: false,
    fee: false,
    master: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDropdown = (id) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = menuCategories.filter(item => {
    if (!searchTerm) return true;
    const matchParent = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChild = item.subItems?.some(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchParent || matchChild;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
      />

      <aside className="fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 select-none text-slate-800 shadow-lg md:shadow-none transition-transform duration-300">
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              U
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-900 leading-none">
                UAB ERP
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                School Management
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1 rounded text-slate-500 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Search Box */}
        <div className="px-3 pt-2 pb-1 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-[11px] rounded bg-slate-100 border border-transparent px-2.5 py-1.5 focus:bg-white focus:border-indigo-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Menu List - Smooth Infinite Scroll for all 19 UAB categories and 100+ submenus */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 text-xs font-medium custom-scrollbar">
          {filteredCategories.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.subItems && item.subItems.length > 0;
            const isOpen = openDropdowns[item.id] || searchTerm.length > 0;
            const isActive = currentPath === item.path || (hasChildren && item.subItems.some(sub => sub.path === currentPath));

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleDropdown(item.id);
                    } else if (onNavigate) {
                      onNavigate(item.path);
                      if (window.innerWidth < 768 && onClose) onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'
                    }`} />
                    <span className="text-[12px]">{item.title}</span>
                  </div>
                  {hasChildren && (
                    <span className="text-slate-400 group-hover:text-slate-600">
                      {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </button>

                {/* Submenu Dropdown */}
                {hasChildren && isOpen && (
                  <div className="pl-7 pr-1 py-0.5 space-y-0.5 border-l border-indigo-100 ml-4 my-0.5">
                    {item.subItems.map((sub) => {
                      const isSubActive = currentPath === sub.path;
                      return (
                        <button
                          key={sub.path}
                          onClick={() => {
                            if (onNavigate) onNavigate(sub.path);
                            if (window.innerWidth < 768 && onClose) onClose();
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-[11px] transition-colors block ${
                            isSubActive
                              ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {sub.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-2 border-t border-slate-200 text-[10px] text-slate-400 text-center bg-slate-50 shrink-0">
          UAB Infosolutions &bull; Session 2026-27
        </div>
      </aside>
    </>
  );
}
