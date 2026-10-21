import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Printer, 
  Download, 
  Clock, 
  User, 
  MapPin, 
  Filter,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function ClassTimetablePage() {
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
      const res = await fetch(`http://localhost:5000/api/timetable/class?className=${selectedClass}&section=${selectedSection}`, {
        headers: { 'x-school-id': schoolId }
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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Class & Section Master Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Period-wise daily schedule, designated subject faculty, and laboratory room allocations.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {classesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {sectionsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Routine
          </button>
        </div>
      </div>

      {/* Printable Sheet Header */}
      <div className="hidden print:block text-center border-b border-slate-300 pb-3 mb-4">
        <h2 className="text-xl font-bold text-slate-900">{schoolName}</h2>
        <p className="text-sm font-semibold text-slate-700">Official Class Routine: Class {selectedClass} - Section {selectedSection} (Session 2026-2027)</p>
      </div>

      {/* Timetable Matrix Grid */}
      {timetableData && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3.5 w-24 text-center border-r border-slate-200">Day</th>
                  {timetableData.periodSlots.map((slot, idx) => (
                    <th key={idx} className="py-2.5 px-3 text-center border-r border-slate-200 last:border-r-0 min-w-[120px]">
                      <div className="font-bold text-slate-800">{slot.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">{slot.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                {days.map((day) => {
                  const dayPeriods = timetableData.schedule[day] || [];
                  return (
                    <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900 bg-slate-50/70 border-r border-slate-200 text-center">
                        {day}
                      </td>

                      {/* Period 1 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 1)} />
                      </td>

                      {/* Period 2 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 2)} />
                      </td>

                      {/* Period 3 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 3)} />
                      </td>

                      {/* Period 4 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 4)} />
                      </td>

                      {/* Recess Break */}
                      <td className="p-2 border-r border-slate-200 text-center bg-amber-50/40 select-none">
                        <div className="text-[10px] font-bold text-amber-800 tracking-wider uppercase rotate-0">
                          Recess / Lunch
                        </div>
                      </td>

                      {/* Period 5 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 5)} />
                      </td>

                      {/* Period 6 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 6)} />
                      </td>

                      {/* Period 7 */}
                      <td className="p-2 border-r border-slate-200 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 7)} />
                      </td>

                      {/* Period 8 */}
                      <td className="p-2 text-center">
                        <PeriodCell cell={dayPeriods.find(p => p.period === 8)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Notes */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium print:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Zero teacher-conflict guarantee enabled. Changes immediately synchronize to Teacher & Student Portals.</span>
        </div>
        <span className="font-semibold text-slate-700">8 Periods &bull; 40 min each &bull; 30 min Lunch</span>
      </div>
    </div>
  );
}

function PeriodCell({ cell }) {
  if (!cell) {
    return (
      <div className="h-14 flex items-center justify-center text-slate-300 text-[11px] italic">
        Free Period
      </div>
    );
  }

  return (
    <div className="h-16 flex flex-col justify-between p-1.5 rounded-lg bg-indigo-50/60 border border-indigo-100 hover:border-indigo-300 transition-all text-left">
      <div className="font-bold text-indigo-950 text-[11.5px] truncate leading-tight">
        {cell.subject}
      </div>
      <div className="text-[10.5px] text-slate-600 font-medium truncate flex items-center gap-1">
        <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
        {cell.teacher}
      </div>
      <div className="text-[9.5px] text-slate-400 font-mono truncate flex items-center gap-1">
        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
        {cell.room}
      </div>
    </div>
  );
}
