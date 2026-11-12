import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function TeacherAcademicTimelinePage() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    syllabusApi
      .listAcademicTerms()
      .then((res) => setTerms(res.terms || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const currentTerm = terms[0] || null;

  const months = useMemo(() => {
    if (!currentTerm?.calendarDays?.length) return [];
    const map = new Map();
    currentTerm.calendarDays.forEach((d) => {
      const key = d.date.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(d);
    });
    return Array.from(map.entries()).map(([key, days]) => {
      const [yr, mo] = key.split('-').map(Number);
      return { key, label: `${MONTH_NAMES[mo - 1]} ${yr}`, days };
    });
  }, [currentTerm]);

  const getColor = (kind) => {
    switch (kind) {
      case 'VACATION': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'INDIAN_HOLIDAY': return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'HOLIDAY': return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'WEEKLY_OFF': return 'bg-slate-100 text-slate-400 border-slate-200';
      default: return 'bg-emerald-50 text-emerald-900 border-emerald-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Academic Calendar &amp; Teaching Days</h1>
          <p className="text-xs text-slate-500">Official school teaching schedule, gazetted holidays, and term vacation breaks</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading academic calendar...</div>
      ) : !currentTerm ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500">
          Academic calendar has not been published by Admin yet.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] font-bold text-slate-500">Session Dates</div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">{currentTerm.startDate} → {currentTerm.endDate}</div>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-200 p-4">
              <div className="text-[11px] font-bold text-emerald-700">Teaching Days Elapsed</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">{currentTerm.elapsedWorkingDays} / {currentTerm.effectiveWorkingDays}</div>
            </div>
            <div className="bg-white rounded-2xl border border-indigo-200 p-4">
              <div className="text-[11px] font-bold text-indigo-700">Target Syllabus Pace</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">{currentTerm.timeProgressPercentage}%</div>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 p-4">
              <div className="text-[11px] font-bold text-amber-700">Holidays &amp; Vacations</div>
              <div className="text-2xl font-black text-amber-800 mt-1">{currentTerm.holidayDays + currentTerm.vacationDays}d</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-600 border-b border-slate-100 pb-3">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" /> Teaching Day</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block" /> Weekly Off</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block" /> Indian Holiday</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" /> Vacation</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 inline-block" /> Declared Holiday</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {months.map((m) => {
                const pad = m.days[0]?.dow || 0;
                return (
                  <div key={m.key} className="rounded-xl border border-slate-200 p-3 bg-slate-50/40">
                    <div className="text-xs font-extrabold text-slate-800 mb-2">{m.label}</div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                      {WEEKDAYS.map((w, idx) => <div key={idx}>{w}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: pad }).map((_, i) => <div key={`p_${i}`} />)}
                      {m.days.map((d) => (
                        <div
                          key={d.date}
                          title={`${d.date}: ${d.label || 'Teaching Day'}`}
                          className={`h-7 rounded-md border text-[11px] font-bold flex items-center justify-center ${getColor(d.dayKind)}`}
                        >
                          {Number(d.date.slice(8, 10))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
