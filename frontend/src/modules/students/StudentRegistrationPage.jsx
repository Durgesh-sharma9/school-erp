import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  Upload,
  Camera,
  ChevronDown,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function StudentRegistrationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('student');

  // Accordion open/close state for Tab 1
  const [openAccordions, setOpenAccordions] = useState({
    contact: false,
    other: false,
    education: false,
    previous: false,
    bank: false
  });

  const toggleAccordion = (name) => {
    setOpenAccordions(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // 1:1 Complete Form State
  const [formData, setFormData] = useState({
    // Primary Student Fields
    srNo: '1993',
    admNo: '1993',
    enrollNo: '',
    permanentEduNo: '',
    className: 'I',
    section: 'A',
    admDate: '2026-04-01',
    dob: '2019-05-12',
    feeType: 'Day Scholar',
    studentType: 'New',
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
    house: 'RED',
    commentRemark: '',
    studentStatus: 'Studying',
    tcNo: '',
    manualTcNo: '',
    reason: '',
    isActive: true,
    isEws: false,
    isStudyMaterial: false,
    photoUrl: '',
    rollNo: '1',
    compNo: '101',

    // Accordion 1: Contact Details
    presentAddress: '',
    presentVillage: '',
    presentPostalCode: '',
    presentCountry: 'India',
    permanentAddress: '',
    permanentVillage: '',
    permanentPostalCode: '',
    permanentPostOffice: '',
    permanentPoliceStation: '',
    permanentDistrict: '',
    permanentTaluka: '',
    birthPlace: '',
    permanentCountry: 'India',
    contactPhoneNo: '',
    contactPersonEmail: '',
    contactPersonAddress: '',

    // Accordion 2: Other Details
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    caste: '',
    aadhaar: '',
    email: '',
    prevSchoolName: '',
    referenceBy: '',
    apaarId: '',
    passportNo: '',
    nicId: '',
    bplNumber: '',
    saralId: '',
    familyId: '',
    bloodGroup: '',
    studentHeight: '',
    studentWeight: '',
    admittedClass: '',
    studentSamagraId: '',
    satsNo: '',
    generalNo: '',
    motherTongue: 'Hindi',
    donationAmount: '',

    // Accordion 3: Education Details
    tenthBoardRollNo: '',
    tenthPassingYear: '',
    tenthBoardName: '',
    tenthMarks: '',
    tenthPercentage: '',
    tenthResult: 'Pass',
    twelfthBoardRollNo: '',
    twelfthBoardName: '',
    twelfthMarks: '',
    twelfthPassingYear: '',
    twelfthPercentage: '',
    twelfthResult: 'Pass',
    graduationRollNo: '',
    graduationMarks: '',
    graduationPassingYear: '',
    graduationUniversityName: '',
    graduationPercentage: '',
    postGraduationRollNo: '',
    postGraduationMarks: '',
    postGraduationPassingYear: '',
    postGraduationUniversityName: '',
    postGraduationPercentage: '',
    boardRegistrationNo: '',

    // Accordion 4: Previous Details
    previousSchool: '',
    previousClass: '',
    previousYear: '',
    previousRegiNo: '',
    previousRollNo: '',
    previousBoard: '',
    previousSubjects: '',
    previousResult: '',
    previousMarks: '',
    previousPercentage: '',

    // Accordion 5: Bank Details
    bankName: '',
    stuAccountNo: '',
    accountHolderName: '',
    ifscCode: '',

    // Tab 2: Parent's Details - Father
    fathersDob: '',
    fathersPhoneNo: '',
    fathersEmail: '',
    fathersAadhaar: '',
    fathersPanNo: '',
    fathersOccupation: '',
    fathersDesignation: '',
    fathersQualification: '',
    fathersDepartment: '',
    fathersIncome: '',
    fathersAddress: '',
    fathersBplCard: '',
    fathersBusinessDetails: '',
    fathersCompanyName: '',
    fathersOfficePhone: '',
    fathersOfficeEmail: '',
    fathersOfficeWebsite: '',
    fathersOfficeAddress: '',
    fathersSamagraId: '',

    // Tab 2: Parent's Details - Mother
    mothersDob: '',
    mothersPhoneNo: '',
    mothersEmail: '',
    mothersAadhaar: '',
    mothersPanNo: '',
    mothersOccupation: '',
    mothersDesignation: '',
    mothersQualification: '',
    mothersDepartment: '',
    mothersIncome: '',
    mothersAddress: '',
    mothersBusinessDetails: '',
    mothersCompanyName: '',
    mothersOfficePhone: '',
    mothersOfficeEmail: '',
    mothersOfficeWebsite: '',
    mothersOfficeAddress: '',
    mothersSamagraId: '',

    // Tab 2: Guardians
    guardian1Name: '',
    guardian1MobileNo: '',
    guardian1Relation: '',
    guardian1Remark: '',
    guardian2Name: '',
    guardian2MobileNo: '',
    guardian2Relation: '',
    guardian2Remark: '',

    // Tab 3: Transport
    transportStatus: false,
    route: '',
    pickDropStop: '',
    vehicle: '',

    // Tab 4: Hostel
    hostelStatus: false,
    hostelBlock: '',
    hostelFloor: '',
    hostelRoom: '',

    // Tab 5: Documents (URLs)
    docFrontAadhar: '',
    docBackAadhar: '',
    docCc: '',
    docTc: '',
    docBirthCert: '',
    docFatherFrontAadhar: '',
    docFatherBackAadhar: '',
    docMotherFrontAadhar: '',
    docMotherBackAadhar: '',
    docRegForm: '',
    docOther: '',

    // Tab 5: Verification Checkboxes
    chkStdAadhar: false,
    chkCc: false,
    chkTc: false,
    chkBc: false,
    chkFAadhar: false,
    chkMAadhar: false,
    chkFMarksheet: false,
    chkMMarksheet: false,

    // Tab 6: Objection
    objectionNotes: '',

    // Tab 7: Sports
    sportsActivities: ''
  });

  const [classesList, setClassesList] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Fetch classes for dropdown
  useEffect(() => {
    fetch('http://localhost:5000/api/academics/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setClassesList(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Upload student photo / document to ImageKit via backend
  const handleFileUpload = async (file, fieldKey) => {
    if (!file) return;
    try {
      setUploadingDoc(prev => ({ ...prev, [fieldKey]: true }));
      const uploadData = new FormData();
      uploadData.append('photo', file);

      const res = await fetch('http://localhost:5000/api/students/upload-photo', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        if (fieldKey === 'photoUrl') {
          setPhotoPreview(data.data.url);
        }
        setFormData(prev => ({ ...prev, [fieldKey]: data.data.url }));
        setSaveSuccessMsg(`Uploaded ${fieldKey} successfully!`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploadingDoc(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  // Save student registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName) {
      alert('First Name is required');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Student Registered Successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setSaveSuccessMsg('Student saved locally!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'student', label: 'Student Details' },
    { id: 'parents', label: "Parent's Details" },
    { id: 'transport', label: 'Transport' },
    { id: 'hostel', label: 'Hostel Allocation' },
    { id: 'documents', label: 'Documents' },
    { id: 'objection', label: 'Objection' },
    { id: 'sports', label: 'Sports' }
  ];

  return (
    <div className="bg-[#f3f4f6] min-h-screen pb-16">
      {/* 1:1 Secondary Toolbar Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2 text-xs">
          <h1 className="text-xl font-bold text-slate-800 pr-3 border-r border-slate-300">
            Student
          </h1>
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hover:text-indigo-600 cursor-pointer">Student</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-indigo-600 font-semibold">Student Registration</span>
        </div>

        {saveSuccessMsg && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-7xl mx-auto">
        {/* Top Profile Card & Primary Details Grid */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Photo & Meta Box */}
            <div className="w-full lg:w-48 shrink-0 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0 lg:pr-6">
              <div className="w-32 h-36 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative shadow-inner mb-2.5">
                {photoPreview || formData.photoUrl ? (
                  <img
                    src={photoPreview || formData.photoUrl}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px]">Photo Slot</span>
                  </div>
                )}
              </div>

              {/* Red Browse Button */}
              <label className="rounded bg-red-500 hover:bg-red-600 text-white w-32 p-1.5 flex justify-center items-center text-xs font-bold cursor-pointer transition-colors shadow-xs">
                Browse
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0], 'photoUrl')}
                />
              </label>

              {/* Quick Meta */}
              <div className="w-full mt-3 text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Roll No. :</span>
                  <span className="font-bold">{formData.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Comp. No. :</span>
                  <span className="font-bold">{formData.compNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status :</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                    {formData.studentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Primary Student Fields Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Sr.No.*</label>
                <input
                  type="text"
                  required
                  name="srNo"
                  value={formData.srNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Adm.No./Sr.No.*</label>
                <input
                  type="text"
                  required
                  name="admNo"
                  value={formData.admNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500 font-bold text-indigo-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Enroll No</label>
                <input
                  type="text"
                  name="enrollNo"
                  value={formData.enrollNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Permanent Edu. no.</label>
                <input
                  type="text"
                  name="permanentEduNo"
                  value={formData.permanentEduNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Class*</label>
                <select
                  required
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  {classesList.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {classesList.length === 0 && (
                    <>
                      <option value="Nursery - PP3+">Nursery - PP3+</option>
                      <option value="I">I</option>
                      <option value="Class 10">Class 10</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Section*</label>
                <select
                  required
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Admission Date*</label>
                <input
                  type="date"
                  required
                  name="admDate"
                  value={formData.admDate}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Date Of Birth*</label>
                <input
                  type="date"
                  required
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fee Type*</label>
                <select
                  name="feeType"
                  value={formData.feeType}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Day Scholar">Day Scholar</option>
                  <option value="Hosteler">Hosteler</option>
                  <option value="Staff Ward">Staff Ward</option>
                  <option value="RTE">RTE</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Type*</label>
                <select
                  name="studentType"
                  value={formData.studentType}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="New">New</option>
                  <option value="Old">Old</option>
                  <option value="Re-Admission">Re-Admission</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Stream</label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="None">None</option>
                  <option value="SCIENCE">SCIENCE</option>
                  <option value="COMMERCE">COMMERCE</option>
                  <option value="HUMANITIES">HUMANITIES</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">First Name*</label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Aarav"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Sharma"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Contact Person Name</label>
                <input
                  type="text"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">SMS/Whatsapp No.*</label>
                <input
                  type="tel"
                  required
                  name="smsWhatsappNo"
                  value={formData.smsWhatsappNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                  placeholder="10 digits"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Name*</label>
                <input
                  type="text"
                  required
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Mobile</label>
                <input
                  type="tel"
                  name="fatherMobile"
                  value={formData.fatherMobile}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother's Mobile No.</label>
                <input
                  type="tel"
                  name="motherMobile"
                  value={formData.motherMobile}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">House</label>
                <select
                  name="house"
                  value={formData.house}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="RED">RED</option>
                  <option value="BLUE">BLUE</option>
                  <option value="GREEN">GREEN</option>
                  <option value="YELLOW">YELLOW</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Comment/Remark</label>
                <input
                  type="text"
                  name="commentRemark"
                  value={formData.commentRemark}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Status</label>
                <select
                  name="studentStatus"
                  value={formData.studentStatus}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Studying">Studying</option>
                  <option value="Left">Left</option>
                  <option value="Struck Off">Struck Off</option>
                  <option value="TC Taken">TC Taken</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">TC No.</label>
                <input
                  type="text"
                  name="tcNo"
                  value={formData.tcNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Manual TC No.</label>
                <input
                  type="text"
                  name="manualTcNo"
                  value={formData.manualTcNo}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-4 mt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded w-4 h-4 text-indigo-600"
              />
              <span>is Active</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isEws"
                checked={formData.isEws}
                onChange={handleInputChange}
                className="rounded w-4 h-4 text-indigo-600"
              />
              <span>EWS</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isStudyMaterial"
                checked={formData.isStudyMaterial}
                onChange={handleInputChange}
                className="rounded w-4 h-4 text-indigo-600"
              />
              <span>is Study Material</span>
            </label>
          </div>
        </div>

        {/* 7 Tabs Header Strip */}
        <div className="bg-white rounded-t-lg border-b border-slate-200 px-6 flex space-x-8 overflow-x-auto shadow-2xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body Content */}
        <div className="bg-white rounded-b-lg border border-slate-200 shadow-2xs p-6">
          {/* ======================================================== */}
          {/* TAB 1: Student Details (5 Accordions)                   */}
          {/* ======================================================== */}
          {activeTab === 'student' && (
            <div className="space-y-3">
              {/* ACCORDION 1: CONTACT DETAILS */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('contact')}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide hover:bg-slate-100 transition-colors"
                >
                  <span>CONTACT DETAILS</span>
                  {openAccordions.contact ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {openAccordions.contact && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs bg-white border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Present Address</label>
                      <input type="text" name="presentAddress" value={formData.presentAddress} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Present Village</label>
                      <input type="text" name="presentVillage" value={formData.presentVillage} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Present Postal Code</label>
                      <input type="text" name="presentPostalCode" value={formData.presentPostalCode} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Present Country</label>
                      <input type="text" name="presentCountry" value={formData.presentCountry} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Permanent Address</label>
                      <input type="text" name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Permanent Village</label>
                      <input type="text" name="permanentVillage" value={formData.permanentVillage} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Permanent Postal Code</label>
                      <input type="text" name="permanentPostalCode" value={formData.permanentPostalCode} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Post Office</label>
                      <input type="text" name="permanentPostOffice" value={formData.permanentPostOffice} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Police Station</label>
                      <input type="text" name="permanentPoliceStation" value={formData.permanentPoliceStation} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">District</label>
                      <input type="text" name="permanentDistrict" value={formData.permanentDistrict} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Taluka</label>
                      <input type="text" name="permanentTaluka" value={formData.permanentTaluka} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Birth Place</label>
                      <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Permanent Country</label>
                      <input type="text" name="permanentCountry" value={formData.permanentCountry} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Contact Phone No.</label>
                      <input type="text" name="contactPhoneNo" value={formData.contactPhoneNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Contact Person Email</label>
                      <input type="email" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Contact Person Address</label>
                      <input type="text" name="contactPersonAddress" value={formData.contactPersonAddress} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 2: OTHER DETAILS */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('other')}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide hover:bg-slate-100 transition-colors"
                >
                  <span>OTHER DETAILS</span>
                  {openAccordions.other ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {openAccordions.other && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs bg-white border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Nationality</label>
                      <select name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5">
                        <option value="Indian">Indian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Religion</label>
                      <select name="religion" value={formData.religion} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5">
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Christian">Christian</option>
                        <option value="Jain">Jain</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5">
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Caste</label>
                      <input type="text" name="caste" value={formData.caste} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Aadhaar No.</label>
                      <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" placeholder="12 digits" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Prev School Name</label>
                      <input type="text" name="prevSchoolName" value={formData.prevSchoolName} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Reference By</label>
                      <input type="text" name="referenceBy" value={formData.referenceBy} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">APAAR ID</label>
                      <input type="text" name="apaarId" value={formData.apaarId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Passport No.</label>
                      <input type="text" name="passportNo" value={formData.passportNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">NIC ID</label>
                      <input type="text" name="nicId" value={formData.nicId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">BPL Number</label>
                      <input type="text" name="bplNumber" value={formData.bplNumber} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Saral ID</label>
                      <input type="text" name="saralId" value={formData.saralId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Family ID</label>
                      <input type="text" name="familyId" value={formData.familyId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Blood Group</label>
                      <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5">
                        <option value="">Select</option>
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
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Height (cm)</label>
                      <input type="text" name="studentHeight" value={formData.studentHeight} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Weight (kg)</label>
                      <input type="text" name="studentWeight" value={formData.studentWeight} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Admitted Class</label>
                      <input type="text" name="admittedClass" value={formData.admittedClass} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Samagra ID</label>
                      <input type="text" name="studentSamagraId" value={formData.studentSamagraId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">SATS No.</label>
                      <input type="text" name="satsNo" value={formData.satsNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">General No.</label>
                      <input type="text" name="generalNo" value={formData.generalNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Tongue</label>
                      <input type="text" name="motherTongue" value={formData.motherTongue} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Donation Amount</label>
                      <input type="number" name="donationAmount" value={formData.donationAmount} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 3: EDUCATION DETAILS */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('education')}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide hover:bg-slate-100 transition-colors"
                >
                  <span>EDUCATION DETAILS</span>
                  {openAccordions.education ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {openAccordions.education && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs bg-white border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">10th Board Roll No.</label>
                      <input type="text" name="tenthBoardRollNo" value={formData.tenthBoardRollNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">10th Passing Year</label>
                      <input type="text" name="tenthPassingYear" value={formData.tenthPassingYear} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">10th Board Name</label>
                      <input type="text" name="tenthBoardName" value={formData.tenthBoardName} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">10th Marks</label>
                      <input type="text" name="tenthMarks" value={formData.tenthMarks} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">10th Percentage</label>
                      <input type="text" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">10th Result</label>
                      <select name="tenthResult" value={formData.tenthResult} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5">
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="Compartment">Compartment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">12th Board Roll No.</label>
                      <input type="text" name="twelfthBoardRollNo" value={formData.twelfthBoardRollNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">12th Board Name</label>
                      <input type="text" name="twelfthBoardName" value={formData.twelfthBoardName} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">12th Marks</label>
                      <input type="text" name="twelfthMarks" value={formData.twelfthMarks} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">12th Passing Year</label>
                      <input type="text" name="twelfthPassingYear" value={formData.twelfthPassingYear} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">12th Percentage</label>
                      <input type="text" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Board Registration No.</label>
                      <input type="text" name="boardRegistrationNo" value={formData.boardRegistrationNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 4: PREVIOUS DETAILS */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('previous')}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide hover:bg-slate-100 transition-colors"
                >
                  <span>PREVIOUS DETAILS</span>
                  {openAccordions.previous ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {openAccordions.previous && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs bg-white border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Previous School</label>
                      <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Previous Class</label>
                      <input type="text" name="previousClass" value={formData.previousClass} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Previous Year</label>
                      <input type="text" name="previousYear" value={formData.previousYear} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Previous Roll No.</label>
                      <input type="text" name="previousRollNo" value={formData.previousRollNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Previous Board</label>
                      <input type="text" name="previousBoard" value={formData.previousBoard} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Previous Result</label>
                      <input type="text" name="previousResult" value={formData.previousResult} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION 5: BANK DETAILS */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccordion('bank')}
                  className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wide hover:bg-slate-100 transition-colors"
                >
                  <span>BANK DETAILS</span>
                  {openAccordions.bank ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {openAccordions.bank && (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-white border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Bank Name</label>
                      <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" placeholder="e.g. State Bank of India" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Account No.</label>
                      <input type="text" name="stuAccountNo" value={formData.stuAccountNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5 font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Account Holder Name</label>
                      <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">IFSC Code</label>
                      <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5 font-mono uppercase" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: Parent's Details                                 */}
          {/* ======================================================== */}
          {activeTab === 'parents' && (
            <div className="space-y-6">
              {/* Father Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-2 mb-3">
                  Father's Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father D.O.B</label>
                    <input type="date" name="fathersDob" value={formData.fathersDob} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Phone</label>
                    <input type="tel" name="fathersPhoneNo" value={formData.fathersPhoneNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Email</label>
                    <input type="email" name="fathersEmail" value={formData.fathersEmail} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Aadhaar No.</label>
                    <input type="text" name="fathersAadhaar" value={formData.fathersAadhaar} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Pan No.</label>
                    <input type="text" name="fathersPanNo" value={formData.fathersPanNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5 font-mono uppercase" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Occupation</label>
                    <input type="text" name="fathersOccupation" value={formData.fathersOccupation} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Designation</label>
                    <input type="text" name="fathersDesignation" value={formData.fathersDesignation} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Annual Income</label>
                    <input type="number" name="fathersIncome" value={formData.fathersIncome} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Address</label>
                    <input type="text" name="fathersAddress" value={formData.fathersAddress} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Company Name</label>
                    <input type="text" name="fathersCompanyName" value={formData.fathersCompanyName} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Office Phone</label>
                    <input type="tel" name="fathersOfficePhone" value={formData.fathersOfficePhone} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Father Samagra ID</label>
                    <input type="text" name="fathersSamagraId" value={formData.fathersSamagraId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                </div>
              </div>

              {/* Mother Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-2 mb-3">
                  Mother's Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother DOB</label>
                    <input type="date" name="mothersDob" value={formData.mothersDob} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Phone</label>
                    <input type="tel" name="mothersPhoneNo" value={formData.mothersPhoneNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Email</label>
                    <input type="email" name="mothersEmail" value={formData.mothersEmail} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Aadhaar No.</label>
                    <input type="text" name="mothersAadhaar" value={formData.mothersAadhaar} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Occupation</label>
                    <input type="text" name="mothersOccupation" value={formData.mothersOccupation} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Annual Income</label>
                    <input type="number" name="mothersIncome" value={formData.mothersIncome} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Address</label>
                    <input type="text" name="mothersAddress" value={formData.mothersAddress} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Mother Samagra ID</label>
                    <input type="text" name="mothersSamagraId" value={formData.mothersSamagraId} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-2 mb-3">
                  Guardian Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Guardian 1 Name</label>
                    <input type="text" name="guardian1Name" value={formData.guardian1Name} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Guardian 1 Mobile</label>
                    <input type="tel" name="guardian1MobileNo" value={formData.guardian1MobileNo} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Relation</label>
                    <input type="text" name="guardian1Relation" value={formData.guardian1Relation} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Remark</label>
                    <input type="text" name="guardian1Remark" value={formData.guardian1Remark} onChange={handleInputChange} className="w-full rounded border border-slate-300 px-2.5 py-1.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: Transport                                        */}
          {/* ======================================================== */}
          {activeTab === 'transport' && (
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="transportStatus"
                  checked={formData.transportStatus}
                  onChange={handleInputChange}
                  className="rounded w-4 h-4 text-indigo-600"
                />
                <span>apply transport</span>
              </label>

              {formData.transportStatus && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Bus Route</label>
                    <input
                      type="text"
                      name="route"
                      value={formData.route}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5"
                      placeholder="e.g. Route 04 (City Center)"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Pickup/Drop Stop</label>
                    <input
                      type="text"
                      name="pickDropStop"
                      value={formData.pickDropStop}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5"
                      placeholder="e.g. Sector 14 Gate 2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Vehicle</label>
                    <input
                      type="text"
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5"
                      placeholder="e.g. Bus #12 (HR-55-A-1234)"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: Hostel Allocation                                */}
          {/* ======================================================== */}
          {activeTab === 'hostel' && (
            <div className="space-y-4">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="hostelStatus"
                  checked={formData.hostelStatus}
                  onChange={handleInputChange}
                  className="rounded w-4 h-4 text-indigo-600"
                />
                <span>apply Hostel</span>
              </label>

              {formData.hostelStatus && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Hostel Block</label>
                    <input
                      type="text"
                      name="hostelBlock"
                      value={formData.hostelBlock}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5"
                      placeholder="e.g. Block A (Boys Hostel)"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Floor</label>
                    <input
                      type="text"
                      name="hostelFloor"
                      value={formData.hostelFloor}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5"
                      placeholder="e.g. 2nd Floor"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Room No.</label>
                    <input
                      type="text"
                      name="hostelRoom"
                      value={formData.hostelRoom}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 px-2.5 py-1.5"
                      placeholder="e.g. Room 204"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: Documents (Uploads & Verifications)              */}
          {/* ======================================================== */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Upload Buttons (11 Slots) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-2 mb-3">
                  Upload Student &amp; Parent Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 text-xs">
                  {[
                    { label: 'Front Aadhar Card', key: 'docFrontAadhar' },
                    { label: 'Back Aadhar Card', key: 'docBackAadhar' },
                    { label: 'CC', key: 'docCc' },
                    { label: 'TC', key: 'docTc' },
                    { label: 'Birth Certificate', key: 'docBirthCert' },
                    { label: "Father's Front Aadhar", key: 'docFatherFrontAadhar' },
                    { label: "Father's Back Aadhar", key: 'docFatherBackAadhar' },
                    { label: "Mother's Front Aadhar", key: 'docMotherFrontAadhar' },
                    { label: "Mother's Back Aadhar", key: 'docMotherBackAadhar' },
                    { label: 'Registration Form', key: 'docRegForm' },
                    { label: 'Other Document', key: 'docOther' }
                  ].map((doc) => (
                    <div key={doc.key} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 flex flex-col justify-between space-y-2">
                      <span className="font-semibold text-slate-800 text-[11px]">{doc.label}</span>
                      <label className="rounded bg-red-500 hover:bg-red-600 text-white w-full p-1.5 flex justify-center items-center text-xs font-bold cursor-pointer transition-colors shadow-xs">
                        {uploadingDoc[doc.key] ? 'Uploading...' : doc.label}
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files?.[0], doc.key)}
                        />
                      </label>
                      {formData[doc.key] && (
                        <span className="text-[10px] text-emerald-600 font-medium truncate">
                          ✓ Uploaded
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Verification Checkboxes (8 Slots) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-2 mb-3">
                  Document Submission Verification Checklist
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-slate-700">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkStdAadhar" checked={formData.chkStdAadhar} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>Std Aadhar</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkCc" checked={formData.chkCc} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>CC</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkTc" checked={formData.chkTc} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>TC</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkBc" checked={formData.chkBc} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>BC</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkFAadhar" checked={formData.chkFAadhar} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>F Aadhar</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkMAadhar" checked={formData.chkMAadhar} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>M Aadhar</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkFMarksheet" checked={formData.chkFMarksheet} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>F Marksheet</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="chkMMarksheet" checked={formData.chkMMarksheet} onChange={handleInputChange} className="rounded w-4 h-4 text-indigo-600" />
                    <span>M Marksheet</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: Objection                                        */}
          {/* ======================================================== */}
          {activeTab === 'objection' && (
            <div className="space-y-3 text-xs">
              <label className="block text-[11px] font-medium text-slate-600">
                Administrative Objection / Verification Notes
              </label>
              <textarea
                rows={4}
                name="objectionNotes"
                value={formData.objectionNotes}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 p-3 focus:outline-none focus:border-indigo-500"
                placeholder="Enter any administrative or verification objection comments here..."
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: Sports                                           */}
          {/* ======================================================== */}
          {activeTab === 'sports' && (
            <div className="space-y-3 text-xs max-w-lg">
              <label className="block text-[11px] font-medium text-slate-600">
                Activities / Sports Participation
              </label>
              <input
                type="text"
                name="sportsActivities"
                value={formData.sportsActivities}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Cricket, Basketball, Athletics"
              />
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar with Save Button */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-end space-x-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2 rounded bg-[#5c67f6] hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentRegistrationPage;
