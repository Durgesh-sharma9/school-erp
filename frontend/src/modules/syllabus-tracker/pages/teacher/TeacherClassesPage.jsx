import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { ChapterWorkflowCard } from '../../components/ChapterWorkflowCard';

export function TeacherClassesPage({ onNavigate }) {
  const [classes, setClasses] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    syllabusApi
      .getTeacherClasses()
      .then((res) => {
        setClasses(res.classes || []);
        setTeacher(res.teacher);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">My Assigned Classes &amp; Chapters</h1>
          <p className="text-xs text-slate-500">Select a class to tick Teaching Done, Q&amp;A Done, and Copy Checked per chapter ({teacher?.name || 'Faculty'})</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading assigned classes...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500">
          No classes or subjects assigned to your profile in the active session yet.
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
                  <p className="text-xs text-slate-500">{cls.subjects.length} Subject(s)</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {cls.completionPercentage}%
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cls.subjects.map((sub) => (
                  <span key={sub.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {sub.subjectName} ({sub.completionPercentage}%)
                  </span>
                ))}
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${cls.completionPercentage}%` }} />
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>{cls.completedChapters} / {cls.totalChapters} Chapters Complete</span>
                <span className="text-indigo-600 font-bold inline-flex items-center gap-1">
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TeacherClassDetailPage({ classId, onNavigate }) {
  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSubs, setExpandedSubs] = useState({});
  const [updatingChId, setUpdatingChId] = useState('');

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await syllabusApi.getTeacherClassDetail(classId);
      setCls(data);
      if (Object.keys(expandedSubs).length === 0 && data.subjects?.[0]) {
        setExpandedSubs({ [data.subjects[0].id]: true });
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) loadDetail();
  }, [classId]);

  const handleToggleStep = async (chapterId, stepKey, nextVal) => {
    try {
      setUpdatingChId(chapterId);
      await syllabusApi.updateChapterProgress(chapterId, { [stepKey]: nextVal });
      await loadDetail();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUpdatingChId('');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate?.('/teacher/syllabus-classes')}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{cls?.label || 'Class Syllabus'}</h1>
            <p className="text-xs text-slate-500">3-Step Chapter Completion Workflow: Teaching Done → Q&amp;A Done → Copy Checked</p>
          </div>
        </div>
        {cls && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
            Overall Progress: {cls.completionPercentage}%
          </span>
        )}
      </div>

      {loading && !cls ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading class chapters...</div>
      ) : !cls ? (
        <div className="p-12 text-center text-sm text-slate-400">Assigned class not found.</div>
      ) : (
        <div className="space-y-4">
          {cls.subjects.map((sub) => {
            const open = Boolean(expandedSubs[sub.id]);
            return (
              <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSubs((p) => ({ ...p, [sub.id]: !open }))}
                  className="w-full px-5 py-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70"
                >
                  <div className="flex items-center gap-2.5">
                    {open ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span className="text-sm font-extrabold text-slate-900">{sub.subjectName}</span>
                    <span className="text-xs text-slate-500">({sub.completedCount} / {sub.chapterCount} Completed)</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                    {sub.completionPercentage}%
                  </span>
                </button>

                {open && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    {sub.chapters.length === 0 ? (
                      <div className="text-center text-xs text-slate-400 py-6">No chapters scheduled under {sub.subjectName} yet.</div>
                    ) : (
                      sub.chapters.map((ch) => (
                        <ChapterWorkflowCard
                          key={ch.id}
                          chapter={ch}
                          updating={updatingChId === ch.id}
                          onToggleStep={handleToggleStep}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
