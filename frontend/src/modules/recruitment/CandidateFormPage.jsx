import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Briefcase, 
  GraduationCap, 
  IndianRupee, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  FileUp,
  Save,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  Star,
  Camera,
  Upload,
  X,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recruitmentStore } from './recruitmentStore';
import { PageHeader } from './components/PageHeader';

const POSITIONS = [
  'PGT Mathematics (Classes XI & XII)',
  'PGT Physics (Classes XI & XII)',
  'PGT Chemistry (Classes XI & XII)',
  'PGT Biology (Classes XI & XII)',
  'TGT English & Social Science',
  'TGT Science & Mathematics',
  'TGT Hindi & Sanskrit',
  'PRT Mother Teacher (Primary Classes I-III)',
  'PRT Environmental Studies & Math',
  'Senior Physical Education Teacher & Sports Coach',
  'Senior School Accountant (Tally Prime & ERP)',
  'School Bus Driver (Heavy Vehicle License)',
  'Computer Teacher / AI Lab Incharge',
  'Music & Dance Teacher',
  'School Receptionist / Front Desk Executive',
  'Librarian',
  'Lab Assistant (Science & Computer)',
  'Office Clerk / Fee Incharge'
];

const QUALIFICATION_OPTIONS = [
  'B.Ed (Bachelor of Education)',
  'M.Sc (Master of Science)',
  'M.A (Master of Arts)',
  'M.Com (Master of Commerce)',
  'B.Sc (Bachelor of Science)',
  'B.A (Bachelor of Arts)',
  'B.Com (Bachelor of Commerce)',
  'Ph.D in Relevant Subject',
  'B.P.Ed / M.P.Ed / NIS',
  'D.El.Ed / NTT',
  'B.Tech / MCA (Computer Science)',
  '12th Pass',
  '10th Pass'
];

const STATES = [
  'Rajasthan',
  'Delhi',
  'Uttar Pradesh',
  'Haryana',
  'Punjab',
  'Madhya Pradesh',
  'Gujarat',
  'Maharashtra',
  'Bihar',
  'Uttarakhand'
];

export function CandidateFormPage({ onNavigate, candidateId }) {
  // If candidateId not passed in props, check query param ?id=
  let activeId = candidateId;
  if (!activeId && typeof window !== 'undefined') {
    try {
      const sp = new URLSearchParams(window.location.search);
      activeId = sp.get('id');
    } catch {}
  }

  const isEdit = Boolean(activeId);
  const existing = activeId ? recruitmentStore.getCandidateById(activeId) : null;

  const [formData, setFormData] = useState(() => {
    if (existing) {
      return {
        ...existing,
        qualifications: Array.isArray(existing.qualifications) 
          ? existing.qualifications 
          : existing.qualification ? [existing.qualification] : ['B.Ed (Bachelor of Education)', 'M.Sc (Master of Science)']
      };
    }
    return {
      name: '',
      gender: 'Female',
      dob: '1996-05-15',
      phone: '',
      whatsapp: '',
      email: '',
      photoUrl: '',
      appliedPosition: POSITIONS[0],
      department: 'Teaching',
      subject: 'Mathematics',
      qualifications: ['B.Ed (Bachelor of Education)', 'M.Sc (Master of Science)'],
      experienceYears: 4,
      currentSalary: 28000,
      expectedSalary: 38000,
      address: 'Plot 42, Vaishali Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      area: 'Vaishali Nagar',
      pincode: '302021',
      status: 'new',
      notes: 'Passionate teacher with strong classroom management skills.',
      documents: []
    };
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const handleToggleQualification = (q) => {
    setFormData(prev => {
      const exists = prev.qualifications.includes(q);
      const updated = exists 
        ? prev.qualifications.filter(item => item !== q)
        : [...prev.qualifications, q];
      return { ...prev, qualifications: updated, qualification: updated.join(', ') };
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newDocs = files.map(f => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.type,
        url: URL.createObjectURL(f)
      }));
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), ...newDocs]
      }));
      toast.success(`${files.length} document(s) attached!`);
    }
  };

  const removeDoc = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Full candidate name is required';
    if (!formData.phone?.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit mobile number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        qualification: formData.qualifications.join(', '),
        expectedSalary: Number(formData.expectedSalary || 0),
        experienceYears: Number(formData.experienceYears || 0)
      };

      if (isEdit && existing) {
        recruitmentStore.updateCandidate(existing.id, payload);
        toast.success(`Candidate ${formData.name} updated successfully!`);
      } else {
        recruitmentStore.createCandidate(payload);
        toast.success(`Candidate ${formData.name} added to candidates pool!`);
      }

      if (onNavigate) {
        onNavigate('/recruitment-candidates');
      } else {
        window.history.pushState({}, '', '/recruitment-candidates');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save candidate. Please verify details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 max-w-4xl mx-auto pb-16 antialiased text-slate-800">
      
      {/* ─── Top Breadcrumb Bar (1:1 with HireHub) ─── */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('/recruitment-candidates') : window.history.back()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-900 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
          <span>Back to Candidates Pool</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20">
          <span className="h-2 w-2 rounded-full bg-[#0F766E] animate-pulse" />
          <span>{isEdit ? 'Edit Record' : 'Direct Manual Entry'}</span>
        </div>
      </div>

      {/* ─── Page Identity Header (1:1 with HireHub) ─── */}
      <div className="space-y-1 pb-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {isEdit ? 'Edit Candidate' : 'Add New Candidate'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fill in the details below to add a candidate directly to your school's recruitment database.
        </p>
      </div>

      {/* ─── Form Form Fields Container ─── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* CARD 1: Basic Personal Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-[#8A3BD4] flex items-center justify-center font-bold">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Basic Personal Details</h3>
              <p className="text-[11px] text-slate-500">Candidate personal identity and contact details</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Candidate Photo Upload Box */}
            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
              {formData.photoUrl ? (
                <div className="relative group shrink-0">
                  <img
                    src={formData.photoUrl}
                    alt="Candidate"
                    className="h-14 w-14 rounded-full object-cover border-2 border-[#0F766E] shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition shadow-xs cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-300 hover:border-[#0F766E] bg-white hover:bg-teal-50/50 transition shadow-2xs shrink-0 group">
                  <Camera className="h-4 w-4 text-slate-400 group-hover:text-[#0F766E] transition-all" />
                  <span className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider group-hover:text-[#0F766E]">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">Candidate Photo</h4>
                <p className="text-[11px] text-slate-400">Square or passport photo (JPG/PNG up to 5MB).</p>
              </div>
            </div>

            {/* Row 1: Full Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  FULL NAME <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={`w-full pl-9 pr-3.5 py-2 text-xs border rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20 ${
                      errors.name ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  <UserPlus className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
                {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  MOBILE NUMBER <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className={`w-full pl-9 pr-3.5 py-2 text-xs border rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20 ${
                      errors.phone ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
                {errors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Row 2: Email, Gender, DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">EMAIL ADDRESS</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GENDER</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">DATE OF BIRTH</label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                </div>
              </div>
            </div>

            {/* Subheader: Candidate Location & Address */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                <MapPin className="h-3.5 w-3.5 text-[#0F766E]" />
                <span>Candidate Location & Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">STATE / REGION</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  >
                    {STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">CITY / DISTRICT</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">AREA / LOCALITY</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Mansarovar, Vaishali Nagar"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">FULL ADDRESS</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House/Flat street no, colony, landmark"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 2: Target Position & Role */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Target Position & Role</h3>
              <p className="text-[11px] text-slate-500">Select the prospective job role for this candidate</p>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              PRIMARY POSITION APPLIED <span className="text-rose-500">*</span>
            </label>
            <select
              name="appliedPosition"
              value={formData.appliedPosition}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
            >
              {POSITIONS.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CARD 3: Qualifications & Experience */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Qualifications & Experience</h3>
              <p className="text-[11px] text-slate-500">Enter candidate's qualifications, total experience, expected salary, and notes</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Multi-Select Qualifications Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                QUALIFICATIONS (Tap to select multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {QUALIFICATION_OPTIONS.map(q => {
                  const selected = formData.qualifications?.includes(q);
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleToggleQualification(q)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#0F766E] text-white shadow-2xs shadow-teal-700/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {selected ? `✓ ${q}` : `+ ${q}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row: Experience & Expected Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  TOTAL EXPERIENCE (YEARS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="experienceYears"
                    min="0"
                    max="40"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                  <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  EXPECTED MONTHLY SALARY (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="expectedSalary"
                    min="0"
                    step="1000"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    placeholder="e.g. 35000"
                    className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
                  />
                  <IndianRupee className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ADDITIONAL NOTES & COMMENTS
              </label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Highlight candidate strengths, key achievements, or interview notes..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]/20"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: Resume & Documents Upload */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Resume & Documents Upload</h3>
              <p className="text-[11px] text-slate-500">Upload candidate resume/CV, certificates, experience letters, and other records</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-teal-50/30 hover:border-[#0F766E]/60 transition-all cursor-pointer group">
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-all text-[#0F766E]">
                <FileUp className="h-6 w-6 stroke-[1.8]" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-2.5">Click or Drag files to upload</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOC, DOCX, JPG, PNG (Max 5MB each, max 10 files)</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* Uploaded Documents List */}
            {formData.documents?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {formData.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate" title={doc.name}>
                        {doc.name}
                      </span>
                      {doc.size && <span className="text-[10px] text-slate-400 shrink-0">({doc.size})</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDoc(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── Bottom Actions (Cancel + Add Candidate in #0F766E) ─── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('/recruitment-candidates') : window.history.back()}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition cursor-pointer shadow-2xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D625C] text-white text-xs font-extrabold shadow-md shadow-teal-700/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Candidate' : 'Add Candidate'}
          </button>
        </div>

      </form>

    </div>
  );
}
