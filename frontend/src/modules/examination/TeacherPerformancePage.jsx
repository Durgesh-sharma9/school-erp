import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Printer,
  FileDown,
  Star,
  Activity,
  Briefcase,
  TrendingUp,
  Clock,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';

const TEACHERS = [
  {
    id: 'tch_1',
    name: 'Mrs. Sunita Verma',
    designation: 'Senior TGT Mathematics',
    department: 'Teaching (Secondary & Middle)',
    classes: 'Class I - A, Class IX - A',
    subjects: 'Mathematics, Science',
    experience: '8 Years',
    passRate: '98.5%',
    studentRating: '4.9',
    syllabusCovered: '92%',
    biometricPunctuality: '99.2%',
    appraisalScore: 'Grade A+ (Exceptional)',
    feedbackCount: 34
  },
  {
    id: 'tch_2',
    name: 'Mr. Rajesh Goyal',
    designation: 'PGT English & Literature',
    department: 'Teaching (Secondary)',
    classes: 'Class X - A, Class IX - B',
    subjects: 'English Language & Phonics',
    experience: '11 Years',
    passRate: '97.2%',
    studentRating: '4.8',
    syllabusCovered: '90%',
    biometricPunctuality: '98.6%',
    appraisalScore: 'Grade A+ (Outstanding)',
    feedbackCount: 28
  },
  {
    id: 'tch_3',
    name: 'Mrs. Kavita Sharma',
    designation: 'PRT Primary Educator',
    department: 'Primary Section',
    classes: 'Nursery, Class I - B',
    subjects: 'Hindi, EVS, Art',
    experience: '5 Years',
    passRate: '99.0%',
    studentRating: '4.9',
    syllabusCovered: '95%',
    biometricPunctuality: '99.5%',
    appraisalScore: 'Grade A+ (Star Faculty)',
    feedbackCount: 42
  }
];

export function TeacherPerformancePage({ onNavigate }) {
  const { schoolId } = useAuth();
  const effectiveSchoolId = schoolId || 'sch_jd_intl';

  const [selectedTeacherId, setSelectedTeacherId] = useState(TEACHERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTeacher = useMemo(() => {
    return TEACHERS.find(t => t.id === selectedTeacherId) || TEACHERS[0];
  }, [selectedTeacherId]);

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
            <span className="text-indigo-600 font-semibold">Teacher Performance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Faculty Appraisal & Teacher Performance Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor syllabus pace, classroom test pass rates, student feedback scores, and biometric attendance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print Appraisal Sheet
          </button>
        </div>
      </div>

      {/* Teacher Selector Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Select Faculty Member:
          </span>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 max-w-sm w-full"
          >
            {TEACHERS.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} &bull; {t.designation}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>Dept: <strong className="text-slate-900">{activeTeacher.department}</strong></span>
          <span>&bull;</span>
          <span>Subjects: <strong className="text-slate-900">{activeTeacher.subjects}</strong></span>
          <span>&bull;</span>
          <span>Experience: <strong className="text-indigo-700 font-bold">{activeTeacher.experience}</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Class Pass Rate</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{activeTeacher.passRate}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Student Rating</span>
            <div className="flex items-center gap-1 text-2xl font-bold text-amber-500 mt-1">
              <span>{activeTeacher.studentRating}</span>
              <span className="text-lg">★</span>
              <span className="text-xs text-slate-400 font-normal">({activeTeacher.feedbackCount})</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Syllabus Completion</span>
            <div className="text-2xl font-bold text-indigo-600 mt-1">{activeTeacher.syllabusCovered}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Biometric Punctuality</span>
            <div className="text-2xl font-bold text-purple-600 mt-1">{activeTeacher.biometricPunctuality}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Classroom Results Under this Faculty */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Assigned Classes & Academic Outcome Analytics
            </h3>
            <p className="text-xs text-slate-500">
              Exam and daily test outcomes for batches assigned to {activeTeacher.name}.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            {activeTeacher.appraisalScore}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Class & Section</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Enrolled Students</th>
                <th className="py-3 px-3 text-center">Batch Pass Rate</th>
                <th className="py-3 px-3 text-center">Class Average</th>
                <th className="py-3 px-3 text-center">Daily Tests Held</th>
                <th className="py-3 px-4 text-center">Evaluation Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-bold text-slate-900">Class I - A</td>
                <td className="py-3 px-3 font-semibold text-indigo-700">Mathematics</td>
                <td className="py-3 px-3 text-center font-mono">45</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-600 font-mono">98.5%</td>
                <td className="py-3 px-3 text-center font-mono">82.4%</td>
                <td className="py-3 px-3 text-center font-mono">14 Tests</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                    5.0 ★ Outstanding
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-bold text-slate-900">Class IX - A</td>
                <td className="py-3 px-3 font-semibold text-indigo-700">Science</td>
                <td className="py-3 px-3 text-center font-mono">42</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-600 font-mono">97.6%</td>
                <td className="py-3 px-3 text-center font-mono">79.8%</td>
                <td className="py-3 px-3 text-center font-mono">12 Tests</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                    4.8 ★ Commendable
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation & Principal Remarks */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          Annual Principal & Academic Coordinator Observations
        </h4>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          "{activeTeacher.name} demonstrates exemplary pedagogy, punctual class conduction, and attentive mentoring. Her batches consistently outperform in term exams, and parent-student feedback remains consistently above 4.8 stars throughout academic session 2026-2027."
        </div>
      </div>
    </div>
  );
}
