import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Search,
  Printer,
  CloudUpload,
  Camera,
  Calendar,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Building,
  Truck,
  FileText,
  CreditCard,
  AlertCircle,
  Trophy,
  User,
  Users
} from 'lucide-react';

// Reusable Outline Field matching Angular Material mat-form-field appearance="outline"
function OutlineInput({
  label,
  required,
  isOrange,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  rightIcon = null,
  className = ''
}) {
  return (
    <div className={`relative mb-3 ${className}`}>
      <label
        className={`absolute -top-2 left-2.5 px-1 text-[11px] font-medium bg-white z-10 pointer-events-none transition-all ${
          isOrange ? 'text-orange-500 font-semibold' : 'text-gray-500'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative flex items-center">
        <input
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none transition-colors ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
          } ${rightIcon ? 'pr-9' : ''}`}
        />
        {rightIcon && (
          <div className="absolute right-2.5 flex items-center pointer-events-none text-indigo-600">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

function OutlineSelect({
  label,
  required,
  name,
  value,
  onChange,
  options = [],
  topRightLink = null,
  className = ''
}) {
  return (
    <div className={`relative mb-3 ${className}`}>
      {topRightLink && (
        <span className="absolute -top-4 right-0 text-[11px] text-blue-600 hover:underline cursor-pointer z-20 font-medium">
          {topRightLink}
        </span>
      )}
      <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10 pointer-events-none">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none appearance-none transition-colors cursor-pointer"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

// Student / Parent Avatar Component
function StudentAvatar({
  previewUrl,
  onFileSelect,
  rollNo = '',
  compNo = '',
  status = 'Studying',
  isStudent = true,
  role = 'student'
}) {
  const fileInputRef = React.useRef(null);

  return (
    <div className="col-span-12 sm:col-span-3 flex flex-col items-center justify-center rounded-lg border border-indigo-100 bg-[#eef2ff] p-3 md:mb-0 mb-3 shadow-xs">
      <div className="w-28 h-28 mb-2 flex items-center justify-center bg-[#e0e7ff] rounded overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt={role} className="w-full h-full object-cover" />
        ) : isStudent ? (
          <svg className="w-24 h-24 text-gray-700" viewBox="0 0 100 100" fill="currentColor">
            {/* Cap */}
            <polygon points="50,15 85,28 50,40 15,28" fill="#1e293b" />
            <polygon points="50,40 50,48 80,36 80,28" fill="#0f172a" />
            {/* Tassel */}
            <path d="M78,30 Q83,38 82,46" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
            <circle cx="82" cy="46" r="2.5" fill="#fbbf24" />
            {/* Head */}
            <circle cx="50" cy="45" r="16" fill="#fbcfe8" />
            {/* Neck cowl yellow */}
            <path d="M42,58 L58,58 L55,70 L45,70 Z" fill="#fbbf24" />
            {/* Body Gown */}
            <path d="M25,88 C25,65 38,62 50,62 C62,62 75,65 75,88 Z" fill="#1e293b" />
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center text-indigo-400 p-2 text-center">
            <User className="w-14 h-14 stroke-1 mb-1 text-indigo-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
              {role === 'father' ? "Father's Photo" : role === 'mother' ? "Mother's Photo" : "Parent Photo"}
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Red Browse + Dark Camera Buttons */}
      <div className="flex items-center w-full max-w-[160px] text-white rounded bg-red-500 overflow-hidden shadow-xs mb-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-red-500 hover:bg-red-600 transition-colors p-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <CloudUpload className="w-3.5 h-3.5" />
          Browse
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-800 hover:bg-gray-900 transition-colors px-2 py-1.5 flex items-center justify-center text-xs cursor-pointer"
          title="Take Photo"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      {isStudent && (
        <>
          <div className="flex justify-around items-center w-full mt-1 font-medium text-xs text-gray-700">
            <span>Roll No. : {rollNo || ''}</span>
            <span>Comp. No. : {compNo || ''}</span>
          </div>
          <div className="flex justify-center items-center w-full my-1 font-medium text-xs text-gray-700">
            <span>
              Status: <span className="text-green-600 font-semibold">{status}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// Document Upload Card with auto-uploaded status badge
function DocumentCard({
  title,
  previewUrl,
  onFileSelect
}) {
  const fileRef = React.useRef(null);

  return (
    <div className="flex flex-col rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all">
      <div className="w-full h-32 bg-slate-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
        {previewUrl ? (
          <img src={previewUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-50/50 to-indigo-50/30 p-3 text-center">
            <FileText className="w-8 h-8 text-indigo-300 mb-1" />
            <span className="text-[11px] font-medium text-gray-400">No file attached</span>
          </div>
        )}

        {/* Auto Uploaded Status Badge */}
        <div className="absolute top-2 right-2">
          {previewUrl ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              <Check className="w-3 h-3" /> Attached
            </span>
          ) : (
            <span className="inline-flex items-center bg-gray-400/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileRef}
        onChange={onFileSelect}
        accept="image/*,application/pdf"
        className="hidden"
      />

      <div className="p-3 bg-white flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-800 truncate" title={title}>
          {title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors px-2.5 py-1 flex items-center gap-1 text-xs font-medium rounded cursor-pointer shadow-xs"
            title={`Upload ${title}`}
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="bg-slate-700 hover:bg-slate-800 text-white transition-colors p-1 flex items-center justify-center text-xs rounded cursor-pointer shadow-xs"
            title="Camera capture"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Collapsible Accordion Component
function Accordion({ title, isOpen, onToggle, children }) {
  return (
    <div className="border border-gray-200 rounded mb-2 bg-white overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex justify-between items-center bg-[#f8fafc] hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-xs font-bold text-gray-700 tracking-wide">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-4 border-t border-gray-100">{children}</div>}
    </div>
  );
}

export function StudentRegistrationPage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();
  const [activeTab, setActiveTab] = useState('student_details');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  // Accordion Toggle States (All closed by default matching Live UAB)
  const [accordions, setAccordions] = useState({
    contact: false,
    other: false,
    previous: false,
    bank: false
  });

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Form State
  const [formData, setFormData] = useState({
    // Primary Tab 1 fields
    sr_no: '1992',
    adm_no: '1992',
    enroll_no: '',
    permanent_edu_no: '',
    class_id: 'I',
    division_id: 'A',
    adm_date: '2026-04-01',
    dob: '2019-05-12',
    fee_id: 'Day Scholar',
    stu_type: 'New',
    stream_id: 'None',
    first_name: '',
    last_name: '',
    gender: 'Male',
    contact_name: '',
    contact_no_sms: '',
    fathers_name: '',
    mothers_name: '',
    fathers_mobile_no: '',
    mothers_mobile_no: '',
    house: 'None',
    remark: '',
    status_type: 'Studying',
    tc_no: '',
    manual_tc_no: '',
    reason: '',
    is_active: true,
    ews: false,
    is_study_material: false,
    roll_no: '',
    comp_no: '',
    student_photo: null,

    // Accordion 1: Contact Details
    present_address: '',
    village2: '',
    present_postal_code: '',
    present_country: 'India',
    permanent_address: '',
    village: '',
    permanent_postal_code: '',
    post_office: '',
    police_station: '',
    district: '',
    taluka: '',
    birth_place: '',
    permanent_country: 'India',
    contact_phone_no: '',
    contact_person_email: '',
    contact_person_address: '',

    // Accordion 2: Other Details
    nationality: 'Indian',
    religion: 'Hindu',
    category: 'General',
    cast: '',
    aadhaar: '',
    email: '',
    prev_school_name: '',
    refrence_by: '',
    apaar_id: '',
    passport_no: '',
    nic_id: '',
    bpl_number: '',
    saral_id: '',
    family_id: '',
    blood_group: 'B+',
    student_height: '',
    student_weight: '',
    admitted_class: '',
    student_samagra_id: '',
    sats_no: '',
    general_no: '',
    mother_tongue: 'Hindi',
    donation_amount: '',
    phy_challenged: 'No',

    // Accordion 3: Education Details
    tenth_board_roll_no: '',
    tenth_passing_year: '',
    reg_board_name: '',
    tenth_marks: '',
    tenth_percentage: '',
    tenth_result: 'Pass',
    twelfth_board_roll_no: '',
    twelfth_board_name: '',
    twelfth_marks: '',
    twelfth_passing_year: '',
    twelfth_percentage: '',
    twelth_result: 'Pass',
    graduation_roll_no: '',
    graduation_marks: '',
    graduation_passing_year: '',
    graduation_university_name: '',
    graduation_percentage: '',
    post_graduation_roll_no: '',
    post_graduation_marks: '',
    post_graduation_passing_year: '',
    post_graduation_university_name: '',
    post_graduation_percentage: '',
    board_registration_no: '',

    // Accordion 4: Previous Details
    previous_school: '',
    previous_class: '',
    previous_year: '',
    previous_regi_no: '',
    previous_roll_no: '',
    previous_board: '',
    previous_subjects: '',
    previous_result: '',
    previous_marks: '',
    previous_percentage: '',
    has_tc: 'No',

    // Accordion 5: Bank Details
    bank_name: '',
    stu_account_no: '',
    account_holder_name: '',
    ifc_code: '',

    // Tab 2: Father Details
    fathers_dob: '',
    fathers_phone_no_alt: '',
    fathers_email: '',
    fathers_aadhaar: '',
    fathers_pan_no: '',
    fathers_occupation: '',
    fathers_designation: '',
    fathers_alternate_email: '', // Qualification in UAB
    fathers_department: '',
    fathers_income: '',
    fathers_address: '',
    fathers_bpl_number: '',
    fathers_service_in: 'No',
    parents_status: 'is alive',
    fathers_bussiness_details: '',
    fathers_company_name: '',
    fathers_office_phone: '',
    fathers_office_email: '',
    fathers_office_website: '',
    fathers_office_address: '',
    fathers_samagra_id: '',
    father_photo: null,

    // Tab 2: Mother Details
    mothers_dob: '',
    mothers_phone_no_alt: '',
    mothers_email: '',
    mothers_aadhaar: '',
    mothers_pan_no: '',
    mothers_occupation: '',
    mothers_designation: '',
    mothers_alternate_email: '', // Qualification in UAB
    mothers_department: '',
    mothers_income: '',
    mothers_address: '',
    mothers_service_in: 'No',
    mothers_bussiness_details: '',
    mothers_company_name: '',
    mothers_office_phone: '',
    mothers_office_email: '',
    mothers_office_website: '',
    mothers_office_address: '',
    mothers_samagra_id: '',
    mother_photo: null,

    // Tab 2: Guardian Details
    guardian1_name: '',
    guardian1_mobile_no: '',
    guardian1_relation: '',
    guardian1_remark: '',
    guardian2_name: '',
    guardian2_mobile_no: '',
    guardian2_relation: '',
    guardian2_remark: '',

    // Tab 3: Transport
    apply_transport: false,
    route_id: 'Route 1',
    destination_id: 'Stop A',
    vehicle_id: 'Bus 101',

    // Tab 4: Hostel
    apply_hostel: false,
    hostel_id: 'Main Hostel',
    block_id: 'Block A',
    floor_id: 'Floor 1',
    room_id: 'Room 101',

    // Tab 5: Documents
    doc_front_aadhar: null,
    doc_back_aadhar: null,
    doc_cc: null,
    doc_tc: null,
    doc_birth_cert: null,
    doc_f_front_aadhar: null,
    doc_f_back_aadhar: null,
    doc_m_front_aadhar: null,
    doc_m_back_aadhar: null,
    doc_reg_form: null,
    doc_other: null,

    // Document Verification Checkboxes
    ver_std_aadhar: false,
    ver_cc: false,
    ver_tc: false,
    ver_bc: false,
    ver_f_aadhar: false,
    ver_m_aadhar: false,
    ver_f_marksheet: false,
    ver_m_marksheet: false,

    // Tab 6: Objection
    objection_remark: '',
    objection_status: 'No Objection',

    // Tab 7: Sports
    sports_activity: '',
    sports_achievement: '',
    sports_remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, [field]: url }));
    }
  };

  const [registeredStudent, setRegisteredStudent] = useState(null);

  useEffect(() => {
    const pending = tenantStore.getPendingRegistration();
    if (pending) {
      setFormData(prev => ({ ...prev, ...pending }));
      toast.success('Form prefilled from CRM: ' + (pending.first_name || '') + ' ' + (pending.last_name || ''));
    }
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      setSaveStatus('Saving student registration...');
      
      const fullName = `${formData.first_name || ''} ${formData.last_name || ''}`.trim() || 'New Student';
      const newStudentData = {
        admNo: formData.adm_no || String(Math.floor(2000 + Math.random() * 8000)),
        srNo: formData.sr_no || '0',
        rollNo: formData.roll_no || '0',
        name: fullName,
        firstName: formData.first_name || '',
        lastName: formData.last_name || '',
        fatherName: formData.fathers_name || '',
        motherName: formData.mothers_name || '',
        contactNo: formData.contact_no_sms || formData.fathers_mobile_no || '',
        className: formData.class_id || 'I',
        section: formData.division_id || 'A',
        isNew: true,
        gender: formData.gender || 'Male',
        category: formData.cast || 'GEN'
      };

      // 1. Strictly isolate within active tenant
      tenantStore.addStudent(schoolId, newStudentData);

      // 2. Transmit to backend with tenant identifier
      try {
        await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId || 'sch_jd_intl'
          },
          body: JSON.stringify({ ...formData, schoolId: schoolId || 'sch_jd_intl' })
        });
      } catch (netErr) {
        // Successfully cached in tenant store
      }

      setRegisteredStudent(newStudentData);
      setSaveStatus(`Registered successfully in ${schoolName}! (Adm No: #${newStudentData.admNo})`);
      toast.success(`Student ${newStudentData.name} registered successfully!`);
    } catch {
      setSaveStatus('Error saving student registration');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const tabs = [
    { id: 'student_details', label: 'Student Details' },
    { id: 'parents_details', label: "Parent's Details" },
    { id: 'transport', label: 'Transport' },
    { id: 'hostel', label: 'Hostel Allocation' },
    { id: 'documents', label: 'Documents' },
    { id: 'sports', label: 'Sports' }
  ];

  return (
    <div className="p-4 md:p-6 bg-[#f3f4f6] min-h-screen text-slate-800">
      {/* Post-Registration Success Actions Banner */}
      {registeredStudent && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                {registeredStudent.name} is successfully registered!
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Admission No: <strong>#{registeredStudent.admNo}</strong> &bull; Class: <strong>{registeredStudent.className} ({registeredStudent.section})</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                tenantStore.setPendingFeeStudent({
                  admNo: registeredStudent.admNo,
                  name: registeredStudent.name,
                  className: registeredStudent.className,
                  fatherName: registeredStudent.fatherName,
                  mobileNo: registeredStudent.contactNo
                });
                onNavigate?.('/fee-collection');
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect Fee POS</span>
            </button>

            <button
              type="button"
              onClick={() => {
                tenantStore.setPendingIdCardStudent({
                  admNo: registeredStudent.admNo,
                  name: registeredStudent.name,
                  className: registeredStudent.className || 'I',
                  fatherName: registeredStudent.fatherName || '',
                  mobile: registeredStudent.contactNo || '',
                  address: registeredStudent.address || ''
                });
                onNavigate?.('/id-card-generator');
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate ID Card</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('/assign-roll-number')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Assign Roll No.</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegisteredStudent(null);
                setSaveStatus(null);
                setFormData(prev => ({
                  ...prev,
                  adm_no: String(Math.floor(2000 + Math.random() * 8000)),
                  first_name: '',
                  last_name: '',
                  fathers_name: '',
                  mothers_name: '',
                  fathers_mobile_no: '',
                  contact_no_sms: ''
                }));
                toast('Ready for next student registration');
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <span>+ Register Next</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Print Action matching Live UAB */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base md:text-lg font-bold text-gray-800">Student</h1>
          <span className="text-gray-400 text-xs flex items-center gap-1.5 font-normal">
            <span>🏠</span>
            <span>•</span>
            <span>Student</span>
            <span>•</span>
            <span className="text-gray-600 font-medium">Student Registration</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
          title="Print Registration Form"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-2xs p-4 md:p-5">
        {/* Global Search Bar with Search Icon */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-300 rounded focus:border-indigo-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Tab Navigation directly below search bar matching Live UAB */}
        <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar mb-4 gap-x-2 md:gap-x-6 text-xs md:text-sm font-medium">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`student-tab-${tab.id}`}
                data-tab={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 px-2 md:px-3 text-center whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Student Details */}
        {activeTab === 'student_details' && (
          <div>
            {/* Top Grid: Avatar (col-span-3) + Right Inputs (col-span-9) */}
            <div className="grid grid-cols-12 gap-x-4 mb-2 mt-1">
              <StudentAvatar
                previewUrl={formData.student_photo}
                onFileSelect={(e) => handleFileUpload(e, 'student_photo')}
                rollNo={formData.roll_no}
                compNo={formData.comp_no}
                status={formData.status_type}
              />

              <div className="col-span-12 sm:col-span-9">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
                  {/* Row 1 */}
                  <OutlineInput
                    label="Sr.No."
                    required
                    name="sr_no"
                    value={formData.sr_no}
                    onChange={handleInputChange}
                  />
                  <OutlineInput
                    label="Adm.No./Sr.No."
                    required
                    name="adm_no"
                    value={formData.adm_no}
                    onChange={handleInputChange}
                  />
                  <OutlineInput
                    label="Enroll No"
                    name="enroll_no"
                    value={formData.enroll_no}
                    onChange={handleInputChange}
                  />
                  <OutlineInput
                    label="Permanent Edu. no."
                    name="permanent_edu_no"
                    value={formData.permanent_edu_no}
                    onChange={handleInputChange}
                  />

                  {/* Row 2 */}
                  <OutlineSelect
                    label="Class"
                    required
                    name="class_id"
                    value={formData.class_id}
                    onChange={handleInputChange}
                    options={['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']}
                  />
                  <OutlineSelect
                    label="Section"
                    required
                    name="division_id"
                    value={formData.division_id}
                    onChange={handleInputChange}
                    options={['A', 'B', 'C', 'D']}
                  />
                  <OutlineInput
                    label="Admission Date"
                    required
                    name="adm_date"
                    type="date"
                    value={formData.adm_date}
                    onChange={handleInputChange}
                    rightIcon={<Calendar className="w-4 h-4" />}
                  />
                  <OutlineInput
                    label="Date Of Birth"
                    required
                    isOrange
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    rightIcon={<Calendar className="w-4 h-4" />}
                  />

                  {/* Row 3 */}
                  <OutlineSelect
                    label="Fee Type"
                    name="fee_id"
                    value={formData.fee_id}
                    onChange={handleInputChange}
                    options={['Day Scholar', 'Hosteler', 'Concession']}
                  />
                  <OutlineSelect
                    label="Student Type"
                    required
                    name="stu_type"
                    value={formData.stu_type}
                    onChange={handleInputChange}
                    options={['New', 'Old', 'Transfer']}
                  />
                  <OutlineSelect
                    label="Stream"
                    name="stream_id"
                    value={formData.stream_id}
                    onChange={handleInputChange}
                    options={['None', 'Science', 'Commerce', 'Humanities']}
                    topRightLink="Add Stream"
                    className="col-span-2 sm:col-span-2"
                  />

                  {/* Row 4 */}
                  <OutlineInput
                    label="First Name"
                    required
                    isOrange
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                  <OutlineInput
                    label="Last Name"
                    isOrange
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                  <OutlineSelect
                    label="Gender"
                    required
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    options={['Male', 'Female', 'Other']}
                    className="col-span-2 sm:col-span-2"
                  />
                </div>
              </div>
            </div>

            {/* Below Avatar Card Full-Width 4-Column Grids matching Live UAB */}
            {/* Row 5 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
              <OutlineInput
                label="Contact Person Name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
              />
              <OutlineInput
                label="SMS/Whatsapp No."
                required
                name="contact_no_sms"
                value={formData.contact_no_sms}
                onChange={handleInputChange}
              />
              <OutlineInput
                label="Father Name"
                required
                name="fathers_name"
                value={formData.fathers_name}
                onChange={handleInputChange}
              />
              <OutlineInput
                label="Mother Name"
                required
                name="mothers_name"
                value={formData.mothers_name}
                onChange={handleInputChange}
              />
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
              <OutlineInput
                label="Father Mobile"
                name="fathers_mobile_no"
                value={formData.fathers_mobile_no}
                onChange={handleInputChange}
              />
              <OutlineInput
                label="Mother's Mobile No."
                name="mothers_mobile_no"
                value={formData.mothers_mobile_no}
                onChange={handleInputChange}
              />
              <OutlineSelect
                label="House"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
                options={['None', 'Red', 'Blue', 'Green', 'Yellow', 'Subhash']}
                topRightLink="Add House"
              />
              <OutlineInput
                label="Comment/Remark"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
              />
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
              <OutlineSelect
                label="Student Status"
                required
                name="status_type"
                value={formData.status_type}
                onChange={handleInputChange}
                options={['Studying', 'Left', 'Passed Out', 'Suspended']}
              />
              <OutlineInput
                label="TC No."
                name="tc_no"
                value={formData.tc_no}
                onChange={handleInputChange}
              />
              <OutlineInput
                label="Manual TC No."
                name="manual_tc_no"
                value={formData.manual_tc_no}
                onChange={handleInputChange}
              />
              <OutlineInput
                label="Reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
              />
            </div>

            {/* Checkboxes matching Live UAB */}
            <div className="mb-5 flex items-center flex-wrap justify-start gap-x-6 text-xs md:text-sm text-gray-700 font-medium">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-red-500 focus:ring-red-400 accent-red-500 cursor-pointer"
                />
                <span>is Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="ews"
                  checked={formData.ews}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span>EWS</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_study_material"
                  checked={formData.is_study_material}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span>is Study Material</span>
              </label>
            </div>

            {/* Streamlined & Essential Student Accordions */}
            <div className="mt-4 space-y-2">
              {/* Accordion 1: Address & Contact Details */}
              <Accordion
                title="RESIDENTIAL & CONTACT DETAILS"
                isOpen={accordions.contact}
                onToggle={() => toggleAccordion('contact')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                  <OutlineInput
                    label="Current Residential Address"
                    name="present_address"
                    value={formData.present_address}
                    onChange={handleInputChange}
                    placeholder="House No., Building, Street / Locality"
                    className="sm:col-span-2"
                  />
                  <OutlineInput
                    label="City / Town / Village"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="e.g. Jaipur"
                  />
                  <OutlineInput
                    label="Pincode / Postal Code"
                    name="present_postal_code"
                    value={formData.present_postal_code}
                    onChange={handleInputChange}
                    placeholder="e.g. 302026"
                  />
                  <OutlineInput
                    label="District"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g. Jaipur"
                  />
                  <OutlineInput
                    label="State"
                    name="birth_place"
                    value={formData.birth_place}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajasthan"
                  />
                  <OutlineInput
                    label="Country"
                    name="present_country"
                    value={formData.present_country || 'India'}
                    onChange={handleInputChange}
                  />
                  <OutlineInput
                    label="Emergency Contact Phone"
                    name="contact_phone_no"
                    value={formData.contact_phone_no}
                    onChange={handleInputChange}
                    placeholder="Alternative Phone No."
                  />
                </div>
              </Accordion>

              {/* Accordion 2: KYC & Identity Details */}
              <Accordion
                title="KYC, IDENTITY & CATEGORY DETAILS"
                isOpen={accordions.other}
                onToggle={() => toggleAccordion('other')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                  <OutlineInput
                    label="Student Aadhaar Card No."
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={handleInputChange}
                    placeholder="12-digit Aadhaar Number"
                  />
                  <OutlineInput
                    label="APAAR ID / PEN (National ID)"
                    name="apaar_id"
                    value={formData.apaar_id}
                    onChange={handleInputChange}
                    placeholder="Govt. Automated Permanent Academic Account"
                  />
                  <OutlineSelect
                    label="Blood Group"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleInputChange}
                    options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                  />
                  <OutlineSelect
                    label="Social Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={['General', 'OBC', 'SC', 'ST', 'EWS', 'Other']}
                  />
                  <OutlineInput
                    label="Sub-Caste (Optional)"
                    name="cast"
                    value={formData.cast}
                    onChange={handleInputChange}
                    placeholder="e.g. Rajput, Brahmin, etc."
                  />
                  <OutlineSelect
                    label="Religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    options={['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhism', 'Other']}
                  />
                  <OutlineInput
                    label="Mother Tongue"
                    name="mother_tongue"
                    value={formData.mother_tongue || 'Hindi'}
                    onChange={handleInputChange}
                  />
                  <OutlineSelect
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality || 'Indian'}
                    onChange={handleInputChange}
                    options={['Indian', 'NRI', 'Other']}
                  />
                </div>
              </Accordion>

              {/* Accordion 3: Previous School & TC Details */}
              <Accordion
                title="PREVIOUS SCHOOL & TRANSFER CERTIFICATE (TC)"
                isOpen={accordions.previous}
                onToggle={() => toggleAccordion('previous')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                  <OutlineInput
                    label="Previous School Name"
                    name="previous_school"
                    value={formData.previous_school}
                    onChange={handleInputChange}
                    placeholder="Name of last attended school"
                    className="sm:col-span-2"
                  />
                  <OutlineInput
                    label="Previous Class Passed"
                    name="previous_class"
                    value={formData.previous_class}
                    onChange={handleInputChange}
                    placeholder="e.g. Class IV"
                  />
                  <OutlineInput
                    label="Previous Board"
                    name="previous_board"
                    value={formData.previous_board}
                    onChange={handleInputChange}
                    placeholder="e.g. CBSE / State Board / ICSE"
                  />
                  <OutlineInput
                    label="Marks (% / Grade)"
                    name="previous_percentage"
                    value={formData.previous_percentage}
                    onChange={handleInputChange}
                    placeholder="e.g. 88% or A Grade"
                  />
                  <OutlineSelect
                    label="Transfer Certificate (TC) Available?"
                    name="has_tc"
                    value={formData.has_tc || 'No'}
                    onChange={handleInputChange}
                    options={['Yes - Submitted', 'No - Due / Pending', 'Not Applicable (Fresher)']}
                  />
                  <OutlineInput
                    label="TC Serial Number"
                    name="tc_no"
                    value={formData.tc_no}
                    onChange={handleInputChange}
                    placeholder="TC No. on certificate"
                  />
                  <OutlineInput
                    label="Previous Passout Year"
                    name="previous_year"
                    value={formData.previous_year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2025-2026"
                  />
                </div>
              </Accordion>

              {/* Accordion 4: Bank Details (Optional for Scholarships/Refunds) */}
              <Accordion
                title="BANK ACCOUNT DETAILS (OPTIONAL)"
                isOpen={accordions.bank}
                onToggle={() => toggleAccordion('bank')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                  <OutlineInput
                    label="Bank Name"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="e.g. State Bank of India"
                  />
                  <OutlineInput
                    label="Bank Account Number"
                    name="stu_account_no"
                    value={formData.stu_account_no}
                    onChange={handleInputChange}
                    placeholder="e.g. 30894102910"
                  />
                  <OutlineInput
                    label="Account Holder Name"
                    name="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={handleInputChange}
                    placeholder="Student / Parent Account Name"
                  />
                  <OutlineInput
                    label="IFSC Code"
                    name="ifc_code"
                    value={formData.ifc_code}
                    onChange={handleInputChange}
                    placeholder="e.g. SBIN0001234"
                  />
                </div>
              </Accordion>
            </div>
          </div>
        )}

        {/* Tab 2: Parent's Details */}
        {activeTab === 'parents_details' && (
          <div className="space-y-6">
            {/* Father Details Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-gray-800 tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                FATHER DETAILS
              </h3>
              <div className="grid grid-cols-12 gap-4">
                <StudentAvatar
                  previewUrl={formData.father_photo}
                  onFileSelect={(e) => handleFileUpload(e, 'father_photo')}
                  isStudent={false}
                  role="father"
                />

                <div className="col-span-12 sm:col-span-9">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                    <OutlineInput
                      label="Father Name"
                      name="fathers_name"
                      value={formData.fathers_name}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Father Mobile No."
                      name="fathers_mobile_no"
                      value={formData.fathers_mobile_no}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Father Email"
                      name="fathers_email"
                      value={formData.fathers_email}
                      onChange={handleInputChange}
                    />

                    <OutlineInput
                      label="Father Occupation"
                      name="fathers_occupation"
                      value={formData.fathers_occupation}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Father Qualification"
                      name="fathers_alternate_email"
                      value={formData.fathers_alternate_email}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Annual Income"
                      name="fathers_income"
                      value={formData.fathers_income}
                      onChange={handleInputChange}
                    />

                    <OutlineInput
                      label="Father Aadhaar No."
                      name="fathers_aadhaar"
                      value={formData.fathers_aadhaar}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Father PAN No."
                      name="fathers_pan_no"
                      value={formData.fathers_pan_no}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Father D.O.B"
                      name="fathers_dob"
                      type="date"
                      value={formData.fathers_dob}
                      onChange={handleInputChange}
                      rightIcon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mother Details Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-gray-800 tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-600"></span>
                MOTHER DETAILS
              </h3>
              <div className="grid grid-cols-12 gap-4">
                <StudentAvatar
                  previewUrl={formData.mother_photo}
                  onFileSelect={(e) => handleFileUpload(e, 'mother_photo')}
                  isStudent={false}
                  role="mother"
                />

                <div className="col-span-12 sm:col-span-9">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                    <OutlineInput
                      label="Mother Name"
                      name="mothers_name"
                      value={formData.mothers_name}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Mother Mobile No."
                      name="mothers_mobile_no"
                      value={formData.mothers_mobile_no}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Mother Email"
                      name="mothers_email"
                      value={formData.mothers_email}
                      onChange={handleInputChange}
                    />

                    <OutlineInput
                      label="Mother Occupation"
                      name="mothers_occupation"
                      value={formData.mothers_occupation}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Mother Qualification"
                      name="mothers_alternate_email"
                      value={formData.mothers_alternate_email}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Mother Annual Income"
                      name="mothers_income"
                      value={formData.mothers_income}
                      onChange={handleInputChange}
                    />

                    <OutlineInput
                      label="Mother Aadhaar No."
                      name="mothers_aadhaar"
                      value={formData.mothers_aadhaar}
                      onChange={handleInputChange}
                    />
                    <OutlineInput
                      label="Mother D.O.B"
                      name="mothers_dob"
                      type="date"
                      value={formData.mothers_dob}
                      onChange={handleInputChange}
                      rightIcon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guardians Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
              <h3 className="text-xs font-bold text-gray-800 tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                LOCAL GUARDIAN DETAILS (OPTIONAL)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                <OutlineInput
                  label="Guardian Name"
                  name="guardian1_name"
                  value={formData.guardian1_name}
                  onChange={handleInputChange}
                />
                <OutlineInput
                  label="Guardian Relation"
                  name="guardian1_relation"
                  value={formData.guardian1_relation}
                  onChange={handleInputChange}
                />
                <OutlineInput
                  label="Guardian Mobile No."
                  name="guardian1_mobile_no"
                  value={formData.guardian1_mobile_no}
                  onChange={handleInputChange}
                />
                <OutlineInput
                  label="Guardian Address / Remark"
                  name="guardian1_remark"
                  value={formData.guardian1_remark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Transport */}
        {activeTab === 'transport' && (
          <div className="py-2">
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="apply_transport"
                  checked={formData.apply_transport}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span>apply transport</span>
              </label>
            </div>

            {formData.apply_transport && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 pt-2">
                <OutlineSelect
                  label="Route"
                  name="route_id"
                  value={formData.route_id}
                  onChange={handleInputChange}
                  options={['Route 1 (North Ring)', 'Route 2 (South Sector)', 'Route 3 (East Expressway)', 'Route 4 (West Bypass)']}
                />
                <OutlineSelect
                  label="Destination"
                  name="destination_id"
                  value={formData.destination_id}
                  onChange={handleInputChange}
                  options={['Stop A (Main Gate)', 'Stop B (Market Complex)', 'Stop C (Metro Station)', 'Stop D (Town Hall)']}
                />
                <OutlineSelect
                  label="Vehicle"
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleInputChange}
                  options={['Bus [RJ02PA2762] (52 Seats)', 'Bus [RJ14PC1019] (42 Seats)', 'Van [RJ14PC1037] (18 Seats)']}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Hostel Allocation */}
        {activeTab === 'hostel' && (
          <div className="py-2">
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="apply_hostel"
                  checked={formData.apply_hostel}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                />
                <span>apply Hostel</span>
              </label>
            </div>

            {formData.apply_hostel && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 pt-2">
                <OutlineSelect
                  label="Hostel"
                  name="hostel_id"
                  value={formData.hostel_id}
                  onChange={handleInputChange}
                  options={['Main Boys Hostel', 'Senior Girls Hostel', 'Junior Hostel Wing']}
                />
                <OutlineSelect
                  label="Block"
                  name="block_id"
                  value={formData.block_id}
                  onChange={handleInputChange}
                  options={['Block A (Tagore)', 'Block B (Ramanujan)', 'Block C (Aryabhata)']}
                />
                <OutlineSelect
                  label="Floor"
                  name="floor_id"
                  value={formData.floor_id}
                  onChange={handleInputChange}
                  options={['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor']}
                />
                <OutlineSelect
                  label="Room"
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleInputChange}
                  options={['Room 101 (2-Bed)', 'Room 102 (2-Bed)', 'Room 201 (3-Bed)', 'Room 202 (3-Bed)']}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Documents - Clean & Streamlined */}
        {activeTab === 'documents' && (
          <div className="py-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Upload student certificates and identity proofs. Upload status updates automatically.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <DocumentCard
                title="Student Aadhaar Card"
                previewUrl={formData.doc_front_aadhar}
                onFileSelect={(e) => handleFileUpload(e, 'doc_front_aadhar')}
              />
              <DocumentCard
                title="Birth Certificate"
                previewUrl={formData.doc_birth_cert}
                onFileSelect={(e) => handleFileUpload(e, 'doc_birth_cert')}
              />
              <DocumentCard
                title="Transfer Certificate (TC)"
                previewUrl={formData.doc_tc}
                onFileSelect={(e) => handleFileUpload(e, 'doc_tc')}
              />
              <DocumentCard
                title="Character Certificate (CC)"
                previewUrl={formData.doc_cc}
                onFileSelect={(e) => handleFileUpload(e, 'doc_cc')}
              />
              <DocumentCard
                title="Parent ID Proof / Aadhaar"
                previewUrl={formData.doc_f_front_aadhar}
                onFileSelect={(e) => handleFileUpload(e, 'doc_f_front_aadhar')}
              />
              <DocumentCard
                title="Previous School Marksheet"
                previewUrl={formData.doc_other}
                onFileSelect={(e) => handleFileUpload(e, 'doc_other')}
              />
            </div>
          </div>
        )}

        {/* Tab 7: Sports */}
        {activeTab === 'sports' && (
          <div className="py-2 max-w-2xl">
            <OutlineInput
              label="Primary Sport / Activity"
              name="sports_activity"
              value={formData.sports_activity}
              onChange={handleInputChange}
              placeholder="e.g. Cricket, Football, Chess, Athletics"
            />
            <OutlineInput
              label="Highest Achievement / Level"
              name="sports_achievement"
              value={formData.sports_achievement}
              onChange={handleInputChange}
              placeholder="e.g. District Level Winner, School Captain"
            />
            <div className="relative mb-3 mt-4">
              <label className="absolute -top-2 left-2.5 px-1 text-[11px] font-medium text-gray-500 bg-white z-10">
                Coach / Physical Fitness Remarks
              </label>
              <textarea
                name="sports_remarks"
                value={formData.sports_remarks}
                onChange={handleInputChange}
                rows={3}
                placeholder="Remarks on fitness, attendance in sports sessions..."
                className="w-full px-3 py-2 text-xs md:text-sm text-gray-800 bg-white border border-gray-300 rounded focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Sticky/Fixed Save Bar matching Live UAB */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          {saveStatus ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-pulse">
              <Check className="w-4 h-4" />
              {saveStatus}
            </span>
          ) : (
            <span className="text-xs text-gray-400">All changes ready to be saved.</span>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs md:text-sm font-semibold rounded shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
