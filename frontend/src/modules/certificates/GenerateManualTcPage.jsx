import React, { useState, useEffect, useRef } from 'react';
import { Home, Plus, Search, Printer, Trash2, X, FileText, CheckCircle, Eye, Check, ChevronDown, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { tenantStore } from '../../services/tenantStore';

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

export function GenerateManualTcPage({ onNavigate }) {
  const INITIAL_TC_LIST = [
    {
      id: 1,
      sNo: 1,
      srNo: '1120',
      admNo: 'JD-2021-120',
      enrollNo: 'ENR-2021-120',
      penNo: 'PEN-994422',
      studentRegNo: 'REG-2021-120',
      name: 'HARSH VARDHAN',
      className: 'VIII',
      fatherName: 'SURENDRA KUMAR',
      motherName: 'ANITA DEVI',
      nationality: 'Indian',
      category: 'OBC',
      dob: '2012-07-22',
      dobWords: 'Twenty Second July Two Thousand Twelve',
      admDate: '2021-04-05',
      failed: 'No',
      gotLastExamResult: 'Promoted to VIII',
      promotion: 'Yes',
      promotedClassFigures: 'IX',
      promotedClassWords: 'Nine',
      feesPaid: 'Yes',
      schoolDues: 'Up to March (2027)',
      feesConcession: 'No',
      nccScout: 'Scout Member',
      attendance: '198',
      schoolOpenDays: '210',
      generalConduct: 'Good',
      tcNo: 'TC-2026/041',
      issueDate: '2026-09-15',
      dateOfLeaving: '2026-09-10',
      reasonOfLeaving: 'Parent job transfer to Jaipur',
      subjects: 'English, Hindi, Mathematics, Science, Social Science',
      remark: 'Conduct was good',
      printType: 'हिंदी / English'
    }
  ];

  const [tcList, setTcList] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_manual_tc_records');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TC_LIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('erp_manual_tc_records', JSON.stringify(tcList));
    } catch (e) {}
  }, [tcList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTc, setSelectedTc] = useState(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Form State with Hindi / English as Default Language
  const initialFormState = {
    admNo: '',
    enrollNo: '',
    studentRegNo: '',
    penNo: '',
    name: '',
    className: 'X',
    motherName: '',
    fatherName: '',
    nationality: 'Indian',
    category: 'GEN',
    dob: '',
    dobWords: '',
    admDate: '',
    failed: 'No',
    gotLastExamResult: 'Passed',
    promotion: 'Yes',
    promotedClassFigures: 'XI',
    promotedClassWords: 'Eleven',
    feesPaid: 'Yes',
    lastFeePaidDate: 'Up to March (2027)',
    feesConcession: 'No',
    nccScout: 'No',
    attendance: '205',
    schoolOpenDays: '220',
    generalConduct: 'Good',
    issueDate: new Date().toISOString().split('T')[0],
    dateOfLeaving: new Date().toISOString().split('T')[0],
    reasonOfLeaving: 'Parent Wish',
    subjects: 'English, Hindi, Mathematics, Science, Social Science',
    remark: 'Good character and conduct',
    printType: 'हिंदी / English'
  };

  const [formData, setFormData] = useState(initialFormState);

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
          setSchoolProfile(prev => ({ ...prev, ...d.data }));
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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = tcList.filter(tc =>
    !searchQuery ||
    tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tc.tcNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tc.admNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.admNo.trim()) {
      toast.error('Please fill at least Student Name and Admission No');
      return;
    }

    const newId = tcList.length + 1;
    const newEntry = {
      ...formData,
      id: Date.now(),
      sNo: newId,
      srNo: formData.admNo,
      name: formData.name.toUpperCase().trim(),
      fatherName: formData.fatherName ? formData.fatherName.toUpperCase().trim() : '',
      motherName: formData.motherName ? formData.motherName.toUpperCase().trim() : '',
      tcNo: `TC-2026/${String(tcList.length + 42).padStart(3, '0')}`
    };

    setTcList(prev => [newEntry, ...prev]);
    toast.success(`Manual TC created for ${newEntry.name} with ${newEntry.printType} format!`);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this manual TC record?')) {
      setTcList(prev => prev.filter(tc => tc.id !== id));
      toast.success('Record deleted');
    }
  };

  const handlePrint = (tc) => {
    setSelectedTc(tc);
    setShowPrintModal(true);
  };

  const schoolName = schoolProfile?.schoolName || 'J D INTERNATIONAL SCHOOL';
  const societyName = schoolProfile?.societyName || 'Blue Moon Educational & Welfare Society';
  const udiseNo = schoolProfile?.udiseNo || '08121204312';
  const affiliationNo = schoolProfile?.affiliationNo || '1730619';
  const schoolAddress = schoolProfile?.address || 'Mahapura, Ajmer Road, Jaipur';
  const contactNo = schoolProfile?.phone1 || '8947919195';
  const schoolEmail = schoolProfile?.email || '10964@cbseshiksha.in';
  const schoolWebsite = schoolProfile?.website || 'www.jdschooljaipur.com';
  const schoolLogo = schoolProfile?.brandingImages?.school_logo || schoolProfile?.logoUrl || null;

  const schoolStamp =
    schoolProfile?.brandingImages?.school_stamp ||
    DEFAULT_SCHOOL_STAMP;

  const principalSig =
    schoolProfile?.brandingImages?.principal_sig ||
    DEFAULT_PRINCIPAL_SIG;

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Generate TC Manual
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 cursor-pointer">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Certificates</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Generate TC Manual</span>
          </div>
        </div>

        {/* Purple Mini FAB */}
        <button
          onClick={() => {
            setFormData(initialFormState);
            setShowAddModal(true);
          }}
          className="w-9 h-9 rounded-full bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
          title="Add Manual TC"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total Generated TCs: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">MOTHER'S NAME</th>
                  <th className="py-3 px-4">TC NO.</th>
                  <th className="py-3 px-4">LANGUAGE</th>
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((tc, i) => (
                  <tr key={tc.id || tc.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{tc.srNo || tc.admNo}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{tc.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {tc.className}
                      </span>
                    </td>
                    <td className="py-3 px-4">{tc.fatherName}</td>
                    <td className="py-3 px-4">{tc.motherName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">{tc.tcNo}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                        {tc.printType || 'हिंदी / English'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{tc.issueDate}</td>
                    <td className="py-3 px-4 text-center space-x-1.5 whitespace-nowrap">
                      {/* VIEW BUTTON */}
                      <button
                        onClick={() => handlePrint(tc)}
                        className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                        title="View TC"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handlePrint(tc)}
                        className="p-1 rounded text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                        title="Print Certificate"
                      >
                        <Printer className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(tc.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GENERATE MANUAL TC MODAL (With Language Selector matching Image 3) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">
                GENERATE MANUAL TC
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Adm.No.*</label>
                  <input
                    type="text"
                    name="admNo"
                    value={formData.admNo}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Enroll.No.</label>
                  <input
                    type="text"
                    name="enrollNo"
                    value={formData.enrollNo}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Student Registration No</label>
                  <input
                    type="text"
                    name="studentRegNo"
                    value={formData.studentRegNo}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">PEN No</label>
                  <input
                    type="text"
                    name="penNo"
                    value={formData.penNo}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Student Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class Name</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="GEN">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Admission Date</label>
                  <input
                    type="date"
                    name="admDate"
                    value={formData.admDate}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Failed</label>
                  <select
                    name="failed"
                    value={formData.failed}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Last Exam Result</label>
                  <input
                    type="text"
                    name="gotLastExamResult"
                    value={formData.gotLastExamResult}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Promotion</label>
                  <select
                    name="promotion"
                    value={formData.promotion}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fees Paid</label>
                  <select
                    name="feesPaid"
                    value={formData.feesPaid}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Last Fee Paid date</label>
                  <input
                    type="text"
                    name="lastFeePaidDate"
                    placeholder="Up to March (2027)"
                    value={formData.lastFeePaidDate}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fees Concession</label>
                  <select
                    name="feesConcession"
                    value={formData.feesConcession}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NCC/Scout</label>
                  <input
                    type="text"
                    name="nccScout"
                    value={formData.nccScout}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Attendance</label>
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">School Open days</label>
                  <input
                    type="number"
                    name="schoolOpenDays"
                    value={formData.schoolOpenDays}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">General Conduct</label>
                  <select
                    name="generalConduct"
                    value={formData.generalConduct}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Good">Good</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Exemplary">Exemplary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date of Leaving</label>
                  <input
                    type="date"
                    name="dateOfLeaving"
                    value={formData.dateOfLeaving}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subjects</label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Reason of Leaving</label>
                  <input
                    type="text"
                    name="reasonOfLeaving"
                    value={formData.reasonOfLeaving}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Remark</label>
                <input
                  type="text"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Bottom Action Bar with Language Dropdown (Matching Image 3) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="relative" ref={langDropdownRef}>
                  <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-indigo-600 font-semibold z-10">
                    Print Type*
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="px-4 py-2 border-2 border-indigo-500/80 rounded-lg text-xs font-medium text-slate-800 bg-white flex items-center justify-between gap-4 min-w-[160px] shadow-2xs hover:border-indigo-600 transition-colors cursor-pointer"
                  >
                    <span>{formData.printType}</span>
                    <ChevronDown className="w-4 h-4 text-indigo-600 shrink-0" />
                  </button>

                  {/* Dropdown Popup */}
                  {isLangDropdownOpen && (
                    <div className="absolute bottom-full mb-1 left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                      {['None', 'हिंदी / English', 'English'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, printType: option }));
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            formData.printType === option
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{option}</span>
                          {formData.printType === option && (
                            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable CBSE Transfer Certificate Modal */}
      {showPrintModal && selectedTc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Transfer Certificate Preview
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {selectedTc.tcNo}
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Language: {selectedTc.printType || 'हिंदी / English'}
                </span>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official 24-Point CBSE TC Document */}
            <div
              className="border-2 border-slate-900 p-6 sm:p-8 bg-white text-slate-900 relative shadow-sm"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              <div className="text-center space-y-1 pb-3">
                {schoolLogo && (
                  <div className="flex justify-center mb-1">
                    <img src={schoolLogo} alt={schoolName} className="w-14 h-14 object-contain" />
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-wider uppercase">
                  {schoolName}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-700 font-medium">
                  (Run By:- {societyName}) &nbsp;•&nbsp; Udise No. {udiseNo} &nbsp;•&nbsp; Affiliation No. {affiliationNo}
                </p>
                <p className="text-[10.5px] sm:text-[11px] text-slate-600">
                  {schoolAddress}. Contact: {contactNo}
                </p>
                <p className="text-[10px] sm:text-[10.5px] text-slate-500">
                  Email – {schoolEmail} &nbsp; {schoolWebsite}
                </p>
              </div>

              <div className="border-t border-slate-400 pt-2 pb-1 text-center">
                <h3 className="text-sm sm:text-base font-black tracking-widest uppercase underline decoration-2 underline-offset-4">
                  {selectedTc.printType === 'हिंदी / English' ? (
                    <>TRANSFER CERTIFICATE / स्थानांतरण प्रमाण पत्र</>
                  ) : (
                    <>TRANSFER CERTIFICATE</>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-b border-slate-400 font-medium">
                <div>Year / सत्र: <strong className="font-bold">2026-2027</strong></div>
                <div>Student ID: <strong className="font-bold">{selectedTc.penNo || selectedTc.studentRegNo || selectedTc.srNo}</strong></div>
                <div>TC No / क्र.: <strong className="font-bold">{selectedTc.tcNo}</strong></div>
                <div>Adm No: <strong className="font-bold">{selectedTc.admNo}</strong></div>
              </div>

              {/* 24 Points */}
              <div className="text-[11.5px] sm:text-xs text-slate-900 space-y-1.5 py-3 leading-relaxed">
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">1.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Name of Pupil / विद्यार्थी का नाम' : 'Name of Pupil'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold tracking-wide">{selectedTc.name}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">2.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? "Mother's Name / माता का नाम" : "Mother's Name"}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.motherName || '—'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">3.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? "Father's / Guardian's Name / पिता / अभिभावक का नाम" : "Father's / Guardian's Name"}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.fatherName || '—'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">4.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Date of birth / जन्म तिथि' : 'Date of Birth'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{formatDateDMY(selectedTc.dob)}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">5.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Nationality / राष्ट्रीयता' : 'Nationality'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.nationality || 'Indian'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">6.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Category / वर्ग (SC/ST/OBC/Gen)' : 'Category'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.category || 'General'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">7.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Class last studied / अंतिम कक्षा' : 'Class last studied'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.className}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">8.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Annual Exam Result / परीक्षा परिणाम' : 'Exam Result'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.gotLastExamResult || 'Passed'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">9.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Whether qualified for promotion / पदोन्नति' : 'Qualified for Promotion'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.promotion || 'Yes'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">10.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'School dues paid / शुल्क भुगतान' : 'School Dues Paid'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.schoolDues || selectedTc.lastFeePaidDate || 'Up to March (2027)'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">11.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Subjects Studied / विषय' : 'Subjects'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.subjects}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">12.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'General Conduct / आचरण' : 'General Conduct'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.generalConduct || 'Good'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">13.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Date of Issue / जारी तिथि' : 'Date of Issue'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{formatDateDMY(selectedTc.issueDate)}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">14.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Reason for leaving / छोड़ने का कारण' : 'Reason for Leaving'}
                  </span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.reasonOfLeaving || 'Parent Request'}</strong>
                </div>

                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">15.</span>
                  <span className="w-80 shrink-0">
                    {selectedTc.printType === 'हिंदी / English' ? 'Remarks / टिप्पणी' : 'Remarks'}
                  </span>
                  <span className="mr-2">:</span>
                  <span>{selectedTc.remark || 'Satisfactory conduct'}</span>
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="pt-8 sm:pt-10 flex justify-between items-end text-xs text-slate-900 font-bold">
                <div className="text-center w-32">
                  <div className="h-10"></div>
                  <div className="border-t-2 border-slate-900 pt-1">
                    {selectedTc.printType === 'हिंदी / English' ? 'Prepared by / तैयारकर्ता' : 'Prepared by'}
                  </div>
                </div>

                <div className="text-center w-32">
                  <div className="h-10"></div>
                  <div className="border-t-2 border-slate-900 pt-1">
                    {selectedTc.printType === 'हिंदी / English' ? 'Checked by / जांचकर्ता' : 'Checked by'}
                  </div>
                </div>

                <div className="text-center">
                  <img
                    src={schoolStamp}
                    alt="Official Stamp"
                    className="w-18 h-18 object-contain mx-auto opacity-85"
                  />
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    {selectedTc.printType === 'हिंदी / English' ? 'विद्यालय मुहर' : 'School Seal'}
                  </div>
                </div>

                <div className="text-center w-40">
                  <img
                    src={principalSig}
                    alt="Principal Sig"
                    className="h-10 mx-auto object-contain mb-0.5"
                  />
                  <div className="border-t-2 border-slate-900 pt-1">
                    {selectedTc.printType === 'हिंदी / English' ? 'Principal / प्राचार्य' : 'Principal'}
                  </div>
                </div>
              </div>
            </div>

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
