import React, { useState } from 'react';
import {
  Home,
  Save,
  CheckCircle,
  Eye,
  Settings,
  User,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';
import { DEFAULT_FORM_CONFIG, DEFAULT_ENQUIRIES } from './crmData';

export function CrmAdmissionFormPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('manualEntry'); // 'manualEntry' | 'formConfig' | 'publicPreview'
  const [formConfig, setFormConfig] = useState(DEFAULT_FORM_CONFIG);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Manual Entry Form State
  const [formData, setFormData] = useState({
    studentName: '',
    gender: 'Male',
    dob: '2015-06-15',
    className: 'I',
    previousSchool: '',
    parentName: '',
    motherName: '',
    mobile: '',
    altMobile: '',
    email: '',
    locality: '',
    city: 'Jaipur',
    source: 'Walk-in',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName || !formData.mobile) {
      alert('Please fill mandatory fields: Student Name and Contact Mobile');
      return;
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      alert(`Admission Enquiry registered successfully for ${formData.studentName}!`);
      if (onNavigate) onNavigate('/crm/enquiries');
    }, 800);
  };

  const toggleField = (fieldKey) => {
    setFormConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldKey]: {
          ...prev.fields[fieldKey],
          enabled: !prev.fields[fieldKey].enabled
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Admission & Enquiry Form
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600">
              CRM
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Admission Form</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate && onNavigate('/crm/qr-code')}
            className="h-9 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            <span>Get Shareable Link</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="border-b border-slate-200 px-4 flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('manualEntry')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'manualEntry'
                  ? 'border-[#5c67f6] text-[#5c67f6]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Manual Reception Entry</span>
            </button>
            <button
              onClick={() => setActiveTab('publicPreview')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'publicPreview'
                  ? 'border-[#5c67f6] text-[#5c67f6]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Parent Form Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('formConfig')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'formConfig'
                  ? 'border-[#5c67f6] text-[#5c67f6]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Form Fields Setup</span>
            </button>
          </div>

          {/* TAB 1: MANUAL RECEPTION FORM */}
          {activeTab === 'manualEntry' && (
            <div className="p-6">
              <div className="mb-5 pb-3 border-b">
                <h3 className="font-bold text-slate-900 text-sm">Walk-in Admission Enquiry Registration</h3>
                <p className="text-xs text-slate-500">Record direct parent visits or telephonic admissions into the ERP database.</p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
                {/* Student Info */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-indigo-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4" /> 1. Student Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Student Full Name*</label>
                      <input
                        type="text"
                        required
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Gender*</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Class Seeking Admission*</label>
                      <select
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        {SCHOOL_CLASSES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Previous School Name</label>
                      <input
                        type="text"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleInputChange}
                        placeholder="e.g. St. Xavier Public School"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Info */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-indigo-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> 2. Parent & Contact Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Father / Guardian Full Name*</label>
                      <input
                        type="text"
                        required
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Mother Full Name</label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sunita Sharma"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Primary Mobile Number*</label>
                      <input
                        type="tel"
                        required
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Alternate Phone</label>
                      <input
                        type="tel"
                        name="altMobile"
                        value={formData.altMobile}
                        onChange={handleInputChange}
                        placeholder="Alternate phone"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Email ID</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="parent@example.com"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-semibold mb-1">Locality / Address</label>
                      <input
                        type="text"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                        placeholder="e.g. Model Town Phase 1"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Enquiry Source</label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        <option value="Walk-in">Walk-in at Reception</option>
                        <option value="Website">School Website</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Friend / Referral</option>
                        <option value="Phone Call">Phone Call Inquiry</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Specific Remarks / Parent Query</label>
                  <textarea
                    rows="2"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Enter transport requirement, hostel queries, scholarship discussions..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-md flex items-center gap-1.5 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Submit & Register Enquiry</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PUBLIC PARENT FORM PREVIEW */}
          {activeTab === 'publicPreview' && (
            <div className="p-6 bg-slate-100/60 min-h-[500px]">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-[#5c67f6] p-6 text-white text-center">
                  <h3 className="text-xl font-bold">{formConfig.schoolName}</h3>
                  <p className="text-xs text-indigo-100 mt-1">{formConfig.formTitle}</p>
                  <p className="text-[11px] text-indigo-200 mt-2">{formConfig.welcomeSubtitle}</p>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Student Name*</label>
                      <input type="text" disabled placeholder="Enter student name" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Class Applying For*</label>
                      <select disabled className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <option>Class I</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Father / Guardian Name*</label>
                      <input type="text" disabled placeholder="Father name" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Contact Mobile*</label>
                      <input type="tel" disabled placeholder="Mobile number" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Locality / Address</label>
                    <input type="text" disabled placeholder="Your residential locality" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg" />
                  </div>

                  <div className="pt-3">
                    <button type="button" disabled className="w-full py-2.5 bg-[#5c67f6] text-white rounded-lg font-bold shadow-xs opacity-90">
                      Submit Online Enquiry
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                      Secured by Campus CRM • J D International School Admissions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FORM CONFIGURATION */}
          {activeTab === 'formConfig' && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Form Customization & Fields</h3>
                <p className="text-xs text-slate-500">Enable or disable optional fields displayed on the online public enquiry form.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(formConfig.fields).map(([key, val]) => (
                  <div
                    key={key}
                    onClick={() => toggleField(key)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      val.enabled ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{val.label}</span>
                      <span className="text-[10px] text-slate-400">
                        {val.required ? 'Mandatory Field' : 'Optional Field'}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      val.enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {val.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => alert('Form configuration settings saved successfully!')}
                  className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
