import React, { useState } from 'react';
import { Settings, Search, Save, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export function EditTransportFeePage() {
  const [selectedClass, setSelectedClass] = useState('Class I');
  const [selectedDivision, setSelectedDivision] = useState('A');
  const [selectedStudent, setSelectedStudent] = useState('1621 - AADITYA SINGH CHOUDHARY');

  const [monthsData, setMonthsData] = useState([
    { month: 'April', fare: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'May', fare: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'July', fare: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'August', fare: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'September', fare: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'October', fare: 2550, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'November', fare: 2550, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'December', fare: 2550, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'January', fare: 2550, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'February', fare: 2550, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
    { month: 'March', fare: 2550, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' }
  ]);

  const destinationsList = [
    '7R Resort',
    'Abhinandan Enclave Jaisinghpura',
    'Auric City Homes',
    'Bhankrota',
    'Kalwara',
    'Thikariya',
    'Vatika'
  ];

  const vehiclesList = [
    'RJ02PA2762',
    'RJ14PC1019',
    'RJ14PC1037',
    'RJ14PC2278',
    'RJ14PC5938',
    'RJ40PA1179'
  ];

  const toggleApply = (idx) => {
    setMonthsData(prev => prev.map((m, i) => i === idx ? { ...m, applied: !m.applied } : m));
  };

  const updateField = (idx, field, value) => {
    setMonthsData(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleModify = async () => {
    try {
      await fetch('/api/transport/student-fee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admNo: '1621', schedule: monthsData })
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
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="1621 - AADITYA SINGH CHOUDHARY">1621 - AADITYA SINGH CHOUDHARY</option>
              <option value="2059 - AADHYA CHOUDHARY">2059 - AADHYA CHOUDHARY</option>
              <option value="1204 - AARAV SHARMA">1204 - AARAV SHARMA</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Student transport data loaded')}
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
