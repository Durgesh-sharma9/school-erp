import React, { useState } from 'react';
import {
  Home,
  Sliders,
  User,
  CreditCard,
  Plus,
  Trash2,
  X,
  Edit2,
  CheckCircle2,
  Search,
  Filter,
  Check,
  ChevronRight
} from 'lucide-react';

export function SettingsAndPermissionsPage() {
  const [activeTab, setActiveTab] = useState('masters');

  // Exact 6 tabs matching live UAB portal
  const tabs = [
    { id: 'masters', label: 'Masters' },
    { id: 'smsTemplate', label: 'Add SMS Template' },
    { id: 'transportSettings', label: 'Transport Settings' },
    { id: 'appSettings', label: 'Student App Settings' },
    { id: 'appModule', label: 'Student App Module' },
    { id: 'comingSoon', label: 'Coming Soon' }
  ];

  // Active sub-master modal for House / Stream / Fee Concession By / Fee Concession Type
  const [activeMasterModal, setActiveMasterModal] = useState(null);

  // Exact live UAB Masters data
  const [houseList, setHouseList] = useState([
    { sNo: 1, house: 'RED', priority: 1 },
    { sNo: 2, house: 'BLUE', priority: 2 },
    { sNo: 3, house: 'GREEN', priority: 3 },
    { sNo: 4, house: 'YELLOW', priority: 4 }
  ]);
  const [newHouseName, setNewHouseName] = useState('');
  const [newHousePriority, setNewHousePriority] = useState('');

  const [streamList, setStreamList] = useState([
    { sNo: 1, stream: 'SCIENCE' },
    { sNo: 2, stream: 'COMMERCE' },
    { sNo: 3, stream: 'HUMANITIES' }
  ]);
  const [newStreamName, setNewStreamName] = useState('');

  const [concessionByList, setConcessionByList] = useState([
    { sNo: 1, name: 'Management' },
    { sNo: 2, name: 'Principal' }
  ]);
  const [newConcessionByName, setNewConcessionByName] = useState('');

  const [concessionTypeList, setConcessionTypeList] = useState([
    { sNo: 1, type: 'Handicap', description: '' },
    { sNo: 2, type: 'Poor Student', description: '' },
    { sNo: 3, type: 'Staff', description: '' },
    { sNo: 4, type: 'Principal', description: '' },
    { sNo: 5, type: 'Management', description: '' },
    { sNo: 6, type: 'Other', description: '' },
    { sNo: 7, type: '3rd Child', description: '' }
  ]);
  const [newConcessionTypeName, setNewConcessionTypeName] = useState('');
  const [newConcessionTypeDesc, setNewConcessionTypeDesc] = useState('');

  // Tab 3: Exact 12 Months Transport Settings Table
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

  // Tab 4: Student App Settings
  const [appSettings, setAppSettings] = useState([
    { sNo: 6, module: 'App Session', status: true },
    { sNo: 1, module: 'Fee', status: true },
    { sNo: 3, module: 'Result', status: true, termSetting: true }
  ]);

  // Tab 5: Exact 38 Student App Modules
  const [appModules, setAppModules] = useState([
    { sNo: 1, name: 'Home', icon: 'home', url: 'home', order: 0, active: true },
    { sNo: 2, name: 'Profile', icon: 'account_circle', url: 'profile', order: 1, active: true },
    { sNo: 3, name: 'Homework', icon: 'menu_book', url: 'get-homework', order: 1, active: true },
    { sNo: 4, name: 'Fee', icon: 'currency_rupee', url: 'get-fee', order: 1, active: true },
    { sNo: 5, name: 'DateSheet', icon: 'today', url: 'get-datesheet', order: 1, active: true },
    { sNo: 6, name: 'Attendance', icon: 'calendar_month', url: 'get-attendance', order: 1, active: true },
    { sNo: 7, name: 'Sms', icon: 'textsms', url: 'get-sms', order: 1, active: true },
    { sNo: 8, name: 'Calendar Planing', icon: 'calendar_month', url: 'get-calendar-planing', order: 1, active: true },
    { sNo: 9, name: 'Student Birthday', icon: 'celebration', url: 'student-birthday', order: 1, active: true },
    { sNo: 10, name: 'Id Card', icon: 'recent_actors', url: 'student-id-card', order: 2, active: true },
    { sNo: 11, name: 'Syllabus', icon: 'auto_stories', url: 'get-syllabus', order: 2, active: true },
    { sNo: 12, name: 'Fee Receipt', icon: 'receipt', url: 'get-fee-receipt', order: 2, active: true },
    { sNo: 13, name: 'Admit Card', icon: 'recent_actors', url: 'student-admit-card', order: 2, active: true },
    { sNo: 14, name: 'Gate Pass', icon: 'recent_actors', url: 'get-gate-pass', order: 2, active: true },
    { sNo: 15, name: 'Notifications', icon: 'article', url: 'all-notifications', order: 2, active: true },
    { sNo: 16, name: 'Birthday', icon: 'cake', url: 'get-birthday', order: 2, active: true },
    { sNo: 17, name: 'Class Test', icon: 'recent_actors', url: 'get-class-test-result', order: 2, active: true },
    { sNo: 18, name: 'Transport', icon: 'airport_shuttle', url: 'get-transport', order: 3, active: true },
    { sNo: 19, name: 'Study Material', icon: 'local_library', url: 'get-study-material', order: 3, active: true },
    { sNo: 20, name: 'Result', icon: 'insert_chart', url: 'get-result', order: 3, active: true },
    { sNo: 21, name: 'Leave Request', icon: 'contact_emergency', url: 'leave-request', order: 3, active: true },
    { sNo: 22, name: 'Voice Sms', icon: 'voice_chat', url: 'get-voice-sms', order: 3, active: true },
    { sNo: 23, name: 'Batchmate', icon: 'diversity_3', url: 'get-batch-mate', order: 3, active: true },
    { sNo: 24, name: 'Hostel', icon: 'business', url: 'get-hostel', order: 4, active: true },
    { sNo: 25, name: 'Time Table', icon: 'calendar_month', url: 'get-time-table', order: 4, active: true },
    { sNo: 26, name: 'Seating Plan', icon: 'event_seat', url: 'get-seating-plan', order: 4, active: true },
    { sNo: 27, name: 'Circular', icon: 'event_note', url: 'get-circular', order: 4, active: true },
    { sNo: 28, name: 'News', icon: 'fiber_new', url: 'get-news', order: 4, active: true },
    { sNo: 29, name: 'Library', icon: 'library_books', url: 'get-library', order: 5, active: true },
    { sNo: 30, name: 'Assignment', icon: 'note_alt', url: 'get-assignment', order: 5, active: true },
    { sNo: 31, name: 'Complaint', icon: 'design_services', url: 'get-complaint', order: 5, active: true },
    { sNo: 32, name: 'Gallery', icon: 'photo_library', url: 'get-gallary', order: 5, active: true },
    { sNo: 33, name: 'Achievement', icon: 'design_services', url: 'get-acheivement', order: 5, active: true },
    { sNo: 34, name: 'App Session', icon: 'recent_actors', url: 'session', order: 6, active: true },
    { sNo: 35, name: 'Online Classes', icon: 'important_devices', url: 'get-online-classes', order: 6, active: true },
    { sNo: 36, name: 'Social Media', icon: 'diversity_2', url: 'get-social-media', order: 6, active: true },
    { sNo: 37, name: 'Online Exam', icon: 'devices', url: 'get-online-exam', order: 7, active: true },
    { sNo: 38, name: 'Pre year Paper', icon: 'local_library', url: 'get-pre-year-paper', order: 8, active: true }
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
        {/* TAB 1: Masters (Exact vex-all-masters list) */}
        {activeTab === 'masters' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 max-w-xl">
            <ul className="flex flex-col gap-1 w-full">
              {/* House */}
              <li
                onClick={() => setActiveMasterModal('house')}
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
                onClick={() => setActiveMasterModal('stream')}
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
                onClick={() => setActiveMasterModal('concessionBy')}
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
                onClick={() => setActiveMasterModal('concessionType')}
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

        {/* TAB 2: Add SMS Template (1:1 UAB Table) */}
        {activeTab === 'smsTemplate' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">SMS Template Register</h3>
              <button className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs">
                + Upload Template
              </button>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase">
                  <th className="py-2.5 px-3">S.No.</th>
                  <th className="py-2.5 px-3">Temp. ID</th>
                  <th className="py-2.5 px-3">Sender ID</th>
                  <th className="py-2.5 px-3">Temp. Name</th>
                  <th className="py-2.5 px-3">Temp. Type</th>
                  <th className="py-2.5 px-3">Lang</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No SMS templates uploaded yet (0 of 0)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Transport Settings (Exact 12 Months Table) */}
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
                      <input
                        type="checkbox"
                        checked={m.active}
                        onChange={() => setTransportMonths(prev => prev.map(x => x.no === m.no ? { ...x, active: !x.active } : x))}
                        className="rounded w-4 h-4 text-indigo-600"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: Student App Settings (1:1 Table) */}
        {activeTab === 'appSettings' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 max-w-xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 border-b pb-2">
              Student App Permission Settings
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                  <th className="py-2.5 px-3">S. No.</th>
                  <th className="py-2.5 px-3">Module Name</th>
                  <th className="py-2.5 px-3 text-center">App Permission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appSettings.map((s) => (
                  <tr key={s.sNo} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-mono">{s.sNo}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <div>{s.module}</div>
                      {s.termSetting && <span className="text-[10px] text-indigo-600 font-normal">Result Term Setting</span>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setAppSettings(prev => prev.map(x => x.sNo === s.sNo ? { ...x, status: !x.status } : x))}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          s.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.status ? 'On' : 'Off'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: Student App Module (Exact 38 Modules Table) */}
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
                    <th className="py-2.5 px-3">S.No.</th>
                    <th className="py-2.5 px-3">Module Name</th>
                    <th className="py-2.5 px-3">Module Icon</th>
                    <th className="py-2.5 px-3">Module URL</th>
                    <th className="py-2.5 px-3">Module Order</th>
                    <th className="py-2.5 px-3 text-center">Is Active</th>
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
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={m.active}
                          onChange={() => setAppModules(prev => prev.map(x => x.sNo === m.sNo ? { ...x, active: !x.active } : x))}
                          className="rounded w-4 h-4 text-indigo-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Coming Soon */}
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

      {/* House Master Exact Dialog */}
      {activeMasterModal === 'house' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">House Master</h3>
                <span className="text-xs text-slate-400">Masters &bull; House Master</span>
              </div>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newHouseName) return;
              setHouseList(prev => [...prev, { sNo: prev.length + 1, house: newHouseName.toUpperCase(), priority: Number(newHousePriority) || prev.length + 1 }]);
              setNewHouseName('');
              setNewHousePriority('');
            }} className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="House Name (e.g. ORANGE)"
                value={newHouseName}
                onChange={(e) => setNewHouseName(e.target.value)}
                className="col-span-2 text-xs rounded border border-slate-300 px-3 py-2 bg-white"
                required
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded shadow-xs">
                + Add House
              </button>
            </form>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">S.NO.</th>
                  <th className="py-2.5 px-3">HOUSE</th>
                  <th className="py-2.5 px-3">PRIORITY</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {houseList.map((h) => (
                  <tr key={h.sNo} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono">{h.sNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{h.house}</td>
                    <td className="py-2.5 px-3 font-mono">{h.priority}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setHouseList(prev => prev.filter(x => x.sNo !== h.sNo))}
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
        </div>
      )}

      {/* Stream Master Exact Dialog */}
      {activeMasterModal === 'stream' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Stream Master</h3>
                <span className="text-xs text-slate-400">Masters &bull; Stream Master</span>
              </div>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newStreamName) return;
              setStreamList(prev => [...prev, { sNo: prev.length + 1, stream: newStreamName.toUpperCase() }]);
              setNewStreamName('');
            }} className="flex gap-2">
              <input
                type="text"
                placeholder="Stream Name (e.g. VOCATIONAL)"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
                className="flex-1 text-xs rounded border border-slate-300 px-3 py-2 bg-white"
                required
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded shadow-xs">
                + Add Stream
              </button>
            </form>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">S.NO.</th>
                  <th className="py-2.5 px-3">STREAM</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {streamList.map((s) => (
                  <tr key={s.sNo} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono">{s.sNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.stream}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setStreamList(prev => prev.filter(x => x.sNo !== s.sNo))}
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
        </div>
      )}

      {/* Fee Concession By Exact Dialog */}
      {activeMasterModal === 'concessionBy' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Fee Concession By</h3>
                <span className="text-xs text-slate-400">Masters &bull; Fee Concession By</span>
              </div>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">S.NO.</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {concessionByList.map((c) => (
                  <tr key={c.sNo} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono">{c.sNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setConcessionByList(prev => prev.filter(x => x.sNo !== c.sNo))}
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
        </div>
      )}

      {/* Fee Concession Type Exact Dialog */}
      {activeMasterModal === 'concessionType' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Fee Concession Type</h3>
                <span className="text-xs text-slate-400">Masters &bull; Fee Concession Type</span>
              </div>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">S.NO.</th>
                  <th className="py-2.5 px-3">CONCESSION TYPE</th>
                  <th className="py-2.5 px-3">DESCRIPTION</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {concessionTypeList.map((ct) => (
                  <tr key={ct.sNo} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono">{ct.sNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{ct.type}</td>
                    <td className="py-2.5 px-3 text-slate-500">{ct.description || '--'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setConcessionTypeList(prev => prev.filter(x => x.sNo !== ct.sNo))}
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
        </div>
      )}
    </div>
  );
}
