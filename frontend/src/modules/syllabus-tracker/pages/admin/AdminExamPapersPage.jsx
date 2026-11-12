import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Eye,
  Trash2,
  Download,
  Sliders,
  ListChecks,
  Plus,
  X,
  Upload,
  Loader2,
  Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { ExamPaperPreviewModal } from '../../components/ExamPaperLivePreview';
import { generateExamPaperPdf, downloadBlob } from '../../utils/pdfGenerator';
import { SyllabusSessionBanner } from '../../components/SyllabusSessionBanner';

export function AdminExamPapersPage({ onNavigate }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [previewPaper, setPreviewPaper] = useState(null);

  // Modals
  const [templateOpen, setTemplateOpen] = useState(false);
  const [template, setTemplate] = useState({
    schoolName: '',
    logoUrl: '',
    defaultTemplateType: 'SINGLE',
    defaultFontFamily: 'Times New Roman',
    defaultFontSize: '11pt',
    defaultColor: '#0f172a',
    showTeacherName: true,
  });
  const [examNamesOpen, setExamNamesOpen] = useState(false);
  const [examNames, setExamNames] = useState([]);
  const [newExamName, setNewExamName] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [list, tpl, names] = await Promise.all([
        syllabusApi.listExamPapers({ status: statusFilter === 'ALL' ? '' : statusFilter, search }),
        syllabusApi.getExamTemplate(),
        syllabusApi.getExamNames(),
      ]);
      setPapers(list || []);
      if (tpl) setTemplate(tpl);
      setExamNames(names || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const sync = () => loadAll();
    window.addEventListener('syllabus-session-changed', sync);
    return () => window.removeEventListener('syllabus-session-changed', sync);
  }, [statusFilter]);

  const handleMarkReviewed = async (paper) => {
    const nextStatus = paper.status === 'REVIEWED' ? 'SUBMITTED' : 'REVIEWED';
    try {
      await syllabusApi.updateExamPaper(paper.id, { status: nextStatus });
      toast.success(nextStatus === 'REVIEWED' ? 'Paper approved & marked Reviewed!' : 'Returned to Submitted status');
      await loadAll();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question paper?')) return;
    try {
      await syllabusApi.deleteExamPaper(id);
      toast.success('Paper deleted');
      await loadAll();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDownloadPdf = async (paper) => {
    try {
      const merged = { ...paper, schoolName: template?.schoolName || paper.schoolName, logoUrl: template?.logoUrl || paper.logoUrl };
      const blob = await generateExamPaperPdf(merged);
      downloadBlob(blob, `${(paper.subjectName || 'Paper').replace(/\s+/g, '_')}_${paper.className}.pdf`);
      toast.success('PDF generated!');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleLogoFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTemplate((t) => ({ ...t, logoUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await syllabusApi.saveExamTemplate(template);
      toast.success('School paper header & template defaults saved!');
      setTemplateOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveExamNames = async (nextList) => {
    try {
      const saved = await syllabusApi.updateExamNames(nextList);
      setExamNames(saved);
      toast.success('Exam names updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const totalCount = papers.length;
  const reviewedCount = papers.filter((p) => p.status === 'REVIEWED').length;
  const submittedCount = papers.filter((p) => p.status === 'SUBMITTED').length;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Exam Papers Review &amp; Print Governance</h1>
              <SyllabusSessionBanner onSessionReload={loadAll} />
            </div>
            <p className="text-xs text-slate-500">Review faculty question papers, customize school header/logo template, &amp; manage exam categories</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExamNamesOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            <ListChecks className="w-4 h-4 text-indigo-600" /> Exam Categories ({examNames.length})
          </button>
          <button
            type="button"
            onClick={() => setTemplateOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" /> Header Logo &amp; Template
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">Total Question Papers</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4">
          <div className="text-xs font-bold text-emerald-700">Reviewed &amp; Ready to Print</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{reviewedCount}</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-4">
          <div className="text-xs font-bold text-amber-700">Awaiting Admin Review</div>
          <div className="text-2xl font-black text-amber-800 mt-1">{submittedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'SUBMITTED', 'REVIEWED', 'DRAFT'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') loadAll(); }}
              placeholder="Search exam, subject or faculty..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>
          <button type="button" onClick={loadAll} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Exam Title</th>
                <th className="py-3 px-4">Class &amp; Subject</th>
                <th className="py-3 px-4">Prepared By</th>
                <th className="py-3 px-4">Marks / Layout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">Loading exam papers...</td></tr>
              ) : papers.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">No question papers matching your filters.</td></tr>
              ) : (
                papers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{p.examName}</div>
                      <div className="text-[11px] font-normal text-slate-400">{p.examDate || ''}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{p.subjectName}</span>
                      <div className="text-[11px] text-slate-500">{p.className}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">{p.teacherName}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold">{p.totalMarks} Marks</span>
                      <div className="text-[10px] text-slate-400">{p.templateType} • {p.duration}m</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'REVIEWED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : p.status === 'SUBMITTED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewPaper({ ...p, schoolName: template?.schoolName, logoUrl: template?.logoUrl })}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600"
                          title="Preview Paper"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate?.(`/teacher/syllabus-exam-papers/${p.id}/edit`)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600"
                          title="Edit Questions in Studio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(p)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMarkReviewed(p)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 ${
                            p.status === 'REVIEWED'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" /> {p.status === 'REVIEWED' ? 'Reviewed' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      <ExamPaperPreviewModal open={Boolean(previewPaper)} onClose={() => setPreviewPaper(null)} paper={previewPaper} />

      {/* School Header & Template Modal */}
      {templateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveTemplate} className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">School Question Paper Header &amp; Logo</h3>
              <button type="button" onClick={() => setTemplateOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">School Header Title</label>
              <input
                type="text"
                value={template.schoolName || ''}
                onChange={(e) => setTemplate((t) => ({ ...t, schoolName: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">School Crest / Watermark Logo</label>
              <div className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                {template.logoUrl ? (
                  <img src={template.logoUrl} alt="School Crest" className="w-14 h-14 object-contain bg-white rounded-lg border p-1" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-200/70 flex items-center justify-center text-[10px] font-bold text-slate-500">No Logo</div>
                )}
                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" /> Upload PNG / JPG
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoFile(e.target.files?.[0])} />
                  </label>
                  {template.logoUrl && (
                    <button type="button" onClick={() => setTemplate((t) => ({ ...t, logoUrl: '' }))} className="ml-2 text-xs text-rose-600 font-bold">
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Column Layout</label>
                <select value={template.defaultTemplateType} onChange={(e) => setTemplate((t) => ({ ...t, defaultTemplateType: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">
                  <option value="SINGLE">Single Column</option>
                  <option value="SPLIT">2-Column Split</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Font</label>
                <select value={template.defaultFontFamily} onChange={(e) => setTemplate((t) => ({ ...t, defaultFontFamily: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setTemplateOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1.5">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Template
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exam Names Manager Modal */}
      {examNamesOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Manage Exam Categories</h3>
              <button onClick={() => setExamNamesOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="e.g. Periodic Test 2"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newExamName.trim()) return;
                  handleSaveExamNames([...examNames, newExamName.trim()]);
                  setNewExamName('');
                }}
                className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {examNames.map((n, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold">
                  <span>{n}</span>
                  <button
                    type="button"
                    onClick={() => handleSaveExamNames(examNames.filter((_, idx) => idx !== i))}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
