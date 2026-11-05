import React, { useState } from 'react';
import {
  X,
  User,
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
  FileUp
} from 'lucide-react';
import { recruitmentStore } from './recruitmentStore';

export function CandidateAddEditModal({ isOpen, onClose, onCandidateCreated }) {
  if (!isOpen) return null;

  const openings = recruitmentStore.getJobOpenings();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Female',
    dob: '',
    fatherHusbandName: '',
    phone: '',
    whatsapp: '',
    email: '',
    appliedPosition: openings.length > 0 ? openings[0].title : 'PGT Mathematics (Classes XI & XII)',
    department: 'Teaching',
    subject: '',
    qualification: '',
    experienceYears: 2,
    currentEmployer: '',
    currentSalary: 25000,
    expectedSalary: 32000,
    noticePeriod: '15 Days',
    address: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    source: 'Direct Walk-in',
    bEdCompleted: true,
    ctetQualified: false,
    interviewerNotes: ''
  });

  const [errors, setErrors] = useState({});

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

  const handlePositionChange = (e) => {
    const selectedTitle = e.target.value;
    const opening = openings.find(o => o.title === selectedTitle);
    setFormData(prev => ({
      ...prev,
      appliedPosition: selectedTitle,
      department: opening ? opening.department : prev.department
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Candidate Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const created = recruitmentStore.createCandidate({
      ...formData,
      expectedSalary: Number(formData.expectedSalary),
      currentSalary: Number(formData.currentSalary),
      experienceYears: Number(formData.experienceYears)
    });

    if (onCandidateCreated) onCandidateCreated(created);
    alert(`Candidate ${created.name} registered successfully with ID ${created.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-200" /> Add Candidate / Walk-in Applicant
            </h2>
            <p className="text-xs text-indigo-100">JD International School • Talent Hub</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Section 1: Candidate Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" /> 1. Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Chandra Sharma"
                  className={`w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'}`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Father / Spouse Name</label>
                <input
                  type="text"
                  name="fatherHusbandName"
                  value={formData.fatherHusbandName}
                  onChange={handleChange}
                  placeholder="Father or Husband name"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className={`w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'}`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="If different from mobile"
                  maxLength={10}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
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
                  placeholder="candidate@example.com"
                  className={`w-full text-xs px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'}`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Application Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Direct Walk-in">Direct Walk-in</option>
                  <option value="Online Portal">Online Portal</option>
                  <option value="Walk-in / QR">Walk-in / QR</option>
                  <option value="Referral">Staff Referral</option>
                  <option value="Newspaper Ad">Newspaper Ad</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House No, Colony, Landmark"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City & State</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Jaipur, Rajasthan"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Position & Academic Qualification */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" /> 2. Position Applied & Teaching Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Applied Position / Role</label>
                <select
                  name="appliedPosition"
                  value={formData.appliedPosition}
                  onChange={handlePositionChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {openings.map(o => (
                    <option key={o.id} value={o.title}>{o.title}</option>
                  ))}
                  <option value="Primary Teacher (All Subjects)">Primary Teacher (All Subjects)</option>
                  <option value="Computer Teacher (IT & AI)">Computer Teacher (IT & AI)</option>
                  <option value="Librarian & Media In-charge">Librarian & Media In-charge</option>
                  <option value="Music & Performing Arts Teacher">Music & Performing Arts Teacher</option>
                  <option value="Hostel Warden">Hostel Warden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Teaching">Teaching</option>
                  <option value="Administration">Administration</option>
                  <option value="Sports">Sports</option>
                  <option value="Transport">Transport</option>
                  <option value="Support Staff">Support Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Specialization</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics, English"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Academic Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. M.Sc (Maths), B.Ed, University of Rajasthan"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3 flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="bEdCompleted"
                    checked={formData.bEdCompleted}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  B.Ed / D.El.Ed Completed
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    name="ctetQualified"
                    checked={formData.ctetQualified}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  CTET / REET Qualified
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Experience & CTC */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-indigo-600" /> 3. Experience & Compensation Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Experience (Years)</label>
                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  max="40"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Employer / School</label>
                <input
                  type="text"
                  name="currentEmployer"
                  value={formData.currentEmployer}
                  onChange={handleChange}
                  placeholder="e.g. Modern Academy Jaipur"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Period</label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="45 Days">45 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Monthly CTC (₹)</label>
                <input
                  type="number"
                  name="currentSalary"
                  value={formData.currentSalary}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Monthly CTC (₹)</label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Screening Observations</label>
                <textarea
                  name="interviewerNotes"
                  rows={2}
                  value={formData.interviewerNotes}
                  onChange={handleChange}
                  placeholder="Any walk-in feedback, demeanor, subject strength, salary expectations notes..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Save Candidate Profile
          </button>
        </div>

      </div>
    </div>
  );
}
