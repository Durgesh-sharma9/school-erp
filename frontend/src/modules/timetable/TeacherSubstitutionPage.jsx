import React, { useState, useEffect } from 'react';
import { 
  UserX, 
  UserCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Sparkles,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export function TeacherSubstitutionPage() {
  const { schoolId } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubstitutes, setSelectedSubstitutes] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/substitutions`, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  const handleAssign = async (absentTeacher, period, time, className, subject) => {
    const assignedSubstitute = selectedSubstitutes[`${absentTeacher}-${period}`] || (data?.freeTeachers[0]?.name);
    if (!assignedSubstitute) {
      toast.error('Please select an available teacher');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/timetable/assign-substitution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify({
          absentTeacher,
          period,
          time,
          className,
          subject,
          assignedSubstitute
        })
      });

      if (res.ok) {
        toast.success(`Assigned ${assignedSubstitute} for Period ${period} (${className})! Notification dispatched.`);
        fetchData();
      }
    } catch {
      toast.error('Failed to assign substitute');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserX className="w-6 h-6 text-rose-600" />
            Teacher Absence & Smart Substitution Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect vacant classroom periods caused by faculty leave and auto-assign free teachers conflict-free.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> 1 Teacher On Leave Today
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Vacant Periods Needing Substitution */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Vacant Class Periods Requiring Coverage
            </h2>

            {data.absentTeachers.map((absent) => (
              <div key={absent.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{absent.name} ({absent.code})</h3>
                    <p className="text-xs text-slate-500">Department: {absent.department} &bull; Reason: <span className="font-semibold text-rose-600">{absent.leaveType}</span></p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700">
                    {absent.affectedPeriods.length} Classes Affected
                  </span>
                </div>

                <div className="space-y-3">
                  {absent.affectedPeriods.map((item) => {
                    const key = `${absent.name}-${item.period}`;
                    const isAlreadyAssigned = data.activeSubstitutions.some(s => s.absentTeacher === absent.name && s.period === item.period);

                    return (
                      <div key={item.period} className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                              Period {item.period}
                            </span>
                            <span className="text-xs font-bold text-slate-800">{item.class}</span>
                            <span className="text-xs text-slate-500">&bull; {item.subject}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.time}
                          </p>
                        </div>

                        {/* Substitution Selector */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isAlreadyAssigned ? (
                            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" /> Covered by {data.activeSubstitutions.find(s => s.absentTeacher === absent.name && s.period === item.period)?.assignedSubstitute}
                            </span>
                          ) : (
                            <>
                              <select
                                value={selectedSubstitutes[key] || ''}
                                onChange={(e) => setSelectedSubstitutes({ ...selectedSubstitutes, [key]: e.target.value })}
                                className="text-xs border border-slate-300 rounded-lg py-1.5 px-2.5 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="">Select Free Teacher...</option>
                                {data.freeTeachers
                                  .filter(t => t.freePeriods.includes(item.period))
                                  .map(t => (
                                    <option key={t.id} value={t.name}>
                                      🟢 {t.name} ({t.department})
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => handleAssign(absent.name, item.period, item.time, item.class, item.subject)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" /> Assign
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Col: Available Free Teachers & Active Substitutions Feed */}
          <div className="space-y-6">
            {/* Free Teachers Available */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Available Free Faculty
              </h2>
              <p className="text-[11px] text-slate-500">Teachers with free slots in current timetable today.</p>
              <div className="space-y-2 pt-1">
                {data.freeTeachers.map(t => (
                  <div key={t.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.department}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Free Periods: {t.freePeriods.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Substitution Log */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Assigned Substitutions Log
              </h2>
              <div className="space-y-2 pt-1 text-xs">
                {data.activeSubstitutions.map(sub => (
                  <div key={sub.id} className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-900">{sub.assignedSubstitute}</span>
                      <span className="text-[10px] font-mono text-slate-400">{sub.notifiedAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Taking <span className="font-semibold text-slate-800">{sub.class}</span> for <span className="text-slate-500">{sub.absentTeacher}</span> (Period {sub.period})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
