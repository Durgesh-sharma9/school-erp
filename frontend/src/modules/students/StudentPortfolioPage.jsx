import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
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
  ExternalLink,
  UserPlus,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export function StudentPortfolioPage({ onNavigate }) {
  const { schoolId } = useAuth();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load real students strictly belonging to this school tenant
  const loadStudents = async () => {
    try {
      setLoading(true);
      let localList = tenantStore.getStudents(schoolId) || [];

      // Try fetching from backend API
      try {
        const res = await fetch('/api/students', {
          headers: {
            'x-school-id': schoolId || 'sch_jd_intl'
          }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            localList = json.data;
          }
        }
      } catch {
        // Fallback silently to tenantStore
      }

      setStudents(localList);
      if (localList.length > 0 && !selectedStudent) {
        setSelectedStudent(localList[0]);
      } else if (localList.length === 0) {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error('[StudentPortfolioPage] Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [schoolId]);

  // Filter students for search suggestions
  const matchingStudents = students.filter((s) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    const fullName = (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toLowerCase();
    const adm = String(s.admNo || '').toLowerCase();
    const roll = String(s.rollNo || '').toLowerCase();
    return fullName.includes(q) || adm.includes(q) || roll.includes(q);
  });

  const handleSelectStudent = (std) => {
    setSelectedStudent(std);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Fee calculation for active student from tenantStore
  const receipts = (tenantStore.getReceipts(schoolId) || []).filter(
    (r) => selectedStudent && (r.admNo === selectedStudent.admNo || r.studentName === selectedStudent.name)
  );
  const totalPaid = receipts.reduce((acc, r) => acc + (Number(r.paidAmount) || 0), 0);

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800 space-y-4">
      {/* Top Header Pill matching Live UAB */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded shadow-2xs">
          Student Portfolio
        </span>

        {students.length > 0 && (
          <span className="text-xs text-gray-500 font-medium">
            Total Enrolled: <strong className="text-gray-900">{students.length}</strong>
          </span>
        )}
      </div>

      {/* Global Search Bar with Live Matching Dropdown */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-3 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search student by name, roll no, or admission no..."
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Live Search Suggestions Dropdown */}
        {showSuggestions && searchQuery.trim() && (
          <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-56 overflow-y-auto">
            {matchingStudents.length === 0 ? (
              <div className="p-3 text-xs text-gray-400 text-center">
                No students found matching "{searchQuery}"
              </div>
            ) : (
              matchingStudents.map((s) => {
                const sName = s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student';
                return (
                  <div
                    key={s.id || s.admNo}
                    onClick={() => handleSelectStudent(s)}
                    className="p-2.5 hover:bg-indigo-50/70 border-b border-gray-50 last:border-0 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-800">{sName}</p>
                      <p className="text-[11px] text-gray-500">
                        Adm: #{s.admNo || '-'} • Class: {s.className || 'I'}-{s.section || 'A'}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                      Select
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-xs font-medium">Loading student portfolio...</span>
        </div>
      )}

      {/* Empty State: No Students in Tenant */}
      {!loading && (!selectedStudent || students.length === 0) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-10 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">No Students Registered Yet</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            This school does not have any student records in the database. Once you register students in the Student Registration module, their full 360° portfolio, transportation status, hostel allocation, attendance, and fee ledgers will appear here dynamically.
          </p>
          <button
            type="button"
            onClick={() => onNavigate?.('/student-registration')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register First Student</span>
          </button>
        </div>
      )}

      {/* Dynamic Portfolio View (Only shown when student exists) */}
      {!loading && selectedStudent && (
        <>
          {/* Row 1: 4 Executive Cards matching Live UAB Screenshot Step 1918 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Student Information (Purple Header) */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
              <div className="bg-indigo-600 px-4 py-2 text-white font-bold text-xs tracking-wider uppercase">
                Student Information
              </div>
              <div className="p-4 flex items-center gap-3">
                <div className="w-16 h-16 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  {selectedStudent.photoUrl ? (
                    <img
                      src={selectedStudent.photoUrl}
                      alt="Student"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-700" viewBox="0 0 100 100" fill="currentColor">
                      <polygon points="50,15 85,28 50,40 15,28" fill="#1e293b" />
                      <polygon points="50,40 50,48 80,36 80,28" fill="#0f172a" />
                      <path d="M78,30 Q83,38 82,46" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
                      <circle cx="82" cy="46" r="2.5" fill="#fbbf24" />
                      <circle cx="50" cy="45" r="16" fill="#fbcfe8" />
                      <path d="M42,58 L58,58 L55,70 L45,70 Z" fill="#fbbf24" />
                      <path d="M25,88 C25,65 38,62 50,62 C62,62 75,65 75,88 Z" fill="#1e293b" />
                    </svg>
                  )}
                </div>
                <div className="text-xs space-y-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {selectedStudent.name || `${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim() || 'Student'}
                  </h3>
                  <p className="text-gray-500 font-medium">
                    Class : {selectedStudent.className || 'I'} - {selectedStudent.section || 'A'}
                  </p>
                  <p className="text-gray-500 font-medium">
                    Status : <span className="text-emerald-600 font-semibold">{selectedStudent.status || 'Studying'}</span>
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
                  <span className="font-semibold text-gray-800">
                    {selectedStudent.vehicle || selectedStudent.transportVehicle || 'Not Opted'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle No</span>
                  <span className="font-semibold text-gray-800">
                    {selectedStudent.vehicleNo || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Route</span>
                  <span className="font-semibold text-gray-800">
                    {selectedStudent.route || selectedStudent.transportRoute || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination</span>
                  <span className="font-semibold text-gray-800">
                    {selectedStudent.destination || selectedStudent.pickupPoint || 'None'}
                  </span>
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
                  <span className="font-semibold text-gray-800">
                    {selectedStudent.hostel || selectedStudent.hostelName || 'Not Opted'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Block</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.block || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Floor</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.floor || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.room || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Warden No</span>
                  <span className="font-semibold text-gray-800">{selectedStudent.wardenNo || '-'}</span>
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
                <span className="text-indigo-600">
                  {selectedStudent.attendancePct !== undefined ? `${selectedStudent.attendancePct}%` : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${selectedStudent.attendancePct || 0}%` }}
                />
              </div>
            </div>

            {/* Fees Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-2xs">
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-600">Fees</span>
                <span className="text-emerald-600">
                  {totalPaid > 0 ? 'Recorded' : '₹ 0 Due'}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: totalPaid > 0 ? '100%' : '0%' }}
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
                      <p className="font-bold text-gray-800 truncate">
                        {selectedStudent.fatherName || selectedStudent.fathers_name || '-'}
                      </p>
                      <p className="text-gray-400 text-[11px] font-medium">
                        {selectedStudent.fatherMobile || selectedStudent.fathers_mobile_no || selectedStudent.contactNo || '-'}
                      </p>
                      <p className="text-gray-500 text-[11px]">Father</p>
                    </div>
                  </div>

                  {/* Mother */}
                  <div className="p-3 border border-gray-100 rounded-lg flex items-center gap-3 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="text-xs truncate">
                      <p className="font-bold text-gray-800 truncate">
                        {selectedStudent.motherName || selectedStudent.mothers_name || '-'}
                      </p>
                      <p className="text-gray-400 text-[11px] font-medium">
                        {selectedStudent.motherMobile || selectedStudent.mothers_mobile_no || '-'}
                      </p>
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
                      <p className="font-bold text-gray-800 truncate">
                        {selectedStudent.guardian1Name || selectedStudent.contact_person_name || '-'}
                      </p>
                      <p className="text-gray-400 text-[11px] font-medium">
                        {selectedStudent.guardian1Mobile || selectedStudent.contact_phone_no || '-'}
                      </p>
                      <p className="text-gray-500 text-[11px]">Primary Guardian</p>
                    </div>
                  </div>

                  {/* Guardian 2 */}
                  <div className="p-3 border border-gray-100 rounded-lg flex items-center gap-3 bg-gray-50/50">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="text-xs truncate">
                      <p className="font-bold text-gray-800 truncate">
                        {selectedStudent.guardian2Name || '-'}
                      </p>
                      <p className="text-gray-400 text-[11px] font-medium">
                        {selectedStudent.guardian2Mobile || '-'}
                      </p>
                      <p className="text-gray-500 text-[11px]">Secondary Guardian</p>
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
                <h4 className="font-bold text-gray-800 text-sm">Fees Ledger</h4>
                <div className="text-xs font-semibold">
                  <span className="text-emerald-600">Paid: ₹ {totalPaid.toLocaleString()}</span>
                </div>
              </div>
              <div className="h-40 bg-[#fffbeb] rounded flex flex-col items-center justify-center text-xs text-gray-500 p-4 text-center">
                {totalPaid > 0 ? (
                  <>
                    <p className="font-bold text-gray-800 text-sm">₹ {totalPaid.toLocaleString()} Total Paid</p>
                    <p className="text-gray-500 text-xs mt-1">{receipts.length} receipt(s) on file for this student.</p>
                  </>
                ) : (
                  <p className="text-gray-500">No payment transactions recorded for this student yet.</p>
                )}
              </div>
            </div>

            {/* Fee Reminder Widget */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
              <h4 className="font-bold text-gray-800 text-sm mb-3">Fee Reminder</h4>
              <div className="h-40 flex items-center justify-center text-xs text-gray-400">
                No pending fee reminders or past due notices.
              </div>
            </div>
          </div>
        </>
      )}

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
            <div className="py-8 text-center text-gray-400 text-xs">
              <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-600">No Examination Results Published Yet</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Examination results and term report cards for this student will appear here once entered in the Examination module.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded font-semibold text-xs cursor-pointer"
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
