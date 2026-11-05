import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Home, Printer, Search, X, Award, CheckCircle, FileText, UserCheck, Briefcase, Calendar, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { tenantStore } from '../../services/tenantStore';

// Default Authentic High-Quality SVGs for School Stamp and Principal Signature
const DEFAULT_SCHOOL_STAMP = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1kYXNoYXJyYXk9IjMsMyIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBpZD0idFRvcCIgZD0iTSAyNCwxMDAgQSA3Niw3NiAwIDEsMSAxNzYsMTAwIiBmaWxsPSJub25lIi8+CiAgPHBhdGggaWQ9InRCb3R0b20iIGQ9Ik0gMTc2LDEwMCBBIDc2LDc2IDAgMCwxIDI0LDEwMCIgZmlsbD0ibm9uZSIvPgogIDx0ZXh0IGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFlM2E4YSIgbGV0dGVyLXNwYWNpbmc9IjEuNSI+CiAgICA8dGV4dFBhdGggaHJlZj0iI3RUb3AiIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKYhSBKIEQgSU5URVJOQVRJT05BTCBTQ0hPT0wg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPHRleHQgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMS41Ij4KICAgIDx0ZXh0UGF0aCBocmVmPSIjdEJvdHRvbSIgc3RhcnRPZmZzZXQ9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4piFIEpBSVBVUiAoUkFKLikg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCAxMDApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDx0ZXh0IHk9Ii0yMiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiPkFGRklMSUFURUQgVE8gQ0JTRTwvdGV4dD4KICAgIDx0ZXh0IHk9Ii00IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiPvCfjpM8L3RleHQ+CiAgICA8dGV4dCB5PSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMSI+T0ZGSUNJQUw8L3RleHQ+CiAgICA8dGV4dCB5PSIyNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiIGxldHRlci1zcGFjaW5nPSIxIj5TRUFMPC90ZXh0PgogIDwvZz4KPC9zdmc+';

const DEFAULT_PRINCIPAL_SIG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iNzAiPgogIDxwYXRoIGQ9Ik0gMjUsNTIgUSA0MCwxNSA1MCwzNSBRIDYwLDU1IDc1LDIyIFEgODUsNDUgMTAwLDI4IFEgMTE1LDEyIDEzNSwzOCBRIDE1MCw1MiAxNjUsMTggUSAxODAsNDUgMjA1LDIyIFEgMjIwLDEyIDIzMCwyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGYyYjVjIiBzdHJva2Utd2lkdGg9IjIuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTSAyMCw0NiBRIDY1LDM4IDEyNSw0MiBRIDE4NSw0NiAyMjUsNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmMmI1YyIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IidCcnVzaCBTY3JpcHQgTVQnLCAnU2Vnb2UgU2NyaXB0JywgY3Vyc2l2ZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwZjJiNWMiIGZvbnQtc3R5bGU9Iml0YWxpYyI+QWJoaWxhc2hhPC90ZXh0Pgo8L3N2Zz4=';

// Comprehensive Fallback Students for immediate out-of-the-box preview
const INITIAL_DEMO_STUDENTS = [
  {
    id: 'std_1002',
    admNo: '1002',
    srNo: '1002',
    name: 'DEV SHARMA',
    className: 'I',
    section: 'A',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    dob: '2019-01-01',
    gender: 'Male',
    totalFees: 42000,
    paidFees: 42000
  },
  {
    id: 'std_1245',
    admNo: '1245',
    srNo: '1245',
    name: 'PAYAL BUNKAR',
    className: 'XII',
    section: 'A',
    fatherName: 'Ramesh Bunkar',
    motherName: 'Geeta Bunkar',
    dob: '2008-05-14',
    gender: 'Female',
    totalFees: 48000,
    paidFees: 48000
  },
  {
    id: 'std_1120',
    admNo: '1120',
    srNo: '1120',
    name: 'HARSH VARDHAN',
    className: 'VIII',
    section: 'B',
    fatherName: 'Surendra Kumar',
    motherName: 'Anita Devi',
    dob: '2012-07-22',
    gender: 'Male',
    totalFees: 38000,
    paidFees: 38000
  },
  {
    id: 'std_1621',
    admNo: '1621',
    srNo: '1621',
    name: 'AADITYA SINGH',
    className: 'X',
    section: 'A',
    fatherName: 'Mahendra Singh',
    motherName: 'Kavita Singh',
    dob: '2010-09-18',
    gender: 'Male',
    totalFees: 45000,
    paidFees: 45000
  },
  {
    id: 'std_2060',
    admNo: '2060',
    srNo: '2060',
    name: 'ROHAN SHARMA',
    className: 'IX',
    section: 'B',
    fatherName: 'Suresh Sharma',
    motherName: 'Rekha Sharma',
    dob: '2011-03-30',
    gender: 'Male',
    totalFees: 40000,
    paidFees: 40000
  }
];

// Comprehensive Initial Staff Roster
const INITIAL_DEMO_STAFF = [
  {
    id: 'stf_101',
    code: '101',
    name: 'ABHILASHA BHATT',
    fatherName: 'R. K. Bhatt',
    gender: 'Female',
    designation: 'Principal',
    department: 'ADMINISTRATIVE & MANAGEMENT',
    mobile: '9672992836',
    email: 'abhilasha.bhatt@jdinternationalschool.com',
    appoinDate: '01/04/2020',
    experience: '16 Years',
    salary: 65000
  },
  {
    id: 'stf_102',
    code: '102',
    name: 'PRITI VERMA',
    fatherName: 'S. N. Sharma',
    gender: 'Female',
    designation: 'Administrator',
    department: 'ADMINISTRATIVE & MANAGEMENT',
    mobile: '9079909813',
    email: 'priti.verma@jdinternationalschool.com',
    appoinDate: '15/07/2021',
    experience: '8 Years',
    salary: 42000
  },
  {
    id: 'stf_201',
    code: '201',
    name: 'MONIKA RANI VERMA',
    fatherName: 'M. L. Verma',
    gender: 'Female',
    designation: 'PGT Mathematics',
    department: 'TEACHING',
    mobile: '9870943695',
    email: 'monika.verma@jdinternationalschool.com',
    appoinDate: '05/01/2022',
    experience: '6 Years',
    salary: 35000
  },
  {
    id: 'stf_202',
    code: '202',
    name: 'SUNITA KUMARI',
    fatherName: 'Gopal Lal',
    gender: 'Female',
    designation: 'TGT Science',
    department: 'TEACHING',
    mobile: '9511719644',
    email: 'sunita.kumari@jdinternationalschool.com',
    appoinDate: '10/08/2022',
    experience: '5 Years',
    salary: 32000
  },
  {
    id: 'stf_301',
    code: '301',
    name: 'RAKESH SHARMA',
    fatherName: 'Kailash Sharma',
    gender: 'Male',
    designation: 'Senior Accountant',
    department: 'ACCOUNTS',
    mobile: '9829989330',
    email: 'rakesh.sharma@jdinternationalschool.com',
    appoinDate: '01/02/2021',
    experience: '9 Years',
    salary: 38000
  }
];

export function CertificateGeneratorPage({ onNavigate }) {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'staff'

  // Student State
  const [students, setStudents] = useState(INITIAL_DEMO_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_DEMO_STUDENTS[0]);
  const [studentSearchQuery, setStudentSearchQuery] = useState(INITIAL_DEMO_STUDENTS[0].name);
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);

  // Staff State
  const [staffList, setStaffList] = useState(INITIAL_DEMO_STAFF);
  const [selectedStaff, setSelectedStaff] = useState(INITIAL_DEMO_STAFF[2]); // Monika Rani Verma
  const [staffSearchQuery, setStaffSearchQuery] = useState(INITIAL_DEMO_STAFF[2].name);
  const [showStaffSuggestions, setShowStaffSuggestions] = useState(false);

  // Certificate Options
  const [reportType, setReportType] = useState('Bonafide Certificate');
  const [staffReportType, setStaffReportType] = useState('Experience Certificate');
  const [withOption, setWithOption] = useState("Father's Name");
  const [format, setFormat] = useState('Standard');
  const [border, setBorder] = useState('Single Border');
  const [showHeader, setShowHeader] = useState(true); // Plain Paper (true) vs Letterhead (false)

  // Custom Editable Certificate Parameters
  const [tuitionFeeAmount, setTuitionFeeAmount] = useState('42,000');
  const [academicSession, setAcademicSession] = useState('2026-2027');
  const [certificateRefNo, setCertificateRefNo] = useState(`JDIS/CERT/2026/${Math.floor(100 + Math.random() * 900)}`);
  const [issueDate, setIssueDate] = useState(() => new Date().toLocaleDateString('en-GB'));
  const [staffConduct, setStaffConduct] = useState('Exemplary and hard-working');

  // Print Dialog State
  const [showPrintModal, setShowPrintModal] = useState(false);

  // School Profile Integration (Fetched live from /school-info)
  const [schoolProfile, setSchoolProfile] = useState(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      return (tenantStore?.getSchoolProfile ? tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') : null) || {};
    } catch {
      return {};
    }
  });

  // Fetch Live School Profile
  useEffect(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      const local = tenantStore?.getSchoolProfile ? tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') : null;
      if (local && Object.keys(local).length > 0) {
        setSchoolProfile(local);
      }
    } catch {}

    fetch('/api/schools/profile')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) {
          const item = d.data;
          setSchoolProfile(prev => ({
            ...prev,
            ...item,
            schoolName: item.schoolName || prev.schoolName || 'J D INTERNATIONAL SCHOOL',
            affiliationNo: item.affiliationNo || prev.affiliationNo || '1730619',
            schoolCode: item.schoolCode || prev.schoolCode || '20000',
            place: item.place || prev.place || 'Jaipur',
            address: item.address || prev.address || 'Main Campus, Mansarovar, Jaipur (Rajasthan) - 302020',
            phone1: item.phone1 || prev.phone1 || '0141-2780000',
            logoUrl: item.brandingImages?.school_logo || item.logoUrl || prev.logoUrl,
            brandingImages: {
              ...(prev.brandingImages || {}),
              ...(item.brandingImages || {}),
              ...(item.extraData?.brandingImages || {})
            }
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Live Registered Students
  useEffect(() => {
    let sid = 'sch_jd_intl';
    let localStudents = [];
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      sid = active?.id || 'sch_jd_intl';
      localStudents = tenantStore?.getStudents ? tenantStore.getStudents(sid) : [];
    } catch (e) {}

    fetch('/api/students')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const mapped = d.data.map((s, idx) => ({
            id: s.id || `std_${idx}`,
            admNo: s.admNo || `ADM-${1000 + idx}`,
            srNo: s.srNo || s.admNo || String(1000 + idx),
            name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toUpperCase().trim() || 'STUDENT',
            className: s.className || 'I',
            section: s.section || 'A',
            fatherName: s.fatherName || s.fathers_name || 'Guardian',
            motherName: s.motherName || s.mothers_name || 'Mother',
            dob: s.dob || '2018-05-10',
            gender: s.gender || 'Male',
            totalFees: s.totalFees || 42000,
            paidFees: s.paidFees || 42000
          }));

          // Merge without duplicates
          setStudents(prev => {
            const combined = [...mapped];
            prev.forEach(p => {
              if (!combined.some(c => String(c.admNo) === String(p.admNo))) {
                combined.push(p);
              }
            });
            return combined;
          });

          if (!selectedStudent && mapped.length > 0) {
            setSelectedStudent(mapped[0]);
            setStudentSearchQuery(mapped[0].name);
          }
        } else if (localStudents && localStudents.length > 0) {
          const mappedLocal = localStudents.map((s, idx) => ({
            id: s.id || `std_loc_${idx}`,
            admNo: s.admNo || `ADM-${1000 + idx}`,
            srNo: s.srNo || s.admNo || String(1000 + idx),
            name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toUpperCase().trim() || 'STUDENT',
            className: s.className || 'I',
            section: s.section || 'A',
            fatherName: s.fatherName || s.fathers_name || 'Guardian',
            motherName: s.motherName || s.mothers_name || 'Mother',
            dob: s.dob || '2018-05-10',
            gender: s.gender || 'Male',
            totalFees: s.totalFees || 42000,
            paidFees: s.paidFees || 42000
          }));
          setStudents(mappedLocal);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Live Staff Roster
  useEffect(() => {
    fetch('/api/payroll/staff')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const mappedStaff = d.data.map(st => ({
            id: st.id,
            code: st.code || '100',
            name: (st.name || '').toUpperCase().trim(),
            fatherName: st.fatherName || 'Guardian',
            gender: st.gender || 'Male',
            designation: st.designation || 'Staff',
            department: st.department || 'ACADEMICS',
            mobile: st.mobile || '-',
            email: st.email || '',
            appoinDate: st.appoinDate || '01/04/2021',
            experience: '5+ Years',
            salary: st.basicSalary || 35000
          }));
          setStaffList(mappedStaff);
          if (!selectedStaff && mappedStaff.length > 0) {
            setSelectedStaff(mappedStaff[0]);
            setStaffSearchQuery(mappedStaff[0].name);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Student Suggestions Filter
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery) return students.slice(0, 8);
    const q = studentSearchQuery.toLowerCase().trim();
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      String(s.admNo).toLowerCase().includes(q) ||
      String(s.srNo).toLowerCase().includes(q) ||
      String(s.className).toLowerCase().includes(q)
    );
  }, [students, studentSearchQuery]);

  // Staff Suggestions Filter
  const filteredStaff = useMemo(() => {
    if (!staffSearchQuery) return staffList.slice(0, 8);
    const q = staffSearchQuery.toLowerCase().trim();
    return staffList.filter(st =>
      st.name.toLowerCase().includes(q) ||
      String(st.code).toLowerCase().includes(q) ||
      st.designation.toLowerCase().includes(q) ||
      st.department.toLowerCase().includes(q)
    );
  }, [staffList, staffSearchQuery]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setStudentSearchQuery(student.name);
    setShowStudentSuggestions(false);
    if (student.paidFees) {
      setTuitionFeeAmount(Number(student.paidFees).toLocaleString('en-IN'));
    }
  };

  const handleSelectStaff = (staff) => {
    setSelectedStaff(staff);
    setStaffSearchQuery(staff.name);
    setShowStaffSuggestions(false);
  };

  const triggerDirectPrint = () => {
    setShowPrintModal(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Branding Elements
  const schoolName = schoolProfile?.schoolName || 'J D INTERNATIONAL SCHOOL';
  const schoolAffiliation = schoolProfile?.affiliationNo || '1730619';
  const schoolCode = schoolProfile?.schoolCode || '20000';
  const schoolAddress = schoolProfile?.address || 'Main Campus, Mansarovar, Jaipur (Rajasthan) - 302020';
  const schoolContact = schoolProfile?.phone1 || '0141-2780000';
  const schoolEmail = schoolProfile?.email || 'info@jdinternationalschool.com';
  const schoolLogo = schoolProfile?.brandingImages?.school_logo || schoolProfile?.logoUrl || null;

  const schoolStamp =
    schoolProfile?.brandingImages?.school_stamp ||
    schoolProfile?.extraData?.brandingImages?.school_stamp ||
    schoolProfile?.schoolStampUrl ||
    DEFAULT_SCHOOL_STAMP;

  const principalSig =
    schoolProfile?.brandingImages?.principal_sig ||
    schoolProfile?.extraData?.brandingImages?.principal_sig ||
    DEFAULT_PRINCIPAL_SIG;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Print Specific CSS to isolate certificate */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate-sheet, #printable-certificate-sheet * {
            visibility: visible;
          }
          #printable-certificate-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
        }
      `}</style>

      {/* Top Header / Toolbar */}
      <div className="no-print bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-slate-800">
                Generate Certificate (CC / BC / TF)
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Dynamic
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <button
                onClick={() => onNavigate && onNavigate('/')}
                className="hover:text-indigo-600 flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <span>•</span>
              <span className="text-slate-500">Certificates</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">CC / BC / TF</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPrintModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Certificate</span>
        </button>
      </div>

      <div className="no-print p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Tabs Bar: Student vs Staff */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-xs">
          <button
            onClick={() => {
              setActiveTab('student');
              if (reportType.includes('Experience') || reportType.includes('Relieving')) {
                setReportType('Bonafide Certificate');
              }
            }}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'student'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student Certificate Details (CC / BC / TF)</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`pb-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'staff'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Staff Certificate Details</span>
          </button>
        </div>

        {/* Filter / Configuration Card */}
        <div className="bg-white rounded-b-xl shadow-xs border border-slate-200/80 p-5 space-y-4">
          {activeTab === 'student' ? (
            /* ================= STUDENT CONFIGURATION ROW ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              {/* Search Student Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Search Student*
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => {
                      setStudentSearchQuery(e.target.value);
                      setShowStudentSuggestions(true);
                    }}
                    onFocus={() => setShowStudentSuggestions(true)}
                    placeholder="Enter Name, Adm No, Class..."
                    className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {showStudentSuggestions && filteredStudents.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto">
                    {filteredStudents.map((s) => (
                      <div
                        key={s.admNo || s.id}
                        onClick={() => handleSelectStudent(s)}
                        className={`px-3 py-2 text-xs hover:bg-indigo-50/60 cursor-pointer border-b border-slate-100 last:border-0 flex items-center justify-between ${
                          selectedStudent?.admNo === s.admNo ? 'bg-indigo-50/80 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Class: {s.className}-{s.section} • Adm: {s.admNo} • SR: {s.srNo}
                          </div>
                        </div>
                        {selectedStudent?.admNo === s.admNo && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Type*
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Bonafide Certificate">Bonafide Certificate</option>
                  <option value="Character Certificate">Character Certificate (CC)</option>
                  <option value="Tution Fee Report">Tuition Fee Certificate (TF)</option>
                  <option value="Study Certificate">Study Certificate</option>
                  <option value="Participation Certificate">Participation Certificate</option>
                  <option value="Participation Achievement">Participation Achievement</option>
                </select>
              </div>

              {/* With Option */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  With
                </label>
                <select
                  value={withOption}
                  onChange={(e) => setWithOption(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Father's Name">Father's Name</option>
                  <option value="Mother's Name">Mother's Name</option>
                  <option value="Both">Both (Father & Mother)</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Standard">Standard Format</option>
                  <option value="Formal">Formal School Format</option>
                  <option value="Board">CBSE Board Affiliated</option>
                </select>
              </div>

              {/* Border */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Border
                </label>
                <select
                  value={border}
                  onChange={(e) => setBorder(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Single Border">Single Border</option>
                  <option value="Double Border">Double Border</option>
                  <option value="Ornate Border">Ornate Border</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          ) : (
            /* ================= STAFF CONFIGURATION ROW ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              {/* Search Staff Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Search Staff*
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={staffSearchQuery}
                    onChange={(e) => {
                      setStaffSearchQuery(e.target.value);
                      setShowStaffSuggestions(true);
                    }}
                    onFocus={() => setShowStaffSuggestions(true)}
                    placeholder="Enter Staff Name, Code, Desig..."
                    className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {showStaffSuggestions && filteredStaff.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-56 overflow-y-auto">
                    {filteredStaff.map((st) => (
                      <div
                        key={st.code || st.id}
                        onClick={() => handleSelectStaff(st)}
                        className={`px-3 py-2 text-xs hover:bg-indigo-50/60 cursor-pointer border-b border-slate-100 last:border-0 flex items-center justify-between ${
                          selectedStaff?.code === st.code ? 'bg-indigo-50/80 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {st.designation} • Dept: {st.department} • Code: {st.code}
                          </div>
                        </div>
                        {selectedStaff?.code === st.code && (
                          <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Staff Report Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Staff Certificate Type*
                </label>
                <select
                  value={staffReportType}
                  onChange={(e) => setStaffReportType(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Experience Certificate">Experience Certificate</option>
                  <option value="Relieving Certificate">Relieving Certificate</option>
                  <option value="Staff Bonafide Certificate">Staff Bonafide / Service</option>
                  <option value="Salary Certificate">Salary Certificate / NOC</option>
                </select>
              </div>

              {/* Staff Conduct / Remark */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  General Conduct / Remark
                </label>
                <select
                  value={staffConduct}
                  onChange={(e) => setStaffConduct(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Exemplary and hard-working">Exemplary & Hard-working</option>
                  <option value="Dedicated, punctual and sincere">Dedicated, Punctual & Sincere</option>
                  <option value="Outstanding academic contributor">Outstanding Contributor</option>
                  <option value="Satisfactory and good">Satisfactory & Good</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Standard">Standard Format</option>
                  <option value="Formal">Formal Employment Format</option>
                  <option value="Board">CBSE Institutional Format</option>
                </select>
              </div>

              {/* Border */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Border
                </label>
                <select
                  value={border}
                  onChange={(e) => setBorder(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="Single Border">Single Border</option>
                  <option value="Double Border">Double Border</option>
                  <option value="Ornate Border">Ornate Border</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          )}

          {/* Secondary Controls & Print Mode */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Print Mode:</span>
              <button
                type="button"
                onClick={() => setShowHeader(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  showHeader
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🖨️</span>
                <span>With Header (Plain Paper)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowHeader(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  !showHeader
                    ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>📄</span>
                <span>No Header (Pre-printed Letterhead)</span>
              </button>
              {!showHeader && (
                <span className="text-[11px] text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  Header hidden • Extra top margin applied for letterhead
                </span>
              )}
            </div>

            {/* Editable Fee / Ref Number inputs */}
            <div className="flex items-center gap-3 text-xs">
              {activeTab === 'student' && reportType === 'Tution Fee Report' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Fee Paid: ₹</span>
                  <input
                    type="text"
                    value={tuitionFeeAmount}
                    onChange={(e) => setTuitionFeeAmount(e.target.value)}
                    className="w-24 px-2 py-1 border border-slate-200 rounded-md font-bold text-slate-800 text-xs text-right"
                  />
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Issue Date:</span>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-24 px-2 py-1 border border-slate-200 rounded-md font-semibold text-slate-800 text-xs text-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LIVE CERTIFICATE PREVIEW SHEET (High Quality Authentic Layout)        */}
      {/* ===================================================================== */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div
          id="printable-certificate-sheet"
          className="bg-white rounded-xl shadow-lg border border-slate-200/90 p-8 md:p-12 transition-all relative overflow-hidden"
          style={{ minHeight: '820px' }}
        >
          {/* Border Wrapper */}
          <div
            className={`p-8 md:p-10 rounded-xl relative h-full flex flex-col justify-between ${
              border === 'Double Border'
                ? 'border-4 border-double border-slate-800'
                : border === 'Ornate Border'
                ? 'border-4 border-dashed border-indigo-900 bg-linear-to-b from-indigo-50/15 via-white to-indigo-50/15'
                : border === 'Single Border'
                ? 'border-2 border-slate-800'
                : 'border-0'
            }`}
          >
            {/* Header Section */}
            {showHeader ? (
              <div className="text-center space-y-1.5 border-b-2 border-slate-800 pb-5">
                {/* School Logo */}
                <div className="flex justify-center mb-2">
                  {schoolLogo ? (
                    <img
                      src={schoolLogo}
                      alt={schoolName}
                      className="w-16 h-16 object-contain drop-shadow-xs"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center text-indigo-700 font-black text-xl shadow-xs">
                      JD
                    </div>
                  )}
                </div>

                {/* School Name & CBSE Credentials */}
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-wider uppercase font-serif">
                  {schoolName}
                </h2>
                <p className="text-xs text-slate-600 font-semibold tracking-wide">
                  Affiliated to CBSE, New Delhi • Affiliation No: {schoolAffiliation} • School Code: {schoolCode}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {schoolAddress} • Ph: {schoolContact}
                </p>
                {schoolEmail && (
                  <p className="text-[10px] text-slate-400">
                    Email: {schoolEmail}
                  </p>
                )}
              </div>
            ) : (
              /* Pre-printed Letterhead Spacer */
              <div
                className="border-b-2 border-dashed border-slate-300 pb-4 mb-4 flex items-center justify-center"
                style={{ minHeight: '120px' }}
              >
                <span className="text-[11px] text-slate-400 italic">
                  [ Pre-Printed Official Letterhead Space • Header Suppressed in Print ]
                </span>
              </div>
            )}

            {/* Certificate Header Bar: Serial No & Date */}
            <div className="flex justify-between items-center text-xs text-slate-600 font-semibold pt-4">
              <div>
                <span>Ref. No: </span>
                <span className="text-slate-950 font-bold">{certificateRefNo}</span>
              </div>
              <div>
                <span>Date: </span>
                <span className="text-slate-950 font-bold">{issueDate}</span>
              </div>
            </div>

            {/* Certificate Title Badge */}
            <div className="text-center my-6">
              <span className="inline-block px-8 py-2 rounded-full bg-slate-900 text-white text-xs md:text-sm font-black tracking-widest uppercase shadow-sm border border-slate-800">
                {activeTab === 'student' ? reportType : staffReportType}
              </span>
            </div>

            {/* ======================================================= */}
            {/* BODY CONTENT: STUDENT CERTIFICATE                      */}
            {/* ======================================================= */}
            {activeTab === 'student' && selectedStudent && (
              <div className="text-[13px] md:text-[14.5px] leading-relaxed text-slate-800 space-y-4 my-6 text-justify px-2 font-serif">
                <p>
                  This is to certify that Master / Miss{' '}
                  <strong className="text-slate-950 font-black underline decoration-slate-400 underline-offset-4">
                    {selectedStudent.name}
                  </strong>
                  {withOption === "Father's Name" && (
                    <>
                      , son/daughter of Mr.{' '}
                      <strong className="text-slate-950 font-bold">{selectedStudent.fatherName}</strong>
                    </>
                  )}
                  {withOption === "Mother's Name" && (
                    <>
                      , son/daughter of Mrs.{' '}
                      <strong className="text-slate-950 font-bold">{selectedStudent.motherName}</strong>
                    </>
                  )}
                  {withOption === 'Both' && (
                    <>
                      , son/daughter of Mr.{' '}
                      <strong className="text-slate-950 font-bold">{selectedStudent.fatherName}</strong> and Mrs.{' '}
                      <strong className="text-slate-950 font-bold">{selectedStudent.motherName}</strong>
                    </>
                  )}
                  , bearing Admission Number{' '}
                  <strong className="text-slate-950 font-bold">{selectedStudent.admNo}</strong> and Scholar Register
                  (SR) Number <strong className="text-slate-950 font-bold">{selectedStudent.srNo}</strong>, is a
                  bonafide regular student of Class{' '}
                  <strong className="text-slate-950 font-bold">
                    {selectedStudent.className} - Section {selectedStudent.section}
                  </strong>{' '}
                  of this institution during the academic session{' '}
                  <strong className="text-slate-950 font-bold">{academicSession}</strong>.
                </p>

                {reportType === 'Character Certificate' && (
                  <p>
                    During his/her tenure at this institution, his/her character, general conduct, moral demeanor, and
                    discipline have been found to be <strong className="font-bold text-slate-950">EXCELLENT</strong>.
                    To the best of our official knowledge and belief, he/she bears an exemplary reputation and has
                    actively participated in co-curricular, sports, and institutional activities.
                  </p>
                )}

                {reportType === 'Tution Fee Report' && (
                  <p>
                    As per official accounts and fee ledger records of the school office, the requisite tuition fee has
                    been cleared for the session {academicSession}. The total school tuition and composite fees
                    deposited for the academic year amounts to{' '}
                    <strong className="font-black text-slate-950">₹{tuitionFeeAmount}/-</strong>. No institutional
                    dues are outstanding against the student as of today.
                  </p>
                )}

                {reportType === 'Study Certificate' && (
                  <p>
                    The medium of instruction in this institution is{' '}
                    <strong className="font-bold text-slate-950">English</strong>. The student has shown earnest
                    scholastic aptitude, commendable attendance record, and diligent progress in all prescribed subjects
                    under the Central Board of Secondary Education curriculum.
                  </p>
                )}

                {(reportType === 'Participation Certificate' || reportType === 'Participation Achievement') && (
                  <p>
                    The student has enthusiastically represented the school and achieved meritorious commendation in
                    inter-school cultural events, literary competitions, and sports meets, bringing laurels and honor to
                    our institution.
                  </p>
                )}

                <p className="pt-2">
                  This certificate is issued on the bona fide request of the parent/guardian for official and academic
                  purposes. We wish him/her resounding success and bright fortune in all future academic pursuits and
                  endeavors.
                </p>
              </div>
            )}

            {/* ======================================================= */}
            {/* BODY CONTENT: STAFF CERTIFICATE                        */}
            {/* ======================================================= */}
            {activeTab === 'staff' && selectedStaff && (
              <div className="text-[13px] md:text-[14.5px] leading-relaxed text-slate-800 space-y-4 my-6 text-justify px-2 font-serif">
                <p>
                  This is to certify that{' '}
                  <strong className="text-slate-950 font-black underline decoration-slate-400 underline-offset-4">
                    {selectedStaff.gender === 'Female' ? 'Mrs. / Ms.' : 'Mr.'} {selectedStaff.name}
                  </strong>
                  , bearing Employee Code <strong className="text-slate-950 font-bold">{selectedStaff.code}</strong>,
                  has been serving in this institution as{' '}
                  <strong className="text-slate-950 font-bold">{selectedStaff.designation}</strong> in the Department
                  of <strong className="text-slate-950 font-bold">{selectedStaff.department}</strong> since{' '}
                  <strong className="text-slate-950 font-bold">{selectedStaff.appoinDate}</strong>.
                </p>

                {staffReportType === 'Experience Certificate' && (
                  <p>
                    During his/her tenure with us, he/she has discharged his/her duties with utmost dedication,
                    professionalism, and sincerity. He/she possesses sound pedagogical knowledge, exceptional student
                    mentorship skills, and has contributed significantly toward institutional academic excellence.
                  </p>
                )}

                {staffReportType === 'Relieving Certificate' && (
                  <p>
                    He/she has been officially relieved of his/her responsibilities at the close of institutional office
                    hours on <strong className="font-bold text-slate-950">{issueDate}</strong> upon his/her own
                    request. All institutional assets, administrative charges, and office clearances have been fully
                    settled, and there are no dues pending against him/her.
                  </p>
                )}

                {staffReportType === 'Salary Certificate' && (
                  <p>
                    As per official payroll and salary disbursement records, his/her current gross monthly compensation
                    is <strong className="font-bold text-slate-950">₹{Number(selectedStaff.salary || 35000).toLocaleString('en-IN')}/-</strong>.
                    This salary certificate is issued upon the employee's request for financial, banking, or official
                    verification purposes.
                  </p>
                )}

                <p>
                  His/her character, personal integrity, and professional conduct during employment have been{' '}
                  <strong className="font-bold text-slate-950">{staffConduct}</strong>. We extend our warmest
                  appreciation for his/her valuable service and wish him/her continued success in all prospective
                  assignments.
                </p>
              </div>
            )}

            {/* ======================================================= */}
            {/* SIGNATURES & OFFICIAL SCHOOL STAMP FOOTER               */}
            {/* ======================================================= */}
            <div className="pt-10 flex justify-between items-end text-xs text-slate-700">
              {/* Left: Place & Date */}
              <div className="space-y-1">
                <p>
                  <span className="text-slate-500">Place of Issue:</span>{' '}
                  <strong className="text-slate-900">{schoolProfile?.place || 'Jaipur'}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Date:</span>{' '}
                  <strong className="text-slate-900">{issueDate}</strong>
                </p>
                <p className="text-[10px] text-slate-400">
                  Affiliation Status: CBSE Regular Affiliated
                </p>
              </div>

              {/* Center: Official School Stamp / Seal (From /school-info) */}
              <div className="text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-1 drop-shadow-xs">
                  <img
                    src={schoolStamp}
                    alt="Official School Stamp / Seal"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                  Official School Seal
                </span>
              </div>

              {/* Right: Principal Signature (From /school-info) */}
              <div className="text-center flex flex-col items-center">
                <div className="h-12 flex items-center justify-center mb-1">
                  <img
                    src={principalSig}
                    alt="Principal Signature"
                    className="h-11 max-w-[130px] object-contain drop-shadow-xs"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="w-36 border-t-2 border-slate-800 pt-1 font-black text-slate-900 text-xs">
                  Principal
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {schoolName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PRINT CONFIRMATION MODAL                                              */}
      {/* ===================================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Ready to Print Certificate
              </h3>
              <p className="text-xs text-slate-500">
                Printing{' '}
                <strong className="text-slate-800">
                  {activeTab === 'student' ? reportType : staffReportType}
                </strong>{' '}
                for{' '}
                <strong className="text-slate-900">
                  {activeTab === 'student' ? selectedStudent?.name : selectedStaff?.name}
                </strong>
                .
              </p>
              <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1.5 text-slate-600 border border-slate-200/80">
                <div className="flex justify-between">
                  <span>Paper Mode:</span>
                  <strong className="text-slate-800">
                    {showHeader ? 'Plain Paper (With Header)' : 'Letterhead (No Header)'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Border:</span>
                  <strong className="text-slate-800">{border}</strong>
                </div>
                <div className="flex justify-between">
                  <span>School Seal:</span>
                  <strong className="text-emerald-600">Attached from /school-info</strong>
                </div>
              </div>

              <div className="pt-3 flex justify-center space-x-3">
                <button
                  onClick={triggerDirectPrint}
                  className="px-5 py-2.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Send to Printer</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
