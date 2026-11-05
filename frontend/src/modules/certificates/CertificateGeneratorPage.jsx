import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home,
  Printer,
  Search,
  X,
  Award,
  CheckCircle,
  FileText,
  UserCheck,
  Briefcase,
  Calendar,
  ShieldCheck,
  ChevronDown,
  Check,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
  Palette,
  Highlighter,
  Eraser,
  RefreshCw,
  FileEdit,
  Eye,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
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

  // MS Word-Style Document Studio States
  const [isWordMode, setIsWordMode] = useState(true);
  const [docFontFamily, setDocFontFamily] = useState("'Times New Roman', Times, serif");
  const [docFontSize, setDocFontSize] = useState("14.5px");
  const [selectedTextColor, setSelectedTextColor] = useState("#0f172a");
  const [templateResetKey, setTemplateResetKey] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const certBodyRef = useRef(null);

  const executeFormat = (command, value = null) => {
    try {
      document.execCommand(command, false, value);
    } catch (err) {
      console.error('Format command error:', err);
    }
  };

  const preventBlurAndExecute = (e, command, value = null) => {
    e.preventDefault();
    executeFormat(command, value);
  };

  const insertDateAtCursor = (e) => {
    e.preventDefault();
    const formatted = new Date().toLocaleDateString('en-GB');
    executeFormat('insertText', formatted);
  };

  const insertRefNoAtCursor = (e) => {
    e.preventDefault();
    executeFormat('insertText', certificateRefNo);
  };

  const insertNewParagraph = (e) => {
    e.preventDefault();
    if (certBodyRef.current) {
      const p = document.createElement('p');
      p.className = 'pt-2';
      p.innerHTML = 'This is an additional official remark or endorsement.';
      certBodyRef.current.appendChild(p);
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(p);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const insertDivider = (e) => {
    e.preventDefault();
    executeFormat('insertHorizontalRule', null);
  };

  const buildStudentHtml = () => {
    if (!selectedStudent) return '';

    let parentText = '';
    if (withOption === "Father's Name") {
      parentText = `, son/daughter of Mr. <strong class="text-slate-950 font-bold">${selectedStudent.fatherName || 'Guardian'}</strong>`;
    } else if (withOption === "Mother's Name") {
      parentText = `, son/daughter of Mrs. <strong class="text-slate-950 font-bold">${selectedStudent.motherName || 'Mother'}</strong>`;
    } else if (withOption === 'Both') {
      parentText = `, son/daughter of Mr. <strong class="text-slate-950 font-bold">${selectedStudent.fatherName || 'Guardian'}</strong> and Mrs. <strong class="text-slate-950 font-bold">${selectedStudent.motherName || 'Mother'}</strong>`;
    }

    let extraParagraph = '';
    if (reportType === 'Character Certificate') {
      extraParagraph = `<p>During his/her tenure at this institution, his/her character, general conduct, moral demeanor, and discipline have been found to be <strong class="font-bold text-slate-950">EXCELLENT</strong>. To the best of our official knowledge and belief, he/she bears an exemplary reputation and has actively participated in co-curricular, sports, and institutional activities.</p>`;
    } else if (reportType === 'Tution Fee Report') {
      extraParagraph = `<p>As per official accounts and fee ledger records of the school office, the requisite tuition fee has been cleared for the session ${academicSession}. The total school tuition and composite fees deposited for the academic year amounts to <strong class="font-black text-slate-950">₹${tuitionFeeAmount}/-</strong>. No institutional dues are outstanding against the student as of today.</p>`;
    } else if (reportType === 'Study Certificate') {
      extraParagraph = `<p>The medium of instruction in this institution is <strong class="font-bold text-slate-950">English</strong>. The student has shown earnest scholastic aptitude, commendable attendance record, and diligent progress in all prescribed subjects under the Central Board of Secondary Education curriculum.</p>`;
    } else if (reportType === 'Participation Certificate' || reportType === 'Participation Achievement') {
      extraParagraph = `<p>The student has enthusiastically represented the school and achieved meritorious commendation in inter-school cultural events, literary competitions, and sports meets, bringing laurels and honor to our institution.</p>`;
    }

    return `
      <p>This is to certify that Master / Miss <strong class="text-slate-950 font-black underline decoration-slate-400 underline-offset-4">${selectedStudent.name}</strong>${parentText}, bearing Admission Number <strong class="text-slate-950 font-bold">${selectedStudent.admNo}</strong> and Scholar Register (SR) Number <strong class="text-slate-950 font-bold">${selectedStudent.srNo}</strong>, is a bonafide regular student of Class <strong class="text-slate-950 font-bold">${selectedStudent.className} - Section ${selectedStudent.section}</strong> of this institution during the academic session <strong class="text-slate-950 font-bold">${academicSession}</strong>.</p>
      ${extraParagraph}
      <p class="pt-2">This certificate is issued on the bona fide request of the parent/guardian for official and academic purposes. We wish him/her resounding success and bright fortune in all future academic pursuits and endeavors.</p>
    `.trim();
  };

  const buildStaffHtml = () => {
    if (!selectedStaff) return '';
    const prefix = selectedStaff.gender === 'Female' ? 'Mrs. / Ms.' : 'Mr.';

    let extraParagraph = '';
    if (staffReportType === 'Experience Certificate') {
      extraParagraph = `<p>During his/her tenure with us, he/she has discharged his/her duties with utmost dedication, professionalism, and sincerity. He/she possesses sound pedagogical knowledge, exceptional student mentorship skills, and has contributed significantly toward institutional academic excellence.</p>`;
    } else if (staffReportType === 'Relieving Certificate') {
      extraParagraph = `<p>He/she has been officially relieved of his/her responsibilities at the close of institutional office hours on <strong class="font-bold text-slate-950">${issueDate}</strong> upon his/her own request. All institutional assets, administrative charges, and office clearances have been fully settled, and there are no dues pending against him/her.</p>`;
    } else if (staffReportType === 'Salary Certificate') {
      extraParagraph = `<p>As per official payroll and salary disbursement records, his/her current gross monthly compensation is <strong class="font-bold text-slate-950">₹${Number(selectedStaff.salary || 35000).toLocaleString('en-IN')}/-</strong>. This salary certificate is issued upon the employee's request for financial, banking, or official verification purposes.</p>`;
    }

    return `
      <p>This is to certify that <strong class="text-slate-950 font-black underline decoration-slate-400 underline-offset-4">${prefix} ${selectedStaff.name}</strong>, bearing Employee Code <strong class="text-slate-950 font-bold">${selectedStaff.code}</strong>, has been serving in this institution as <strong class="text-slate-950 font-bold">${selectedStaff.designation}</strong> in the Department of <strong class="text-slate-950 font-bold">${selectedStaff.department}</strong> since <strong class="text-slate-950 font-bold">${selectedStaff.appoinDate}</strong>.</p>
      ${extraParagraph}
      <p>His/her character, personal integrity, and professional conduct during employment have been <strong class="font-bold text-slate-950">${staffConduct}</strong>. We extend our warmest appreciation for his/her valuable service and wish him/her continued success in all prospective assignments.</p>
    `.trim();
  };

  const handleResetTemplate = () => {
    setIsResetting(true);
    try {
      // 1. Reset typography & toolbar state
      setDocFontFamily("'Times New Roman', Times, serif");
      setDocFontSize("14.5px");
      setSelectedTextColor("#0f172a");

      // 2. Reset certificate metadata
      setCertificateRefNo(`JDIS/CERT/2026/${Math.floor(100 + Math.random() * 900)}`);
      setIssueDate(new Date().toLocaleDateString('en-GB'));
      if (selectedStudent?.paidFees) {
        setTuitionFeeAmount(Number(selectedStudent.paidFees).toLocaleString('en-IN'));
      } else {
        setTuitionFeeAmount('42,000');
      }

      // 3. Force remount of the entire certificate canvas
      setTemplateResetKey((prev) => prev + 1);

      toast.success('Certificate restored to original template!');
    } catch (err) {
      console.error('Reset template error:', err);
    } finally {
      setTimeout(() => setIsResetting(false), 500);
    }
  };

  // Sync Body HTML when selected entity or template parameters change
  useEffect(() => {
    if (certBodyRef.current) {
      if (activeTab === 'student') {
        certBodyRef.current.innerHTML = buildStudentHtml();
      } else {
        certBodyRef.current.innerHTML = buildStaffHtml();
      }
    }
  }, [
    activeTab,
    selectedStudent?.admNo,
    selectedStaff?.id,
    reportType,
    staffReportType,
    withOption,
    academicSession,
    tuitionFeeAmount,
    issueDate,
    staffConduct
  ]);

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
        /* Word Mode Clean Typography & Seamless Editing (No persistent dashed boxes) */
        [contenteditable="true"] {
          outline: none !important;
        }
        [contenteditable="true"]:focus {
          outline: none !important;
        }

        /* Clean Word Document Editing Experience */
        .word-mode-active [contenteditable="true"] {
          cursor: text;
        }

        /* Subtle focus indicator on the active paragraph or element only when typing */
        .word-mode-active [contenteditable="true"]:focus {
          box-shadow: 0 0 0 1.5px rgba(59, 130, 246, 0.4);
          border-radius: 3px;
        }

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
          .no-print, .word-ribbon-toolbar {
            display: none !important;
          }
          [contenteditable="true"] {
            box-shadow: none !important;
            outline: none !important;
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
      {/* LIVE CERTIFICATE PREVIEW SHEET WITH MS WORD WYSIWYG STUDIO            */}
      {/* ===================================================================== */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
        {/* ===================================================================== */}
        {/* MS WORD-STYLE WYSIWYG FORMATTING TOOLBAR RIBBON                       */}
        {/* ===================================================================== */}
        <div className="no-print bg-white rounded-xl shadow-md border border-slate-200/90 overflow-hidden transition-all">
          {/* Word Header Bar */}
          <div className="bg-gradient-to-r from-[#185abd] via-[#2b579a] to-[#104a8e] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-white text-[#2b579a] font-serif font-black flex items-center justify-center text-sm shadow-sm">
                W
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs tracking-wide uppercase">Word Document Studio</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                    {isWordMode ? 'WYSIWYG Edit Mode Active' : 'Read-Only Preview'}
                  </span>
                </div>
                <p className="text-[10px] text-blue-100">
                  Click anywhere directly on the certificate canvas below to type, replace words, or format
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Edit Mode */}
              <button
                type="button"
                onClick={() => setIsWordMode(!isWordMode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isWordMode
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isWordMode ? <FileEdit className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isWordMode ? 'Word Mode: ON' : 'Preview Mode'}</span>
              </button>

              {/* Reset to Default Template */}
              <button
                type="button"
                onClick={handleResetTemplate}
                title="Restore official template wording"
                className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Reset Template</span>
              </button>

              {/* Print */}
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="px-3.5 py-1 rounded-lg bg-white text-[#2b579a] hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Word Formatting Ribbon */}
          {isWordMode && (
            <div className="p-2.5 bg-slate-50/90 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-slate-700 text-xs">
              {/* Undo / Redo */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'undo')}
                  title="Undo (Ctrl+Z)"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'redo')}
                  title="Redo (Ctrl+Y)"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Font Family Dropdown */}
              <select
                value={docFontFamily}
                onChange={(e) => {
                  setDocFontFamily(e.target.value);
                  executeFormat('fontName', e.target.value);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                title="Document Font Family"
              >
                <option value="'Times New Roman', Times, serif">Times New Roman (Serif)</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Garamond', serif">Garamond</option>
                <option value="Arial, Helvetica, sans-serif">Arial (Sans-serif)</option>
                <option value="'Inter', -apple-system, sans-serif">Inter / Modern</option>
                <option value="'Courier New', Courier, monospace">Courier (Typewriter)</option>
              </select>

              {/* Font Size Dropdown */}
              <select
                value={docFontSize}
                onChange={(e) => {
                  setDocFontSize(e.target.value);
                  const selection = window.getSelection();
                  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    span.style.fontSize = e.target.value;
                    try {
                      range.surroundContents(span);
                    } catch (err) {
                      executeFormat('fontSize', '3');
                    }
                  }
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer w-20"
                title="Font Size"
              >
                <option value="12px">12 pt</option>
                <option value="13px">13 pt</option>
                <option value="14px">14 pt</option>
                <option value="14.5px">14.5 pt</option>
                <option value="16px">16 pt</option>
                <option value="18px">18 pt</option>
                <option value="20px">20 pt</option>
              </select>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Bold, Italic, Underline, Strikethrough */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'bold')}
                  title="Bold (Ctrl+B)"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-black cursor-pointer"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'italic')}
                  title="Italic (Ctrl+I)"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'underline')}
                  title="Underline (Ctrl+U)"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'strikeThrough')}
                  title="Strikethrough"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Text Color & Highlight Picker */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs relative">
                <label
                  title="Text Color"
                  className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-slate-600" />
                  <input
                    type="color"
                    value={selectedTextColor}
                    onChange={(e) => {
                      setSelectedTextColor(e.target.value);
                      executeFormat('foreColor', e.target.value);
                    }}
                    className="w-4 h-4 p-0 border-0 rounded cursor-pointer"
                  />
                </label>

                {/* Highlighter Quick Colors */}
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                  <Highlighter className="w-3.5 h-3.5 text-amber-500 ml-1" />
                  {[
                    { color: '#fef08a', name: 'Yellow' },
                    { color: '#bbf7d0', name: 'Green' },
                    { color: '#bae6fd', name: 'Cyan' },
                    { color: 'transparent', name: 'None' }
                  ].map((h) => (
                    <button
                      key={h.name}
                      type="button"
                      title={`Highlight ${h.name}`}
                      onMouseDown={(e) => preventBlurAndExecute(e, 'hiliteColor', h.color)}
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 hover:scale-125 transition-transform cursor-pointer"
                      style={{ backgroundColor: h.color === 'transparent' ? '#fff' : h.color }}
                    />
                  ))}
                </div>
              </div>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Text Alignment */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'justifyLeft')}
                  title="Align Left"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'justifyCenter')}
                  title="Center"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'justifyRight')}
                  title="Align Right"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'justifyFull')}
                  title="Justify"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Bullets & Numbering */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'insertUnorderedList')}
                  title="Bullet List"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'insertOrderedList')}
                  title="Numbered List"
                  className="p-1.5 rounded hover:bg-blue-50 text-slate-700 hover:text-blue-700 cursor-pointer"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => preventBlurAndExecute(e, 'removeFormat')}
                  title="Clear Formatting on Selection"
                  className="p-1.5 rounded hover:bg-rose-50 text-slate-700 hover:text-rose-600 cursor-pointer"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-5 w-px bg-slate-300 mx-1" />

              {/* Quick Word Helpers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onMouseDown={insertDateAtCursor}
                  title="Insert Today's Date at cursor"
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  <span>Date</span>
                </button>

                <button
                  type="button"
                  onMouseDown={insertRefNoAtCursor}
                  title="Insert Ref No at cursor"
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Award className="w-3 h-3 text-amber-500" />
                  <span>Ref No</span>
                </button>

                <button
                  type="button"
                  onMouseDown={insertNewParagraph}
                  title="Add a new custom paragraph at bottom"
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  <span>Paragraph</span>
                </button>

                <button
                  type="button"
                  onMouseDown={insertDivider}
                  title="Insert horizontal line divider"
                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Minus className="w-3 h-3 text-slate-500" />
                  <span>Line</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Paper Canvas */}
        <div
          id="printable-certificate-sheet"
          key={templateResetKey}
          spellCheck={false}
          className={`bg-white rounded-xl shadow-lg border border-slate-200/90 p-8 md:p-12 transition-all relative overflow-hidden ${
            isWordMode ? 'word-mode-active' : ''
          }`}
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
                <h2
                  contentEditable={isWordMode}
                  suppressContentEditableWarning={true}
                  spellCheck={false}
                  className="text-2xl md:text-3xl font-black text-slate-900 tracking-wider uppercase font-serif cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                >
                  {schoolName}
                </h2>
                <p
                  contentEditable={isWordMode}
                  suppressContentEditableWarning={true}
                  spellCheck={false}
                  className="text-xs text-slate-600 font-semibold tracking-wide cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                >
                  Affiliated to CBSE, New Delhi • Affiliation No: {schoolAffiliation} • School Code: {schoolCode}
                </p>
                <p
                  contentEditable={isWordMode}
                  suppressContentEditableWarning={true}
                  spellCheck={false}
                  className="text-[11px] text-slate-500 font-medium cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                >
                  {schoolAddress} • Ph: {schoolContact}
                </p>
                {schoolEmail && (
                  <p
                    contentEditable={isWordMode}
                    suppressContentEditableWarning={true}
                    spellCheck={false}
                    className="text-[10px] text-slate-400 cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                  >
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
              <div
                contentEditable={isWordMode}
                suppressContentEditableWarning={true}
                spellCheck={false}
                className="cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
              >
                <span>Ref. No: </span>
                <span className="text-slate-950 font-bold">{certificateRefNo}</span>
              </div>
              <div
                contentEditable={isWordMode}
                suppressContentEditableWarning={true}
                spellCheck={false}
                className="cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
              >
                <span>Date: </span>
                <span className="text-slate-950 font-bold">{issueDate}</span>
              </div>
            </div>

            {/* Certificate Title Badge */}
            <div className="text-center my-6">
              <span
                contentEditable={isWordMode}
                suppressContentEditableWarning={true}
                spellCheck={false}
                style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                className="inline-block px-8 py-2 rounded-full text-white text-xs md:text-sm font-black tracking-widest uppercase shadow-sm border border-slate-800 cursor-text select-text outline-none focus:ring-2 focus:ring-blue-400"
              >
                {activeTab === 'student' ? reportType : staffReportType}
              </span>
            </div>

            {/* ======================================================= */}
            {/* BODY CONTENT: EDITABLE MS WORD CANVAS                   */}
            {/* ======================================================= */}
            <div
              ref={certBodyRef}
              contentEditable={isWordMode}
              suppressContentEditableWarning={true}
              spellCheck={false}
              dangerouslySetInnerHTML={{
                __html: activeTab === 'student' ? buildStudentHtml() : buildStaffHtml()
              }}
              className="leading-relaxed text-slate-800 space-y-4 my-6 text-justify px-2 font-serif cursor-text outline-none focus:ring-1 focus:ring-blue-400 rounded-sm"
              style={{
                fontFamily: docFontFamily,
                fontSize: docFontSize
              }}
            />

            {/* ======================================================= */}
            {/* SIGNATURES & OFFICIAL SCHOOL STAMP FOOTER               */}
            {/* ======================================================= */}
            <div className="pt-10 flex justify-between items-end text-xs text-slate-700">
              {/* Left: Place & Date */}
              <div
                contentEditable={isWordMode}
                suppressContentEditableWarning={true}
                spellCheck={false}
                className="space-y-1 cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
              >
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
                <span
                  contentEditable={isWordMode}
                  suppressContentEditableWarning={true}
                  spellCheck={false}
                  className="text-[9px] font-black uppercase text-slate-500 tracking-wider cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                >
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
                <div
                  contentEditable={isWordMode}
                  suppressContentEditableWarning={true}
                  spellCheck={false}
                  className="w-36 border-t-2 border-slate-800 pt-1 font-black text-slate-900 text-xs cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                >
                  Principal
                </div>
                <span
                  contentEditable={isWordMode}
                  suppressContentEditableWarning={true}
                  spellCheck={false}
                  className="text-[10px] text-slate-500 font-medium cursor-text outline-none px-1 rounded-sm focus:ring-1 focus:ring-blue-400"
                >
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
