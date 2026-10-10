import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  Users,
  Check,
  X,
  Clock,
  Save,
  CheckCircle2,
  Filter
} from 'lucide-react';

export function StudentAttendancePage({ onNavigate }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [students, setStudents] = useState([
    { id: '1', rollNo: '01', admNo: 'JD-2026-101', name: 'Aarav Sharma', status: 'P' },
    { id: '2', rollNo: '02', admNo: 'JD-2026-102', name: 'Ananya Gupta', status: 'P' },
    { id: '3', rollNo: '03', admNo: 'JD-2026-103', name: 'Chirag Sethi', status: 'A' },
    { id: '4', rollNo: '04', admNo: 'JD-2026-104', name: 'Diya Choudhary', status: 'P' },
    { id: '5', rollNo: '05', admNo: 'JD-2026-105', name: 'Kabir Verma', status: 'L' },
    { id: '6', rollNo: '06', admNo: 'JD-2026-106', name: 'Mehul Soni', status: 'P' },
    { id: '7', rollNo: '07', admNo: 'JD-2026-107', name: 'Pooja Tiwari', status: 'P' },
    { id: '8', rollNo: '08', admNo: 'JD-2026-108', name: 'Rohan Meena', status: 'P' },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const total = students.length;
  const present = students.filter(s => s.status === 'P').length;
  const absent = students.filter(s => s.status === 'A').length;
  const leave = students.filter(s => s.status === 'L').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Attendance Tracker
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Student Daily Attendance</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              One-Tap Marker
            </span>
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-sm shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            Attendance for <span className="font-bold">{selectedClass} - Section {selectedSection}</span> ({selectedDate}) saved successfully! Present: {present}, Absent: {absent}.
          </div>
        </div>
      )}

      {/* Class & Date Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold text-xs"
            >
              <option value="Class 10">Class 10</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 5">Class 5</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 font-semibold text-xs"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>

        {/* Quick Batch Selectors */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Set:</span>
          <button
            onClick={() => markAll('P')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors"
          >
            All Present (P)
          </button>
          <button
            onClick={() => markAll('A')}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition-colors"
          >
            All Absent (A)
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Roster</div>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">{total}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-xs">
          <div className="text-[10px] font-bold text-emerald-700 uppercase">Present (P)</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-0.5">{present}</div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 shadow-xs">
          <div className="text-[10px] font-bold text-rose-700 uppercase">Absent (A)</div>
          <div className="text-xl font-extrabold text-rose-800 mt-0.5">{absent}</div>
        </div>
        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-xs">
          <div className="text-[10px] font-bold text-amber-700 uppercase">Leave (L)</div>
          <div className="text-xl font-extrabold text-amber-800 mt-0.5">{leave}</div>
        </div>
      </div>

      {/* Attendance Fill Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/70">
              <th className="py-3 px-4">Roll No</th>
              <th className="py-3 px-4">Adm No</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4 text-center">Status (One-Tap)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-500">{s.rollNo}</td>
                <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{s.admNo}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleStatusChange(s.id, 'P')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        s.status === 'P'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      Present (P)
                    </button>
                    <button
                      onClick={() => handleStatusChange(s.id, 'A')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        s.status === 'A'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      Absent (A)
                    </button>
                    <button
                      onClick={() => handleStatusChange(s.id, 'L')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        s.status === 'L'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      Leave (L)
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
