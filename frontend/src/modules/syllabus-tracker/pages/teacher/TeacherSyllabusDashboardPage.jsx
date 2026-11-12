import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  ArrowRight,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';

export function TeacherSyllabusDashboardPage({ onNavigate }) {
  const [classesData, setClassesData] = useState(null);
  const [progression, setProgression] = useState(null);
  const [cpd, setCpd] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [clsRes, progRes, cpdRes, epRes] = await Promise.all([
        syllabusApi.getTeacherClasses(),
        syllabusApi.getTeacherProgression(),
        syllabusApi.getMyCpd(),
        syllabusApi.listExamPapers(),
      ]);
      setClassesData(clsRes);
      setProgression(progRes);
      setCpd(cpdRes);
      setPapers(epRes || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading && !classesData) {
    return <div className="p-8 text-center text-sm text-slate-400">Loading faculty syllabus dashboard...</div>;
  }

  const classes = classesData?.classes || [];
  const totalChapters = classes.reduce((s, c) => s + (c.totalChapters || 0), 0);
  const completedChapters = classes.reduce((s, c) => s + (c.completedChapters || 0), 0);
  const overallVel = progression?.overallVelocity;
  const activeTerm = progression?.activeTerm;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Faculty Syllabus Workspace — {classesData?.teacher?.name || 'Teacher'}
            </h1>
            <p className="text-xs text-slate-500">Track chapter workflow, schedule pace, question papers &amp; 50h CBSE CPD hours</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate?.('/teacher/syllabus-exam-papers/create')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Create Exam Paper
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('/teacher/syllabus-teacher-training')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" /> My CPD ({cpd?.effectiveTotalHours || 0}/50h)
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Assigned Classes</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{classes.length}</div>
          <div className="text-[11px] text-slate-400">Active sections mapped</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Chapter Completion</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{progression?.overallPercentage || 0}%</div>
          <div className="text-[11px] text-slate-400">{completedChapters} / {totalChapters} chapters completed</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Velocity Status</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            {overallVel?.velocityStatus === 'BEHIND' ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Behind ({overallVel.paceDelta}%)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> {overallVel?.velocityStatus?.replace('_', ' ') || 'ON PACE'} ({overallVel?.paceDelta >= 0 ? `+${overallVel?.paceDelta}` : overallVel?.paceDelta || 0}%)
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target timeline pace: {progression?.targetPercentage || 0}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">My Exam Papers</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{papers.length}</div>
          <div className="text-[11px] text-slate-400">{papers.filter((p) => p.status === 'REVIEWED').length} Approved</div>
        </div>
      </div>

      {/* Term Banner */}
      {activeTerm && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {activeTerm.name}
            </div>
            <div className="text-base font-extrabold">
              {activeTerm.elapsedWorkingDays} / {activeTerm.effectiveWorkingDays} Teaching Days Elapsed ({activeTerm.timeProgressPercentage}% Target Pace)
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.('/teacher/syllabus-academic-timeline')}
            className="px-4 py-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold"
          >
            View School Calendar
          </button>
        </div>
      )}

      {/* Assigned Classes Quick Jump Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">Your Assigned Classes &amp; Subjects</h2>
          <button
            type="button"
            onClick={() => onNavigate?.('/teacher/syllabus-classes')}
            className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            Open All Classes <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-xs text-slate-500">
            No classes assigned yet. Ask Admin to map your subjects in Syllabus Curriculum Builder.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => onNavigate?.(`/teacher/syllabus-classes/${cls.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{cls.label}</h3>
                    <p className="text-[11px] text-slate-500">{cls.subjects.map((s) => s.subjectName).join(' • ')}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    {cls.completionPercentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${cls.completionPercentage}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{cls.completedChapters} / {cls.totalChapters} Chapters Done</span>
                  <span className="text-indigo-600 font-bold inline-flex items-center gap-1">
                    Update Chapters <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
