import React, { useState } from 'react';
import {
  Home,
  Sliders,
  User,
  CreditCard,
  Plus,
  Trash2,
  X,
  CheckCircle2,
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

  // In-memory data for masters
  const [houseList, setHouseList] = useState([
    { id: '1', name: 'Red House' },
    { id: '2', name: 'Blue House' },
    { id: '3', name: 'Green House' },
    { id: '4', name: 'Yellow House' }
  ]);
  const [newHouseName, setNewHouseName] = useState('');

  const [streamList, setStreamList] = useState([
    { id: '1', name: 'Science (PCM)' },
    { id: '2', name: 'Science (PCB)' },
    { id: '3', name: 'Commerce' },
    { id: '4', name: 'Arts / Humanities' }
  ]);
  const [newStreamName, setNewStreamName] = useState('');

  const [concessionByList, setConcessionByList] = useState([
    { id: '1', name: 'Director / Management' },
    { id: '2', name: 'Principal' }
  ]);
  const [newConcessionByName, setNewConcessionByName] = useState('');

  const [concessionTypeList, setConcessionTypeList] = useState([
    { id: '1', name: 'Sibling Concession', percent: '10%' },
    { id: '2', name: 'Staff Ward Concession', percent: '50%' },
    { id: '3', name: 'Merit Scholarship', percent: '25%' }
  ]);
  const [newConcessionTypeName, setNewConcessionTypeName] = useState('');

  const handleAddHouse = (e) => {
    e.preventDefault();
    if (!newHouseName.trim()) return;
    setHouseList(prev => [...prev, { id: String(Date.now()), name: newHouseName.trim() }]);
    setNewHouseName('');
  };

  const handleAddStream = (e) => {
    e.preventDefault();
    if (!newStreamName.trim()) return;
    setStreamList(prev => [...prev, { id: String(Date.now()), name: newStreamName.trim() }]);
    setNewStreamName('');
  };

  const handleAddConcessionBy = (e) => {
    e.preventDefault();
    if (!newConcessionByName.trim()) return;
    setConcessionByList(prev => [...prev, { id: String(Date.now()), name: newConcessionByName.trim() }]);
    setNewConcessionByName('');
  };

  const handleAddConcessionType = (e) => {
    e.preventDefault();
    if (!newConcessionTypeName.trim()) return;
    setConcessionTypeList(prev => [...prev, { id: String(Date.now()), name: newConcessionTypeName.trim(), percent: '10%' }]);
    setNewConcessionTypeName('');
  };

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

      {/* Tabs Header (1:1 UAB Angular Material Tab Styling) */}
      <div className="bg-white border-b border-slate-200 px-6 flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
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
        {/* TAB 1: Masters (1:1 UAB vex-all-masters Vertical Navigation Box) */}
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

        {/* TAB 2: Add SMS Template */}
        {activeTab === 'smsTemplate' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 max-w-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Add New SMS Template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Template Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fee Due Notification"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">DLT Template ID</label>
                <input
                  type="text"
                  placeholder="e.g. 110716128472910"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="block font-medium text-slate-600 mb-1">
                SMS Content (Use {'{#var#}'} for variables)
              </label>
              <textarea
                rows={4}
                placeholder="Dear Parent, your ward {#var#} fee of Rs {#var#} is pending. Please clear by {#var#}."
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow-xs">
                Save SMS Template
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Transport Settings */}
        {activeTab === 'transportSettings' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 max-w-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-800">Transport & GPS Configuration</h3>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Live Tracking Refresh Interval</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2 bg-white">
                <option value="15">15 Seconds (Real-time)</option>
                <option value="30">30 Seconds</option>
                <option value="60">1 Minute</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Parent Proximity Alert Radius</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2 bg-white">
                <option value="500">500 Meters before stop</option>
                <option value="1000">1 Kilometer before stop</option>
                <option value="2000">2 Kilometers before stop</option>
              </select>
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow-xs">
                Save Transport Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Student App Settings */}
        {activeTab === 'appSettings' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 max-w-xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-800">Student & Parent Mobile App Settings</h3>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Notice Board Marquee Ticker</label>
              <input
                type="text"
                defaultValue="Welcome to Session 2026-2027! Annual Sports Meet scheduled next week."
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">Fee Payment Gateway</label>
              <select className="w-full rounded border border-slate-300 px-3 py-2 bg-white">
                <option value="razorpay">Razorpay UPI & Cards</option>
                <option value="paytm">Paytm PG</option>
                <option value="easebuzz">Easebuzz</option>
              </select>
            </div>
            <div className="flex justify-end pt-2">
              <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded shadow-xs">
                Update App Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Student App Module */}
        {activeTab === 'appModule' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 max-w-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Mobile App Module Permissions</h3>
            <p className="text-xs text-slate-500">Enable or disable modules visible to students & parents on the mobile application.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {['Homework', 'Daily Attendance', 'Online Fee Payment', 'Timetable & Routine', 'Report Cards', 'Online Tests', 'Bus Live Tracking', 'Syllabus Tracker', 'Leave Request'].map((mod) => (
                <label key={mod} className="p-3 border border-slate-200 rounded-lg flex items-center space-x-2 bg-slate-50 cursor-pointer hover:bg-indigo-50/50">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 w-4 h-4" />
                  <span className="font-semibold text-slate-800">{mod}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Coming Soon */}
        {activeTab === 'comingSoon' && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-12 text-center max-w-xl mx-auto space-y-3">
            <div className="text-4xl">🚀</div>
            <h3 className="font-bold text-base text-slate-800">New Features In Pipeline</h3>
            <p className="text-xs text-slate-500">
              AI Face Recognition Attendance &amp; Smart RFID integration for gates and buses will be enabled in next firmware update.
            </p>
          </div>
        )}
      </div>

      {/* House Master Modal */}
      {activeMasterModal === 'house' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-800">House Master</h3>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHouse} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter House Name (e.g. Shivaji House)"
                value={newHouseName}
                onChange={(e) => setNewHouseName(e.target.value)}
                className="flex-1 text-xs rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                required
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded shadow-xs">
                Add
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {houseList.map((h) => (
                <div key={h.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{h.name}</span>
                  <button
                    onClick={() => setHouseList(prev => prev.filter(x => x.id !== h.id))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stream Master Modal */}
      {activeMasterModal === 'stream' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-800">Stream Master</h3>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStream} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Stream Name"
                value={newStreamName}
                onChange={(e) => setNewStreamName(e.target.value)}
                className="flex-1 text-xs rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                required
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded shadow-xs">
                Add
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {streamList.map((s) => (
                <div key={s.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <button
                    onClick={() => setStreamList(prev => prev.filter(x => x.id !== s.id))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fee Concession By Modal */}
      {activeMasterModal === 'concessionBy' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-800">Fee Concession By</h3>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddConcessionBy} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Approver Title (e.g. Director)"
                value={newConcessionByName}
                onChange={(e) => setNewConcessionByName(e.target.value)}
                className="flex-1 text-xs rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                required
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded shadow-xs">
                Add
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {concessionByList.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{c.name}</span>
                  <button
                    onClick={() => setConcessionByList(prev => prev.filter(x => x.id !== c.id))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fee Concession Type Modal */}
      {activeMasterModal === 'concessionType' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-800">Fee Concession Type</h3>
              <button onClick={() => setActiveMasterModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddConcessionType} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Concession Type"
                value={newConcessionTypeName}
                onChange={(e) => setNewConcessionTypeName(e.target.value)}
                className="flex-1 text-xs rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                required
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded shadow-xs">
                Add
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {concessionTypeList.map((ct) => (
                <div key={ct.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{ct.name}</span>
                  <button
                    onClick={() => setConcessionTypeList(prev => prev.filter(x => x.id !== ct.id))}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
