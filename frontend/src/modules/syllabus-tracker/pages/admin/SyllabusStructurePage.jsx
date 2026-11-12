import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit3,
  Link2,
  UserCheck,
  ChevronsDownUp,
  Loader2,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { ImportDataButton } from '../../components/SessionImportDialogs';
import { ChapterWorkflowCard } from '../../components/ChapterWorkflowCard';
import { SyllabusSessionBanner } from '../../components/SyllabusSessionBanner';

export function SyllabusStructurePage() {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [termTag, setTermTag] = useState('ALL');
  const [expandedClasses, setExpandedClasses] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Chapter modal
  const [chapterModal, setChapterModal] = useState({ open: false, mode: 'create', classSubjectId: '', chapter: null });
  const [chForm, setChForm] = useState({ chapterNo: 1, name: '', termTag: 'Term 1', description: '' });

  // Link Subject to Class modal (uses ERP Master classes, subjects & teachers!)
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ classId: '', className: '', subjectName: '', teacherId: '', teacherName: '' });
  const [saving, setSaving] = useState(false);

  const loadTree = async () => {
    try {
      setLoading(true);
      const data = await syllabusApi.getSyllabusTree({ search, termTag });
      setTreeData(data);
      // Auto expand first class on initial load
      if (Object.keys(expandedClasses).length === 0 && data.classes?.length > 0) {
        const firstCls = data.classes[0];
        setExpandedClasses({ [firstCls.id]: true });
        if (firstCls.subjects?.[0]) {
          setExpandedSubjects({ [firstCls.subjects[0].id]: true });
        }
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
    const sync = () => loadTree();
    window.addEventListener('syllabus-session-changed', sync);
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, [termTag]);

  const toggleAll = (expand) => {
    const clsMap = {};
    const subMap = {};
    (treeData?.classes || []).forEach((c) => {
      clsMap[c.id] = expand;
      (c.subjects || []).forEach((s) => {
        subMap[s.id] = expand;
      });
    });
    setExpandedClasses(clsMap);
    setExpandedSubjects(subMap);
  };

  const openAddChapter = (cs) => {
    const nextNo = (cs.chapters?.length || 0) + 1;
    setChForm({ chapterNo: nextNo, name: '', termTag: 'Term 1', description: '' });
    setChapterModal({ open: true, mode: 'create', classSubjectId: cs.id, chapter: null });
  };

  const openEditChapter = (ch) => {
    setChForm({ chapterNo: ch.chapterNo, name: ch.name, termTag: ch.termTag || 'Term 1', description: ch.description || '' });
    setChapterModal({ open: true, mode: 'edit', classSubjectId: ch.classSubjectId, chapter: ch });
  };

  const handleSaveChapter = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (chapterModal.mode === 'create') {
        await syllabusApi.createChapter({ ...chForm, classSubjectId: chapterModal.classSubjectId });
        toast.success('Chapter added to syllabus');
      } else {
        await syllabusApi.updateChapter(chapterModal.chapter.id, chForm);
        toast.success('Chapter updated');
      }
      setChapterModal({ open: false, mode: 'create', classSubjectId: '', chapter: null });
      await loadTree();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChapter = async (chId) => {
    if (!window.confirm('Delete this chapter from syllabus?')) return;
    try {
      await syllabusApi.deleteChapter(chId);
      toast.success('Chapter deleted');
      await loadTree();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAssignTeacher = async (csId, teacherId) => {
    const tObj = (treeData?.availableTeachers || []).find((t) => t.id === teacherId);
    try {
      await syllabusApi.updateSubjectTeacher(csId, {
        teacherId: tObj?.id || teacherId,
        teacherName: tObj?.name || 'Unassigned',
      });
      toast.success(`Assigned ${tObj?.name || 'Teacher'} successfully`);
      await loadTree();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLinkSubject = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await syllabusApi.linkSubjectToClass(linkForm);
      toast.success('Subject mapped from ERP Master into Syllabus Tree');
      setLinkModalOpen(false);
      await loadTree();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleWorkflowStep = async (chapterId, key, val) => {
    try {
      await syllabusApi.updateChapterProgress(chapterId, { [key]: val });
      await loadTree();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const classes = treeData?.classes || [];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Syllabus Curriculum Builder</h1>
              <SyllabusSessionBanner onSessionReload={loadTree} />
            </div>
            <p className="text-xs text-slate-500">Organize Class → Subject → Chapter roadmap synced with ERP Class, Subject &amp; Teacher Masters</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ImportDataButton importType="syllabus" label="Import Past Syllabus" onSuccess={loadTree} />
          <button
            type="button"
            onClick={() => {
              const firstCls = treeData?.availableClasses?.[0];
              const firstSub = treeData?.availableSubjects?.[0];
              const firstTea = treeData?.availableTeachers?.[0];
              setLinkForm({
                classId: firstCls?.id || '',
                className: firstCls?.label || '',
                subjectName: firstSub?.name || '',
                teacherId: firstTea?.id || '',
                teacherName: firstTea?.name || '',
              });
              setLinkModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Link2 className="w-3.5 h-3.5" /> Link ERP Subject to Class
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') loadTree(); }}
              placeholder="Search class, subject, chapter or teacher..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-xs"
            />
          </div>
          <button type="button" onClick={loadTree} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold">
            Search
          </button>

          <select
            value={termTag}
            onChange={(e) => setTermTag(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => toggleAll(true)} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1">
            <ChevronsDownUp className="w-3.5 h-3.5" /> Expand All
          </button>
          <button type="button" onClick={() => toggleAll(false)} className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree */}
      {loading && !treeData ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading syllabus tree...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">No Syllabus Nodes Found</div>
          <p className="text-xs text-slate-500">Click "Link ERP Subject to Class" or "Import Past Syllabus" to build your curriculum.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => {
            const clsOpen = Boolean(expandedClasses[cls.id]);
            return (
              <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedClasses((prev) => ({ ...prev, [cls.id]: !clsOpen }))}
                  className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {clsOpen ? <ChevronDown className="w-4 h-4 text-indigo-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span className="font-extrabold text-sm text-slate-900">{cls.label}</span>
                    {cls.fromErpMaster && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">Synced from ERP Class Master</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-500">{cls.subjects?.length || 0} Subjects</span>
                </button>

                {clsOpen && (
                  <div className="p-4 space-y-3 border-t border-slate-100">
                    {(cls.subjects || []).length === 0 ? (
                      <div className="text-xs text-slate-400 py-4 text-center">
                        No subjects mapped to {cls.label} yet. Use "Link ERP Subject to Class" above to attach subjects.
                      </div>
                    ) : (
                      cls.subjects.map((sub) => {
                        const subOpen = Boolean(expandedSubjects[sub.id]);
                        return (
                          <div key={sub.id} className="rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-4 py-3 bg-white flex flex-wrap items-center justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => setExpandedSubjects((prev) => ({ ...prev, [sub.id]: !subOpen }))}
                                className="flex items-center gap-2 text-left"
                              >
                                {subOpen ? <ChevronDown className="w-4 h-4 text-indigo-600" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                <span className="font-bold text-xs sm:text-sm text-slate-900">{sub.subjectName}</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                  {sub.chapterCount} Ch • {sub.completionPercentage}% Done
                                </span>
                              </button>

                              <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1 bg-slate-50 text-[11px]">
                                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                                  <select
                                    value={sub.teacherId || ''}
                                    onChange={(e) => handleAssignTeacher(sub.id, e.target.value)}
                                    className="bg-transparent font-bold text-slate-700 outline-none"
                                  >
                                    <option value="">Assign ERP Teacher...</option>
                                    {(treeData?.availableTeachers || []).map((t) => (
                                      <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openAddChapter(sub)}
                                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold inline-flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Chapter
                                </button>
                              </div>
                            </div>

                            {subOpen && (
                              <div className="p-3 bg-slate-50/50 border-t border-slate-100 space-y-2.5">
                                {sub.chapters.length === 0 ? (
                                  <div className="text-center text-xs text-slate-400 py-4">No chapters yet. Click "Add Chapter" above.</div>
                                ) : (
                                  sub.chapters.map((ch) => (
                                    <div key={ch.id} className="space-y-1">
                                      <div className="flex justify-end gap-1.5">
                                        <button type="button" onClick={() => openEditChapter(ch)} className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                                          <Edit3 className="w-3 h-3" /> Edit
                                        </button>
                                        <button type="button" onClick={() => handleDeleteChapter(ch.id)} className="text-[11px] font-bold text-rose-600 hover:underline inline-flex items-center gap-1">
                                          <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                      </div>
                                      <ChapterWorkflowCard chapter={ch} onToggleStep={handleToggleWorkflowStep} />
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Chapter Create / Edit Modal */}
      {chapterModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveChapter} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">{chapterModal.mode === 'create' ? 'Add Syllabus Chapter' : 'Edit Chapter'}</h3>
              <button type="button" onClick={() => setChapterModal({ open: false, mode: 'create', classSubjectId: '', chapter: null })}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chapter No *</label>
                <input type="number" min="1" value={chForm.chapterNo} onChange={(e) => setChForm((f) => ({ ...f, chapterNo: Number(e.target.value) }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Term Tag</label>
                <select value={chForm.termTag} onChange={(e) => setChForm((f) => ({ ...f, termTag: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Title *</label>
              <input type="text" value={chForm.name} onChange={(e) => setChForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. Quadratic Equations" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description / Learning Outcomes</label>
              <textarea rows={2} value={chForm.description} onChange={(e) => setChForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setChapterModal({ open: false, mode: 'create', classSubjectId: '', chapter: null })} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Chapter
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Link ERP Subject to Class Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleLinkSubject} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Link ERP Subject &amp; Teacher to Class</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
              <select
                value={linkForm.classId}
                onChange={(e) => {
                  const c = (treeData?.availableClasses || []).find((x) => x.id === e.target.value);
                  setLinkForm((f) => ({ ...f, classId: e.target.value, className: c?.label || '' }));
                }}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
              >
                <option value="">Select Class...</option>
                {(treeData?.availableClasses || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject Name *</label>
              <input
                list="erp-subjects-list"
                value={linkForm.subjectName}
                onChange={(e) => setLinkForm((f) => ({ ...f, subjectName: e.target.value }))}
                placeholder="Pick ERP subject or type..."
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
              />
              <datalist id="erp-subjects-list">
                {(treeData?.availableSubjects || []).map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ERP Teacher</label>
              <select
                value={linkForm.teacherId}
                onChange={(e) => {
                  const t = (treeData?.availableTeachers || []).find((x) => x.id === e.target.value);
                  setLinkForm((f) => ({ ...f, teacherId: e.target.value, teacherName: t?.name || '' }));
                }}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
              >
                <option value="">Select Teacher...</option>
                {(treeData?.availableTeachers || []).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setLinkModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">Attach Subject</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
