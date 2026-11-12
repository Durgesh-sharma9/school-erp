import React, { useState, useEffect } from 'react';
import { X, Loader2, Award, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { syllabusApi } from '../services/syllabusApi';
import {
  ANNEXURE_I_TOPICS,
  ANNEXURE_II_TOPICS,
  ANNEXURE_III_TOPICS,
  ACADEMIC_ACTIVITIES,
} from '../constants/cbseCatalog';

export function LogTrainingDialog({
  open,
  onOpenChange,
  teachers = [],
  defaultTeacherId = '',
  isTeacherSelf = false,
  onSuccess,
}) {
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
  const [catalogCategory, setCatalogCategory] = useState('ANNEXURE_I');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('CBSE');
  const [domain, setDomain] = useState('CORE_VALUES_ETHICS');
  const [annexure, setAnnexure] = useState('ANNEXURE_I');
  const [hours, setHours] = useState(6);
  const [mode, setMode] = useState('OFFLINE');
  const [trainingDate, setTrainingDate] = useState(new Date().toISOString().slice(0, 10));
  const [certificateNo, setCertificateNo] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedTeacherIds(defaultTeacherId ? [defaultTeacherId] : teachers[0]?.teacherId ? [teachers[0].teacherId] : []);
      setTitle('');
      setSelectedTopicId('');
      setHours(6);
      setCertificateNo('');
      setOrganizer('');
      setNotes('');
    }
  }, [open, defaultTeacherId]);

  if (!open) return null;

  const catalogByGroup = {
    ANNEXURE_I: ANNEXURE_I_TOPICS,
    ANNEXURE_II: ANNEXURE_II_TOPICS,
    ANNEXURE_III: ANNEXURE_III_TOPICS,
    ACADEMIC_ACTIVITY: ACADEMIC_ACTIVITIES,
  };

  const handleSelectCatalogTopic = (topicId) => {
    setSelectedTopicId(topicId);
    const list = catalogByGroup[catalogCategory] || [];
    const found = list.find((t) => t.id === topicId);
    if (found) {
      setTitle(found.title);
      setDomain(found.domain);
      setAnnexure(found.annexure);
      setHours(found.defaultHours || 6);
      setProvider(found.annexure === 'ACADEMIC_ACTIVITY' ? 'SCHOOL' : 'CBSE');
    }
  };

  const toggleTeacherSelection = (tid) => {
    setSelectedTeacherIds((prev) =>
      prev.includes(tid) ? prev.filter((id) => id !== tid) : [...prev, tid],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Training topic / title is required');
    if (!isTeacherSelf && selectedTeacherIds.length === 0) return toast.error('Select at least one teacher');

    try {
      setSaving(true);
      await syllabusApi.createTrainingRecord(
        {
          teacherIds: selectedTeacherIds,
          teacherId: selectedTeacherIds[0],
          title: title.trim(),
          provider,
          domain,
          annexure,
          hours: Number(hours),
          mode,
          trainingDate,
          certificateNo,
          organizer,
          notes,
        },
        { isTeacherSelf },
      );
      toast.success(isTeacherSelf ? 'Training submitted for Admin verification!' : 'CPD Training logged & verified!');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isTeacherSelf ? 'Submit CPD Training Record' : 'Log Faculty Training (Single or Bulk)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isTeacherSelf ? 'Submitted records appear in Admin Approval queue before counting toward 50h.' : 'Pick an official CBSE Annexure topic or enter custom workshop hours.'}
              </p>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isTeacherSelf && teachers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Select Faculty ({selectedTeacherIds.length} selected)</label>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTeacherIds(
                      selectedTeacherIds.length === teachers.length ? [] : teachers.map((t) => t.teacherId),
                    )
                  }
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  {selectedTeacherIds.length === teachers.length ? 'Clear All' : 'Select All Teachers'}
                </button>
              </div>
              <div className="max-h-28 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-xl border border-slate-200 bg-slate-50/60">
                {teachers.map((t) => {
                  const checked = selectedTeacherIds.includes(t.teacherId);
                  return (
                    <button
                      key={t.teacherId}
                      type="button"
                      onClick={() => toggleTeacherSelection(t.teacherId)}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-xs flex items-center justify-between ${
                        checked ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {checked && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Preset Picker */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="text-xs font-bold text-slate-700">Official CBSE Circular TRG-02/2025 Topic Preset (Optional)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={catalogCategory}
                onChange={(e) => {
                  setCatalogCategory(e.target.value);
                  setSelectedTopicId('');
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
              >
                <option value="ANNEXURE_I">Annexure I (Core Values &amp; Ethics)</option>
                <option value="ANNEXURE_II">Annexure II (Knowledge &amp; Practice)</option>
                <option value="ANNEXURE_III">Annexure III (Professional Growth)</option>
                <option value="ACADEMIC_ACTIVITY">Academic Activities (Duties)</option>
                <option value="CUSTOM">Custom Workshop / Seminar</option>
              </select>

              {catalogCategory !== 'CUSTOM' && (
                <select
                  value={selectedTopicId}
                  onChange={(e) => handleSelectCatalogTopic(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <option value="">Select preset topic...</option>
                  {(catalogByGroup[catalogCategory] || []).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.defaultHours}h)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Training Title / Program Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Experiential Learning Workshop"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Provider</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">
                <option value="CBSE">CBSE / COE (25h Quota)</option>
                <option value="SCHOOL">School In-House (25h Quota)</option>
                <option value="SAHODAYA">Sahodaya (25h Quota)</option>
                <option value="OTHER">DIKSHA / Other (25h Quota)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NPST Domain</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">
                <option value="CORE_VALUES_ETHICS">Domain 1: Ethics (12h)</option>
                <option value="KNOWLEDGE_PRACTICE">Domain 2: Practice (24h)</option>
                <option value="PROFESSIONAL_GROWTH">Domain 3: Growth (14h)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hours *</label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold">
                <option value="OFFLINE">Offline / In-Person</option>
                <option value="ONLINE">Online / Virtual</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Certificate No</label>
              <input
                type="text"
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
                placeholder="CBSE-2026-..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organizer / COE Name</label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="CBSE COE / School"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key takeaways or session notes..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isTeacherSelf ? 'Submit for Approval' : 'Save Training Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
