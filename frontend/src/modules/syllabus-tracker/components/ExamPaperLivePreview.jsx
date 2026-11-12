import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Download, ZoomIn, ZoomOut, Columns, FileText, Loader2, Users, X, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateExamPaperPdf, generateBulkExamPapersZip, downloadBlob } from '../utils/pdfGenerator';

function renderInlineMath(html = '') {
  let out = String(html || '');
  out = out.replace(/<span[^>]*data-latex="([^"]+)"[^>]*>[\s\S]*?<\/span>/gi, (_, tex) => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: false });
    } catch {
      return tex;
    }
  });
  out = out.replace(/\$([^$]+)\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode: false });
    } catch {
      return tex;
    }
  });
  return out;
}

export function ExamPaperLivePreviewSheet({ paperDetails, sections = [], instructions = '', overrideTemplate }) {
  const layout = overrideTemplate || paperDetails?.templateType || 'SINGLE';
  const fontFamily = paperDetails?.styleFontFamily || 'Times New Roman';
  const fontSize = paperDetails?.styleFontSize || '11pt';
  const color = paperDetails?.styleColor || '#0f172a';

  let qNo = 0;

  return (
    <div
      className="relative bg-white border border-slate-300 shadow-lg mx-auto p-6 sm:p-8 rounded-sm"
      style={{ maxWidth: '820px', fontFamily, fontSize, color }}
    >
      {/* Subtle Watermark */}
      {paperDetails?.logoUrl && (
        <img
          src={paperDetails.logoUrl}
          alt=""
          className="pointer-events-none select-none absolute inset-0 m-auto w-64 h-64 object-contain opacity-[0.04]"
        />
      )}

      {/* Paper Header */}
      <div className="border border-slate-400 p-4 flex items-center gap-4 mb-3 relative z-10">
        {paperDetails?.logoUrl && (
          <img src={paperDetails.logoUrl} alt="Logo" className="w-14 h-14 object-contain shrink-0" />
        )}
        <div className="flex-1 text-center space-y-0.5">
          <h2 className="text-base sm:text-lg font-extrabold tracking-wide uppercase">
            {paperDetails?.schoolName || 'SCHOOL ACADEMIC PORTAL'}
          </h2>
          <div className="text-sm font-bold">{paperDetails?.examName || 'EXAMINATION PAPER'}</div>
          <div className="text-xs flex flex-wrap justify-center gap-x-4 gap-y-0.5 pt-0.5">
            <span><strong>{paperDetails?.className || 'Class'}</strong></span>
            <span>Subject: <strong>{paperDetails?.subjectName || 'Subject'}</strong></span>
            {paperDetails?.examDate && <span>Date: {new Date(paperDetails.examDate).toLocaleDateString()}</span>}
            {paperDetails?.showTeacherName !== false && paperDetails?.teacherName && (
              <span>Faculty: {paperDetails.teacherName}</span>
            )}
          </div>
          <div className="text-xs font-semibold">
            Duration: {paperDetails?.duration || 180} mins &nbsp;|&nbsp; Maximum Marks: {paperDetails?.totalMarks || 0}
          </div>
        </div>
      </div>

      {/* Candidate Name / Roll Box */}
      <div className="border border-slate-400 px-4 py-2 flex flex-wrap justify-between gap-2 text-xs font-bold mb-4 relative z-10">
        <span>Student Name: ______________________________</span>
        <span>Roll No: ________________</span>
      </div>

      {/* Instructions */}
      {instructions?.trim() && (
        <div className="mb-4 pb-3 border-b border-slate-200 text-xs leading-relaxed relative z-10">
          <div className="font-bold mb-1">General Instructions:</div>
          <div className="whitespace-pre-line">{instructions}</div>
        </div>
      )}

      {/* Sections & Questions */}
      <div className={`relative z-10 ${layout === 'SPLIT' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-5'}`}>
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <div className="text-center border-b border-slate-300 pb-1">
              <div className="font-bold text-sm uppercase">{sec.sectionTitle}</div>
              {sec.sectionDescription && <div className="text-xs italic text-slate-600">{sec.sectionDescription}</div>}
            </div>

            <div className="space-y-3.5">
              {(sec.questions || []).map((q, qIdx) => {
                qNo += 1;
                return (
                  <div key={qIdx} className="text-xs leading-relaxed space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5 flex-1">
                        <span className="font-bold shrink-0">Q{qNo}.</span>
                        <div className="flex-1">
                          {q.segmentType === 'ASSERTION_REASONING' ? (
                            <div className="space-y-1">
                              <div><strong>Assertion (A):</strong> <span dangerouslySetInnerHTML={{ __html: renderInlineMath(q.assertion || '—') }} /></div>
                              <div><strong>Reason (R):</strong> <span dangerouslySetInnerHTML={{ __html: renderInlineMath(q.reason || '—') }} /></div>
                            </div>
                          ) : q.segmentType === 'PASSAGE' ? (
                            <div className="space-y-1.5">
                              <div className="p-2 bg-slate-50 border border-slate-200 rounded" dangerouslySetInnerHTML={{ __html: renderInlineMath(q.passageText || 'Passage text...') }} />
                              {(q.subQuestions || []).map((sq, i) => (
                                <div key={i} className="pl-3 flex justify-between gap-2">
                                  <span>({String.fromCharCode(105 + i)}) {sq.questionText}</span>
                                  <span className="font-bold shrink-0">[{sq.marks || 1}]</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div dangerouslySetInnerHTML={{ __html: renderInlineMath(q.questionText || `[${q.segmentLabel || 'Question'} placeholder]`) }} />
                          )}
                        </div>
                      </div>
                      <span className="font-bold shrink-0">[{q.marks || 1}]</span>
                    </div>

                    {q.imageUrl && (
                      <div className="pl-5">
                        <img src={q.imageUrl} alt="Diagram" className="max-h-32 object-contain border border-slate-200 rounded p-1" />
                      </div>
                    )}

                    {q.segmentType === 'MATCHING' && Array.isArray(q.matchingPairs) && (
                      <div className="pl-6 grid grid-cols-2 gap-x-6 gap-y-1">
                        {q.matchingPairs.map((p, idx) => (
                          <React.Fragment key={idx}>
                            <div>({idx + 1}) {p.left}</div>
                            <div>({String.fromCharCode(97 + idx)}) {p.right}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                        {q.options.map((o, oIdx) => (
                          <div key={oIdx}>
                            ({String.fromCharCode(97 + oIdx)}) <span dangerouslySetInnerHTML={{ __html: renderInlineMath(typeof o === 'string' ? o : o.text || '') }} />
                          </div>
                        ))}
                      </div>
                    )}

                    {Array.isArray(q.alternatives) && q.alternatives.map((alt, aIdx) => (
                      <div key={aIdx} className="pl-5 pt-1 space-y-1">
                        <div className="text-center font-bold text-[11px] uppercase">OR</div>
                        <div dangerouslySetInnerHTML={{ __html: renderInlineMath(alt.questionText || '') }} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamPaperLivePreview({ paperDetails, sections = [], instructions = '' }) {
  const [zoom, setZoom] = useState(100);
  const [overrideTemplate, setOverrideTemplate] = useState(null);
  const [rollNumber, setRollNumber] = useState('');
  const [bulkCount, setBulkCount] = useState(10);
  const [downloading, setDownloading] = useState(false);

  const buildPaperPayload = () => ({
    ...paperDetails,
    templateType: overrideTemplate || paperDetails?.templateType || 'SINGLE',
    sections,
    instructions,
  });

  const handleDownloadPdf = async (withRoll = false) => {
    try {
      setDownloading(true);
      const rNo = withRoll ? (rollNumber.trim() || 'ROLL-001') : '';
      const blob = await generateExamPaperPdf(buildPaperPayload(), rNo);
      const fname = `${(paperDetails?.subjectName || 'Exam_Paper').replace(/\s+/g, '_')}${rNo ? `_${rNo}` : ''}.pdf`;
      downloadBlob(blob, fname);
      toast.success(`Downloaded ${fname}`);
    } catch (e) {
      toast.error(`PDF export error: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadBulkZip = async () => {
    try {
      setDownloading(true);
      const blob = await generateBulkExamPapersZip(buildPaperPayload(), bulkCount);
      const fname = `${(paperDetails?.subjectName || 'Exam').replace(/\s+/g, '_')}_RollSheets_${bulkCount}.zip`;
      downloadBlob(blob, fname);
      toast.success(`ZIP with ${bulkCount} numbered student papers ready!`);
    } catch (e) {
      toast.error(`ZIP export error: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setOverrideTemplate('SINGLE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                (overrideTemplate || paperDetails?.templateType) === 'SINGLE' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Single
            </button>
            <button
              type="button"
              onClick={() => setOverrideTemplate('SPLIT')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                (overrideTemplate || paperDetails?.templateType) === 'SPLIT' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> 2-Col Split
            </button>
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2 py-1 bg-slate-50 text-xs">
            <button type="button" onClick={() => setZoom((z) => Math.max(70, z - 10))} className="p-0.5 hover:text-indigo-600"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="font-bold w-10 text-center">{zoom}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(125, z + 10))} className="p-0.5 hover:text-indigo-600"><ZoomIn className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={downloading}
            onClick={() => handleDownloadPdf(false)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download Blank PDF
          </button>

          <div className="inline-flex items-center rounded-xl border border-slate-200 overflow-hidden">
            <Hash className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Roll No"
              className="w-24 px-2 py-1.5 text-xs outline-none"
            />
            <button
              type="button"
              disabled={downloading}
              onClick={() => handleDownloadPdf(true)}
              className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border-l border-slate-200"
            >
              Roll PDF
            </button>
          </div>

          <div className="inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50/40 overflow-hidden">
            <Users className="w-3.5 h-3.5 text-emerald-700 ml-2" />
            <input
              type="number"
              min="1"
              max="50"
              value={bulkCount}
              onChange={(e) => setBulkCount(Number(e.target.value))}
              className="w-12 bg-transparent px-1.5 py-1.5 text-xs font-bold text-center outline-none"
              title="Student Count"
            />
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadBulkZip}
              className="px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold"
            >
              Bulk ZIP
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-6 overflow-auto border border-slate-200">
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
          <ExamPaperLivePreviewSheet
            paperDetails={paperDetails}
            sections={sections}
            instructions={instructions}
            overrideTemplate={overrideTemplate}
          />
        </div>
      </div>
    </div>
  );
}

export function ExamPaperPreviewModal({ open, onClose, paper }) {
  if (!open || !paper) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{paper.examName} — {paper.subjectName}</h3>
            <p className="text-xs text-slate-500">{paper.className} • {paper.totalMarks} Marks • Prepared by {paper.teacherName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <ExamPaperLivePreview
            paperDetails={paper}
            sections={paper.sections || []}
            instructions={paper.instructions || ''}
          />
        </div>
      </div>
    </div>
  );
}
