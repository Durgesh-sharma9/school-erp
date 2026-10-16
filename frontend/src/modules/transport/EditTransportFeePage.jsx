import React, { useState } from 'react';
import { Settings, Search, Save, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export function EditTransportFeePage() {
  const [selectedClass, setSelectedClass] = useState('Class I');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [selectedStudent, setSelectedStudent] = useState('1621 - AADITYA SINGH CHOUDHARY');

  const studentPresets = {
    '1621 - AADITYA SINGH CHOUDHARY': {
      class: 'Class I',
      division: 'A',
      vehicle: 'RJ02PA2762',
      destination: 'Abhinandan Enclave Jaisinghpura',
      fare: 2550,
      paidMonths: 5
    },
    '2059 - AADHYA CHOUDHARY': {
      class: 'Nursery - PP3+',
      division: 'A',
      vehicle: 'RJ14PC1019',
      destination: 'Kalwara',
      fare: 3000,
      paidMonths: 7
    },
    '1204 - AARAV SHARMA': {
      class: 'Class II',
      division: 'A',
      vehicle: 'RJ14PC1037',
      destination: 'Vatika',
      fare: 2400,
      paidMonths: 6
    },
    '1985 - KABIR VERMA': {
      class: 'Class III',
      division: 'A',
      vehicle: 'RJ14PC2278',
      destination: 'Muhana Mandi',
      fare: 2600,
      paidMonths: 7
    },
    '1540 - TANISHQ JAIN': {
      class: 'Class V',
      division: 'B',
      vehicle: 'RJ14PC5938',
      destination: 'Neerja Modi / Mansarovar',
      fare: 3200,
      paidMonths: 6
    },
    '2201 - ANANYA SHARMA': {
      class: 'Class VI',
      division: 'A',
      vehicle: 'RJ14PC7878',
      destination: 'Mahapura',
      fare: 2500,
      paidMonths: 6
    },
    '1319 - DAKSH SINGH': {
      class: 'Class VII',
      division: 'A',
      vehicle: 'RJ14PE0832',
      destination: '7R Resort',
      fare: 2800,
      paidMonths: 8
    },
    '1442 - MANVI PATEL': {
      class: 'Class VIII',
      division: 'B',
      vehicle: 'RJ19PB7511',
      destination: 'Auric City Homes',
      fare: 2900,
      paidMonths: 7
    },
    '2105 - ROHAN GUPTA': {
      class: 'Class IX',
      division: 'A',
      vehicle: 'RJ20PA9932',
      destination: 'Sanganer Bridge',
      fare: 3100,
      paidMonths: 6
    },
    '1842 - PRIYANSH MEENA': {
      class: 'Class X',
      division: 'B',
      vehicle: 'RJ40PA1179',
      destination: 'Bhankrota',
      fare: 3600,
      paidMonths: 8
    }
  };

  const getInitialSchedule = (studentKey) => {
    const months = ['April', 'May', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
    const p = studentPresets[studentKey] || studentPresets['1621 - AADITYA SINGH CHOUDHARY'];
    return months.map((m, idx) => ({
      month: m,
      fare: p.fare,
      balance: idx < p.paidMonths ? 0 : p.fare,
      applied: true,
      destination: p.destination,
      vehicle: p.vehicle
    }));
  };

  const [monthsData, setMonthsData] = useState(getInitialSchedule('1621 - AADITYA SINGH CHOUDHARY'));

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

  const handleStudentChange = (e) => {
    const student = e.target.value;
    setSelectedStudent(student);
    if (studentPresets[student]) {
      setSelectedClass(studentPresets[student].class);
      setSelectedDivision(studentPresets[student].division);
      setMonthsData(getInitialSchedule(student));
    }
  };

  const toggleApply = (idx) => {
    setMonthsData(prev => prev.map((m, i) => i === idx ? { ...m, applied: !m.applied } : m));
  };

  const updateField = (idx, field, value) => {
    setMonthsData(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleModify = async () => {
    try {
      const admMatch = selectedStudent.match(/^(\d+)/);
      const admNo = admMatch ? admMatch[1] : '1621';
      await fetch('/api/transport/student-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admNo, schedule: monthsData })
      });
      toast.success('Transport fee schedule updated successfully');
    } catch {
      toast.error('Failed to update transport fee');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 UAB Breadcrumb & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Transport</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Edit Transport Fee</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            Edit Transport Fee
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Student-by-student monthly transport fare adjustment and destination allocation
          </p>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB: Class, Division, Student) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
            <select
              value={selectedStudent}
              onChange={handleStudentChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              {Object.keys(studentPresets).map((sKey) => (
                <option key={sKey} value={sKey}>
                  {sKey}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => {
                if (studentPresets[selectedStudent]) {
                  setMonthsData(getInitialSchedule(selectedStudent));
                }
                toast.success(`Loaded schedule for ${selectedStudent}`);
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Load Schedule
            </button>
          </div>
        </div>
      </div>

      {/* 1:1 UAB Table: APPLY, MONTH, FARE, BALANCE, DESTINATION, VEHICLE */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-20 text-center">APPLY</th>
                <th className="py-3.5 px-6 font-bold text-slate-900">MONTH</th>
                <th className="py-3.5 px-6">FARE (₹)</th>
                <th className="py-3.5 px-6">BALANCE (₹)</th>
                <th className="py-3.5 px-6">DESTINATION</th>
                <th className="py-3.5 px-6">VEHICLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthsData.map((m, idx) => (
                <tr key={idx} className={`hover:bg-slate-50/80 transition-colors ${!m.applied ? 'opacity-50 bg-slate-50/30' : ''}`}>
                  <td className="py-3.5 px-6 text-center">
                    <button
                      type="button"
                      onClick={() => toggleApply(idx)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {m.applied ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </button>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{m.month}</td>
                  <td className="py-3.5 px-6">
                    <input
                      type="number"
                      disabled={!m.applied}
                      value={m.fare}
                      onChange={(e) => updateField(idx, 'fare', Number(e.target.value))}
                      className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-rose-600">
                    ₹{m.balance?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      disabled={!m.applied}
                      value={m.destination}
                      onChange={(e) => updateField(idx, 'destination', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {destinationsList.map((d, dIdx) => (
                        <option key={dIdx} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-6">
                    <select
                      disabled={!m.applied}
                      value={m.vehicle}
                      onChange={(e) => updateField(idx, 'vehicle', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {vehiclesList.map((v, vIdx) => (
                        <option key={vIdx} value={v}>{v}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UAB Modify Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleModify}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> Modify
          </button>
        </div>
      </div>
    </div>
  );
}
