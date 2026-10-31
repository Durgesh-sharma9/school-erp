import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Printer,
  FileDown,
  User,
  Sparkles,
  BarChart2,
  Star,
  Activity,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

export function StudentPerformancePage({ onNavigate }) {
  const { schoolId } = useAuth();
  const effectiveSchoolId = schoolId || 'sch_jd_intl';

  const [students, setStudents] = useState([]);
  const [selectedStudentAdm, setSelectedStudentAdm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');

  useEffect(() => {
    const list = tenantStore.getStudents(effectiveSchoolId) || [];
    setStudents(list);
    if (list.length > 0 && !selectedStudentAdm) {
      setSelectedStudentAdm(list[0].admNo || list[0].admissionNo);
    }
  }, [effectiveSchoolId]);

  // Active student object
  const activeStudent = useMemo(() => {
    return students.find(s => (s.admNo || s.admissionNo) === selectedStudentAdm) || students[0] || {
      name: 'Dev Sharma',
      admNo: '1002',
      className: 'Class I - A',
      srNo: '1002',
      fatherName: 'Rajesh Sharma'
    };
  }, [students, selectedStudentAdm]);

  // Subject Performance Breakdown for Active Student
  const subjectScores = [
    { subject: 'Mathematics', periodicTest: '19/20', halfYearly: '94/100', classAverage: '81%', grade: 'A1', trend: '+4.2% 📈', status: 'Excellent' },
    { subject: 'English & Phonics', periodicTest: '18/20', halfYearly: '92/100', classAverage: '84%', grade: 'A1', trend: '+2.8% 📈', status: 'Consistent' },
    { subject: 'Hindi & Kavita', periodicTest: '17/20', halfYearly: '88/100', classAverage: '79%', grade: 'A2', trend: '+1.5% 📈', status: 'Good' },
    { subject: 'Environmental Studies (EVS)', periodicTest: '20/20', halfYearly: '96/100', classAverage: '85%', grade: 'A1', trend: '+5.0% 📈', status: 'Top Performer' },
    { subject: 'Art & Craft', periodicTest: '19/20', halfYearly: '95/100', classAverage: '88%', grade: 'A1', trend: 'Stable ➡️', status: 'Creative' }
  ];

  const overallAvg = '93.0%';
  const classRank = 'Rank 1 / 45';

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={() => onNavigate?.('/dashboard')}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </button>
            <span>/</span>
            <span>Performance Analytics</span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Student Performance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            360° Comprehensive Student Academic Performance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic report cards, test benchmarks, subject trends, and learning progress analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print Evaluation
          </button>
        </div>
      </div>

      {/* Student Selector Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-600" />
            Select Student:
          </span>
          <select
            value={selectedStudentAdm}
            onChange={(e) => setSelectedStudentAdm(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-sm w-full"
          >
            {students.map(s => (
              <option key={s.admNo || s.admissionNo} value={s.admNo || s.admissionNo}>
                {s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()} (Adm: {s.admNo || s.admissionNo}, Class: {s.className})
              </option>
            ))}
            {students.length === 0 && (
              <option value="1002">Dev Sharma (Adm: 1002, Class I - A)</option>
            )}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>Class: <strong className="text-slate-900">{activeStudent.className || 'Class I - A'}</strong></span>
          <span>&bull;</span>
          <span>Father: <strong className="text-slate-900">{activeStudent.fatherName || 'Rajesh Sharma'}</strong></span>
          <span>&bull;</span>
          <span>Session: <strong className="text-indigo-700 font-bold">2026-2027</strong></span>
        </div>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Cumulative Average</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{overallAvg}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Classroom Standing</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{classRank}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Biometric Attendance</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">98.4%</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Conduct & Discipline</span>
            <div className="text-2xl font-bold text-purple-600 mt-1">Grade A+</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Subject Performance Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Subject-Wise Exam & Daily Test Score Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Benchmark comparison against class average and grade criteria.
            </p>
          </div>
          <span className="text-xs text-indigo-700 bg-indigo-50 font-bold px-2.5 py-1 rounded-md">
            Academic Status: Distinction
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-3 text-center">Unit / Daily Tests</th>
                <th className="py-3 px-3 text-center">Term / Exam Score</th>
                <th className="py-3 px-3 text-center">Class Average</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Learning Trajectory</th>
                <th className="py-3 px-4 text-center">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {subjectScores.map((sub, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{sub.subject}</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">{sub.periodicTest}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">{sub.halfYearly}</td>
                  <td className="py-3 px-3 text-center text-slate-500 font-mono">{sub.classAverage}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">{sub.trend}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holistic Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Academic Strengths
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Exceptional calculation accuracy and analytical problem-solving in Mathematics.</li>
            <li>Consistent 100% submission rate in daily homework and science projects.</li>
            <li>Active classroom curiosity, phonics expression, and peer collaboration.</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Targeted Focus & Recommendations
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Encourage daily Hindi handwriting and cursive sentence practice.</li>
            <li>Incorporate competitive Olympiad sample test exercises weekly.</li>
            <li>Active participation in inter-school storytelling and stage recitation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
