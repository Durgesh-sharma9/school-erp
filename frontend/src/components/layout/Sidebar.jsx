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
  X
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
      { title: 'Stream Master', path: '/add-update-stream' }
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
      { title: 'Promotion', path: '/promotion' },
      { title: 'Student Portfolio', path: '/student-portfolio' },
      { title: 'ID Card Generator', path: '/id-card-generator' },
      { title: 'Admit Card Generator', path: '/admit-card-generator' }
    ]
  },
  {
    id: 'certificates',
    title: 'Certificates',
    icon: Award,
    subItems: [
      { title: 'CC/BC/TF', path: '/certificate-generater-new' },
      { title: 'TC Generation', path: '/transfer-certificate' }
    ]
  },
  {
    id: 'studyMaterial',
    title: 'Study Material',
    icon: BookOpen,
    subItems: [
      { title: 'Upload Material', path: '/study-material' },
      { title: 'Assignment', path: '/assignment' }
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
      { title: 'Fee Entry', path: '/fee-collection' },
      { title: 'Sibling Fee Entry', path: '/sibling-fee-collection' },
      { title: 'Cancel Fee', path: '/fee-refund' }
    ]
  },
  {
    id: 'transport',
    title: 'Transport',
    icon: Bus,
    subItems: [
      { title: 'Transport Vehicle', path: '/transport-vehicle' },
      { title: 'Transport Route', path: '/transport-route' }
    ]
  },
  {
    id: 'hostel',
    title: 'Hostel',
    icon: Building,
    subItems: [
      { title: 'Hostel Rooms', path: '/hostel-rooms' },
      { title: 'Student Allocation', path: '/hostel-allocation' }
    ]
  },
  {
    id: 'examination',
    title: 'Examination',
    icon: FileSpreadsheet,
    subItems: [
      { title: 'Exam Term', path: '/exam-terms' },
      { title: 'Exam Names', path: '/exam-names' },
      { title: 'Grade Master', path: '/grade-master' },
      { title: 'Marks Entry', path: '/marks-entry' },
      { title: 'Student Wise Marks Entry', path: '/student-wise-marks-entry' }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll',
    icon: Banknote,
    subItems: [
      { title: 'Department', path: '/payroll-department' },
      { title: 'Designation', path: '/payroll-designation' },
      { title: 'Staff Registration', path: '/payroll-registration' },
      { title: 'Staff Attendance', path: '/staff-attendance' },
      { title: 'Generate Salary', path: '/generate-staff-salary' },
      { title: 'Staff ID Card', path: '/staff-id-card-generator' }
    ]
  },
  {
    id: 'frontOffice',
    title: 'Front Office',
    icon: Headphones,
    subItems: [
      { title: 'Visitor Enquiry', path: '/visitor-enquiry' },
      { title: 'Pre-Admission', path: '/pre-admission' },
      { title: 'Student Gate Pass', path: '/gate-pass' }
    ]
  },
  {
    id: 'library',
    title: 'Library',
    icon: BookMarked,
    subItems: [
      { title: 'Library Master', path: '/library-master' },
      { title: 'Add Books', path: '/add-books' }
    ]
  },
  {
    id: 'stationary',
    title: 'Stationary',
    icon: Package,
    subItems: [
      { title: 'Item Master', path: '/item-master' },
      { title: 'Issue Item', path: '/issue-item' }
    ]
  },
  {
    id: 'sms',
    title: 'SMS & WhatsApp',
    icon: MessageSquare,
    subItems: [
      { title: 'Send SMS', path: '/send-sms' },
      { title: 'SMS Templates', path: '/sms-templates' }
    ]
  },
  {
    id: 'userManagement',
    title: 'User Management',
    icon: Users,
    path: '/user-management'
  },
  {
    id: 'leaveManagement',
    title: 'Leave Management',
    icon: CalendarCheck,
    path: '/leave-management'
  }
];

export function Sidebar({ currentPath = '/', onNavigate, isOpen = true, onClose }) {
  const [openDropdowns, setOpenDropdowns] = useState({
    student: true,
    fee: false,
    master: false
  });

  const toggleDropdown = (id) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
      />

      <aside className="fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shrink-0 select-none text-slate-800 shadow-lg md:shadow-none transition-transform duration-300">
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
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
        <div className="px-3 pt-2 pb-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Menu..."
              className="w-full text-[11px] rounded bg-slate-100 border border-transparent px-2.5 py-1.5 focus:bg-white focus:border-indigo-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Menu List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 text-xs font-medium custom-scrollbar">
          {menuCategories.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.subItems && item.subItems.length > 0;
            const isOpen = openDropdowns[item.id];
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
        <div className="p-2 border-t border-slate-200 text-[10px] text-slate-400 text-center bg-slate-50">
          UAB Infosolutions &bull; Session 2026-27
        </div>
      </aside>
    </>
  );
}
