import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  Search,
  Save,
  RotateCcw,
  Upload,
  Calendar,
  Phone,
  Mail,
  Home,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bus,
  BedDouble,
  Trophy,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

export function StudentRegistrationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    // Student Details
    srNo: '10964/2026/089',
    admNo: 'JD-2026-142',
    enrollNo: 'ENR-9842',
    permanentEduNo: 'PEN-871239082',
    admDate: '2026-04-01',
    dob: '2012-08-15',
    studentType: 'NEW', // NEW / OLD
    classId: 'Class 8',
    sectionId: 'A',
    stream: 'General',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'Boy',
    category: 'General',
    religion: 'Hindu',
    bloodGroup: 'B+',
    aadharNo: '7823-4412-9011',

    // Parent's Details
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    fatherMobile: '9829012345',
    motherMobile: '9829012346',
    smsMobile: '9829012345',
    fatherOccupation: 'Businessman',
    motherOccupation: 'Teacher',
    fatherAadhar: '4412-9981-3321',
    annualIncome: '8,50,000',
    currentAddress: 'Plot No. 42, Gokul Vatika, Tonk Road, Jaipur',
    permanentAddress: 'Plot No. 42, Gokul Vatika, Tonk Road, Jaipur',
    city: 'Jaipur',
    pincode: '302018',

    // Transport
    optTransport: 'No',
    route: '',
    pickupPoint: '',
    vehicleNo: '',

    // Hostel
    optHostel: 'No',
    roomNo: '',
    bedNo: '',

    // Objection
    hasObjection: 'No',
    objectionReason: '',

    // Sports & Extra Curricular
    sportName: 'Cricket',
    achievementLevel: 'District Level',
    hobbies: 'Chess, Coding'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = [
    { id: 'student', label: '1. Student Details', icon: GraduationCap },
    { id: 'parents', label: "2. Parent's Details", icon: Users },
    { id: 'transport', label: '3. Transport', icon: Bus },
    { id: 'hostel', label: '4. Hostel', icon: BedDouble },
    { id: 'documents', label: '5. Documents', icon: FileText },
    { id: 'objection', label: '6. Objection', icon: ShieldAlert },
    { id: 'sports', label: '7. Sports', icon: Trophy },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Student Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Student Registration (Admission)</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Session 2026-2027
            </span>
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate && onNavigate('/student-portfolio')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Student Directory</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-sm animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Admission Record Registered Successfully!</span> Admission No: <span className="font-mono font-semibold">{formData.admNo}</span> ({formData.firstName} {formData.lastName}) saved to database.
          </div>
        </div>
      )}

      {/* Main Registration Form Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* 7 Tabs Header (UAB Style) */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 p-1.5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSave} className="p-6">
          {/* TAB 1: Student Details */}
          {activeTab === 'student' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* SR No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SR No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="srNo"
                    value={formData.srNo}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Admission No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="admNo"
                    value={formData.admNo}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-indigo-50/40 text-indigo-900 font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Enrollment No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrollment No.
                  </label>
                  <input
                    type="text"
                    name="enrollNo"
                    value={formData.enrollNo}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Permanent Edu No (PEN) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PEN (Permanent Edu No.)
                  </label>
                  <input
                    type="text"
                    name="permanentEduNo"
                    value={formData.permanentEduNo}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Admission Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    name="admDate"
                    value={formData.admDate}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Student Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="studentType"
                    value={formData.studentType}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  >
                    <option value="NEW">NEW ADMISSION</option>
                    <option value="OLD">OLD STUDENT</option>
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="classId"
                    value={formData.classId}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  >
                    <option value="Nursery">Nursery</option>
                    <option value="L.K.G">L.K.G</option>
                    <option value="U.K.G">U.K.G</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Section <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="sectionId"
                    value={formData.sectionId}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Personal Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Aarav"
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Sharma"
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    >
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  {/* DOB */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth (DOB)
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Aadhar No */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Aadhar No.
                    </label>
                    <input
                      type="text"
                      name="aadharNo"
                      value={formData.aadharNo}
                      onChange={handleInputChange}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Parent's Details */}
          {activeTab === 'parents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Father Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Father's Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                    required
                  />
                </div>

                {/* Father Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Father's Mobile No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherMobile"
                    value={formData.fatherMobile}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                    required
                  />
                </div>

                {/* Father Occupation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Father's Occupation
                  </label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mother Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  />
                </div>

                {/* Mother Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mother's Mobile No.
                  </label>
                  <input
                    type="text"
                    name="motherMobile"
                    value={formData.motherMobile}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* SMS & WhatsApp Alert No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SMS / WhatsApp Mobile No.
                  </label>
                  <input
                    type="text"
                    name="smsMobile"
                    value={formData.smsMobile}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-emerald-50/50 text-emerald-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {/* Address Details */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Residential Address
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Residential Address
                    </label>
                    <textarea
                      name="currentAddress"
                      rows={2}
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pin Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Transport */}
          {activeTab === 'transport' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Require School Transport Facility?
                </label>
                <select
                  name="optTransport"
                  value={formData.optTransport}
                  onChange={handleInputChange}
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-semibold"
                >
                  <option value="No">No - Own Transport</option>
                  <option value="Yes">Yes - School Bus Required</option>
                </select>
              </div>

              {formData.optTransport === 'Yes' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bus Route
                    </label>
                    <select
                      name="route"
                      value={formData.route}
                      onChange={handleInputChange}
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white"
                    >
                      <option value="">Select Route</option>
                      <option value="Route 1">Route 1 (Tonk Road - Mansarovar)</option>
                      <option value="Route 2">Route 2 (Malviya Nagar - Jagatpura)</option>
                      <option value="Route 3">Route 3 (Vaishali Nagar - Ajmer Road)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pickup / Drop Point
                    </label>
                    <input
                      type="text"
                      name="pickupPoint"
                      value={formData.pickupPoint}
                      onChange={handleInputChange}
                      placeholder="e.g. Sanganer Flyover"
                      className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Hostel */}
          {activeTab === 'hostel' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Opt for Hostel Accommodation?
                </label>
                <select
                  name="optHostel"
                  value={formData.optHostel}
                  onChange={handleInputChange}
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-semibold"
                >
                  <option value="No">No - Day Scholar</option>
                  <option value="Yes">Yes - Hosteller</option>
                </select>
              </div>

              {formData.optHostel === 'Yes' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Room No.</label>
                      <input
                        type="text"
                        name="roomNo"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        placeholder="e.g. 204"
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bed No.</label>
                      <input
                        type="text"
                        name="bedNo"
                        value={formData.bedNo}
                        onChange={handleInputChange}
                        placeholder="e.g. Bed B"
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Student Photo */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Student Passport Photo</div>
                  <div className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 2MB (ImageKit)</div>
                  <button type="button" className="mt-3 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold">
                    Upload Photo
                  </button>
                </div>

                {/* Birth Certificate */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Birth Certificate</div>
                  <div className="text-[10px] text-slate-400 mt-1">PDF or Image</div>
                  <button type="button" className="mt-3 px-3 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold">
                    Upload Doc
                  </button>
                </div>

                {/* Transfer Certificate (TC) */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Previous School TC</div>
                  <div className="text-[10px] text-slate-400 mt-1">Mandatory for Class 2+</div>
                  <button type="button" className="mt-3 px-3 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-semibold">
                    Upload Doc
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Objection */}
          {activeTab === 'objection' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Has Any Legal / Disciplinary Objection?
                </label>
                <select
                  name="hasObjection"
                  value={formData.hasObjection}
                  onChange={handleInputChange}
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-semibold"
                >
                  <option value="No">No - Clean Record</option>
                  <option value="Yes">Yes - Has Objection Remark</option>
                </select>
              </div>

              {formData.hasObjection === 'Yes' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Objection Note / Justification
                  </label>
                  <textarea
                    name="objectionReason"
                    rows={3}
                    value={formData.objectionReason}
                    onChange={handleInputChange}
                    placeholder="Enter reason for objection..."
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-rose-50/40 text-rose-900 focus:bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Sports */}
          {activeTab === 'sports' && (
            <div className="space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Sport
                  </label>
                  <input
                    type="text"
                    name="sportName"
                    value={formData.sportName}
                    onChange={handleInputChange}
                    placeholder="e.g. Cricket, Football"
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Level of Achievement
                  </label>
                  <select
                    name="achievementLevel"
                    value={formData.achievementLevel}
                    onChange={handleInputChange}
                    className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-medium"
                  >
                    <option value="School Level">School Level</option>
                    <option value="Zonal Level">Zonal Level</option>
                    <option value="District Level">District Level</option>
                    <option value="State Level">State Level</option>
                    <option value="National Level">National Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hobbies / Special Talents
                </label>
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleInputChange}
                  placeholder="e.g. Chess, Coding, Music"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 font-medium"
                />
              </div>
            </div>
          )}

          {/* Action Buttons Bar */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
              }}
              disabled={activeTab === tabs[0].id}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Previous Tab
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="reset"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Student Record</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
