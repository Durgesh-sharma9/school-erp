import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Eye,
  Edit3,
  Download,
  Send,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { ExamPaperPreviewModal } from '../../components/ExamPaperLivePreview';
import { generateExamPaperPdf, downloadBlob } from '../../utils/pdfGenerator';

export function TeacherExamPapersPage({ onNavigate }) {
  const [papers, setPapers] = useState([]);
  const [template, setTemplate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewPaper, setPreviewPaper] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [list, tpl] = await Promise.all([
        syllabusApi.listExamPapers({ status: statusFilter === 'ALL' ? '' : statusFilter, search }),
        syllabusApi.getExamTemplate(),
      ]);
      setPapers(list || []);
      setTemplate(tpl);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSubmitPaper = async (paper) => {
    try {
      await syllabusApi.updateExamPaper(paper.id, { status: 'SUBMITTED' });
      toast.success('Question paper submitted to Admin for review!');
      await loadData();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft question paper?')) return;
    try {
      await syllabusApi.deleteExamPaper(id);
      toast.success('Paper deleted');
      await loadData();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handlePdf = async (paper) => {
    try {
      const merged = { ...paper, schoolName: template?.schoolName || paper.schoolName, logoUrl: template?.logoUrl || paper.logoUrl };
      const blob = await generateExamPaperPdf(merged);
      downloadBlob(blob, `${(paper.subjectName || 'Paper').replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF downloaded!');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">My Question Papers</h1>
            <p className="text-xs text-slate-500">Draft, format with LaTeX &amp; diagrams, preview A4 PDF &amp; submit to Admin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.('/teacher/syllabus-exam-papers/create')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Exam Paper
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'DRAFT', 'SUBMITTED', 'REVIEWED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') loadData(); }}
              placeholder="Search exam or subject..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs"
            />
          </div>
          <button type="button" onClick={loadData} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-slate-400">Loading your question papers...</div>
      ) : papers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-800">No Question Papers Found</div>
          <button
            type="button"
            onClick={() => onNavigate?.('/teacher/syllabus-exam-papers/create')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            + Launch Question Paper Builder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">{p.examName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'REVIEWED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : p.status === 'SUBMITTED'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {p.className} • {p.subjectName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {p.totalMarks} Marks • {p.duration} mins • {p.templateType} Layout
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPreviewPaper({ ...p, schoolName: template?.schoolName, logoUrl: template?.logoUrl })}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.(`/teacher/syllabus-exam-papers/${p.id}/edit`)}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-700 inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handlePdf(p)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                {p.status === 'DRAFT' && (
                  <button
                    type="button"
                    onClick={() => handleSubmitPaper(p)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 ml-auto text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ExamPaperPreviewModal open={Boolean(previewPaper)} onClose={() => setPreviewPaper(null)} paper={previewPaper} />
    </div>
  );
}
