import React, { useState } from 'react';
import {
  Settings,
  Search,
  Save,
  CheckSquare,
  Square,
  User,
  Bus,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export function EditTransportFeePage() {
  const [selectedClass, setSelectedClass] = useState('Class V');
  const [selectedDivision, setSelectedDivision] = useState('B');
  const [selectedStudent, setSelectedStudent] = useState('1540 - TANISHQ JAIN');

  const studentPresets = {
    '1540 - TANISHQ JAIN': {
      admNo: '1540',
      name: 'TANISHQ JAIN',
      fatherName: 'Vikas Jain',
      class: 'Class V',
      division: 'B',
      vehicle: 'RJ14PC5938',
      destination: 'Neerja Modi / Mansarovar',
      fare: 3200,
      paidMonths: 6,
      phone: '+91 98290 12345'
    },
    '1621 - AADITYA SINGH CHOUDHARY': {
      admNo: '1621',
      name: 'AADITYA SINGH CHOUDHARY',
      fatherName: 'Ramesh Choudhary',
      class: 'Class I',
      division: 'A',
      vehicle: 'RJ02PA2762',
      destination: 'Abhinandan Enclave Jaisinghpura',
      fare: 2550,
      paidMonths: 5,
      phone: '+91 98290 54321'
    },
    '2059 - AADHYA CHOUDHARY': {
      admNo: '2059',
      name: 'AADHYA CHOUDHARY',
      fatherName: 'Surendra Choudhary',
      class: 'Nursery - PP3+',
      division: 'A',
      vehicle: 'RJ14PC1019',
      destination: 'Kalwara',
      fare: 3000,
      paidMonths: 7,
      phone: '+91 94140 11223'
    },
    '1204 - AARAV SHARMA': {
      admNo: '1204',
      name: 'AARAV SHARMA',
      fatherName: 'Deepak Sharma',
      class: 'Class II',
      division: 'A',
      vehicle: 'RJ14PC1037',
      destination: 'Vatika',
      fare: 2400,
      paidMonths: 6,
      phone: '+91 98291 99887'
    },
    '1985 - KABIR VERMA': {
      admNo: '1985',
      name: 'KABIR VERMA',
      fatherName: 'Rajesh Verma',
      class: 'Class III',
      division: 'A',
      vehicle: 'RJ14PC2278',
      destination: 'Muhana Mandi',
      fare: 2600,
      paidMonths: 7,
      phone: '+91 97845 33445'
    },
    '2201 - ANANYA SHARMA': {
      admNo: '2201',
      name: 'ANANYA SHARMA',
      fatherName: 'Sunil Sharma',
      class: 'Class VI',
      division: 'A',
      vehicle: 'RJ14PC7878',
      destination: 'Mahapura',
      fare: 2500,
      paidMonths: 6,
      phone: '+91 99280 44556'
    },
    '1319 - DAKSH SINGH': {
      admNo: '1319',
      name: 'DAKSH SINGH',
      fatherName: 'Vikram Singh',
      class: 'Class VII',
      division: 'A',
      vehicle: 'RJ14PE0832',
      destination: '7R Resort',
      fare: 2800,
      paidMonths: 8,
      phone: '+91 98292 77665'
    },
    '1442 - MANVI PATEL': {
      admNo: '1442',
      name: 'MANVI PATEL',
      fatherName: 'Girish Patel',
      class: 'Class VIII',
      division: 'B',
      vehicle: 'RJ19PB7511',
      destination: 'Auric City Homes',
      fare: 2900,
      paidMonths: 7,
      phone: '+91 98294 88990'
    },
    '2105 - ROHAN GUPTA': {
      admNo: '2105',
      name: 'ROHAN GUPTA',
      fatherName: 'Anil Gupta',
      class: 'Class IX',
      division: 'A',
      vehicle: 'RJ20PA9932',
      destination: 'Sanganer Bridge',
      fare: 3100,
      paidMonths: 6,
      phone: '+91 98293 22110'
    },
    '1842 - PRIYANSH MEENA': {
      admNo: '1842',
      name: 'PRIYANSH MEENA',
      fatherName: 'Mukesh Meena',
      class: 'Class X',
      division: 'B',
      vehicle: 'RJ40PA1179',
      destination: 'Bhankrota',
      fare: 3600,
      paidMonths: 8,
      phone: '+91 94142 66778'
    }
  };

  const getInitialSchedule = (studentKey) => {
    const months = ['April', 'May', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    const p = studentPresets[studentKey] || studentPresets['1540 - TANISHQ JAIN'];
    return months.map((m, idx) => ({
      month: m,
      fare: p.fare,
      balance: idx < p.paidMonths ? 0 : p.fare,
      applied: true,
      destination: p.destination,
      vehicle: p.vehicle
    }));
  };

  const [monthsData, setMonthsData] = useState(getInitialSchedule('1540 - TANISHQ JAIN'));

  // Bulk Edit States
  const [bulkDestination, setBulkDestination] = useState('');
  const [bulkFare, setBulkFare] = useState('');

  const destinationsList = [
    '7R Resort',
    'Abhinandan Enclave Jaisinghpura',
    'Auric City Homes',
    'Bhankrota',
    'Kalwara',
    'Mahapura',
    'Muhana Mandi',
    'Neerja Modi / Mansarovar',
    'Sanganer Bridge',
    'Thikariya',
    'Vatika'
  ];

  const vehiclesList = [
    'RJ02PA2762',
    'RJ14PC1019',
    'RJ14PC1037',
    'RJ14PC2278',
    'RJ14PC5938',
    'RJ14PC7878',
    'RJ14PE0832',
    'RJ19PB7511',
    'RJ20PA9932',
    'RJ40PA1179'
  ];

  const currentStudent = studentPresets[selectedStudent] || studentPresets['1540 - TANISHQ JAIN'];

  // Handle student change with auto-sync
  const handleStudentChange = (studentKey) => {
    setSelectedStudent(studentKey);
    const p = studentPresets[studentKey];
    if (p) {
      setSelectedClass(p.class);
      setSelectedDivision(p.division);
      setMonthsData(getInitialSchedule(studentKey));
      toast.success(`Loaded schedule for ${p.name}`);
    }
  };

  const toggleApply = (idx) => {
    setMonthsData(prev => prev.map((m, i) => i === idx ? { ...m, applied: !m.applied } : m));
  };

  const updateField = (idx, field, value) => {
    setMonthsData(prev =>
      prev.map((m, i) => {
        if (i !== idx) return m;
        const updated = { ...m, [field]: value };
        // If fare changes and it wasn't already paid (balance > 0), adjust balance
        if (field === 'fare' && m.balance > 0) {
          updated.balance = Number(value) || 0;
        }
        return updated;
      })
    );
  };

  // Bulk Actions
  const handleToggleSelectAll = () => {
    const allApplied = monthsData.every(m => m.applied);
    setMonthsData(prev => prev.map(m => ({ ...m, applied: !allApplied })));
    toast.success(allApplied ? 'All months unselected' : 'All months selected');
  };

  const handleApplyBulkDestination = () => {
    if (!bulkDestination) {
      toast.error('Please choose a destination first');
      return;
    }
    setMonthsData(prev => prev.map(m => m.applied ? { ...m, destination: bulkDestination } : m));
    toast.success(`Updated destination to "${bulkDestination}" for all active months`);
  };

  const handleApplyBulkFare = () => {
    const num = Number(bulkFare);
    if (!num || num <= 0) {
      toast.error('Please enter a valid fare amount');
      return;
    }
    setMonthsData(prev =>
      prev.map(m => {
        if (!m.applied) return m;
        return {
          ...m,
          fare: num,
          balance: m.balance > 0 ? num : 0
        };
      })
    );
    toast.success(`Applied ₹${num.toLocaleString()} fare to active months`);
    setBulkFare('');
  };

  const handleResetToDefault = () => {
    setMonthsData(getInitialSchedule(selectedStudent));
    toast.success('Reset schedule to default settings');
  };

  const handleSaveSchedule = async () => {
    try {
      const admMatch = selectedStudent.match(/^(\d+)/);
      const admNo = admMatch ? admMatch[1] : '1540';
      await fetch('/api/transport/student-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admNo, schedule: monthsData })
      }).catch(() => null);

      toast.success(`Transport fee schedule updated for ${currentStudent.name}!`);
    } catch {
      toast.error('Failed to update transport fee');
    }
  };

  // Live Summary Calculations
  const activeMonths = monthsData.filter(m => m.applied);
  const totalAnnualDemand = activeMonths.reduce((sum, m) => sum + (Number(m.fare) || 0), 0);
  const totalPaid = activeMonths.filter(m => m.balance === 0).reduce((sum, m) => sum + (Number(m.fare) || 0), 0);
  const totalPendingDue = activeMonths.reduce((sum, m) => sum + (Number(m.balance) || 0), 0);

  return (
    <div className="p-3.5 sm:p-4 max-w-7xl mx-auto space-y-3.5">
      {/* 1:1 Unified Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-0.5">
            <span>Transport</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Edit Transport Fee</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <span>Student Transport Fee & Monthly Allocation</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Customize student-wise monthly stoppages, opt-in/opt-out status, and monthly transport fee schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Reset schedule"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSaveSchedule}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Schedule</span>
          </button>
        </div>
      </div>

      {/* Filter / Student Selector Bar */}
      <div className="bg-white p-3.5 px-4 rounded-xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Filter Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Nursery - PP3+">Nursery - PP3+</option>
              <option value="Class I">Class I</option>
              <option value="Class II">Class II</option>
              <option value="Class III">Class III</option>
              <option value="Class V">Class V</option>
              <option value="Class VI">Class VI</option>
              <option value="Class VII">Class VII</option>
              <option value="Class VIII">Class VIII</option>
              <option value="Class IX">Class IX</option>
              <option value="Class X">Class X</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Select Student (Auto-Loads Schedule)
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Object.keys(studentPresets).map((sKey) => (
                <option key={sKey} value={sKey}>
                  {sKey} ({studentPresets[sKey].class} - {studentPresets[sKey].division})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => handleStudentChange(selectedStudent)}
              className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Transport Profile & Financial KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Student Profile */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-black text-xs">
            {currentStudent.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Student Profile</div>
            <div className="text-xs font-bold text-slate-900 truncate">{currentStudent.name}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Adm #{currentStudent.admNo}</span>
              <span>&bull;</span>
              <span className="font-semibold text-indigo-600">{currentStudent.class} - {currentStudent.division}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Months & Route */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Transport Schedule</div>
            <div className="text-xs font-bold text-slate-800">
              {activeMonths.length} / 11 Months Active
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{activeMonths.length === 11 ? 'Full Academic Year' : 'Custom Coverage'}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Annual Demand */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Annual Demand</div>
            <div className="text-sm font-black text-slate-900 font-mono">
              ₹{totalAnnualDemand.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Bus: <span className="font-mono font-bold text-slate-700">{currentStudent.vehicle}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Paid vs Due Balance */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Fee Status & Balance</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-emerald-700 font-mono">
                Paid ₹{totalPaid.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-black text-rose-600 font-mono bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                Due ₹{totalPendingDue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Current stop: {currentStudent.destination}
            </div>
          </div>
        </div>
      </div>

      {/* Fast Bulk-Actions Toolbar */}
      <div className="bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 p-2.5 px-3.5 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-[11px] font-semibold transition cursor-pointer shadow-2xs"
          >
            {monthsData.every(m => m.applied) ? (
              <>
                <Square className="w-3.5 h-3.5 text-slate-400" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select All Months</span>
              </>
            )}
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500 font-medium">Quick Bulk Actions:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk Destination */}
          <div className="flex items-center gap-1">
            <select
              value={bulkDestination}
              onChange={(e) => setBulkDestination(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Apply Stop to All --</option>
              {destinationsList.map((d, dIdx) => (
                <option key={dIdx} value={d}>{d}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleApplyBulkDestination}
              className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition cursor-pointer"
            >
              Apply Stop
            </button>
          </div>

          {/* Bulk Fare */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="e.g. 3000"
              value={bulkFare}
              onChange={(e) => setBulkFare(e.target.value)}
              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-mono outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleApplyBulkFare}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition cursor-pointer"
            >
              Apply Fare
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Transport Fee Schedule Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3 w-14 text-center whitespace-nowrap">APPLY</th>
                <th className="py-2.5 px-4 w-28 font-bold text-slate-900 whitespace-nowrap">MONTH</th>
                <th className="py-2.5 px-4 w-32 whitespace-nowrap">MONTHLY FARE (₹)</th>
                <th className="py-2.5 px-4 w-36 whitespace-nowrap">PAYMENT & BALANCE</th>
                <th className="py-2.5 px-4 min-w-[200px] whitespace-nowrap">STOPPAGE / DESTINATION</th>
                <th className="py-2.5 px-4 w-40 whitespace-nowrap">ASSIGNED VEHICLE</th>
                <th className="py-2.5 px-4 text-center w-24 whitespace-nowrap">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {monthsData.map((m, idx) => {
                const isPaid = m.balance === 0;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      !m.applied
                        ? 'bg-slate-50/50 opacity-60'
                        : isPaid
                        ? 'hover:bg-emerald-50/20'
                        : 'hover:bg-indigo-50/30'
                    }`}
                  >
                    {/* Apply Checkbox */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleApply(idx)}
                        className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-indigo-50 text-indigo-600 transition cursor-pointer"
                        title={m.applied ? 'Opt-Out for this Month' : 'Opt-In for this Month'}
                      >
                        {m.applied ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Month Name */}
                    <td className="py-2.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{m.month}</span>
                      </div>
                    </td>

                    {/* Monthly Fare Input */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="relative flex items-center w-28">
                        <span className="absolute left-2.5 text-slate-400 text-xs font-mono">₹</span>
                        <input
                          type="number"
                          disabled={!m.applied}
                          value={m.fare}
                          onChange={(e) => updateField(idx, 'fare', Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        />
                      </div>
                    </td>

                    {/* Balance & Payment Status */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Paid (₹0 Due)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 font-mono whitespace-nowrap">
                          <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Due ₹{Number(m.balance || 0).toLocaleString('en-IN')}</span>
                        </span>
                      )}
                    </td>

                    {/* Stoppage Select */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <select
                          disabled={!m.applied}
                          value={m.destination}
                          onChange={(e) => updateField(idx, 'destination', e.target.value)}
                          className="w-full min-w-[190px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {destinationsList.map((d, dIdx) => (
                            <option key={dIdx} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Vehicle Select */}
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Bus className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <select
                          disabled={!m.applied}
                          value={m.vehicle}
                          onChange={(e) => updateField(idx, 'vehicle', e.target.value)}
                          className="w-full min-w-[130px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {vehiclesList.map((v, vIdx) => (
                            <option key={vIdx} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Active Status Badge */}
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      {m.applied ? (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                          Opted Out
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Calculation & Save Action Footer */}
        <div className="p-3.5 px-5 bg-gradient-to-r from-slate-50 via-slate-50 to-indigo-50/20 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-slate-500">
              Active Months: <strong className="text-slate-800">{activeMonths.length} of 11</strong>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500">
              Total Demand: <strong className="text-slate-900 font-mono">₹{totalAnnualDemand.toLocaleString('en-IN')}</strong>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500">
              Total Paid: <strong className="text-emerald-700 font-mono">₹{totalPaid.toLocaleString('en-IN')}</strong>
            </span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-500">
              Net Balance: <strong className="text-rose-600 font-mono font-bold">₹{totalPendingDue.toLocaleString('en-IN')}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSaveSchedule}
              className="inline-flex items-center gap-1.5 px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Update Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
