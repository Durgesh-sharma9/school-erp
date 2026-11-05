import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  FileText,
  Building,
  Check,
  AlertCircle,
  Award,
  Send,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PIPELINE_STAGES, recruitmentStore } from './recruitmentStore';
import WhatsAppIcon from './components/WhatsAppIcon';

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 py-3 last:border-0 group transition-colors">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400 self-center">{label}</dt>
      <dd className="col-span-2 text-xs sm:text-sm font-semibold text-slate-800 self-center break-words">{value || '-'}</dd>
    </div>
  );
}

const HIREHUB_STAGES = [
  { id: 'new', label: 'New Application', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { id: 'shortlisted', label: 'Shortlisted', color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
  { id: 'interview_scheduled', label: 'Interview Scheduled', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { id: 'demo_class', label: 'Demo Class', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' },
  { id: 'offered', label: 'Offered', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { id: 'hired', label: 'Hired', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 font-bold' },
  { id: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
];

export function CandidateProfileModal({ candidate, isOpen, onClose, onCandidateUpdated, onHireSuccess }) {
  if (!isOpen || !candidate) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'experience' | 'interview' | 'documents'
  const [currentStatus, setCurrentStatus] = useState(candidate.status || 'new');
  const [rating, setRating] = useState(candidate.rating || 0);
  const [notes, setNotes] = useState(candidate.interviewerNotes || '');
  const [interviewDate, setInterviewDate] = useState(candidate.interviewDate || '');
  const [interviewTime, setInterviewTime] = useState(candidate.interviewTime || '');
  const [interviewLocation, setInterviewLocation] = useState(candidate.interviewLocation || 'Principal Office / Audio-Visual Room');
  
  // 1-Click Hire State
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [offeredSalary, setOfferedSalary] = useState(candidate.expectedSalary || 30000);
  const [isHiring, setIsHiring] = useState(false);

  const handleSaveEvaluation = () => {
    recruitmentStore.updateCandidate(candidate.id, {
      status: currentStatus,
      rating,
      interviewerNotes: notes,
      interviewDate,
      interviewTime,
      interviewLocation
    });
    if (onCandidateUpdated) onCandidateUpdated();
    alert('Candidate evaluation updated successfully!');
  };

  const handleConfirmHire = () => {
    setIsHiring(true);
    try {
      const res = recruitmentStore.hireCandidateToStaff(candidate.id, {
        finalSalary: offeredSalary
      });
      setIsHiring(false);
      setShowHireDialog(false);
      if (onHireSuccess) {
        onHireSuccess(res);
      } else {
        alert(res.message);
      }
      if (onCandidateUpdated) onCandidateUpdated();
      onClose();
    } catch (e) {
      setIsHiring(false);
      alert('Error during hiring: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* ─── 1. HIREHUB HERO HEADER ─── */}
        <div className="bg-gradient-to-r from-[#F0FCF5] via-[#EFF6FF] to-[#FAF5FF] border-b border-slate-200/80 p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-full border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {candidate.photoUrl ? (
                  <img
                    src={candidate.photoUrl}
                    alt={candidate.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-purple-300/40 shadow-xs"
                  />
                ) : (
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-[#8A3BD4] to-[#A855F7] text-white flex items-center justify-center text-2xl font-black shadow-xs">
                    {candidate.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="Candidate Profile Active">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{candidate.name}</h2>
                  <span className="bg-purple-50 text-[#8A3BD4] border border-purple-200 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {candidate.appliedPosition}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  {candidate.city || 'Jaipur'}, {candidate.state || 'Rajasthan'}
                  <span>•</span>
                  <span>{candidate.department} Department</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">ID: {candidate.id}</span>
                  <span>•</span>
                  <span>Applied on {candidate.appliedDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/91${candidate.phone}?text=Hello%20${encodeURIComponent(candidate.name)},%20greetings%20from%20JD%20International%20School%20regarding%20your%20application%20for%20${encodeURIComponent(candidate.appliedPosition)}.`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <a
                href={`tel:${candidate.phone}`}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Call
              </a>
            </div>
          </div>
        </div>

        {/* ─── 2. PIPELINE STAGE STEPPER (HireHub style) ─── */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            {HIREHUB_STAGES.map(stage => {
              const isCurrent = currentStatus === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStatus(stage.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? `${stage.color} ring-2 ring-purple-500/30 shadow-xs scale-102`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. TAB NAVIGATION ─── */}
        <div className="bg-white border-b border-slate-100 px-6 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'Personal Biodata', icon: User },
            { id: 'experience', label: 'Academics & Experience', icon: GraduationCap },
            { id: 'interview', label: 'Evaluation & Notes', icon: Award },
            { id: 'documents', label: 'CV & Documents', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#8A3BD4] text-[#8A3BD4]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#8A3BD4]' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── 4. MODAL SCROLLABLE BODY ─── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Contact Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Phone className="w-4 h-4 text-[#0F766E]" /> Contact & Communication
                  </h4>
                  <dl className="space-y-0.5">
                    <DetailRow label="Mobile Calling" value={candidate.phone} />
                    <DetailRow label="WhatsApp" value={candidate.whatsapp || candidate.phone} />
                    <DetailRow label="Email Address" value={candidate.email} />
                    <DetailRow label="Residential Address" value={`${candidate.address || 'Jaipur'}, ${candidate.pincode || '302001'}`} />
                  </dl>
                </div>

                {/* Personal & Compensation */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <User className="w-4 h-4 text-[#8A3BD4]" /> Personal Profile & Compensation
                  </h4>
                  <dl className="space-y-0.5">
                    <DetailRow label="Father / Spouse" value={candidate.fatherHusbandName || 'N/A'} />
                    <DetailRow label="Gender & DOB" value={`${candidate.gender || 'Not specified'} • ${candidate.dob || 'N/A'}`} />
                    <DetailRow label="Current Monthly" value={`₹${Number(candidate.currentSalary || 0).toLocaleString('en-IN')}`} />
                    <DetailRow label="Expected Monthly" value={`₹${Number(candidate.expectedSalary || 0).toLocaleString('en-IN')}`} />
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMICS & EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#8A3BD4]" /> Academic Qualifications
                  </h4>
                  <p className="text-sm font-bold text-slate-800">{candidate.qualification || 'Graduation / Post Graduation'}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${candidate.bEdCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {candidate.bEdCompleted ? '✓ B.Ed Qualified' : 'B.Ed Not Completed'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${candidate.ctetQualified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {candidate.ctetQualified ? '✓ CTET / REET Passed' : 'CTET / REET N/A'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#0F766E]" /> Teaching Experience
                  </h4>
                  <p className="text-sm font-bold text-slate-800">{candidate.currentEmployer || 'Private School / Freelance'}</p>
                  <p className="text-xs text-slate-600">
                    Total Experience: <span className="font-bold text-slate-800">{candidate.experienceYears} Years</span> • Notice: <span className="font-bold text-slate-800">{candidate.noticePeriod || 'Immediate'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVALUATION & NOTES */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Rating */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Candidate Rating (1-5 Stars)
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">({rating} / 5)</span>
                  </div>
                </div>

                {/* Interview Schedule */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Interview / Demo Class Schedule
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={e => setInterviewDate(e.target.value)}
                      className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                    <input
                      type="time"
                      value={interviewTime}
                      onChange={e => setInterviewTime(e.target.value)}
                      className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

              </div>

              {/* Notes */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Interviewer & Principal Observations
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Record assessment on subject fluency, board questions handling, personality, demo class rating..."
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#8A3BD4] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveEvaluation}
                  className="px-5 py-2 bg-[#8A3BD4] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Evaluation & Pipeline State
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CV & DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8A3BD4] border border-purple-200 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Curriculum Vitae / Resume</h5>
                    <p className="text-[11px] text-slate-500">Candidate_Resume_{candidate.name.replace(/\s+/g, '_')}.pdf</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Resume preview opened.')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View PDF
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ─── 5. FOOTER WITH 1-CLICK HIRE TO SCHOOL ERP ─── */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            {candidate.status === 'hired' ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Onboarded to School Staff Roster
              </span>
            ) : (
              <span>Ready to extend offer or onboard this candidate into School ERP?</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Close
            </button>

            {candidate.status !== 'hired' ? (
              <button
                type="button"
                onClick={() => setShowHireDialog(true)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Hire & Convert to Staff Roster
              </button>
            ) : (
              <span className="px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                Staff Profile Active in Payroll
              </span>
            )}
          </div>
        </div>

        {/* 1-Click Hire Confirmation Dialog */}
        {showHireDialog && (
          <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-100">
              <div className="flex items-center gap-3 text-emerald-700">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Confirm Hiring & Port to Staff Roster</h3>
                  <p className="text-xs text-slate-500">JD International School HRMS</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate:</span>
                  <span className="font-bold text-slate-900">{candidate.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-bold text-slate-900">{candidate.appliedPosition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-900">{candidate.department}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Agreed Monthly Gross Salary (₹)
                </label>
                <input
                  type="number"
                  value={offeredSalary}
                  onChange={e => setOfferedSalary(e.target.value)}
                  className="w-full text-sm font-bold px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Will automatically generate salary breakdown (50% Basic, 20% HRA, 10% DA, Allowances) in Salary Structure.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHireDialog(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isHiring}
                  onClick={handleConfirmHire}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  {isHiring ? 'Porting Staff...' : 'Confirm & Generate Staff Code'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
