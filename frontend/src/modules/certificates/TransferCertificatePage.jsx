import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Home, Search, Printer, CheckCircle, X, AlertCircle, Award, FileText, Eye, Check, ChevronDown, Calendar, Plus, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { tenantStore } from '../../services/tenantStore';

// Default Authentic High-Quality SVGs for School Stamp and Principal Signature
const DEFAULT_SCHOOL_STAMP = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1kYXNoYXJyYXk9IjMsMyIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBpZD0idFRvcCIgZD0iTSAyNCwxMDAgQSA3Niw3NiAwIDEsMSAxNzYsMTAwIiBmaWxsPSJub25lIi8+CiAgPHBhdGggaWQ9InRCb3R0b20iIGQ9Ik0gMTc2LDEwMCBBIDc2LDc2IDAgMCwxIDI0LDEwMCIgZmlsbD0ibm9uZSIvPgogIDx0ZXh0IGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFlM2E4YSIgbGV0dGVyLXNwYWNpbmc9IjEuNSI+CiAgICA8dGV4dFBhdGggaHJlZj0iI3RUb3AiIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKYhSBKIEQgSU5URVJOQVRJT05BTCBTQ0hPT0wg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPHRleHQgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMS41Ij4KICAgIDx0ZXh0UGF0aCBocmVmPSIjdEJvdHRvbSIgc3RhcnRPZmZzZXQ9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4piFIEpBSVBVUiAoUkFKLikg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCAxMDApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDx0ZXh0IHk9Ii0yMiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiPkFGRklMSUFURUQgVE8gQ0JTRTwvdGV4dD4KICAgIDx0ZXh0IHk9Ii00IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiPvCfjpM8L3RleHQ+CiAgICA8dGV4dCB5PSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMSI+T0ZGSUNJQUw8L3RleHQ+CiAgICA8dGV4dCB5PSIyNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiIGxldHRlci1zcGFjaW5nPSIxIj5TRUFMPC90ZXh0PgogIDwvZz4KPC9zdmc+';

const DEFAULT_PRINCIPAL_SIG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iNzAiPgogIDxwYXRoIGQ9Ik0gMjUsNTIgUSA0MCwxNSA1MCwzNSBRIDYwLDU1IDc1LDIyIFEgODUsNDUgMTAwLDI4IFEgMTE1LDEyIDEzNSwzOCBRIDE1MCw1MiAxNjUsMTggUSAxODAsNDUgMjA1LDIyIFEgMjIwLDEyIDIzMCwyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGYyYjVjIiBzdHJva2Utd2lkdGg9IjIuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTSAyMCw0NiBRIDY1LDM4IDEyNSw0MiBRIDE4NSw0NiAyMjUsNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmMmI1YyIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IidCcnVzaCBTY3JpcHQgTVQnLCAnU2Vnb2UgU2NyaXB0JywgY3Vyc2l2ZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwZjJiNWMiIGZvbnQtc3R5bGU9Iml0YWxpYyI+QWJoaWxhc2hhPC90ZXh0Pgo8L3N2Zz4=';

function formatDateDMY(dateStr) {
  if (!dateStr) return '—';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }
  return dateStr;
}

export function TransferCertificatePage({ onNavigate }) {
  const INITIAL_TC_LIST = [
    {
      sNo: 1,
      admNo: '1144',
      srNo: '1144',
      studentId: 'PEN-889911',
      studentRegNo: 'REG-1144',
      name: 'VANSH GUPTA',
      className: 'XI-NON-MEDICAL-A',
      fatherName: 'BHUPENDRA KUMAR GUPTA',
      motherName: 'SUNITA GUPTA',
      dob: '2009-04-12',
      dobWords: 'Twelfth April Two Thousand Nine',
      nationality: 'Indian',
      placeOfBirth: 'Jaipur',
      category: 'General',
      admissionDate: '2016-04-05',
      admissionClass: 'I',
      lastClass: 'XI (Eleven)',
      examResult: 'Promoted to XI',
      isFailed: 'No',
      subjects: 'English Core, Physics, Chemistry, Mathematics, Physical Education',
      isPromoted: 'Qualified for Promotion',
      promotedClassFigures: 'XII',
      promotedClassWords: 'Twelfth',
      schoolDues: 'Paid in Full (All Clear)',
      concession: 'No',
      totalWorkingDays: 216,
      daysPresent: 204,
      nccCadet: 'No',
      extraCurricular: 'School Cricket Team, Inter-School Science Quiz Participant',
      generalConduct: 'Good',
      applicationDate: '2026-10-01',
      issueDate: '',
      dateOfLeaving: '2026-04-01',
      reasonLeaving: 'Parent job transfer to Kota',
      remarks: 'Good character and moral conduct',
      tcNo: '',
      fbno: '—',
      proofOfDob: 'Birth Certificate',
      onceTwiceInClass: 'No',
      dueAmount: 24500,
      openingAmount: 0,
      printType: 'हिंदी / English',
      status: 'Pending'
    },
    {
      sNo: 2,
      admNo: '1448',
      srNo: '1448',
      studentId: 'PEN-773322',
      studentRegNo: 'REG-1448',
      name: 'RIDHIMA SINHA',
      className: 'II-A',
      fatherName: 'RAUNAK KUMAR SINHA',
      motherName: 'PRIYA SINHA',
      dob: '2018-10-18', // Matches Image 2 DOB: 18/10/2018
      dobWords: 'Eighteenth October Two Thousand Eighteen',
      nationality: 'Indian',
      placeOfBirth: 'Jaipur',
      category: 'General',
      admissionDate: '2020-01-01', // Matches Image 2 Adm. Date: 01/01/2020
      admissionClass: 'Nursery',
      lastClass: 'II (Two)',
      examResult: 'Passed and Promoted',
      isFailed: 'No',
      subjects: 'HINDI,ENGLISH,MATHEMATICS,EVS,ART',
      isPromoted: 'Yes',
      promotedClassFigures: 'III',
      promotedClassWords: 'Three',
      schoolDues: 'Up to March (2027)',
      concession: 'No',
      totalWorkingDays: 210,
      daysPresent: 198,
      nccCadet: 'No',
      extraCurricular: 'Active in Annual Day Dance and Storytelling',
      generalConduct: 'Very Good',
      applicationDate: '2026-10-02',
      issueDate: '',
      dateOfLeaving: '2026-01-04',
      reasonLeaving: 'Parent Request (Relocation)',
      remarks: 'Disciplined and obedient child',
      tcNo: '',
      fbno: '0',
      proofOfDob: 'Birth Certificate',
      onceTwiceInClass: 'No',
      dueAmount: 38200,
      openingAmount: 0,
      printType: 'हिंदी / English',
      status: 'Pending'
    },
    {
      sNo: 3,
      admNo: 'JD-2021-120',
      srNo: '1120',
      studentId: 'PEN-994422',
      studentRegNo: 'REG-2021-120',
      name: 'HARSH VARDHAN',
      className: 'VIII-A',
      fatherName: 'SURENDRA KUMAR',
      motherName: 'ANITA DEVI',
      dob: '2012-07-22',
      dobWords: 'Twenty Second July Two Thousand Twelve',
      nationality: 'Indian',
      placeOfBirth: 'Jaipur',
      category: 'OBC',
      admissionDate: '2021-04-05',
      admissionClass: 'V',
      lastClass: 'VIII (Eight)',
      examResult: 'Promoted to VIII',
      isFailed: 'No',
      subjects: 'English, Hindi, Mathematics, Science, Social Science, Sanskrit',
      isPromoted: 'Yes',
      promotedClassFigures: 'IX',
      promotedClassWords: 'Nine',
      schoolDues: 'Up to March (2027)',
      concession: 'No',
      totalWorkingDays: 210,
      daysPresent: 198,
      nccCadet: 'Scout Member',
      extraCurricular: 'State Level Football Championship Participant',
      generalConduct: 'Good',
      applicationDate: '2026-09-10',
      issueDate: '2026-09-15',
      dateOfLeaving: '2026-09-10',
      reasonLeaving: 'Parent job transfer to Jaipur',
      remarks: 'Exemplary conduct and active student in academic & sports',
      tcNo: 'TC-2026/041',
      fbno: 'FB-1120',
      proofOfDob: 'Transfer Certificate & Aadhar',
      onceTwiceInClass: 'No',
      dueAmount: 0,
      openingAmount: 0,
      printType: 'हिंदी / English',
      status: 'Issued'
    }
  ];

  const [tcList, setTcList] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_transfer_certificates_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TC_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('erp_transfer_certificates_list', JSON.stringify(tcList));
    } catch (e) {}
  }, [tcList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTc, setSelectedTc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // View / Edit Modal State (Exact 1:1 Parity with Image 2)
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTc, setEditingTc] = useState(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Add New TC Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTcData, setNewTcData] = useState(null);
  const [isNewLangDropdownOpen, setIsNewLangDropdownOpen] = useState(false);
  const newLangDropdownRef = useRef(null);

  // Registered students directory for quick auto-fill
  const DEMO_STUDENTS = [
    { id: '1002', admNo: '1002', srNo: '1002', name: 'DEV SHARMA', className: 'I', section: 'A', fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', dob: '2019-01-01', admissionDate: '2020-04-01', pendingFees: 0 },
    { id: '1245', admNo: '1245', srNo: '1245', name: 'PAYAL BUNKAR', className: 'XII', section: 'A', fatherName: 'Ramesh Bunkar', motherName: 'Geeta Bunkar', dob: '2008-05-14', admissionDate: '2017-07-10', pendingFees: 4800 },
    { id: '1120', admNo: '1120', srNo: '1120', name: 'HARSH VARDHAN', className: 'VIII', section: 'B', fatherName: 'Surendra Kumar', motherName: 'Anita Devi', dob: '2012-07-22', admissionDate: '2021-04-05', pendingFees: 0 },
    { id: '1621', admNo: '1621', srNo: '1621', name: 'AADITYA SINGH', className: 'X', section: 'A', fatherName: 'Mahipal Singh', motherName: 'Pushpa Kanwar', dob: '2010-09-12', admissionDate: '2019-04-02', pendingFees: 12000 },
    { id: '1448', admNo: '1448', srNo: '1448', name: 'RIDHIMA SINHA', className: 'II', section: 'A', fatherName: 'RAUNAK KUMAR SINHA', motherName: 'PRIYA SINHA', dob: '2018-10-18', admissionDate: '2020-01-01', pendingFees: 38200 }
  ];
  const [studentsList, setStudentsList] = useState(DEMO_STUDENTS);
  const [studentSearchInput, setStudentSearchInput] = useState('');
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);

  const filteredStudentSuggestions = useMemo(() => {
    if (!studentSearchInput.trim()) return studentsList.slice(0, 8);
    const q = studentSearchInput.toLowerCase();
    return studentsList.filter(
      s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.admNo && String(s.admNo).toLowerCase().includes(q)) ||
        (s.srNo && String(s.srNo).toLowerCase().includes(q))
    ).slice(0, 8);
  }, [studentsList, studentSearchInput]);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(d => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const mapped = d.data.map((s, idx) => ({
            id: s.id || `std_${idx}`,
            admNo: s.admNo || '',
            srNo: s.srNo || s.admNo || '',
            name: (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toUpperCase().trim(),
            className: s.className || 'X',
            section: s.section || 'A',
            fatherName: s.fatherName || s.fathers_name || '',
            motherName: s.motherName || s.mothers_name || '',
            dob: s.dob || '2012-05-15',
            admissionDate: s.admissionDate || s.admDate || '2020-04-01',
            pendingFees: s.pendingFees ?? (s.totalFees && s.paidFees ? (s.totalFees - s.paidFees) : 0)
          }));
          setStudentsList(prev => {
            const combined = [...mapped];
            prev.forEach(p => {
              if (!combined.some(c => String(c.admNo) === String(p.admNo))) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Live School Profile
  const [schoolProfile, setSchoolProfile] = useState(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      return (tenantStore?.getSchoolProfile ? tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') : null) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      const local = tenantStore?.getSchoolProfile ? tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') : null;
      if (local && Object.keys(local).length > 0) setSchoolProfile(local);
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
            udiseNo: item.udiseNo || prev.udiseNo || '08120501234',
            societyName: item.societyName || prev.societyName || 'Blue Moon Educational & Welfare Society',
            place: item.place || prev.place || 'Jaipur',
            address: item.address || prev.address || 'Khasra No. 12/B, Mansarovar, Jaipur-302020',
            phone1: item.phone1 || prev.phone1 || '0141-2780000',
            phone2: item.phone2 || prev.phone2 || '9829012345',
            email: item.email || prev.email || 'info@jdinternationalschool.com',
            website: item.website || prev.website || 'www.jdinternationalschool.com',
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
      if (newLangDropdownRef.current && !newLangDropdownRef.current.contains(event.target)) {
        setIsNewLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = tcList.filter(t =>
    !searchQuery ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computes next sequential TC number based on highest existing number
  const getNextTcNumber = (currentList) => {
    let maxNum = 41;
    currentList.forEach(item => {
      if (item.tcNo && item.tcNo.includes('/')) {
        const parts = item.tcNo.split('/');
        const n = parseInt(parts[1], 10);
        if (!isNaN(n) && n > maxNum) {
          maxNum = n;
        }
      }
    });
    return `TC-2026/${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleIssue = (sNo) => {
    setTcList(prev => {
      const nextTcNo = getNextTcNumber(prev);
      const today = new Date().toISOString().split('T')[0];
      const target = prev.find(t => t.sNo === sNo);
      toast.success(`TC Approved & Issued for ${target?.name || 'Student'}! Assigned TC No: ${nextTcNo}`);
      return prev.map(t =>
        t.sNo === sNo
          ? {
              ...t,
              status: 'Issued',
              tcNo: nextTcNo,
              issueDate: today
            }
          : t
      );
    });
  };

  const handleOpenViewModal = (tcRecord) => {
    setEditingTc({
      ...tcRecord,
      printType: tcRecord.printType || 'हिंदी / English',
      dueAmount: tcRecord.dueAmount ?? (tcRecord.admNo === '1448' ? 38200 : 0),
      openingAmount: tcRecord.openingAmount ?? 0,
      dateOfLeaving: tcRecord.dateOfLeaving || '2026-01-04',
      issueDate: tcRecord.issueDate || new Date().toISOString().split('T')[0],
      subjects: tcRecord.subjects || 'HINDI,ENGLISH,MATHEMATICS',
      fbno: tcRecord.fbno === '—' ? '0' : (tcRecord.fbno || '0'),
      proofOfDob: tcRecord.proofOfDob || 'Birth Certificate',
      onceTwiceInClass: tcRecord.onceTwiceInClass || 'No'
    });
    setIsLangDropdownOpen(false);
    setShowViewModal(true);
  };

  const handleEditingChange = (field, value) => {
    setEditingTc(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveModal = (e) => {
    if (e) e.preventDefault();
    if (!editingTc) return;

    setTcList(prev =>
      prev.map(item => (item.sNo === editingTc.sNo ? { ...item, ...editingTc } : item))
    );
    toast.success(`TC details updated for ${editingTc.name}!`);
    setShowViewModal(false);
  };

  const handleOpenAddNewModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewTcData({
      admNo: '',
      srNo: '',
      studentRegNo: '',
      name: '',
      className: 'X-A',
      fatherName: '',
      motherName: '',
      nationality: 'Indian',
      placeOfBirth: 'Jaipur',
      category: 'General',
      dob: '2012-05-15',
      dobWords: '',
      admissionDate: '2020-04-01',
      admissionClass: 'I',
      lastClass: 'X',
      examResult: 'Passed and Promoted',
      isFailed: 'No',
      subjects: 'HINDI,ENGLISH,MATHEMATICS,SCIENCE,SOCIAL SCIENCE',
      isPromoted: 'Yes',
      promotedClassFigures: 'XI',
      promotedClassWords: 'Eleven',
      schoolDues: 'Up to March (2027)',
      dueAmount: 0,
      openingAmount: 0,
      concession: 'No',
      totalWorkingDays: 218,
      daysPresent: 204,
      nccCadet: 'No',
      extraCurricular: 'Active Participant',
      generalConduct: 'Good',
      applicationDate: today,
      issueDate: today,
      dateOfLeaving: today,
      reasonLeaving: 'Parent job transfer',
      remarks: 'Good character and moral conduct',
      tcNo: '',
      fbno: '0',
      proofOfDob: 'Birth Certificate',
      onceTwiceInClass: 'No',
      printType: 'हिंदी / English',
      status: 'Pending'
    });
    setStudentSearchInput('');
    setShowStudentSuggestions(false);
    setIsNewLangDropdownOpen(false);
    setShowAddModal(true);
  };

  const handleSelectStudentForNewTc = (student) => {
    setStudentSearchInput(`[${student.admNo || student.id}] ${student.name}`);
    setShowStudentSuggestions(false);
    setNewTcData(prev => ({
      ...prev,
      admNo: student.admNo || '',
      srNo: student.srNo || student.admNo || '',
      studentRegNo: student.studentRegNo || `REG-${student.admNo || '100'}`,
      name: (student.name || '').toUpperCase().trim(),
      className: student.className ? `${student.className}-${student.section || 'A'}` : 'X-A',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      dob: student.dob || prev.dob,
      admissionDate: student.admissionDate || prev.admissionDate,
      dueAmount: student.pendingFees ?? 0,
      openingAmount: 0
    }));
  };

  const handleNewTcChange = (field, value) => {
    setNewTcData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewTc = (e, shouldIssueDirectly = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTcData?.name?.trim()) {
      toast.error('Please enter student name!');
      return;
    }
    if (!newTcData?.admNo?.trim()) {
      toast.error('Please enter admission number!');
      return;
    }

    setTcList(prev => {
      const nextSNo = (prev.length > 0 ? Math.max(...prev.map(p => p.sNo || 0)) : 0) + 1;
      let assignedTcNo = '';
      let assignedStatus = 'Pending';
      let assignedIssueDate = '';

      if (shouldIssueDirectly) {
        assignedTcNo = getNextTcNumber(prev);
        assignedStatus = 'Issued';
        assignedIssueDate = newTcData.issueDate || new Date().toISOString().split('T')[0];
      }

      const newRecord = {
        ...newTcData,
        sNo: nextSNo,
        tcNo: assignedTcNo,
        status: assignedStatus,
        issueDate: assignedIssueDate
      };

      toast.success(
        shouldIssueDirectly
          ? `TC Approved & Issued for ${newRecord.name}! Assigned TC No: ${assignedTcNo}`
          : `New TC record created for ${newRecord.name} (Pending Approval)`
      );

      return [newRecord, ...prev];
    });

    setShowAddModal(false);
  };

  const handlePrint = (tc) => {
    setSelectedTc(tc);
    setShowPrintModal(true);
  };

  // Branding Elements
  const schoolName = schoolProfile?.schoolName || 'J D INTERNATIONAL SCHOOL';
  const societyName = schoolProfile?.societyName || 'Blue Moon Educational & Welfare Society';
  const udiseNo = schoolProfile?.udiseNo || '27090503604';
  const affiliationNo = schoolProfile?.affiliationNo || '1730619';
  const schoolAddress = schoolProfile?.address || 'Khasra No. 12/B, Mansarovar, Jaipur-302020';
  const contactNo = schoolProfile?.phone1 || '0141-2780000, 9829012345';
  const schoolEmail = schoolProfile?.email || 'info@jdinternationalschool.com';
  const schoolWebsite = schoolProfile?.website || 'www.jdinternationalschool.com';
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
      {/* Print Specific CSS to isolate 24-point CBSE TC */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-tc-document, #printable-tc-document * {
            visibility: visible;
          }
          #printable-tc-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 8mm;
            box-shadow: none !important;
            border: 2px solid #0f172a !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-800">
              Generate TC (CBSE Standard 24-Point Format)
            </h1>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 flex items-center gap-1 cursor-pointer">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <span>•</span>
              <span className="text-slate-500">Certificates</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">TC Generation</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddNewModal}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New TC</span>
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-700">
              Transfer Certificates: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, adm no..."
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenAddNewModal}
                className="px-4 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM.NO.</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">TC NO.</th>
                  <th className="py-3 px-4">FBNO/M TC NO.</th>
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">{r.className}</td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    {/* TC NO: Only displayed when Approved & Issued */}
                    <td className="py-3 px-4 font-mono font-bold">
                      {r.status === 'Issued' && r.tcNo ? (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                          {r.tcNo}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal italic">Pending Approval</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.fbno || '—'}</td>
                    {/* ISSUE DATE: Only displayed when Approved & Issued */}
                    <td className="py-3 px-4 text-slate-600">
                      {r.status === 'Issued' && r.issueDate ? formatDateDMY(r.issueDate) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.status === 'Issued' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-1.5 whitespace-nowrap">
                      {/* VIEW BUTTON (Requested by user) */}
                      <button
                        onClick={() => handleOpenViewModal(r)}
                        className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                        title="View & Edit TC Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View</span>
                      </button>

                      {r.status === 'Pending' ? (
                        <button
                          onClick={() => handleIssue(r.sNo)}
                          className="px-2.5 py-1 rounded bg-[#5c67f6] hover:bg-indigo-600 text-white text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          Approve & Issue
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePrint(r)}
                          className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-indigo-600" />
                          <span>Print</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW / GENERATE TC MODAL (Exact 1:1 Parity with Provided Images 2 & 3) */}
      {/* ===================================================================== */}
      {showViewModal && editingTc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 mb-2">
              <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                GENERATE TC
              </h2>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Red Financial Info Dues */}
            <div className="text-rose-600 text-xs font-semibold space-y-0.5 mb-3">
              <div>Due Amount : {editingTc.dueAmount ?? 38200}</div>
              <div>Opening Amount : {editingTc.openingAmount ?? 0}</div>
            </div>

            {/* Student Info Gray Banner */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 mb-4 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500">Name: </span>
                  <strong className="text-slate-900">[{editingTc.admNo}] {editingTc.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Class: </span>
                  <strong className="text-slate-900">{editingTc.className}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Father's Name: </span>
                  <strong className="text-slate-900">{editingTc.fatherName}</strong>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-500">Adm. Date: </span>
                  <strong className="text-slate-900">{formatDateDMY(editingTc.admissionDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">DOB: </span>
                  <strong className="text-slate-900">{formatDateDMY(editingTc.dob)}</strong>
                </div>
              </div>
            </div>

            {/* 3-Column Inputs Grid */}
            <form onSubmit={handleSaveModal} className="space-y-3.5 text-xs">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="Student Registration No"
                    value={editingTc.studentRegNo || ''}
                    onChange={(e) => handleEditingChange('studentRegNo', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.isFailed || 'No'}
                      onChange={(e) => handleEditingChange('isFailed', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="No">Failed* : No</option>
                      <option value="Yes">Failed* : Yes</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.examResult || 'Passed'}
                      onChange={(e) => handleEditingChange('examResult', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Passed and Promoted">Got Last Exam Result* : Passed & Promoted</option>
                      <option value="Passed">Got Last Exam Result* : Passed</option>
                      <option value="Promoted to XI">Got Last Exam Result* : Promoted to XI</option>
                      <option value="Promoted to VIII">Got Last Exam Result* : Promoted to VIII</option>
                      <option value="Detained">Got Last Exam Result* : Detained</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.isPromoted || 'Yes'}
                      onChange={(e) => handleEditingChange('isPromoted', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Yes">Promotion* : Yes</option>
                      <option value="Qualified for Promotion">Promotion* : Qualified for Promotion</option>
                      <option value="No">Promotion* : No</option>
                      <option value="N/A">Promotion* : N/A</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.feesPaid || 'Yes'}
                      onChange={(e) => handleEditingChange('feesPaid', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Yes">Fees Paid* : Yes</option>
                      <option value="No">Fees Paid* : No</option>
                      <option value="Partial">Fees Paid* : Partial</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium">
                    Last Fee Paid date
                  </span>
                  <input
                    type="text"
                    placeholder="Up to March (2027)"
                    value={editingTc.schoolDues || 'Up to March (2027)'}
                    onChange={(e) => handleEditingChange('schoolDues', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.concession || 'No'}
                      onChange={(e) => handleEditingChange('concession', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="No">Fees Concession* : No</option>
                      <option value="Yes">Fees Concession* : Yes</option>
                      <option value="Nil">Fees Concession* : Nil</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.nccCadet || 'No'}
                      onChange={(e) => handleEditingChange('nccCadet', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="No">NCC/Scout : No</option>
                      <option value="Scout Member">NCC/Scout : Scout Member</option>
                      <option value="NCC Cadet">NCC/Scout : NCC Cadet</option>
                      <option value="Guide">NCC/Scout : Guide</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Attendance"
                    value={editingTc.daysPresent ?? 198}
                    onChange={(e) => handleEditingChange('daysPresent', parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <input
                    type="number"
                    placeholder="School Open days"
                    value={editingTc.totalWorkingDays ?? 210}
                    onChange={(e) => handleEditingChange('totalWorkingDays', parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={editingTc.generalConduct || 'Good'}
                      onChange={(e) => handleEditingChange('generalConduct', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Good">General Conduct* : Good</option>
                      <option value="Very Good">General Conduct* : Very Good</option>
                      <option value="Exemplary">General Conduct* : Exemplary</option>
                      <option value="Satisfactory">General Conduct* : Satisfactory</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Date of Application
                  </span>
                  <input
                    type={editingTc.applicationDate ? 'date' : 'text'}
                    placeholder="mm/dd/yyyy"
                    value={editingTc.applicationDate || ''}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!editingTc.applicationDate) e.target.type = 'text';
                    }}
                    onChange={(e) => handleEditingChange('applicationDate', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Issue Date*
                  </span>
                  <input
                    type={editingTc.issueDate ? 'date' : 'text'}
                    placeholder="mm/dd/yyyy"
                    value={editingTc.issueDate || ''}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!editingTc.issueDate) e.target.type = 'text';
                    }}
                    onChange={(e) => handleEditingChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Date of Leaving*
                  </span>
                  <input
                    type={editingTc.dateOfLeaving ? 'date' : 'text'}
                    placeholder="04/01/2026"
                    value={editingTc.dateOfLeaving || ''}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!editingTc.dateOfLeaving) e.target.type = 'text';
                    }}
                    onChange={(e) => handleEditingChange('dateOfLeaving', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Reason of Leaving*"
                    value={editingTc.reasonLeaving || ''}
                    onChange={(e) => handleEditingChange('reasonLeaving', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    subjects
                  </span>
                  <input
                    type="text"
                    placeholder="subjects"
                    value={editingTc.subjects || ''}
                    onChange={(e) => handleEditingChange('subjects', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Fee Book No. / Manual TC No.
                  </span>
                  <input
                    type="text"
                    placeholder="0"
                    value={editingTc.fbno || '0'}
                    onChange={(e) => handleEditingChange('fbno', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Remark"
                    value={editingTc.remarks || ''}
                    onChange={(e) => handleEditingChange('remarks', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="Proof Of DOB"
                    value={editingTc.proofOfDob || ''}
                    onChange={(e) => handleEditingChange('proofOfDob', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Once/Twice In Class"
                    value={editingTc.onceTwiceInClass || ''}
                    onChange={(e) => handleEditingChange('onceTwiceInClass', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Bottom Row: Print Type Dropdown (Exact match to Image 3) & Modify Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="text-slate-400 text-[11px]">
                  {editingTc.status === 'Issued' ? (
                    <span className="text-emerald-600 font-medium">Assigned TC No: {editingTc.tcNo}</span>
                  ) : (
                    <span>Status: Pending Approval</span>
                  )}
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  {/* Language Selector Dropdown (Image 3 Parity) */}
                  <div className="relative" ref={langDropdownRef}>
                    <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-indigo-600 font-semibold z-10">
                      Print Type*
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      className="px-4 py-2 border-2 border-indigo-500/80 rounded-lg text-xs font-medium text-slate-800 bg-white flex items-center justify-between gap-4 min-w-[150px] shadow-2xs hover:border-indigo-600 transition-colors cursor-pointer"
                    >
                      <span>{editingTc.printType || 'हिंदी / English'}</span>
                      <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" />
                    </button>

                    {/* Dropdown Popup Menu */}
                    {isLangDropdownOpen && (
                      <div className="absolute bottom-full mb-1 right-0 sm:left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                        {['None', 'हिंदी / English', 'English'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              handleEditingChange('printType', option);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              editingTc.printType === option
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{option}</span>
                            {editingTc.printType === option && (
                              <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modify Button */}
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-slate-200 hover:bg-indigo-600 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors shadow-2xs cursor-pointer"
                  >
                    Modify
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1:1 CBSE OFFICIAL 24-POINT TRANSFER CERTIFICATE MODAL                 */}
      {/* Supports Both 'हिंदी / English' Bilingual and English Modes          */}
      {/* ===================================================================== */}
      {/* ===================================================================== */}
      {/* ADD NEW TC MODAL (CBSE STANDARD 24-POINT + STUDENT DIRECTORY LOOKUP)  */}
      {/* ===================================================================== */}
      {showAddModal && newTcData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                    GENERATE NEW TC
                  </h2>
                  <p className="text-[11px] text-slate-500">CBSE Standard 24-Point Format Transfer Certificate Entry</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Student Directory Autocomplete Search */}
            <div className="relative mb-3.5">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Quick Search & Auto-Fill from Student Directory (Optional):
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type student name or admission number to auto-populate fields..."
                  value={studentSearchInput}
                  onChange={(e) => {
                    setStudentSearchInput(e.target.value);
                    setShowStudentSuggestions(true);
                  }}
                  onFocus={() => setShowStudentSuggestions(true)}
                  className="w-full text-xs pl-8 pr-8 py-2.5 border border-indigo-200 rounded-lg bg-indigo-50/20 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                />
                {studentSearchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setStudentSearchInput('');
                      setShowStudentSuggestions(false);
                    }}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showStudentSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {filteredStudentSuggestions.length > 0 ? (
                    filteredStudentSuggestions.map((st) => (
                      <div
                        key={st.id || st.admNo}
                        onClick={() => handleSelectStudentForNewTc(st)}
                        className="p-2.5 hover:bg-indigo-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-bold text-slate-800">[{st.admNo}] {st.name}</span>
                          <span className="text-slate-500 ml-2">Class: {st.className}-{st.section || 'A'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Father: {st.fatherName || '—'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">
                      No matching students found. You can enter details manually below.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Red Financial Info Dues */}
            <div className="text-rose-600 text-xs font-semibold flex items-center gap-6 mb-3">
              <div>Due Amount : {newTcData.dueAmount ?? 0}</div>
              <div>Opening Amount : {newTcData.openingAmount ?? 0}</div>
            </div>

            {/* Student Basic Information Form Fields */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 mb-4 leading-relaxed">
              <div className="text-[11px] font-bold text-slate-700 uppercase mb-2">Student Basic Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Adm No *</label>
                  <input
                    type="text"
                    value={newTcData.admNo || ''}
                    onChange={(e) => handleNewTcChange('admNo', e.target.value)}
                    placeholder="e.g. 1501"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-800 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Scholar / SR No</label>
                  <input
                    type="text"
                    value={newTcData.srNo || ''}
                    onChange={(e) => handleNewTcChange('srNo', e.target.value)}
                    placeholder="e.g. 1501"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Student Full Name *</label>
                  <input
                    type="text"
                    value={newTcData.name || ''}
                    onChange={(e) => handleNewTcChange('name', e.target.value.toUpperCase())}
                    placeholder="e.g. AARAV SHARMA"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-900 bg-white uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Class & Section *</label>
                  <input
                    type="text"
                    value={newTcData.className || ''}
                    onChange={(e) => handleNewTcChange('className', e.target.value)}
                    placeholder="e.g. X-A"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Father's Name *</label>
                  <input
                    type="text"
                    value={newTcData.fatherName || ''}
                    onChange={(e) => handleNewTcChange('fatherName', e.target.value)}
                    placeholder="Father's full name"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Mother's Name</label>
                  <input
                    type="text"
                    value={newTcData.motherName || ''}
                    onChange={(e) => handleNewTcChange('motherName', e.target.value)}
                    placeholder="Mother's full name"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Date of Birth</label>
                  <input
                    type="date"
                    value={newTcData.dob || ''}
                    onChange={(e) => handleNewTcChange('dob', e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 3-Column CBSE 24-Point Input Grid */}
            <form onSubmit={(e) => handleSaveNewTc(e, false)} className="space-y-3.5 text-xs">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="Student Registration No"
                    value={newTcData.studentRegNo || ''}
                    onChange={(e) => handleNewTcChange('studentRegNo', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.isFailed || 'No'}
                      onChange={(e) => handleNewTcChange('isFailed', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="No">Failed* : No</option>
                      <option value="Yes">Failed* : Yes</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.examResult || 'Passed and Promoted'}
                      onChange={(e) => handleNewTcChange('examResult', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Passed and Promoted">Got Last Exam Result* : Passed & Promoted</option>
                      <option value="Passed">Got Last Exam Result* : Passed</option>
                      <option value="Promoted to XI">Got Last Exam Result* : Promoted to XI</option>
                      <option value="Promoted to VIII">Got Last Exam Result* : Promoted to VIII</option>
                      <option value="Detained">Got Last Exam Result* : Detained</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.isPromoted || 'Yes'}
                      onChange={(e) => handleNewTcChange('isPromoted', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Yes">Promotion* : Yes</option>
                      <option value="Qualified for Promotion">Promotion* : Qualified for Promotion</option>
                      <option value="No">Promotion* : No</option>
                      <option value="N/A">Promotion* : N/A</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.feesPaid || 'Yes'}
                      onChange={(e) => handleNewTcChange('feesPaid', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Yes">Fees Paid* : Yes</option>
                      <option value="No">Fees Paid* : No</option>
                      <option value="Partial">Fees Paid* : Partial</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium">
                    Last Fee Paid date
                  </span>
                  <input
                    type="text"
                    placeholder="Up to March (2027)"
                    value={newTcData.schoolDues || 'Up to March (2027)'}
                    onChange={(e) => handleNewTcChange('schoolDues', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.concession || 'No'}
                      onChange={(e) => handleNewTcChange('concession', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="No">Fees Concession* : No</option>
                      <option value="Yes">Fees Concession* : Yes</option>
                      <option value="Nil">Fees Concession* : Nil</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.nccCadet || 'No'}
                      onChange={(e) => handleNewTcChange('nccCadet', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="No">NCC/Scout : No</option>
                      <option value="Scout Member">NCC/Scout : Scout Member</option>
                      <option value="NCC Cadet">NCC/Scout : NCC Cadet</option>
                      <option value="Guide">NCC/Scout : Guide</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Attendance"
                    value={newTcData.daysPresent ?? 204}
                    onChange={(e) => handleNewTcChange('daysPresent', parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <input
                    type="number"
                    placeholder="School Open days"
                    value={newTcData.totalWorkingDays ?? 218}
                    onChange={(e) => handleNewTcChange('totalWorkingDays', parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <div className="relative">
                    <select
                      value={newTcData.generalConduct || 'Good'}
                      onChange={(e) => handleNewTcChange('generalConduct', e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-700 bg-white appearance-none focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Good">General Conduct* : Good</option>
                      <option value="Very Good">General Conduct* : Very Good</option>
                      <option value="Exemplary">General Conduct* : Exemplary</option>
                      <option value="Satisfactory">General Conduct* : Satisfactory</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Date of Application
                  </span>
                  <input
                    type={newTcData.applicationDate ? 'date' : 'text'}
                    placeholder="mm/dd/yyyy"
                    value={newTcData.applicationDate || ''}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!newTcData.applicationDate) e.target.type = 'text';
                    }}
                    onChange={(e) => handleNewTcChange('applicationDate', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Issue Date*
                  </span>
                  <input
                    type={newTcData.issueDate ? 'date' : 'text'}
                    placeholder="mm/dd/yyyy"
                    value={newTcData.issueDate || ''}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!newTcData.issueDate) e.target.type = 'text';
                    }}
                    onChange={(e) => handleNewTcChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Date of Leaving*
                  </span>
                  <input
                    type={newTcData.dateOfLeaving ? 'date' : 'text'}
                    placeholder="04/01/2026"
                    value={newTcData.dateOfLeaving || ''}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!newTcData.dateOfLeaving) e.target.type = 'text';
                    }}
                    onChange={(e) => handleNewTcChange('dateOfLeaving', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Reason of Leaving*"
                    value={newTcData.reasonLeaving || ''}
                    onChange={(e) => handleNewTcChange('reasonLeaving', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    subjects
                  </span>
                  <input
                    type="text"
                    placeholder="subjects"
                    value={newTcData.subjects || ''}
                    onChange={(e) => handleNewTcChange('subjects', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-slate-500 font-medium z-10">
                    Fee Book No. / Manual TC No.
                  </span>
                  <input
                    type="text"
                    placeholder="0"
                    value={newTcData.fbno || '0'}
                    onChange={(e) => handleNewTcChange('fbno', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Remark"
                    value={newTcData.remarks || ''}
                    onChange={(e) => handleNewTcChange('remarks', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <input
                    type="text"
                    placeholder="Proof Of DOB"
                    value={newTcData.proofOfDob || ''}
                    onChange={(e) => handleNewTcChange('proofOfDob', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Once/Twice In Class"
                    value={newTcData.onceTwiceInClass || ''}
                    onChange={(e) => handleNewTcChange('onceTwiceInClass', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Bottom Row: Language Selection + Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                {/* Print Type Dropdown */}
                <div className="relative" ref={newLangDropdownRef}>
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-indigo-600 font-semibold z-10">
                    Print Type*
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsNewLangDropdownOpen(!isNewLangDropdownOpen)}
                    className="px-4 py-2 border-2 border-indigo-500/80 rounded-lg text-xs font-medium text-slate-800 bg-white flex items-center justify-between gap-4 min-w-[150px] shadow-2xs hover:border-indigo-600 transition-colors cursor-pointer"
                  >
                    <span>{newTcData.printType || 'हिंदी / English'}</span>
                    <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" />
                  </button>

                  {/* Dropdown Popup Menu */}
                  {isNewLangDropdownOpen && (
                    <div className="absolute bottom-full mb-1 left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                      {['None', 'हिंदी / English', 'English'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            handleNewTcChange('printType', option);
                            setIsNewLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            newTcData.printType === option
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{option}</span>
                          {newTcData.printType === option && (
                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveNewTc(e, false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Save as Pending
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveNewTc(e, true)}
                    className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Generate & Issue TC</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPrintModal && selectedTc && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setShowPrintModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header with Title & Clean Non-overlapping Close Button */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  CBSE Transfer Certificate Preview
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {selectedTc.tcNo || 'DRAFT'}
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Format: {selectedTc.printType || 'हिंदी / English'}
                </span>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                title="Close Modal"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* =================================================================== */}
            {/* PRINTABLE CBSE 24-POINT DOCUMENT CONTAINER                          */}
            {/* =================================================================== */}
            <div
              id="printable-tc-document"
              className="border-2 border-slate-900 p-6 sm:p-8 bg-white text-slate-900 relative shadow-sm"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              {/* Header: School Logo, Name, Society, UDISE & Affiliation */}
              <div className="text-center space-y-1 pb-3">
                {/* Logo */}
                <div className="flex justify-center mb-1">
                  {schoolLogo ? (
                    <img src={schoolLogo} alt={schoolName} className="w-14 h-14 object-contain" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-slate-900 text-lg">
                      JD
                    </div>
                  )}
                </div>

                {/* School Name */}
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-wider uppercase">
                  {schoolName}
                </h2>

                {/* Society / Trust & Affiliation Credentials */}
                <p className="text-[11px] sm:text-xs text-slate-700 font-medium">
                  (Run By:- {societyName}) &nbsp;•&nbsp; Udise No. {udiseNo} &nbsp;•&nbsp; Affiliation No. {affiliationNo}
                </p>
                <p className="text-[10.5px] sm:text-[11px] text-slate-600">
                  {schoolAddress}. Contact No. :- {contactNo}
                </p>
                <p className="text-[10px] sm:text-[10.5px] text-slate-500">
                  Email – <span className="underline">{schoolEmail}</span> &nbsp;&nbsp; {schoolWebsite}
                </p>
              </div>

              {/* Title: TRANSFER CERTIFICATE / स्थानांतरण प्रमाण पत्र */}
              <div className="border-t border-slate-400 pt-2 pb-1 text-center">
                <h3 className="text-sm sm:text-base font-black tracking-widest uppercase underline decoration-2 underline-offset-4">
                  {selectedTc.printType === 'हिंदी / English' ? (
                    <>TRANSFER CERTIFICATE / स्थानांतरण प्रमाण पत्र</>
                  ) : (
                    <>TRANSFER CERTIFICATE</>
                  )}
                </h3>
              </div>

              {/* Meta Top 4 Fields: Year, Student ID, TC No, Admission No */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-b border-slate-400 font-medium">
                <div>
                  <span>Year / सत्र: </span>
                  <strong className="font-bold">2026-2027</strong>
                </div>
                <div>
                  <span>Student ID: </span>
                  <strong className="font-bold">{selectedTc.studentId || selectedTc.studentRegNo || selectedTc.srNo || '—'}</strong>
                </div>
                <div>
                  <span>TC No / क्र.: </span>
                  <strong className="font-bold">{selectedTc.tcNo || '—'}</strong>
                </div>
                <div>
                  <span>Adm No / प्रवेश क्र: </span>
                  <strong className="font-bold">{selectedTc.admNo}</strong>
                </div>
              </div>

              {/* =============================================================== */}
              {/* THE OFFICIAL 24 CBSE TRANSFER CERTIFICATE POINTS                */}
              {/* =============================================================== */}
              <div className="text-[11.5px] sm:text-xs text-slate-900 space-y-1.5 py-3 leading-relaxed">
                {/* 1. Name of Pupil */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">1.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Name of Pupil / विद्यार्थी का नाम' : 'Name of Pupil'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold tracking-wide">{selectedTc.name}</strong>
                </div>

                {/* 2. Mother's Name */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">2.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? "Mother's Name / माता का नाम" : "Mother's Name"}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.motherName || '—'}</strong>
                </div>

                {/* 3. Father's / Guardian's Name */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">3.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? "Father's / Guardian's Name / पिता / अभिभावक का नाम" : "Father's / Guardian's Name"}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.fatherName || '—'}</strong>
                </div>

                {/* 4. Date of Birth according to Register */}
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">4.</span>
                    <span className="w-80 shrink-0">
                      {selectedTc.printType === 'हिंदी / English'
                        ? 'Date of birth according to Admission Register / जन्म तिथि'
                        : 'Date of birth according to Register (in figures)'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{formatDateDMY(selectedTc.dob)}</strong>
                  </div>
                  <div className="flex pl-6 text-[11px]">
                    <span className="w-80 shrink-0 pl-1">
                      {selectedTc.printType === 'हिंदी / English'
                        ? '(in words / शब्दों में)'
                        : '(in words)'}
                    </span>
                    <span className="mr-2">:</span>
                    <span className="italic font-semibold">{selectedTc.dobWords || '—'}</span>
                  </div>
                </div>

                {/* 5 & 6. Nationality & Place of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">5.</span>
                    <span className="w-48 shrink-0">
                      {selectedTc.printType === 'हिंदी / English' ? 'Nationality / राष्ट्रीयता' : 'Nationality'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{selectedTc.nationality || 'Indian'}</strong>
                  </div>
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">6.</span>
                    <span className="w-48 shrink-0">
                      {selectedTc.printType === 'हिंदी / English' ? 'Place of Birth / जन्म स्थान' : 'Place of Birth'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong>{selectedTc.placeOfBirth || 'Jaipur'}</strong>
                  </div>
                </div>

                {/* 7. Category */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">7.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Whether candidate belongs to SC/ST/OBC / वर्ग (अ.जा./अ.ज.जा./अ.पि.व./सामान्य)'
                      : 'Whether the candidate belongs to SC / ST / OBC'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.category || 'General'}</strong>
                </div>

                {/* 8. Date of first admission with class */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">8.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Date of first admission with class / प्रथम प्रवेश तिथि एवं कक्षा'
                      : 'Date of first admission in the School with class'}
                  </span>
                  <span className="mr-2">:</span>
                  <span>
                    <strong>{formatDateDMY(selectedTc.admissionDate)}</strong> in Class{' '}
                    <strong>{selectedTc.admissionClass || selectedTc.className}</strong>
                  </span>
                </div>

                {/* 9. Class last studied */}
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">9.</span>
                    <span className="w-80 shrink-0">
                      {selectedTc.printType === 'हिंदी / English'
                        ? 'Class in which pupil last studied / अंतिम कक्षा (अंकों में)'
                        : 'Class in which the pupil last studied (in figures)'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{selectedTc.className}</strong>
                  </div>
                  <div className="flex pl-6 text-[11px]">
                    <span className="w-80 shrink-0 pl-1">
                      {selectedTc.printType === 'हिंदी / English'
                        ? '(in words / शब्दों में)'
                        : '(in words)'}
                    </span>
                    <span className="mr-2">:</span>
                    <span className="font-semibold">{selectedTc.lastClass || selectedTc.className}</span>
                  </div>
                </div>

                {/* 10. School / Board Annual examination */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">10.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'School / Board Annual Exam Result / विद्यालय/बोर्ड परीक्षा परिणाम'
                      : 'School / Board Annual Examination last taken with result'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.examResult || 'Passed'}</strong>
                </div>

                {/* 11. Whether failed */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">11.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Whether failed in same class / क्या उसी कक्षा में अनुत्तीर्ण हुए'
                      : 'Whether failed, if so once/twice in the same class'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.isFailed || 'No'}</strong>
                </div>

                {/* 12. Subjects Studied */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">12.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Subjects Studied / अध्ययन किए गए विषय' : 'Subjects Studied'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="font-semibold">{selectedTc.subjects}</strong>
                </div>

                {/* 13. Qualified for promotion */}
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">13.</span>
                    <span className="w-80 shrink-0">
                      {selectedTc.printType === 'हिंदी / English'
                        ? 'Whether qualified for promotion / क्या अगली कक्षा हेतु पदोन्नत हुए'
                        : 'Whether qualified for promotion to higher class'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{selectedTc.isPromoted || 'Yes'}</strong>
                  </div>
                  <div className="flex pl-6 text-[11px]">
                    <span className="w-80 shrink-0 pl-1">
                      {selectedTc.printType === 'हिंदी / English'
                        ? 'If so, to which class / यदि हाँ, तो किस कक्षा में'
                        : 'If so, to which class (in figures & words)'}
                    </span>
                    <span className="mr-2">:</span>
                    <span>
                      Class <strong>{selectedTc.promotedClassFigures || '—'}</strong> ({selectedTc.promotedClassWords || '—'})
                    </span>
                  </div>
                </div>

                {/* 14. Month up to which dues paid */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">14.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Month up to which school dues paid / किस माह तक शुल्क का भुगतान किया'
                      : 'Month up to which the pupil has paid school dues'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.schoolDues || 'Up to March (2027)'}</strong>
                </div>

                {/* 15. Fee concession */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">15.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Any fee concession availed / क्या कोई शुल्क छूट का लाभ उठाया गया'
                      : 'Any fee concession availed of'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.concession || 'No'}</strong>
                </div>

                {/* 16 & 17. Working Days & Days Present */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">16.</span>
                    <span className="w-56 shrink-0">
                      {selectedTc.printType === 'हिंदी / English' ? 'Total working days / कुल कार्य दिवस' : 'Total No. of working days in session'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong>{selectedTc.totalWorkingDays || 210}</strong>
                  </div>
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">17.</span>
                    <span className="w-56 shrink-0">
                      {selectedTc.printType === 'हिंदी / English' ? 'Total days present / उपस्थित दिन' : 'Total working days pupil present'}
                    </span>
                    <span className="mr-2">:</span>
                    <strong>{selectedTc.daysPresent || 198}</strong>
                  </div>
                </div>

                {/* 18. NCC / Scout */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">18.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Whether NCC Cadet / Scout / Guide / क्या एनसीसी/स्काउट/गाइड है'
                      : 'Whether NCC Cadet / Boy Scout / Girl Guide'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.nccCadet || 'No'}</strong>
                </div>

                {/* 19. Extra Curricular */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">19.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Games / Extra-curricular activities / पाठ्येतर गतिविधियां'
                      : 'Games played or extra curricular activities'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.extraCurricular || 'Active in School Activities'}</strong>
                </div>

                {/* 20. General Conduct */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">20.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'General conduct / सामान्य आचरण' : 'General conduct'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.generalConduct || 'Good'}</strong>
                </div>

                {/* 21. Date of application */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">21.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Date of application for certificate / आवेदन की तिथि'
                      : 'Date of application for certificate'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{formatDateDMY(selectedTc.applicationDate)}</strong>
                </div>

                {/* 22. Date of issue */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">22.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Date of issue of certificate / प्रमाण पत्र जारी करने की तिथि'
                      : 'Date of issue of certificate'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">
                    {selectedTc.issueDate ? formatDateDMY(selectedTc.issueDate) : 'Pending Approval'}
                  </strong>
                </div>

                {/* 23. Reasons for leaving */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">23.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Reasons for leaving the school / विद्यालय छोड़ने का कारण'
                      : 'Reasons for leaving the school'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.reasonLeaving || 'Parent Request'}</strong>
                </div>

                {/* 24. Any other remarks */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">24.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Any other remarks / अन्य टिप्पणी' : 'Any other remarks'}
                  </span>
                  <span className="mr-2">:</span>
                  <span>{selectedTc.remarks || 'Satisfactory conduct and regular attendance'}</span>
                </div>
              </div>

              {/* Compliance Verification Note */}
              <div className="mt-2 pt-2 border-t border-slate-300 text-center text-[10.5px] italic text-slate-700">
                {selectedTc.printType === 'हिंदी / English' ? (
                  <>प्रमाणित किया जाता है कि उपरोक्त जानकारी विद्यालय प्रवेश एवं निकासी पंजिका के अनुसार पूर्णतः सत्य है। / Certified that the above information is in accordance with the School Register.</>
                ) : (
                  <>Certified that the above information is in accordance with the School Admission and Withdrawal Register.</>
                )}
              </div>

              {/* =============================================================== */}
              {/* AUTHENTIC 3-SIGNATORY FOOTER WITH SCHOOL SEAL & PRINCIPAL SIG    */}
              {/* =============================================================== */}
              <div className="pt-8 sm:pt-10 flex justify-between items-end text-xs text-slate-900 font-bold">
                {/* 1. Prepared by */}
                <div className="text-center w-32">
                  <div className="h-10"></div>
                  <div className="border-t-2 border-slate-900 pt-1">
                    {selectedTc.printType === 'हिंदी / English' ? 'Prepared by / तैयारकर्ता' : 'Prepared by'}
                  </div>
                </div>

                {/* 2. Checked by */}
                <div className="text-center w-32">
                  <div className="h-10"></div>
                  <div className="border-t-2 border-slate-900 pt-1">
                    {selectedTc.printType === 'हिंदी / English' ? 'Checked by / जांचकर्ता' : 'Checked by'}
                  </div>
                </div>

                {/* 3. School Stamp */}
                <div className="text-center">
                  <img
                    src={schoolStamp}
                    alt="School Official Stamp"
                    className="w-18 h-18 sm:w-20 sm:h-20 object-contain mx-auto opacity-85"
                  />
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    {selectedTc.printType === 'हिंदी / English' ? 'विद्यालय मुहर / Official Seal' : 'School Official Seal'}
                  </div>
                </div>

                {/* 4. Principal Signature */}
                <div className="text-center w-40">
                  <img
                    src={principalSig}
                    alt="Principal Signature"
                    className="h-10 sm:h-11 mx-auto object-contain mb-0.5"
                  />
                  <div className="border-t-2 border-slate-900 pt-1">
                    {selectedTc.printType === 'हिंदी / English'
                      ? 'Principal / प्राचार्य (Seal)'
                      : 'Principal (With Seal)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-4 flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official TC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
