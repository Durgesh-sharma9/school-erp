import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  SlidersHorizontal,
  Plus,
  X,
  Check,
  Bell,
  Dot,
  ChevronDown
} from 'lucide-react';

const CLASSES = [
  'Nursery - PP3+',
  'Lower Kindergarten - PP4+',
  'Upper Kindergarten - PP5+',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI- HUMANITIES',
  'XII-HUMANITIES',
  'XI-MEDICAL',
  'XII-MEDICAL',
  'XI-NON-MEDICAL',
  'XII-NON-MEDICAL',
  'XI-COMMERCE'
];

const DIVISIONS = ['A', 'B', 'C', 'D'];

export function StudentAttendancePage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState('2026-10-10');
  const [selectedClass, setSelectedClass] = useState('I');
  const [selectedSection, setSelectedSection] = useState('A');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [history, setHistory] = useState([
    {
      id: 'att_1',
      className: 'I',
      section: 'A',
      attendanceSummary: '5 Present / 1 Absent (83.3%)',
      date: '2026-10-10'
    },
    {
      id: 'att_2',
      className: 'X',
      section: 'A',
      attendanceSummary: '52 Present / 3 Absent (94.5%)',
      date: '2026-10-09'
    }
  ]);

  // Student roster inside modal
  const [modalStudents, setModalStudents] = useState([
    { id: 'std_1', rollNo: '1', name: 'AADITYA SINGH CHOUDHARY', status: 'Present' },
    { id: 'std_2', rollNo: '2', name: 'ADVIK RAO', status: 'Present' },
    { id: 'std_3', rollNo: '3', name: 'ANANYA RAJESH KUMAR YADAV', status: 'Present' },
    { id: 'std_4', rollNo: '4', name: 'ANVI VERMA', status: 'Present' },
    { id: 'std_5', rollNo: '5', name: 'ARADIYA SAINI', status: 'Absent' },
    { id: 'std_6', rollNo: '6', name: 'ARJUN SHARMA', status: 'Present' }
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  // Total Absent counter
  const totalAbsent = modalStudents.filter((s) => s.status === 'Absent').length;

  const toggleStudentStatus = (id, newStatus) => {
    setModalStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = async () => {
    try {
      const presentCount = modalStudents.filter((s) => s.status === 'Present').length;
      const absentCount = modalStudents.filter((s) => s.status === 'Absent').length;
      const total = modalStudents.length || 1;
      const pct = Math.round((presentCount / total) * 100);

      const newHistoryItem = {
        id: `att_${Date.now()}`,
        className: selectedClass,
        section: selectedSection,
        attendanceSummary: `${presentCount} Present / ${absentCount} Absent (${pct}%)`,
        date: attendanceDate
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      setIsModalOpen(false);
      setToastMessage('Attendance saved successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setIsModalOpen(false);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.className.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.date.includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Breadcrumbs matching Live UAB */}
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Attendance</h1>
        <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
          <span>🏠</span>
          <span>•</span>
          <span>Students</span>
          <span>•</span>
          <span className="text-gray-600 font-medium">Attendance</span>
        </span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5">
        {/* Top Action Bar matching Live UAB */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-full focus:border-indigo-600 focus:outline-none bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg transition-colors"
              title="Pick Date"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {/* Round Purple FAB matching Live UAB */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
              title="Add Attendance"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="mb-4 p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded flex items-center gap-2">
            <Check className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Attendance Table matching Live UAB */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">S.NO.</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">SECTION</th>
                <th className="py-3 px-4">ATTENDANCE</th>
                <th className="py-3 px-4">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    No attendance records found. Click '+' to mark attendance.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.className}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{item.section}</td>
                    <td className="py-3 px-4">{item.attendanceSummary}</td>
                    <td className="py-3 px-4 text-gray-500">{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar matching Live UAB */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500 gap-4">
          <span>Items per page:</span>
          <select className="border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none">
            <option>50</option>
            <option>100</option>
          </select>
          <span>
            {filteredHistory.length > 0 ? `1 - ${filteredHistory.length} of ${filteredHistory.length}` : '0 of 0'}
          </span>
        </div>
      </div>

      {/* Attendance Modal matching Live UAB Screenshot in Step 1882 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-sm md:text-base font-bold text-gray-800 tracking-wide">
                ATTENDANCE
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  title="Filter"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Target & Bell Icons matching Live UAB */}
              <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
                <span className="flex items-center text-red-500">
                  <span className="w-3 h-3 rounded-full border-2 border-red-500 flex items-center justify-center mr-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </span>
                  Mark Live
                </span>
                <span className="flex items-center text-amber-500">
                  <Bell className="w-4 h-4 mr-1 text-amber-500" />
                  SMS Alert
                </span>
              </div>

              {/* Class, Section, Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Class*
                  </label>
                  <div className="relative">
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
                    >
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Section*
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
                    >
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                    Attendance Date*
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Total Absent counter matching Live UAB */}
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center justify-between">
                <span>Total Absent: <span className="text-red-600">{totalAbsent}</span></span>
                <span className="text-emerald-600">Total Present: {modalStudents.length - totalAbsent}</span>
              </div>

              {/* Student Roster */}
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded divide-y divide-gray-100 mb-4">
                {modalStudents.map((std) => (
                  <div
                    key={std.id}
                    className="p-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-[11px]">
                        {std.rollNo}
                      </span>
                      <span className="font-semibold text-gray-800">{std.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(std.id, 'Present')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors ${
                          std.status === 'Present'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(std.id, 'Absent')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors ${
                          std.status === 'Absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                        }`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStudentStatus(std.id, 'Leave')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors ${
                          std.status === 'Leave'
                            ? 'bg-amber-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-amber-50'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons matching Live UAB */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded shadow-xs transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
