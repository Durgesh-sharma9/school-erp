import React, { useState, useEffect } from 'react';
import {
  School, GraduationCap, Briefcase, IndianRupee, CheckCircle2,
  Sparkles, Phone, Mail, MapPin, FileText, User, ArrowRight,
  ShieldCheck, Building, Calendar, Check
} from 'lucide-react';
import { recruitmentStore } from './recruitmentStore';
import { HireHubLogo } from './components/HireHubLogo';

export function PublicApplyPortalPage({ onNavigate, isEmbedded = false, isStandalone = false }) {
  const navigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const [preSelectedJobId, setPreSelectedJobId] = useState(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('jobId') || null;
    } catch {
      return null;
    }
  });

  const [openings, setOpenings] = useState([]);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Female',
    dob: '',
    fatherHusbandName: '',
    phone: '',
    whatsapp: '',
    email: '',
    appliedPosition: '',
    department: 'Teaching',
    subject: '',
    qualification: '',
    experienceYears: 2,
    currentEmployer: '',
    currentSalary: 25000,
    expectedSalary: 35000,
    noticePeriod: '15 Days',
    address: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    bEdCompleted: true,
    ctetQualified: false,
    resumeName: '',
    coverNote: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const list = recruitmentStore.getJobOpenings();
    setOpenings(list);

    if (preSelectedJobId) {
      const match = list.find(o => o.id === preSelectedJobId);
      if (match) {
        setSelectedOpening(match);
        setFormData(prev => ({
          ...prev,
          appliedPosition: match.title,
          department: match.department
        }));
      }
    } else if (list.length > 0) {
      setSelectedOpening(list[0]);
      setFormData(prev => ({
        ...prev,
        appliedPosition: list[0].title,
        department: list[0].department
      }));
    }
  }, [preSelectedJobId]);

  const handlePositionSelect = (opening) => {
    setSelectedOpening(opening);
    setFormData(prev => ({
      ...prev,
      appliedPosition: opening.title,
      department: opening.department
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit mobile number is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Highest qualification is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    const created = recruitmentStore.createCandidate({
      ...formData,
      source: 'Online Portal',
      expectedSalary: Number(formData.expectedSalary),
      currentSalary: Number(formData.currentSalary),
      experienceYears: Number(formData.experienceYears)
    });

    setSubmittedCandidate(created);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SUCCESS CONFIRMATION SCREEN (HireHub style)
  if (submitted && submittedCandidate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0FCF5] via-slate-50 to-white flex items-center justify-center p-4 antialiased">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Application Submitted Successfully!
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Thank You, {submittedCandidate.name}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Your application for <span className="font-bold text-[#8A3BD4]">{submittedCandidate.appliedPosition}</span> has been received by the Academic Selection Committee at JD International School.
            </p>
          </div>

          {/* Reference Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-500">Application Reference ID:</span>
              <span className="font-mono font-bold text-[#8A3BD4] text-sm">{submittedCandidate.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-slate-800">{submittedCandidate.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/80">
              <span className="text-slate-500">Email:</span>
              <span className="font-semibold text-slate-800">{submittedCandidate.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Submission Date:</span>
              <span className="font-semibold text-slate-800">{submittedCandidate.appliedDate}</span>
            </div>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-xl text-left text-xs text-[#8A3BD4] space-y-1 border border-purple-100">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8A3BD4]" /> What happens next?
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Our HR department will review your profile and academic credentials within 2-3 business days. If shortlisted, you will receive an invitation via WhatsApp/Call for the personal interview and classroom demo round.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setSubmittedCandidate(null);
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Submit Another Application
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#00D2FF] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Return to School Portal
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`text-slate-800 antialiased ${isEmbedded ? 'pb-16' : 'min-h-screen bg-[#F4F7F6]/80 pb-16'}`}>
      
      {/* ─── Embedded ERP Banner (Shown only when viewing inside School ERP) ─── */}
      {isEmbedded && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-teal-50 border border-purple-200/80 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-[#8A3BD4] shadow-2xs shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">Candidate Self-Apply Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                This interactive form is what external teacher applicants see when scanning your school's QR code.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.open('/apply', '_blank')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#8A3BD4] bg-white hover:bg-purple-50 border border-purple-200 shadow-2xs transition cursor-pointer"
            >
              <span>Open Standalone Portal ↗</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/recruitment-candidates') : null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer"
            >
              <span>Candidates Pool</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── TOP HEADER (Shown for public applicants) ─── */}
      {!isEmbedded && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00D2FF] text-white font-black text-sm flex items-center justify-center shadow-xs">
                JD
              </div>
              <div>
                <h1 className="font-black text-sm text-slate-900 tracking-tight uppercase">
                  JD International School
                </h1>
                <p className="text-[10px] text-[#8A3BD4] font-semibold">
                  Staff Recruitment Portal • Powered by HireHub
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Application Portal
              </span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold text-[#8A3BD4] hover:text-[#7C3AED] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                ERP Login →
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ─── HERO BANNER (HireHub style) ─── */}
      <section className="bg-gradient-to-r from-[#08295C] via-[#0F766E] to-[#7C3AED] text-white py-10 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Session 2026-2027 Academic Faculty & Staff Recruitment
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Join Our Prestigious Educator Community
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed">
            We are hiring passionate PGT, TGT, PRT teachers, activity instructors, and administrative leaders. Fill out the application form below to apply directly.
          </p>
        </div>
      </section>

      {/* ─── FORM CONTAINER ─── */}
      <main className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          
          {/* Position Selector Bar */}
          <div className="p-6 bg-slate-50/80 border-b border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step 1: Select Position You Are Applying For
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {openings.map(op => {
                const isSelected = selectedOpening?.id === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handlePositionSelect(op)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#8A3BD4] bg-purple-50 text-slate-950 ring-2 ring-purple-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-bold line-clamp-1">{op.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#8A3BD4] shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="font-semibold text-[#0F766E]">{op.salaryRange}</span>
                      <span>{op.minExperience}+ yrs exp</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 text-slate-800">
            
            {/* Step 2: Personal Information */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8A3BD4]" /> Personal & Contact Information
                </h3>
                <p className="text-[11px] text-slate-500">Provide accurate contact details so we can reach you for interview calls.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Candidate Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full official name"
                    className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8A3BD4] ${errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father / Spouse Name</label>
                  <input
                    type="text"
                    name="fatherHusbandName"
                    value={formData.fatherHusbandName}
                    onChange={handleChange}
                    placeholder="Father or spouse name"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (Calling) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8A3BD4] ${errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    maxLength={10}
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="For interview invite & schedule"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. educator@example.com"
                    className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8A3BD4] ${errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-0.5">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, locality, area in Jaipur"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City & Pincode</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Jaipur - 302021"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Academic Qualifications */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#8A3BD4]" /> Academic & Professional Qualifications
                </h3>
                <p className="text-[11px] text-slate-500">Highest degrees and teacher eligibility test certifications.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highest Educational Degrees & University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. M.Sc (Mathematics), B.Ed from Rajasthan University"
                    className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#8A3BD4] ${errors.qualification ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'}`}
                  />
                  {errors.qualification && <p className="text-[11px] text-rose-500 mt-0.5">{errors.qualification}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Subject Specialization</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics, English, Physics"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-6 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="bEdCompleted"
                      checked={formData.bEdCompleted}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8A3BD4] rounded border-slate-300"
                    />
                    B.Ed / D.El.Ed Completed
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="ctetQualified"
                      checked={formData.ctetQualified}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8A3BD4] rounded border-slate-300"
                    />
                    CTET / REET Qualified
                  </label>
                </div>
              </div>
            </div>

            {/* Step 4: Teaching Experience */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#8A3BD4]" /> Teaching Experience & Compensation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Teaching Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    min="0"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current / Previous School or Institute</label>
                  <input
                    type="text"
                    name="currentEmployer"
                    value={formData.currentEmployer}
                    onChange={handleChange}
                    placeholder="Name of school, city"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Period</label>
                  <select
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="45 Days">45 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Salary (₹/month)</label>
                  <input
                    type="number"
                    name="currentSalary"
                    value={formData.currentSalary}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Salary (₹/month)</label>
                  <input
                    type="number"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl font-bold text-[#8A3BD4]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cover Note / Brief Statement of Purpose
                  </label>
                  <textarea
                    rows={3}
                    name="coverNote"
                    value={formData.coverNote}
                    onChange={handleChange}
                    placeholder="Mention why you want to join JD International School, your teaching philosophy, or notable student achievements..."
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#8A3BD4]"
                  />
                </div>
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-500 text-center sm:text-left">
                By submitting this application, you declare that all information furnished is true to the best of your knowledge.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#7C3AED] via-[#8A3BD4] to-[#00D2FF] text-white font-bold text-xs rounded-xl shadow-md transition hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                Submit Application to School <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      </main>

    </div>
  );
}
