import React, { useState, useEffect } from 'react';
import { 
  Home,
  CalendarDays, 
  Printer, 
  Download, 
  Clock, 
  User, 
  MapPin, 
  Filter,
  CheckCircle,
  Sparkles,
  BookOpen,
  BarChart3,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function ClassTimetablePage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetableData, setTimetableData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const classesList = ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const sectionsList = ['A', 'B', 'C', 'D'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchTimetable = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/timetable/class?className=${selectedClass}&section=${selectedSection}`, {
        headers: { 'x-school-id': schoolId || 'sch_jd_intl' }
      });
      if (res.ok) {
        const json = await res.json();
        setTimetableData(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [schoolId, selectedClass, selectedSection]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Class & Section Timetable
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/timetable-dashboard')} className="hover:text-indigo-600 transition-colors">
              Timetable Pro
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Class Timetable</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1.5">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1.5">Sec:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {sectionsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="h-9 px-3 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-xs text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Routine</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 print:p-0">
        {/* Quick Module Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
          <button
            onClick={() => onNavigate && onNavigate('/timetable-dashboard')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Dashboard</p>
              <p className="text-[10px] text-slate-400 truncate">Live Metrics</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetables')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Time Tables</p>
              <p className="text-[10px] text-slate-400 truncate">Master routines</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/daily-desk')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Daily Desk</p>
              <p className="text-[10px] text-slate-400 truncate">Substitutions</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-builder')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Visual Editor</p>
              <p className="text-[10px] text-slate-400 truncate">Interactive builder</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/lesson-planning')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Lesson Plans</p>
              <p className="text-[10px] text-slate-400 truncate">Curriculum tracker</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('/timetable-reports')}
            className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left shadow-2xs hover:shadow-xs transition-all flex items-center space-x-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800">Reports & Logs</p>
              <p className="text-[10px] text-slate-400 truncate">Teacher activity</p>
            </div>
          </button>
        </div>

        {/* Printable Sheet Header */}
        <div className="hidden print:block text-center border-b border-slate-300 pb-3 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">{schoolName || 'J D International School'}</h2>
          <p className="text-sm font-semibold text-slate-700">Official Class Timetable - Academic Session 2026-27</p>
          <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-800 border border-slate-300">
            Class: {selectedClass} | Section: {selectedSection}
          </div>
        </div>

        {/* Timetable Matrix Grid */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between print:hidden">
            <div>
              <h2 className="font-bold text-sm text-slate-800">Weekly Schedule - Class {selectedClass} (Section {selectedSection})</h2>
              <p className="text-xs text-slate-400">Master period and faculty allocation</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Active Routine
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3 w-28 border-r border-slate-200">Day / Period</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                    <th key={p} className="p-3 text-center border-r border-slate-200">
                      <div className="font-bold text-slate-800">Period {p}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {p === 1 ? '08:00 - 08:45' : p === 2 ? '08:45 - 09:30' : p === 3 ? '09:30 - 10:15' : p === 4 ? '10:15 - 11:00' : p === 5 ? '11:45 - 12:30' : p === 6 ? '12:30 - 01:15' : p === 7 ? '01:15 - 02:00' : '02:00 - 02:45'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {days.map((day) => (
                  <tr key={day} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/40">
                      {day}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                      <td key={period} className="p-2 border-r border-slate-200 text-center">
                        <div className="p-2 rounded-lg bg-indigo-50/40 border border-indigo-100 space-y-0.5">
                          <p className="font-bold text-xs text-indigo-900">
                            {period === 1 ? 'Mathematics' : period === 2 ? 'Physics' : period === 3 ? 'English Core' : period === 4 ? 'Chemistry' : period === 5 ? 'Biology' : period === 6 ? 'Computer Sci' : period === 7 ? 'Social Science' : 'Physical Ed.'}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
                            <User className="w-2.5 h-2.5" />
                            {period === 1 ? 'Dr. Sharma' : period === 2 ? 'Prof. Anita' : period === 3 ? 'Ms. Kavita' : period === 4 ? 'Mr. Verma' : period === 5 ? 'Dr. Mehta' : period === 6 ? 'Mr. Rahul' : period === 7 ? 'Mrs. Sunita' : 'Coach Rajesh'}
                          </p>
                          <p className="text-[9px] text-slate-400">Room 102</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassTimetablePage;
