import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../../services/syllabusApi';
import { ExamStepper } from '../../components/ExamStepper';
import { PaperSetupForm } from '../../components/PaperSetupForm';
import { SectionSegmentForm } from '../../components/SectionSegmentForm';
import { QuestionEditor } from '../../components/QuestionEditor';
import { InstructionsForm } from '../../components/InstructionsForm';
import { ExamPaperLivePreview, ExamPaperPreviewModal } from '../../components/ExamPaperLivePreview';

export function TeacherExamPaperStudioPage({ paperId = '', onNavigate }) {
  const isEdit = Boolean(paperId);
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(isEdit ? 5 : 1);
  const [classes, setClasses] = useState([]);
  const [examNames, setExamNames] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [paper, setPaper] = useState({
    classId: '',
    className: '',
    subjectId: '',
    subjectName: '',
    examName: 'Unit Test 1',
    examDate: new Date().toISOString().slice(0, 10),
    duration: 180,
    totalMarks: 20,
    templateType: 'SINGLE',
    styleFontFamily: 'Times New Roman',
    styleFontSize: '11pt',
    styleColor: '#0f172a',
    showTeacherName: true,
    teacherName: '',
    instructions: '1. All questions are compulsory.\n2. Marks are indicated against each question.',
    sections: [],
    status: 'DRAFT',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [assignedRes, treeRes, namesRes, tplRes] = await Promise.all([
          syllabusApi.getTeacherClasses().catch(() => ({ classes: [] })),
          syllabusApi.getSyllabusTree().catch(() => ({ classes: [] })),
          syllabusApi.getExamNames().catch(() => ['Unit Test 1', 'Half Yearly (Term 1)', 'Annual Exam (Term 2)']),
          syllabusApi.getExamTemplate().catch(() => ({})),
        ]);

        const mergedClasses =
          assignedRes?.classes?.length > 0 ? assignedRes.classes : treeRes?.classes || [];
        setClasses(mergedClasses);
        setExamNames(namesRes || []);
        setTemplate(tplRes || {});

        if (paperId) {
          const existing = await syllabusApi.getExamPaper(paperId);
          setPaper(existing);
          setMaxStep(5);
        } else {
          const firstCls = mergedClasses[0];
          const firstSub = firstCls?.subjects?.[0];
          setPaper((prev) => ({
            ...prev,
            classId: firstCls?.id || '',
            className: firstCls?.label || '',
            subjectId: firstSub?.subjectId || '',
            subjectName: firstSub?.subjectName || '',
            examName: namesRes?.[0] || 'Unit Test 1',
            templateType: tplRes?.defaultTemplateType || 'SINGLE',
            styleFontFamily: tplRes?.defaultFontFamily || 'Times New Roman',
            styleFontSize: tplRes?.defaultFontSize || '11pt',
            styleColor: tplRes?.defaultColor || '#0f172a',
            teacherName: assignedRes?.teacher?.name || '',
          }));
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [paperId]);

  const goStep = (next) => {
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
  };

  const handleSave = async (targetStatus = paper.status || 'DRAFT') => {
    if (!paper.className || !paper.subjectName || !paper.examName) {
      return toast.error('Complete Step 1 Paper Setup before saving');
    }
    try {
      setSaving(true);
      const payload = { ...paper, status: targetStatus };
      if (isEdit) {
        await syllabusApi.updateExamPaper(paperId, payload);
        toast.success(targetStatus === 'SUBMITTED' ? 'Paper submitted for Admin review!' : 'Changes saved!');
      } else {
        await syllabusApi.createExamPaper(payload);
        toast.success(targetStatus === 'SUBMITTED' ? 'Question paper created & submitted!' : 'Question paper saved as Draft!');
      }
      const user = JSON.parse(localStorage.getItem('uab_user') || '{}');
      const isStaff = String(user?.role || '').toUpperCase() === 'STAFF';
      onNavigate?.(isStaff ? '/teacher/syllabus-exam-papers' : '/syllabus-exam-papers');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-400">Initializing Question Paper Studio...</div>;
  }

  const enrichedPaperDetails = {
    ...paper,
    schoolName: template?.schoolName || 'SCHOOL ACADEMIC PORTAL',
    logoUrl: template?.logoUrl || '',
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('uab_user') || '{}');
              onNavigate?.(String(user?.role || '').toUpperCase() === 'STAFF' ? '/teacher/syllabus-exam-papers' : '/syllabus-exam-papers');
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {isEdit ? 'Edit Question Paper Studio' : 'Create Question Paper Studio'}
            </h1>
            <p className="text-xs text-slate-500">5-Step CBSE Question Paper Designer with LaTeX Equations, Cropped Diagrams &amp; Roll-No Bulk PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('DRAFT')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('SUBMITTED')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Submit to Admin
          </button>
        </div>
      </div>

      <ExamStepper
        currentStep={step}
        maxStepReached={maxStep}
        onStepClick={(s) => setStep(s)}
        onOpenPreview={() => setPreviewModalOpen(true)}
        paperDetails={enrichedPaperDetails}
      />

      {step === 1 && (
        <PaperSetupForm
          classes={classes}
          examNames={examNames}
          {...paper}
          onChange={(patch) => setPaper((p) => ({ ...p, ...patch }))}
          onNext={() => goStep(2)}
        />
      )}

      {step === 2 && (
        <SectionSegmentForm
          totalMarks={paper.totalMarks}
          sections={paper.sections}
          onChange={(sections) => setPaper((p) => ({ ...p, sections }))}
          onBack={() => setStep(1)}
          onNext={() => goStep(3)}
        />
      )}

      {step === 3 && (
        <QuestionEditor
          sections={paper.sections}
          onChange={(sections) => setPaper((p) => ({ ...p, sections }))}
          styleFontFamily={paper.styleFontFamily}
          styleFontSize={paper.styleFontSize}
          styleColor={paper.styleColor}
          onBack={() => setStep(2)}
          onNext={() => goStep(4)}
        />
      )}

      {step === 4 && (
        <InstructionsForm
          instructions={paper.instructions}
          onChange={(instructions) => setPaper((p) => ({ ...p, instructions }))}
          onBack={() => setStep(3)}
          onNext={() => goStep(5)}
        />
      )}

      {step === 5 && (
        <div className="space-y-4">
          <ExamPaperLivePreview
            paperDetails={enrichedPaperDetails}
            sections={paper.sections}
            instructions={paper.instructions}
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
            >
              Back to Instructions
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('SUBMITTED')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Save &amp; Submit Final Paper
            </button>
          </div>
        </div>
      )}

      <ExamPaperPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        paper={enrichedPaperDetails}
      />
    </div>
  );
}
