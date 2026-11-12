import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Trash2, Image as ImageIcon, GitBranch, Crop } from 'lucide-react';
import { RichTextField } from './RichTextField';
import { ImageCropModal } from './ImageCropModal';

export function QuestionEditor({
  sections = [],
  onChange,
  styleFontFamily,
  styleFontSize,
  styleColor,
  onBack,
  onNext,
}) {
  const [cropState, setCropState] = useState({ open: false, src: '', secIdx: 0, qIdx: 0 });
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);

  const patchQuestion = (secIdx, qIdx, patch) => {
    const next = sections.map((sec, sIdx) => {
      if (sIdx !== secIdx) return sec;
      const nextQs = (sec.questions || []).map((q, idx) => (idx === qIdx ? { ...q, ...patch } : q));
      return { ...sec, questions: nextQs };
    });
    onChange(next);
  };

  const handleImageFile = (secIdx, qIdx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({ open: true, src: reader.result, secIdx, qIdx });
    };
    reader.readAsDataURL(file);
  };

  const sec = sections[activeSectionIdx] || sections[0];
  const sIdx = Math.min(activeSectionIdx, Math.max(0, sections.length - 1));

  let globalStart = 0;
  for (let i = 0; i < sIdx; i++) globalStart += (sections[i]?.questions || []).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Step 3: Question Content, Diagrams &amp; Formulas</h3>
          <p className="text-xs text-slate-500">Write questions, embed LaTeX formulas, upload cropped diagrams, or add internal OR choices.</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sections.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSectionIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                idx === sIdx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.sectionTitle} ({(s.questions || []).length} Qs)
            </button>
          ))}
        </div>
      </div>

      {sec && (
        <div className="space-y-5">
          {(sec.questions || []).map((q, qIdx) => {
            const qNum = globalStart + qIdx + 1;
            const alternatives = q.alternatives || [];
            return (
              <div key={qIdx} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold">Q{qNum}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-bold">
                      {q.segmentLabel || q.segmentType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      {q.marks} Marks
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 inline-flex items-center gap-1 cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                      {q.imageUrl ? 'Replace Diagram' : 'Add Diagram'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFile(sIdx, qIdx, e.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        patchQuestion(sIdx, qIdx, {
                          alternatives: [
                            ...alternatives,
                            {
                              segmentType: q.segmentType,
                              questionText: '',
                              options: q.segmentType === 'MCQ' ? Array.from({ length: 4 }, (_, i) => ({ text: '', isCorrect: i === 0 })) : [],
                            },
                          ],
                        })
                      }
                      className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <GitBranch className="w-3 h-3" /> Add OR Choice
                    </button>
                  </div>
                </div>

                {/* Main prompt depending on segment type */}
                {q.segmentType === 'ASSERTION_REASONING' ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Assertion (A)</label>
                      <RichTextField value={q.assertion || ''} onChange={(val) => patchQuestion(sIdx, qIdx, { assertion: val })} fontFamily={styleFontFamily} fontSize={styleFontSize} color={styleColor} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Reason (R)</label>
                      <RichTextField value={q.reason || ''} onChange={(val) => patchQuestion(sIdx, qIdx, { reason: val })} fontFamily={styleFontFamily} fontSize={styleFontSize} color={styleColor} />
                    </div>
                  </div>
                ) : q.segmentType === 'PASSAGE' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Comprehension / Case Study Passage</label>
                      <RichTextField value={q.passageText || ''} onChange={(val) => patchQuestion(sIdx, qIdx, { passageText: val })} fontFamily={styleFontFamily} fontSize={styleFontSize} color={styleColor} />
                    </div>
                    <div className="space-y-2 pl-3 border-l-2 border-indigo-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-700">Sub-Questions</span>
                        <button
                          type="button"
                          onClick={() => patchQuestion(sIdx, qIdx, { subQuestions: [...(q.subQuestions || []), { questionText: '', marks: 1 }] })}
                          className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Sub-Q
                        </button>
                      </div>
                      {(q.subQuestions || []).map((sq, sqIdx) => (
                        <div key={sqIdx} className="flex gap-2 items-center">
                          <span className="text-xs font-bold text-slate-500">({String.fromCharCode(105 + sqIdx)})</span>
                          <input
                            type="text"
                            value={sq.questionText}
                            onChange={(e) => {
                              const nextSqs = [...(q.subQuestions || [])];
                              nextSqs[sqIdx] = { ...nextSqs[sqIdx], questionText: e.target.value };
                              patchQuestion(sIdx, qIdx, { subQuestions: nextSqs });
                            }}
                            placeholder="Sub-question text..."
                            className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                          />
                          <input
                            type="number"
                            min="1"
                            value={sq.marks || 1}
                            onChange={(e) => {
                              const nextSqs = [...(q.subQuestions || [])];
                              nextSqs[sqIdx] = { ...nextSqs[sqIdx], marks: Number(e.target.value) };
                              patchQuestion(sIdx, qIdx, { subQuestions: nextSqs });
                            }}
                            className="w-14 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <RichTextField
                    value={q.questionText || ''}
                    onChange={(val) => patchQuestion(sIdx, qIdx, { questionText: val })}
                    fontFamily={styleFontFamily}
                    fontSize={styleFontSize}
                    color={styleColor}
                    placeholder={`Enter Question ${qNum}... (supports Math LaTeX like $x^2 + y^2 = r^2$)`}
                  />
                )}

                {/* Diagram preview */}
                {q.imageUrl && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200">
                    <img src={q.imageUrl} alt="Question diagram" className="h-16 w-24 object-contain rounded border border-slate-100" />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCropState({ open: true, src: q.imageUrl, secIdx: sIdx, qIdx })}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 inline-flex items-center gap-1"
                      >
                        <Crop className="w-3 h-3" /> Crop
                      </button>
                      <button
                        type="button"
                        onClick={() => patchQuestion(sIdx, qIdx, { imageUrl: '' })}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Matching Pairs */}
                {q.segmentType === 'MATCHING' && (
                  <div className="space-y-2 p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-600">Column A / Column B Matching Pairs</span>
                      <button
                        type="button"
                        onClick={() => patchQuestion(sIdx, qIdx, { matchingPairs: [...(q.matchingPairs || []), { left: '', right: '' }] })}
                        className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Pair
                      </button>
                    </div>
                    {(q.matchingPairs || []).map((pair, pIdx) => (
                      <div key={pIdx} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={pair.left}
                          onChange={(e) => {
                            const nextPairs = [...(q.matchingPairs || [])];
                            nextPairs[pIdx] = { ...nextPairs[pIdx], left: e.target.value };
                            patchQuestion(sIdx, qIdx, { matchingPairs: nextPairs });
                          }}
                          placeholder={`Col A (${pIdx + 1})`}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                        />
                        <input
                          type="text"
                          value={pair.right}
                          onChange={(e) => {
                            const nextPairs = [...(q.matchingPairs || [])];
                            nextPairs[pIdx] = { ...nextPairs[pIdx], right: e.target.value };
                            patchQuestion(sIdx, qIdx, { matchingPairs: nextPairs });
                          }}
                          placeholder={`Col B (${String.fromCharCode(97 + pIdx)})`}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* MCQ / True-False options */}
                {(q.segmentType === 'MCQ' || q.segmentType === 'TRUE_FALSE') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(q.options || []).map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                        <input
                          type="radio"
                          name={`q_correct_${sIdx}_${qIdx}`}
                          checked={Boolean(opt.isCorrect)}
                          onChange={() => {
                            const nextOpts = (q.options || []).map((o, idx) => ({ ...o, isCorrect: idx === oIdx }));
                            patchQuestion(sIdx, qIdx, { options: nextOpts });
                          }}
                          title="Mark as answer key"
                        />
                        <span className="text-[11px] font-bold text-slate-400">({String.fromCharCode(97 + oIdx)})</span>
                        <input
                          type="text"
                          value={typeof opt === 'string' ? opt : opt.text || ''}
                          onChange={(e) => {
                            const nextOpts = [...(q.options || [])];
                            nextOpts[oIdx] = { ...(typeof opt === 'object' ? opt : {}), text: e.target.value };
                            patchQuestion(sIdx, qIdx, { options: nextOpts });
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                          className="flex-1 text-xs outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Metadata: Topic & Hint */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <input
                    type="text"
                    value={q.subject || ''}
                    onChange={(e) => patchQuestion(sIdx, qIdx, { subject: e.target.value })}
                    placeholder="Chapter / Topic Tag (optional)"
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px]"
                  />
                  <input
                    type="text"
                    value={q.hint || ''}
                    onChange={(e) => patchQuestion(sIdx, qIdx, { hint: e.target.value })}
                    placeholder="Hint / Marking Note (optional)"
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px]"
                  />
                </div>

                {/* Alternatives */}
                {alternatives.map((alt, aIdx) => (
                  <div key={aIdx} className="mt-2 p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-800">Internal Choice — OR Option #{aIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => patchQuestion(sIdx, qIdx, { alternatives: alternatives.filter((_, idx) => idx !== aIdx) })}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <RichTextField
                      value={alt.questionText || ''}
                      onChange={(val) => {
                        const nextAlts = alternatives.map((a, idx) => (idx === aIdx ? { ...a, questionText: val } : a));
                        patchQuestion(sIdx, qIdx, { alternatives: nextAlts });
                      }}
                      fontFamily={styleFontFamily}
                      fontSize={styleFontSize}
                      color={styleColor}
                      placeholder="Enter alternative OR question..."
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sections
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
        >
          Continue to Instructions <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <ImageCropModal
        isOpen={cropState.open}
        imageSrc={cropState.src}
        onClose={() => setCropState((s) => ({ ...s, open: false }))}
        onCropComplete={(croppedUrl) => patchQuestion(cropState.secIdx, cropState.qIdx, { imageUrl: croppedUrl })}
      />
    </div>
  );
}
