import React, { useState } from 'react';
import {
  Search,
  Printer,
  Upload,
  Camera,
  Calendar,
  Save,
  RotateCcw,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export function StudentRegistrationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    // Student Details
    srNo: '1992',
    admNo: '1992',
    enrollNo: '',
    permanentEduNo: '',
    className: 'Class 10',
    section: 'A',
    admDate: '2026-04-01',
    dob: '2011-08-15',
    feeType: 'Day Scholar', // Day Scholar / Hosteller
    studentType: 'New', // New / Old
    stream: 'None',
    firstName: '',
    lastName: '',
    gender: 'Male',
    contactPersonName: '',
    smsWhatsappNo: '',
    fatherName: '',
    motherName: '',
    fatherMobile: '',
    motherMobile: '',
    address: '',
    bloodGroup: '',
    category: 'General',
    aadharNo: '',

    // Transport
    busRoute: '',
    pickupPoint: '',

    // Hostel
    hostelRoom: '',
    bedNo: ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = [
    { id: 'student', label: 'Student Details' },
    { id: 'parents', label: "Parent's Details" },
    { id: 'transport', label: 'Transport' },
    { id: 'hostel', label: 'Hostel Allocation' },
    { id: 'documents', label: 'Documents' },
    { id: 'objection', label: 'Objection' },
    { id: 'sports', label: 'Sports' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800 text-sm">Student</span>
          <span>&bull;</span>
          <span className="text-gray-400">Student &bull; Student Registration</span>
        </div>
        <button
          onClick={() => window.print()}
          className="text-indigo-600 hover:text-indigo-800 p-1 rounded"
          title="Print Blank Form"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            Student Admission <span className="font-bold">Sr.No {formData.srNo}</span> registered successfully!
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 space-y-4">
        {/* Global Student Search Top Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, mobile, admission no..."
            className="w-full text-xs rounded-md border border-slate-300 pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Tab Switcher Line */}
        <div className="flex items-center space-x-1 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold">
          <button className="p-1 text-slate-400 hover:text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <button className="p-1 text-slate-400 hover:text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {activeTab === 'student' && (
            <div className="flex flex-col md:flex-row gap-5">
              {/* Left Profile Avatar Card */}
              <div className="w-full md:w-56 flex-shrink-0 bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex flex-col items-center justify-center text-center space-y-3">
                {/* Graduate Silhouette Avatar */}
                <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-5xl overflow-hidden shadow-inner">
                  🎓
                </div>

                {/* Upload Buttons */}
                <div className="flex items-center space-x-1 w-full justify-center">
                  <label className="cursor-pointer inline-flex items-center space-x-1 px-3 py-1.5 rounded-l bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <button
                    type="button"
                    className="p-1.5 rounded-r bg-slate-800 hover:bg-slate-900 text-white shadow-xs"
                    title="Camera Capture"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Metadata details */}
                <div className="text-[11px] text-slate-600 space-y-0.5 text-left w-full pt-2 border-t border-blue-100">
                  <p><strong>Roll No. :</strong> <span>--</span></p>
                  <p><strong>Comp. No. :</strong> <span>--</span></p>
                  <p><strong>Status :</strong> <span className="text-emerald-600 font-bold">Studying</span></p>
                </div>
              </div>

              {/* Right Input Fields Grid */}
              <div className="flex-1 space-y-3.5 text-xs">
                {/* Row 1: Sr.No, Adm.No, Enroll No, Permanent Edu No */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="relative">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Sr.No.*
                    </label>
                    <input
                      type="text"
                      name="srNo"
                      value={formData.srNo}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Adm.No./Sr.No.*
                    </label>
                    <input
                      type="text"
                      name="admNo"
                      value={formData.admNo}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Enroll No
                    </label>
                    <input
                      type="text"
                      name="enrollNo"
                      value={formData.enrollNo}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Permanent Edu No (PEN)
                    </label>
                    <input
                      type="text"
                      name="permanentEduNo"
                      value={formData.permanentEduNo}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Class, Section, Admission Date, Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Class*
                    </label>
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                      required
                    >
                      <option value="Nursery">Nursery</option>
                      <option value="L.K.G">L.K.G</option>
                      <option value="U.K.G">U.K.G</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 12">Class 12</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Section*
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                      required
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Admission Date
                    </label>
                    <input
                      type="date"
                      name="admDate"
                      value={formData.admDate}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5 text-orange-600 font-semibold">
                      Date Of Birth*
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full rounded border border-orange-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Fee Type, Student Type, Stream, Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Fee Type
                    </label>
                    <select
                      name="feeType"
                      value={formData.feeType}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Day Scholar">Day Scholar</option>
                      <option value="Hosteller">Hosteller</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Student Type*
                    </label>
                    <select
                      name="studentType"
                      value={formData.studentType}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Old">Old</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[11px] font-medium text-slate-600">Stream</label>
                      <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer">Add Stream</span>
                    </div>
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="None">None</option>
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Gender*
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: First Name, Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-orange-600 mb-0.5">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-orange-600 mb-0.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 5: Contact Person, SMS/Whatsapp, Father Name, Mother Name */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      SMS/Whatsapp Mobile
                    </label>
                    <input
                      type="text"
                      name="smsWhatsappNo"
                      value={formData.smsWhatsappNo}
                      onChange={handleInputChange}
                      placeholder="10 digit mobile"
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Father Name*
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Mother Name*
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="reset"
              className="px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
