import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Sliders,
  Bell,
  Bus,
  Smartphone,
  Layers,
  ChevronRight
} from 'lucide-react';

export function SettingsAndPermissionsPage() {
  const [activeTab, setActiveTab] = useState('masters');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Tab definitions matching UAB live portal
  const tabs = [
    { id: 'masters', label: 'Masters' },
    { id: 'smsTemplate', label: 'Add SMS Template' },
    { id: 'transportSettings', label: 'Transport Settings' },
    { id: 'appSettings', label: 'Student App Settings' },
    { id: 'appModule', label: 'Student App Module' },
    { id: 'comingSoon', label: 'Coming Soon' }
  ];

  // Masters options
  const [masterSettings, setMasterSettings] = useState({
    houseEnabled: true,
    streamEnabled: true,
    feeConcessionByEnabled: true,
    feeConcessionTypeEnabled: true,
    admissionNoAutoIncrement: true,
    srNoAutoIncrement: true,
    smsAutoTriggerOnFee: true
  });

  const handleToggle = (key) => {
    setMasterSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800 text-sm">School</span>
          <span>&bull;</span>
          <span className="text-gray-400">School &bull; Settings & Permissions</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            Settings & Permissions saved successfully!
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 space-y-4">
        {/* Navigation Tabs Header */}
        <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Masters Settings */}
        {activeTab === 'masters' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* House */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800">House Master</h4>
                  <p className="text-[11px] text-slate-500">Enable school houses (Red, Blue, Green, Yellow) for students</p>
                </div>
                <input
                  type="checkbox"
                  checked={masterSettings.houseEnabled}
                  onChange={() => handleToggle('houseEnabled')}
                  className="rounded w-4 h-4 text-indigo-600"
                />
              </div>

              {/* Stream */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800">Stream Master</h4>
                  <p className="text-[11px] text-slate-500">Enable Science, Commerce & Arts streams for Higher Secondary</p>
                </div>
                <input
                  type="checkbox"
                  checked={masterSettings.streamEnabled}
                  onChange={() => handleToggle('streamEnabled')}
                  className="rounded w-4 h-4 text-indigo-600"
                />
              </div>

              {/* Fee Concession By */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800">Fee Concession By</h4>
                  <p className="text-[11px] text-slate-500">Authority approval hierarchy for granting student discounts</p>
                </div>
                <input
                  type="checkbox"
                  checked={masterSettings.feeConcessionByEnabled}
                  onChange={() => handleToggle('feeConcessionByEnabled')}
                  className="rounded w-4 h-4 text-indigo-600"
                />
              </div>

              {/* Fee Concession Type */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <div>
                  <h4 className="font-bold text-slate-800">Fee Concession Type</h4>
                  <p className="text-[11px] text-slate-500">Allow categorical fee concessions (Sibling, Staff child, Merit)</p>
                </div>
                <input
                  type="checkbox"
                  checked={masterSettings.feeConcessionTypeEnabled}
                  onChange={() => handleToggle('feeConcessionTypeEnabled')}
                  className="rounded w-4 h-4 text-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Add SMS Template */}
        {activeTab === 'smsTemplate' && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Template Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fee Reminder SMS"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">DLT Template ID</label>
                <input
                  type="text"
                  placeholder="e.g. 110716128472910"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                SMS Body (With variables: {'{#var#}'})
              </label>
              <textarea
                rows={3}
                placeholder="Dear {#var#}, your ward {#var#} fee of Rs {#var#} is due. Please pay by {#var#}."
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Transport Settings */}
        {activeTab === 'transportSettings' && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h4 className="font-bold text-slate-800">Vehicle Live Tracking Interval</h4>
              <select className="rounded border border-slate-300 px-3 py-1.5 bg-white">
                <option value="15">Every 15 Seconds</option>
                <option value="30">Every 30 Seconds</option>
                <option value="60">Every 1 Minute</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab 4: Student App Settings */}
        {activeTab === 'appSettings' && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h4 className="font-bold text-slate-800">Student Mobile App Notice Banner</h4>
              <input
                type="text"
                placeholder="Enter ticker text showing on parent app home screen..."
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Student App Module */}
        {activeTab === 'appModule' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            {['Homework', 'Attendance', 'Fees Online Pay', 'Timetable', 'Report Card', 'Online Test'].map((m) => (
              <label key={m} className="p-3 border border-slate-200 rounded-lg flex items-center space-x-2 bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                <span className="font-semibold text-slate-800">{m}</span>
              </label>
            ))}
          </div>
        )}

        {/* Tab 6: Coming Soon */}
        {activeTab === 'comingSoon' && (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <div className="text-3xl">🚀</div>
            <p className="font-bold text-slate-700">AI Powered Smart Attendance & Facial Recognition Integration</p>
            <p>Will be rolled out in upcoming patch release.</p>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded bg-[#4338ca] hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
