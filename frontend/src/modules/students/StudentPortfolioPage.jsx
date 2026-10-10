import React, { useState } from 'react';
import {
  Search,
  Bus,
  Building,
  CheckCircle,
  FileText,
  User,
  Users,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export function StudentPortfolioPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);

  // Active loaded student
  const student = {
    name: 'AADITYA SINGH CHOUDHARY',
    admNo: '1621',
    rollNo: '1',
    className: 'I - A',
    status: 'Studying',
    fatherName: 'NARENDRA SINGH CHOUDHARY',
    motherName: 'SUNITA CHOUDHARY',
    fatherMobile: '9829012345',
    motherMobile: '9829012346',
    guardian1Name: 'RAMESH CHOUDHARY',
    guardian1Mobile: '9829012347',
    guardian2Name: 'SITA DEVI',
    guardian2Mobile: '9829012348',
    vehicle: 'Bus [RJ02PA2762]',
    vehicleNo: 'RJ02PA2762',
    route: 'North Ring Route',
    destination: 'Main Gate Stop',
    hostel: 'Main Boys Hostel',
    block: 'Block A',
    floor: 'Floor 1',
    room: 'Room 101',
    wardenNo: '9829099881',
    attendancePct: 92,
    feesPct: 100
  };

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800 space-y-4">
      {/* Top Header Pill matching Live UAB */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded shadow-2xs">
          Student Portfolio
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll no, or admission no..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded focus:border-indigo-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Row 1: 4 Executive Cards matching Live UAB Screenshot Step 1918 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Student Information (Purple Header) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
          <div className="bg-indigo-600 px-4 py-2 text-white font-bold text-xs tracking-wider uppercase">
            Student Information
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-16 h-16 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 text-gray-700" viewBox="0 0 100 100" fill="currentColor">
                <polygon points="50,15 85,28 50,40 15,28" fill="#1e293b" />
                <polygon points="50,40 50,48 80,36 80,28" fill="#0f172a" />
                <path d="M78,30 Q83,38 82,46" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
                <circle cx="82" cy="46" r="2.5" fill="#fbbf24" />
                <circle cx="50" cy="45" r="16" fill="#fbcfe8" />
                <path d="M42,58 L58,58 L55,70 L45,70 Z" fill="#fbbf24" />
                <path d="M25,88 C25,65 38,62 50,62 C62,62 75,65 75,88 Z" fill="#1e293b" />
              </svg>
            </div>
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-gray-900 text-sm truncate max-w-[150px]">{student.name}</h3>
              <p className="text-gray-500 font-medium">Class : {student.className}</p>
              <p className="text-gray-500 font-medium">
                Status : <span className="text-emerald-600 font-semibold">{student.status}</span>
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <Bus className="w-2.5 h-2.5" /> Transport
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold flex items-center gap-1">
                  <Building className="w-2.5 h-2.5" /> Hostel
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Student Result (Orange Header) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs flex flex-col">
          <div className="bg-amber-600 px-4 py-2 text-white font-bold text-xs tracking-wider uppercase">
            Student Result
          </div>
          <div className="p-4 flex-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowResultModal(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 cursor-pointer"
            >
              Show Result
            </button>
          </div>
        </div>

        {/* Card 3: Transport Information (Yellow Header) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
          <div className="bg-yellow-500 px-4 py-2 text-white font-bold text-xs tracking-wider uppercase">
            Transport Information
          </div>
          <div className="p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-semibold text-gray-800">{student.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle No</span>
              <span className="font-semibold text-gray-800">{student.vehicleNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Route</span>
              <span className="font-semibold text-gray-800">{student.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Destination</span>
              <span className="font-semibold text-gray-800">{student.destination}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Hostel Information (Pink Header) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
          <div className="bg-pink-600 px-4 py-2 text-white font-bold text-xs tracking-wider uppercase">
            Hostel Information
          </div>
          <div className="p-3 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Hostel</span>
              <span className="font-semibold text-gray-800">{student.hostel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Block</span>
              <span className="font-semibold text-gray-800">{student.block}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Floor</span>
              <span className="font-semibold text-gray-800">{student.floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room</span>
              <span className="font-semibold text-gray-800">{student.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Warden No</span>
              <span className="font-semibold text-gray-800">{student.wardenNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Progress Bars matching Live UAB */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attendance Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-2xs">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-600">Attendance</span>
            <span className="text-indigo-600">{student.attendancePct}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${student.attendancePct}%` }}
            />
          </div>
        </div>

        {/* Fees Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-2xs">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-600">Fees</span>
            <span className="text-emerald-600">{student.feesPct}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${student.feesPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Parents & Guardian Details matching Live UAB */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PARENTS DETAILS */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              PARENTS DETAILS
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Father */}
              <div className="p-3 border border-gray-100 rounded-lg flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-xs truncate">
                  <p className="font-bold text-gray-800 truncate">{student.fatherName}</p>
                  <p className="text-gray-400 text-[11px] font-medium">{student.fatherMobile}</p>
                  <p className="text-gray-500 text-[11px]">Father</p>
                </div>
              </div>

              {/* Mother */}
              <div className="p-3 border border-gray-100 rounded-lg flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-xs truncate">
                  <p className="font-bold text-gray-800 truncate">{student.motherName}</p>
                  <p className="text-gray-400 text-[11px] font-medium">{student.motherMobile}</p>
                  <p className="text-gray-500 text-[11px]">Mother</p>
                </div>
              </div>
            </div>
          </div>

          {/* GUARDIAN DETAILS */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              GUARDIAN DETAILS
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {/* Guardian 1 */}
              <div className="p-3 border border-gray-100 rounded-lg flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-xs truncate">
                  <p className="font-bold text-gray-800 truncate">{student.guardian1Name}</p>
                  <p className="text-gray-400 text-[11px] font-medium">{student.guardian1Mobile}</p>
                  <p className="text-gray-500 text-[11px]">Guardian 1</p>
                </div>
              </div>

              {/* Guardian 2 */}
              <div className="p-3 border border-gray-100 rounded-lg flex items-center gap-3 bg-gray-50/50">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-xs truncate">
                  <p className="font-bold text-gray-800 truncate">{student.guardian2Name}</p>
                  <p className="text-gray-400 text-[11px] font-medium">{student.guardian2Mobile}</p>
                  <p className="text-gray-500 text-[11px]">Guardian 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Fees Chart & Fee Reminder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fees Widget */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-gray-800 text-sm">Fees</h4>
            <div className="text-xs font-semibold">
              <span className="text-emerald-600">Paid 100%</span> • <span className="text-red-500">Due 0%</span>
            </div>
          </div>
          <div className="h-40 bg-[#fffbeb] rounded flex flex-col items-center justify-center text-xs text-gray-400">
            <p className="font-semibold text-gray-700">₹ 45,000 / ₹ 45,000 Paid</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-700" /> Total Fee</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Paid</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> Due</span>
            </div>
          </div>
        </div>

        {/* Fee Reminder Widget */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
          <h4 className="font-bold text-gray-800 text-sm mb-3">Fee Reminder</h4>
          <div className="h-40 flex items-center justify-center text-xs text-gray-400">
            No upcoming fee due for this student.
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden p-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-bold text-gray-800 text-sm">Student Academic Report Card</h3>
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded border border-gray-100 flex justify-between">
                <span>Term 1 Examination:</span>
                <span className="font-bold text-emerald-600">92.4% (Grade A1)</span>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-100 flex justify-between">
                <span>Unit Test 1:</span>
                <span className="font-bold text-emerald-600">48 / 50</span>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-100 flex justify-between">
                <span>Unit Test 2:</span>
                <span className="font-bold text-emerald-600">47 / 50</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
