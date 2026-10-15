import toast from 'react-hot-toast';
import React, { useState } from 'react';
import {
  Home,
  Sliders,
  User,
  CreditCard,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Search,
  ListFilter,
  Check,
  CheckSquare,
  FileText
} from 'lucide-react';

export function SettingsAndPermissionsPage() {
  const [activeTab, setActiveTab] = useState('masters');

  const tabs = [
    { id: 'masters', label: 'Masters' },
    { id: 'smsTemplate', label: 'Add SMS Template' },
    { id: 'transportSettings', label: 'Transport Settings' },
    { id: 'appSettings', label: 'Student App Settings' },
    { id: 'appModule', label: 'Student App Module' },
    { id: 'comingSoon', label: 'Coming Soon' }
  ];

  // ==========================================
  // TAB 1: MASTERS STATE
  // ==========================================
  const [activeMasterModal, setActiveMasterModal] = useState(null); // 'house' | 'stream' | 'concessionBy' | 'concessionType'
  const [activeNestedAddModal, setActiveNestedAddModal] = useState(null); // 'addHouse' | 'addStream' | 'addConcessionBy' | 'addConcessionType'
  const [masterSearchQuery, setMasterSearchQuery] = useState('');

  // 1. House Master
  const [houseList, setHouseList] = useState([
    { sNo: 1, house: 'RED', priority: 1 },
    { sNo: 2, house: 'BLUE', priority: 2 },
    { sNo: 3, house: 'GREEN', priority: 3 },
    { sNo: 4, house: 'YELLOW', priority: 4 }
  ]);
  const [newHouseData, setNewHouseData] = useState({ name: '', priority: '' });

  // 2. Stream Master
  const [streamList, setStreamList] = useState([
    { sNo: 1, stream: 'SCIENCE' },
    { sNo: 2, stream: 'COMMERCE' },
    { sNo: 3, stream: 'HUMANITIES' }
  ]);
  const [newStreamName, setNewStreamName] = useState('');

  // 3. Fee Concession By
  const [concessionByList, setConcessionByList] = useState([
    { sNo: 1, name: 'Management' },
    { sNo: 2, name: 'Principal' }
  ]);
  const [newConcessionByName, setNewConcessionByName] = useState('');

  // 4. Fee Concession Type
  const [concessionTypeList, setConcessionTypeList] = useState([
    { sNo: 1, type: 'Handicap', description: '' },
    { sNo: 2, type: 'Poor Student', description: '' },
    { sNo: 3, type: 'Staff', description: '' },
    { sNo: 4, type: 'Principal', description: '' },
    { sNo: 5, type: 'Management', description: '' },
    { sNo: 6, type: 'Other', description: '' },
    { sNo: 7, type: '3rd Child', description: '' }
  ]);
  const [newConcessionTypeData, setNewConcessionTypeData] = useState({
    type: '',
    mode: 'Amount', // 'Amount' or 'Percentage'
    heads: {
      'Transport': '',
      'Hostel': '',
      'Extra Concession': '',
      'Admission Fee': '',
      'Tuition Fee': '',
      'Activity Fee': '',
      'Digital Learning fee': '',
      'Registration fee': '',
      'Examination Fee': '',
      'School Application Fee': ''
    }
  });

  // ==========================================
  // TAB 2: SMS TEMPLATE STATE
  // ==========================================
  const [smsSearchQuery, setSmsSearchQuery] = useState('');
  const [smsAddModalOpen, setSmsAddModalOpen] = useState(false);
  const [smsUploadModalOpen, setSmsUploadModalOpen] = useState(false);
  const [smsFormData, setSmsFormData] = useState({
    categoryIcon: 'chat', // 'target', 'chat', 'circle', 'bell'
    templateId: '',
    templateTitle: '',
    type: 'Common',
    language: 'English',
    companyName: 'Default SMS Gateway',
    senderId: '',
    message: '',
    status: 'Temporary'
  });
  const [smsTemplatesList, setSmsTemplatesList] = useState([]);

  // ==========================================
  // TAB 3: TRANSPORT SETTINGS STATE
  // ==========================================
  const [transportMonths, setTransportMonths] = useState([
    { no: 1, month: 'April', active: true },
    { no: 2, month: 'May', active: true },
    { no: 3, month: 'June', active: false },
    { no: 4, month: 'July', active: true },
    { no: 5, month: 'August', active: true },
    { no: 6, month: 'September', active: true },
    { no: 7, month: 'October', active: true },
    { no: 8, month: 'November', active: true },
    { no: 9, month: 'December', active: true },
    { no: 10, month: 'January', active: true },
    { no: 11, month: 'February', active: true },
    { no: 12, month: 'March', active: true }
  ]);

  // ==========================================
  // TAB 4: STUDENT APP SETTINGS STATE
  // ==========================================
  const [appSettings, setAppSettings] = useState([
    { sNo: 6, module: 'App Session', status: false },
    { sNo: 1, module: 'Fee', status: true },
    { sNo: 3, module: 'Result', status: true, termSetting: true }
  ]);
  const [resultTermModalOpen, setResultTermModalOpen] = useState(false);
  const [resultTermList, setResultTermList] = useState([
    { className: 'Nursery - PP3+', halfYearly: true, annual: true },
    { className: 'Lower Kindergarten - PP4+', halfYearly: true, annual: true },
    { className: 'Upper Kindergarten - PP5+', halfYearly: true, annual: true },
    { className: 'I', halfYearly: true, annual: true },
    { className: 'II', halfYearly: true, annual: true },
    { className: 'III', halfYearly: true, annual: true },
    { className: 'IV', halfYearly: true, annual: true },
    { className: 'V', halfYearly: true, annual: true },
    { className: 'VI', halfYearly: true, annual: true },
    { className: 'VII', halfYearly: true, annual: true },
    { className: 'VIII', halfYearly: true, annual: true },
    { className: 'IX', halfYearly: true, annual: true },
    { className: 'X', halfYearly: true, annual: true },
    { className: 'XI- HUMANITIES', halfYearly: true, annual: true },
    { className: 'XII-HUMANITIES', halfYearly: true, annual: true, annualLabel: 'Pre- Board Examinations' },
    { className: 'XI-MEDICAL', halfYearly: true, annual: true },
    { className: 'XII-MEDICAL', halfYearly: true, annual: true, annualLabel: 'Pre- Board Examinations' },
    { className: 'XI-NON-MEDICAL', halfYearly: true, annual: true },
    { className: 'XII-NON-MEDICAL', halfYearly: true, annual: true, annualLabel: 'Pre- Board Examinations' }
  ]);

  // ==========================================
  // TAB 5: STUDENT APP MODULE (38 MODULES) STATE
  // ==========================================
  const [appModules, setAppModules] = useState([
    { sNo: 1, name: 'Home', icon: 'home', url: 'home', order: 0, dashboardIcon: false, isReport: false, active: true },
    { sNo: 2, name: 'Profile', icon: 'account_circle', url: 'profile', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 3, name: 'Homework', icon: 'menu_book', url: 'get-homework', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 4, name: 'Fee', icon: 'currency_rupee', url: 'get-fee', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 5, name: 'DateSheet', icon: 'today', url: 'get-datesheet', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 6, name: 'Attendance', icon: 'fact_check', url: 'get-attendance', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 7, name: 'Sms', icon: 'chat', url: 'get-sms', order: 1, dashboardIcon: false, isReport: false, active: true },
    { sNo: 8, name: 'Calendar Planing', icon: 'date_range', url: 'get-calendar-planing', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 9, name: 'Birthday', icon: 'cake', url: 'get-birthday', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 10, name: 'Id Card', icon: 'badge', url: 'get-idcard', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 11, name: 'Syllabus', icon: 'description', url: 'get-syllabus', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 12, name: 'Fee Receipt', icon: 'receipt_long', url: 'get-fee-receipt', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 13, name: 'Admit Card', icon: 'receipt', url: 'get-admit-card', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 14, name: 'Gate Pass', icon: 'airplane_ticket', url: 'get-gate-pass', order: 2, dashboardIcon: false, isReport: false, active: true },
    { sNo: 15, name: 'Notifications', icon: 'notifications', url: 'get-notification', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 16, name: 'Transport', icon: 'directions_bus', url: 'get-transport', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 17, name: 'Study Material', icon: 'import_contacts', url: 'get-study-material', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 18, name: 'Result', icon: 'assessment', url: 'get-result', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 19, name: 'Hostel', icon: 'meeting_room', url: 'get-hostel', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 20, name: 'Time Table', icon: 'calendar_month', url: 'get-time-table', order: 3, dashboardIcon: false, isReport: false, active: true },
    { sNo: 21, name: 'Gallery', icon: 'photo_library', url: 'get-gallery', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 22, name: 'Help', icon: 'help', url: 'get-help', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 23, name: 'About School', icon: 'info', url: 'about-school', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 24, name: 'Teacher Details', icon: 'people', url: 'get-teacher-details', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 25, name: 'Leave Application', icon: 'flight_takeoff', url: 'get-leave-application', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 26, name: 'Feedback & Query', icon: 'rate_review', url: 'get-feedback', order: 4, dashboardIcon: false, isReport: false, active: true },
    { sNo: 27, name: 'Download Center', icon: 'download', url: 'get-download-center', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 28, name: 'Rules & Regulations', icon: 'rule', url: 'get-rules-regulations', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 29, name: 'Daily Attendance', icon: 'today', url: 'get-daily-attendance', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 30, name: 'Visitor History', icon: 'person_pin', url: 'get-visitor-history', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 31, name: 'Daily Task', icon: 'assignment', url: 'get-daily-task', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 32, name: 'Digital Diary', icon: 'import_contacts', url: 'get-digital-dairy', order: 5, dashboardIcon: false, isReport: false, active: true },
    { sNo: 33, name: 'Change Password', icon: 'lock', url: 'change-password', order: 6, dashboardIcon: false, isReport: false, active: true },
    { sNo: 34, name: 'Class Room Activity', icon: 'nature_people', url: 'get-class-room-activity', order: 6, dashboardIcon: false, isReport: false, active: true },
    { sNo: 35, name: 'Online Test', icon: 'laptop', url: 'get-online-test', order: 7, dashboardIcon: false, isReport: false, active: true },
    { sNo: 36, name: 'Online Classes', icon: 'videocam', url: 'get-online-classes', order: 8, dashboardIcon: false, isReport: false, active: true },
    { sNo: 37, name: 'Lesson Plan', icon: 'menu_book', url: 'get-lesson-plan', order: 8, dashboardIcon: false, isReport: false, active: true },
    { sNo: 38, name: 'Pre year Paper', icon: 'local_library', url: 'get-pre-year-paper', order: 8, dashboardIcon: false, isReport: false, active: true }
  ]);

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* 1:1 Breadcrumb Header */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Settings &amp; Permissions</h2>
          <div className="flex items-center space-x-2 text-xs text-slate-500 pt-0.5">
            <span className="hover:text-indigo-600 cursor-pointer">School</span>
            <span>&bull;</span>
            <span className="text-slate-400">Settings &amp; Permissions</span>
          </div>
        </div>
      </div>

      {/* Tabs Header (1:1 UAB Angular Material Tab Strip) */}
      <div className="bg-white border-b border-slate-200 px-6 flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Body Container */}
      <div className="p-6">
        {/* ======================================================== */}
        {/* TAB 1: Masters (Exact vex-all-masters list)              */}
        {/* ======================================================== */}
        {activeTab === 'masters' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 max-w-xl">
            <ul className="flex flex-col gap-1 w-full">
              {/* House */}
              <li
                onClick={() => {
                  setMasterSearchQuery('');
                  setActiveMasterModal('house');
                }}
                className="font-semibold text-sm hover:cursor-pointer hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2.5 rounded transition-colors flex items-center justify-between text-slate-700 group"
              >
                <div className="flex items-center space-x-3">
                  <Home className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                  <span>House</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </li>

              {/* Stream */}
              <li
                onClick={() => {
                  setMasterSearchQuery('');
                  setActiveMasterModal('stream');
                }}
                className="font-semibold text-sm hover:cursor-pointer hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2.5 rounded transition-colors flex items-center justify-between text-slate-700 group"
              >
                <div className="flex items-center space-x-3">
                  <Sliders className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                  <span>Stream</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </li>

              {/* Fee Concession By */}
              <li
                onClick={() => {
                  setMasterSearchQuery('');
                  setActiveMasterModal('concessionBy');
                }}
                className="font-semibold text-sm hover:cursor-pointer hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2.5 rounded transition-colors flex items-center justify-between text-slate-700 group"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                  <span>Fee Concession By</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </li>

              {/* Fee Concession Type */}
              <li
                onClick={() => {
                  setMasterSearchQuery('');
                  setActiveMasterModal('concessionType');
                }}
                className="font-semibold text-sm hover:cursor-pointer hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2.5 rounded transition-colors flex items-center justify-between text-slate-700 group"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                  <span>Fee Concession Type</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
              </li>
            </ul>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: Add SMS Template (1:1 UAB Exact Match)            */}
        {/* ======================================================== */}
        {activeTab === 'smsTemplate' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            {/* Top Bar with Search Input & Mini Action Buttons */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={smsSearchQuery}
                  onChange={(e) => setSmsSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-full border border-slate-200 pl-9 pr-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Right Action Icons (File upload icon + Plus FAB) */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSmsUploadModalOpen(true)}
                  title="Upload Template File"
                  className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 text-indigo-600" />
                </button>

                <button
                  type="button"
                  onClick={() => setSmsAddModalOpen(true)}
                  title="Add SMS Template"
                  className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase">
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">TEMP. ID</th>
                  <th className="py-3 px-4">SENDER ID</th>
                  <th className="py-3 px-4">TEMP. NAME</th>
                  <th className="py-3 px-4">TEMP. TYPE</th>
                  <th className="py-3 px-4">LANG</th>
                  <th className="py-3 px-4">TYPE</th>
                  <th className="py-3 px-4">DATE &amp; TIME</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {smsTemplatesList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      No records found
                    </td>
                  </tr>
                ) : (
                  smsTemplatesList
                    .filter((st) =>
                      smsSearchQuery
                        ? st.templateTitle?.toLowerCase().includes(smsSearchQuery.toLowerCase()) ||
                          st.templateId?.toLowerCase().includes(smsSearchQuery.toLowerCase())
                        : true
                    )
                    .map((st, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{st.templateId}</td>
                        <td className="py-2.5 px-4">{st.senderId || '--'}</td>
                        <td className="py-2.5 px-4 font-semibold">{st.templateTitle}</td>
                        <td className="py-2.5 px-4">{st.type}</td>
                        <td className="py-2.5 px-4">{st.language}</td>
                        <td className="py-2.5 px-4">{st.status}</td>
                        <td className="py-2.5 px-4 text-slate-500">{new Date().toLocaleString()}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>

            {/* Pagination Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span>Items per page:</span>
                <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                  <option value="100">100</option>
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
              </div>
              <div>
                <span>{smsTemplatesList.length === 0 ? '0 of 0' : `1 – ${smsTemplatesList.length} of ${smsTemplatesList.length}`}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button disabled className="p-1 text-slate-300 cursor-not-allowed">
                  &lt;
                </button>
                <button disabled className="p-1 text-slate-300 cursor-not-allowed">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: Transport Settings (Exact 12 Months Table)        */}
        {/* ======================================================== */}
        {activeTab === 'transportSettings' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 max-w-lg">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 border-b pb-2">
              Transport Active Months
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                  <th className="py-2 px-3">No.</th>
                  <th className="py-2 px-3">Month</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transportMonths.map((m) => (
                  <tr key={m.no} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono">{m.no}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{m.month}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setTransportMonths((prev) =>
                            prev.map((x) => (x.no === m.no ? { ...x, active: !x.active } : x))
                          )
                        }
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ml-auto ${
                          m.active ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: Student App Settings                              */}
        {/* ======================================================== */}
        {activeTab === 'appSettings' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 max-w-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 border-b pb-2">
              Student App Permission Settings
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                  <th className="py-2.5 px-3">S. No.</th>
                  <th className="py-2.5 px-3">Module Name</th>
                  <th className="py-2.5 px-3 text-left">App Permission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appSettings.map((s) => (
                  <tr key={s.sNo} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono">{s.sNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <div>
                        <span>{s.module}</span>{' '}
                        <span className="text-[10px] text-slate-400 font-normal">On/Off</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 flex items-center space-x-4">
                      {/* Slide toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setAppSettings((prev) =>
                            prev.map((x) => (x.sNo === s.sNo ? { ...x, status: !x.status } : x))
                          )
                        }
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                          s.status ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                      </button>

                      {/* Result Term Setting Button */}
                      {s.termSetting && (
                        <button
                          type="button"
                          onClick={() => setResultTermModalOpen(true)}
                          className="px-3.5 py-1.5 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          Result Term Setting
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: Student App Module (38 Modules Table with Toggles)*/}
        {/* ======================================================== */}
        {activeTab === 'appModule' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Student App Module Directory (Total 38 Modules)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase">
                    <th className="py-2.5 px-3">S.NO.</th>
                    <th className="py-2.5 px-3">MODULE NAME</th>
                    <th className="py-2.5 px-3">MODULE ICON</th>
                    <th className="py-2.5 px-3">MODULE URL</th>
                    <th className="py-2.5 px-3">MODULE ORDER</th>
                    <th className="py-2.5 px-3 text-center">DASHBOARD ICON</th>
                    <th className="py-2.5 px-3 text-center">IS REPORT</th>
                    <th className="py-2.5 px-3 text-center">IS ACTIVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {appModules.map((m) => (
                    <tr key={m.sNo} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono">{m.sNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                      <td className="py-2.5 px-3 font-mono text-indigo-600">{m.icon}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{m.url}</td>
                      <td className="py-2.5 px-3 font-mono">{m.order}</td>
                      
                      {/* Dashboard Icon slide toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAppModules((prev) =>
                              prev.map((x) => (x.sNo === m.sNo ? { ...x, dashboardIcon: !x.dashboardIcon } : x))
                            )
                          }
                          className={`w-8 h-4 inline-flex items-center rounded-full p-0.5 transition-colors ${
                            m.dashboardIcon ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-3 h-3 rounded-full shadow-md"></div>
                        </button>
                      </td>

                      {/* Is Report slide toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAppModules((prev) =>
                              prev.map((x) => (x.sNo === m.sNo ? { ...x, isReport: !x.isReport } : x))
                            )
                          }
                          className={`w-8 h-4 inline-flex items-center rounded-full p-0.5 transition-colors ${
                            m.isReport ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-3 h-3 rounded-full shadow-md"></div>
                        </button>
                      </td>

                      {/* Is Active slide toggle */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setAppModules((prev) =>
                              prev.map((x) => (x.sNo === m.sNo ? { ...x, active: !x.active } : x))
                            )
                          }
                          className={`w-8 h-4 inline-flex items-center rounded-full p-0.5 transition-colors ${
                            m.active ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="bg-white w-3 h-3 rounded-full shadow-md"></div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: Coming Soon                                      */}
        {/* ======================================================== */}
        {activeTab === 'comingSoon' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-12 text-center max-w-xl mx-auto space-y-3">
            <div className="text-4xl">🚀</div>
            <h3 className="font-bold text-base text-slate-800">New Features In Pipeline</h3>
            <p className="text-xs text-slate-500">
              Coming Soon - Under Development.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: HOUSE MASTER                                  */}
      {/* ========================================================================= */}
      {activeMasterModal === 'house' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm text-slate-800">House Master</span>
                <span className="text-slate-300">|</span>
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Masters</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-indigo-600 font-semibold">House Master</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar (Search, Filter Checklist, Add Mini FAB) */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-full border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => toast.success('Active table columns filtered')} title="Filter Columns" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewHouseData({ name: '', priority: '' });
                    setActiveNestedAddModal('addHouse');
                  }}
                  title="Add House"
                  className="w-8 h-8 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0 bg-slate-100">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">House</th>
                    <th className="py-2.5 px-4">Priority</th>
                    <th className="py-2.5 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {houseList
                    .filter((h) =>
                      masterSearchQuery
                        ? h.house.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((h, idx) => (
                      <tr key={h.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{h.house}</td>
                        <td className="py-2.5 px-4 font-mono">{h.priority}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setHouseList((prev) => prev.filter((x) => x.sNo !== h.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span>Items per page:</span>
                <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
              </div>
              <span>1 – {houseList.length} of {houseList.length}</span>
              <div className="flex items-center space-x-1">
                <button disabled className="p-1 text-slate-300">&lt;</button>
                <button disabled className="p-1 text-slate-300">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD HOUSE MODAL */}
      {activeNestedAddModal === 'addHouse' && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">House</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newHouseData.name) return;
                setHouseList((prev) => [
                  ...prev,
                  {
                    sNo: prev.length + 1,
                    house: newHouseData.name.toUpperCase(),
                    priority: Number(newHouseData.priority) || prev.length + 1
                  }
                ]);
                setActiveNestedAddModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">House Name*</label>
                <input
                  type="text"
                  required
                  value={newHouseData.name}
                  onChange={(e) => setNewHouseData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. ORANGE"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Priority*</label>
                <input
                  type="number"
                  required
                  value={newHouseData.priority}
                  onChange={(e) => setNewHouseData((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="5"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-4 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: STREAM MASTER                                 */}
      {/* ========================================================================= */}
      {activeMasterModal === 'stream' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm text-slate-800">Stream Master</span>
                <span className="text-slate-300">|</span>
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Masters</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-indigo-600 font-semibold">Stream</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-full border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => toast.success('Active table columns filtered')} title="Filter Columns" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewStreamName('');
                    setActiveNestedAddModal('addStream');
                  }}
                  title="Add Stream"
                  className="w-8 h-8 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0 bg-slate-100">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">Stream</th>
                    <th className="py-2.5 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {streamList
                    .filter((s) =>
                      masterSearchQuery
                        ? s.stream.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((s, idx) => (
                      <tr key={s.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{s.stream}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setStreamList((prev) => prev.filter((x) => x.sNo !== s.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span>Items per page:</span>
                <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
              </div>
              <span>1 – {streamList.length} of {streamList.length}</span>
              <div className="flex items-center space-x-1">
                <button disabled className="p-1 text-slate-300">&lt;</button>
                <button disabled className="p-1 text-slate-300">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD STREAM MODAL */}
      {activeNestedAddModal === 'addStream' && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">Stream</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStreamName) return;
                setStreamList((prev) => [
                  ...prev,
                  { sNo: prev.length + 1, stream: newStreamName.toUpperCase() }
                ]);
                setActiveNestedAddModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Stream Name*</label>
                <input
                  type="text"
                  required
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. VOCATIONAL"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-4 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: FEE CONCESSION BY                             */}
      {/* ========================================================================= */}
      {activeMasterModal === 'concessionBy' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm text-slate-800">Fee Concession By</span>
                <span className="text-slate-300">|</span>
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Fee</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-indigo-600 font-semibold">Fee Concession By</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-full border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => toast.success('Active table columns filtered')} title="Filter Columns" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewConcessionByName('');
                    setActiveNestedAddModal('addConcessionBy');
                  }}
                  title="Add Fee Concession By"
                  className="w-8 h-8 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0 bg-slate-100">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {concessionByList
                    .filter((c) =>
                      masterSearchQuery
                        ? c.name.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((c, idx) => (
                      <tr key={c.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setConcessionByList((prev) => prev.filter((x) => x.sNo !== c.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span>Items per page:</span>
                <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
              </div>
              <span>1 – {concessionByList.length} of {concessionByList.length}</span>
              <div className="flex items-center space-x-1">
                <button disabled className="p-1 text-slate-300">&lt;</button>
                <button disabled className="p-1 text-slate-300">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD FEE CONCESSION BY MODAL */}
      {activeNestedAddModal === 'addConcessionBy' && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">Fee Concession By</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newConcessionByName) return;
                setConcessionByList((prev) => [
                  ...prev,
                  { sNo: prev.length + 1, name: newConcessionByName }
                ]);
                setActiveNestedAddModal(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fee Concession By*</label>
                <input
                  type="text"
                  required
                  value={newConcessionByName}
                  onChange={(e) => setNewConcessionByName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Director"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-4 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 MASTER SUB-PAGE DIALOG: FEE CONCESSION TYPE                           */}
      {/* ========================================================================= */}
      {activeMasterModal === 'concessionType' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden">
            {/* Top Bar with Breadcrumbs & Close */}
            <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-bold text-sm text-slate-800">Fee Concession Type</span>
                <span className="text-slate-300">|</span>
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">Fees</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-indigo-600 font-semibold">Concession Category</span>
              </div>
              <button
                onClick={() => setActiveMasterModal(null)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-full border border-slate-200 pl-8 pr-3 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => toast.success('Active table columns filtered')} title="Filter Columns" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                  <ListFilter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewConcessionTypeData({
                      type: '',
                      mode: 'Amount',
                      heads: {
                        'Transport': '',
                        'Hostel': '',
                        'Extra Concession': '',
                        'Admission Fee': '',
                        'Tuition Fee': '',
                        'Activity Fee': '',
                        'Digital Learning fee': '',
                        'Registration fee': '',
                        'Examination Fee': '',
                        'School Application Fee': ''
                      }
                    });
                    setActiveNestedAddModal('addConcessionType');
                  }}
                  title="Add Fee Concession Type"
                  className="w-8 h-8 rounded-full bg-[#5c67f6] hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase sticky top-0 bg-slate-100">
                    <th className="py-2.5 px-4">S.No.</th>
                    <th className="py-2.5 px-4">Concession Type</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {concessionTypeList
                    .filter((ct) =>
                      masterSearchQuery
                        ? ct.type.toLowerCase().includes(masterSearchQuery.toLowerCase())
                        : true
                    )
                    .map((ct, idx) => (
                      <tr key={ct.sNo} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{ct.type}</td>
                        <td className="py-2.5 px-4 text-slate-500">{ct.description || '--'}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => setConcessionTypeList((prev) => prev.filter((x) => x.sNo !== ct.sNo))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span>Items per page:</span>
                <select className="border border-slate-200 rounded px-2 py-1 bg-white text-xs">
                  <option value="50">50</option>
                  <option value="25">25</option>
                </select>
              </div>
              <span>1 – {concessionTypeList.length} of {concessionTypeList.length}</span>
              <div className="flex items-center space-x-1">
                <button disabled className="p-1 text-slate-300">&lt;</button>
                <button disabled className="p-1 text-slate-300">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NESTED ADD FEE CONCESSION MODAL (WITH HEADS TABLE) */}
      {activeNestedAddModal === 'addConcessionType' && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase">Fee Concession</h3>
              <button
                onClick={() => setActiveNestedAddModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newConcessionTypeData.type) return;
                setConcessionTypeList((prev) => [
                  ...prev,
                  {
                    sNo: prev.length + 1,
                    type: newConcessionTypeData.type,
                    description: `${newConcessionTypeData.mode} concession applied`
                  }
                ]);
                setActiveNestedAddModal(null);
              }}
              className="space-y-4 text-xs overflow-y-auto flex-1 pr-1"
            >
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Concession Type*</label>
                <input
                  type="text"
                  required
                  value={newConcessionTypeData.type}
                  onChange={(e) =>
                    setNewConcessionTypeData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded border border-slate-300 px-3 py-1.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Sibling Concession"
                />
              </div>

              {/* Amount / Percentage radio */}
              <div className="flex items-center space-x-6 py-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="concessionMode"
                    value="Amount"
                    checked={newConcessionTypeData.mode === 'Amount'}
                    onChange={() =>
                      setNewConcessionTypeData((prev) => ({ ...prev, mode: 'Amount' }))
                    }
                    className="text-indigo-600"
                  />
                  <span className="font-semibold text-slate-700">Amount (₹)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="concessionMode"
                    value="Percentage"
                    checked={newConcessionTypeData.mode === 'Percentage'}
                    onChange={() =>
                      setNewConcessionTypeData((prev) => ({ ...prev, mode: 'Percentage' }))
                    }
                    className="text-indigo-600"
                  />
                  <span className="font-semibold text-slate-700">Percentage (%)</span>
                </label>
              </div>

              {/* HEADS | AMOUNT Table */}
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-3">HEADS</th>
                      <th className="py-2 px-3 text-right">
                        {newConcessionTypeData.mode === 'Amount' ? 'AMOUNT (₹)' : 'PERCENTAGE (%)'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.keys(newConcessionTypeData.heads).map((head) => (
                      <tr key={head}>
                        <td className="py-2 px-3 font-semibold text-slate-800">{head}</td>
                        <td className="py-1.5 px-3 text-right">
                          <input
                            type="number"
                            placeholder="0"
                            value={newConcessionTypeData.heads[head]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewConcessionTypeData((prev) => ({
                                ...prev,
                                heads: { ...prev.heads, [head]: val }
                              }));
                            }}
                            className="w-24 text-right rounded border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveNestedAddModal(null)}
                  className="px-4 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 RESULT TERM WISE SETTING MODAL                                        */}
      {/* ========================================================================= */}
      {resultTermModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                RESULT TERM WISE SETTING
              </h3>
              <button
                onClick={() => setResultTermModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px] sticky top-0 bg-slate-100">
                    <th className="py-2.5 px-4 uppercase">CLASS</th>
                    <th className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span>SHOW HALF YEARLY EXAMINATION</span>
                        <label className="flex items-center space-x-1 cursor-pointer font-normal text-slate-600 text-[10px]">
                          <input
                            type="checkbox"
                            checked={resultTermList.every((r) => r.halfYearly)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r) => ({ ...r, halfYearly: checked }))
                              );
                            }}
                            className="rounded w-3.5 h-3.5 text-indigo-600"
                          />
                          <span>All</span>
                        </label>
                      </div>
                    </th>
                    <th className="py-2.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span>SHOW ANNUAL EXAMINATION</span>
                        <label className="flex items-center space-x-1 cursor-pointer font-normal text-slate-600 text-[10px]">
                          <input
                            type="checkbox"
                            checked={resultTermList.every((r) => r.annual)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r) => ({ ...r, annual: checked }))
                              );
                            }}
                            className="rounded w-3.5 h-3.5 text-indigo-600"
                          />
                          <span>All</span>
                        </label>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {resultTermList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{row.className}</td>
                      <td className="py-2.5 px-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.halfYearly}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, halfYearly: checked } : r))
                              );
                            }}
                            className="rounded w-4 h-4 text-indigo-600"
                          />
                          <span>Half Yearly Examination</span>
                        </label>
                      </td>
                      <td className="py-2.5 px-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.annual}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setResultTermList((prev) =>
                                prev.map((r, i) => (i === idx ? { ...r, annual: checked } : r))
                              );
                            }}
                            className="rounded w-4 h-4 text-indigo-600"
                          />
                          <span>{row.annualLabel || 'Annual Examination'}</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer with Save button */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  alert('Result Term Wise Settings saved successfully!');
                  setResultTermModalOpen(false);
                }}
                className="px-6 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 SMS ADD MODAL (Matches user screenshot 1 exactly)                     */}
      {/* ========================================================================= */}
      {smsAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                SMS TEMPLATE
              </h3>
              <button
                onClick={() => setSmsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Radio Category Icons (Red bullseye, Blue chat, Circle, Yellow bell) */}
            <div className="flex items-center space-x-3 pt-1">
              {/* Option 1: Red Target / Bullseye */}
              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'target' }))}
                className={`p-1.5 rounded-full border ${
                  smsFormData.categoryIcon === 'target' ? 'border-red-500 bg-red-50' : 'border-transparent'
                }`}
              >
                <span className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                </span>
              </button>

              {/* Option 2: Blue Chat Bubble */}
              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'chat' }))}
                className={`p-1.5 rounded-full border ${
                  smsFormData.categoryIcon === 'chat' ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
              >
                <span className="text-blue-500 text-lg">💬</span>
              </button>

              {/* Option 3: Hollow Circle */}
              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'circle' }))}
                className={`p-1.5 rounded-full border ${
                  smsFormData.categoryIcon === 'circle' ? 'border-slate-400 bg-slate-50' : 'border-transparent'
                }`}
              >
                <span className="w-5 h-5 rounded-full border-2 border-slate-400 inline-block"></span>
              </button>

              {/* Option 4: Yellow Notification Bell */}
              <button
                type="button"
                onClick={() => setSmsFormData((prev) => ({ ...prev, categoryIcon: 'bell' }))}
                className={`p-1.5 rounded-full border ${
                  smsFormData.categoryIcon === 'bell' ? 'border-amber-500 bg-amber-50' : 'border-transparent'
                }`}
              >
                <span className="text-amber-500 text-lg">🔔</span>
              </button>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!smsFormData.templateId || !smsFormData.templateTitle) return;
                setSmsTemplatesList((prev) => [...prev, { ...smsFormData }]);
                setSmsAddModalOpen(false);
                setSmsFormData({
                  categoryIcon: 'chat',
                  templateId: '',
                  templateTitle: '',
                  type: 'Common',
                  language: 'English',
                  companyName: 'Default SMS Gateway',
                  senderId: '',
                  message: '',
                  status: 'Temporary'
                });
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Row 1: Template ID* & Template Title* */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Template ID*</label>
                  <input
                    type="text"
                    required
                    value={smsFormData.templateId}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, templateId: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Template Title*</label>
                  <input
                    type="text"
                    required
                    value={smsFormData.templateTitle}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, templateTitle: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Type* & Language* */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Type*</label>
                  <select
                    value={smsFormData.type}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Common">Common</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Service Implicit">Service Implicit</option>
                    <option value="Promotional">Promotional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Language*</label>
                  <select
                    value={smsFormData.language}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, language: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Unicode">Unicode</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Sms Company Name* & Sender ID(optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Sms Company Name*</label>
                  <select
                    value={smsFormData.companyName}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Default SMS Gateway">Default SMS Gateway</option>
                    <option value="Textlocal">Textlocal</option>
                    <option value="Msg91">Msg91</option>
                    <option value="Fast2SMS">Fast2SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Sender ID(optional)</label>
                  <input
                    type="text"
                    value={smsFormData.senderId}
                    onChange={(e) => setSmsFormData((prev) => ({ ...prev, senderId: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Message* */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Message*</label>
                <textarea
                  rows={3}
                  required
                  value={smsFormData.message}
                  onChange={(e) => setSmsFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Row 5: Template Status */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Template Status</label>
                <select
                  value={smsFormData.status}
                  onChange={(e) => setSmsFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Temporary">Temporary</option>
                  <option value="Permanent">Permanent</option>
                </select>
              </div>

              {/* Action Buttons: Cancel & Add */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSmsAddModalOpen(false)}
                  className="px-5 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1:1 UPLOAD TEMPLATE FILE MODAL (Matches user screenshot 2 exactly)        */}
      {/* ========================================================================= */}
      {smsUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
                UPLOAD TEMPLATE FILE
              </h3>
              <button
                onClick={() => setSmsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Choose file input */}
            <div className="py-2">
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .txt"
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            {/* Footer Buttons: Cancel & Upload */}
            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setSmsUploadModalOpen(false)}
                className="px-5 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Template file uploaded successfully!');
                  setSmsUploadModalOpen(false);
                }}
                className="px-6 py-2 rounded bg-slate-200 hover:bg-indigo-600 hover:text-white text-slate-600 font-bold text-xs shadow-xs transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
