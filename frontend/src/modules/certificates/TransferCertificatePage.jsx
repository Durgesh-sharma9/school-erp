import React, { useState, useEffect } from 'react';
import { Home, Search, Printer, CheckCircle, X, AlertCircle, Award, FileText } from 'lucide-react';
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
  const [tcList, setTcList] = useState([
    {
      sNo: 1,
      admNo: '1144',
      srNo: '1144',
      studentId: 'PEN-889911',
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
      concession: 'Nil',
      totalWorkingDays: 216,
      daysPresent: 204,
      nccCadet: 'No',
      extraCurricular: 'School Cricket Team, Inter-School Science Quiz Participant',
      generalConduct: 'Good',
      applicationDate: '2026-10-01',
      issueDate: '', // Empty until approved
      reasonLeaving: 'Parent job transfer to Kota',
      remarks: 'Good character and moral conduct',
      tcNo: '', // Empty until approved
      fbno: '—',
      status: 'Pending'
    },
    {
      sNo: 2,
      admNo: '1448',
      srNo: '1448',
      studentId: 'PEN-773322',
      name: 'RIDHIMA SINHA',
      className: 'II-A',
      fatherName: 'RAUNAK KUMAR SINHA',
      motherName: 'PRIYA SINHA',
      dob: '2018-08-25',
      dobWords: 'Twenty Fifth August Two Thousand Eighteen',
      nationality: 'Indian',
      placeOfBirth: 'Jaipur',
      category: 'General',
      admissionDate: '2022-04-10',
      admissionClass: 'Nursery',
      lastClass: 'II (Two)',
      examResult: 'Passed and Promoted',
      isFailed: 'No',
      subjects: 'English, Hindi, Mathematics, EVS, Art & Craft',
      isPromoted: 'Yes',
      promotedClassFigures: 'III',
      promotedClassWords: 'Three',
      schoolDues: 'Paid in Full (Nil)',
      concession: 'Nil',
      totalWorkingDays: 210,
      daysPresent: 198,
      nccCadet: 'No',
      extraCurricular: 'Active in Annual Day Dance and Storytelling',
      generalConduct: 'Very Good',
      applicationDate: '2026-10-02',
      issueDate: '', // Empty until approved
      reasonLeaving: 'Parent Request (Relocation)',
      remarks: 'Disciplined and obedient child',
      tcNo: '', // Empty until approved
      fbno: '—',
      status: 'Pending'
    },
    {
      sNo: 3,
      admNo: 'JD-2021-120',
      srNo: '1120',
      studentId: 'PEN-994422',
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
      schoolDues: 'All school dues cleared as on date',
      concession: 'Nil',
      totalWorkingDays: 210,
      daysPresent: 198,
      nccCadet: 'Scout Member',
      extraCurricular: 'State Level Football Championship Participant',
      generalConduct: 'Good',
      applicationDate: '2026-09-10',
      issueDate: '2026-09-15',
      reasonLeaving: 'Parent job transfer to Jaipur',
      remarks: 'Exemplary conduct and active student in academic & sports',
      tcNo: 'TC-2026/041',
      fbno: 'FB-1120',
      status: 'Issued'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTc, setSelectedTc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

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
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 flex items-center gap-1">
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
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-700">
              Transfer Certificates: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, adm no..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
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
                    <td className="py-3 px-4 text-center space-x-1.5">
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
                          <Printer className="w-3 h-3" />
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
      {/* 1:1 CBSE OFFICIAL 24-POINT TRANSFER CERTIFICATE MODAL                 */}
      {/* ===================================================================== */}
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

              {/* Title: TRANSFER CERTIFICATE */}
              <div className="border-t border-slate-400 pt-2 pb-1 text-center">
                <h3 className="text-sm sm:text-base font-black tracking-widest uppercase underline decoration-2 underline-offset-4">
                  TRANSFER CERTIFICATE
                </h3>
              </div>

              {/* Meta Top 4 Fields: Year, Student ID, TC No, Admission No */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 border-b border-slate-400 font-medium">
                <div>
                  <span>Year: </span>
                  <strong className="font-bold">2026-2027</strong>
                </div>
                <div>
                  <span>Student ID: </span>
                  <strong className="font-bold">{selectedTc.studentId || selectedTc.srNo || '—'}</strong>
                </div>
                <div>
                  <span>TC No: </span>
                  <strong className="font-bold">{selectedTc.tcNo || '—'}</strong>
                </div>
                <div>
                  <span>Admission No : </span>
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
                  <span className="w-72 shrink-0">Name of Pupil</span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold tracking-wide">{selectedTc.name}</strong>
                </div>

                {/* 2. Mother's Name */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">2.</span>
                  <span className="w-72 shrink-0">Mother's Name</span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.motherName || '—'}</strong>
                </div>

                {/* 3. Father's / Guardian's Name */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">3.</span>
                  <span className="w-72 shrink-0">Father's / Guardian's Name</span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.fatherName || '—'}</strong>
                </div>

                {/* 4. Date of Birth according to Register */}
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">4.</span>
                    <span className="w-72 shrink-0">Date of birth (in Christian Era) according to</span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{formatDateDMY(selectedTc.dob)}</strong>
                  </div>
                  <div className="flex pl-6 text-[11px]">
                    <span className="w-72 shrink-0 pl-1">Admission & Withdrawal Register (in words)</span>
                    <span className="mr-2">:</span>
                    <span className="italic font-semibold">{selectedTc.dobWords || '—'}</span>
                  </div>
                </div>

                {/* 5 & 6. Nationality & Place of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">5.</span>
                    <span className="w-36 shrink-0">Nationality</span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{selectedTc.nationality || 'Indian'}</strong>
                  </div>
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">6.</span>
                    <span className="w-36 shrink-0">Place of Birth</span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{selectedTc.placeOfBirth || 'Jaipur'}</strong>
                  </div>
                </div>

                {/* 7. SC / ST / OBC */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">7.</span>
                  <span className="w-72 shrink-0">Whether the candidate belongs to Scheduled Caste or Scheduled Tribe or OBC</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.category || 'General'}</strong>
                </div>

                {/* 8. First Admission with Class & Class Joined */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">8.</span>
                    <span className="w-60 shrink-0">Date of first admission in the school with class</span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{formatDateDMY(selectedTc.admissionDate)}</strong>
                  </div>
                  <div className="flex">
                    <span className="w-28 shrink-0 font-semibold">Class Joined</span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">Class {selectedTc.admissionClass || 'I'}</strong>
                  </div>
                </div>

                {/* 9. Class last studied */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">9.</span>
                  <span className="w-72 shrink-0">Class in which the pupil last studied (in figures)</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">Class {selectedTc.className} ({selectedTc.lastClass || selectedTc.className})</strong>
                </div>

                {/* 10. Annual exam result */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">10.</span>
                  <span className="w-72 shrink-0">School / Board Annual examination last taken with result</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.examResult || 'Passed'}</strong>
                </div>

                {/* 11. Whether failed */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">11.</span>
                  <span className="w-72 shrink-0">Whether failed, if so once / twice in the same class</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.isFailed || 'No'}</strong>
                </div>

                {/* 12. Subjects studied */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">12.</span>
                  <span className="w-72 shrink-0">Subject studied</span>
                  <span className="mr-2">:</span>
                  <span className="font-medium">{selectedTc.subjects || 'English, Hindi, Mathematics, Science, Social Science'}</span>
                </div>

                {/* 13. Promotion to higher class */}
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">13.</span>
                    <span className="w-72 shrink-0">Whether qualified for promotion to the higher class</span>
                    <span className="mr-2">:</span>
                    <strong className="font-bold">{selectedTc.isPromoted || 'Yes'}</strong>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 text-[11px]">
                    <div>
                      <span className="pl-1">if so to which class (in figure) : </span>
                      <strong className="font-bold">{selectedTc.promotedClassFigures || '—'}</strong>
                    </div>
                    <div>
                      <span>(in words) : </span>
                      <strong className="font-bold italic">{selectedTc.promotedClassWords || '—'}</strong>
                    </div>
                  </div>
                </div>

                {/* 14. School dues */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">14.</span>
                  <span className="w-72 shrink-0">School dues</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.schoolDues || 'Cleared up to date (Nil)'}</strong>
                </div>

                {/* 15. Fee concession */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">15.</span>
                  <span className="w-72 shrink-0">Any fee concession availed of. If so, nature of such concession</span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.concession || 'Nil'}</strong>
                </div>

                {/* 16. Total working days */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">16.</span>
                  <span className="w-72 shrink-0">Total No. of working days in the academic session.</span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.totalWorkingDays || 210} Days</strong>
                </div>

                {/* 17. Present days */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">17.</span>
                  <span className="w-72 shrink-0">Total No. of working days pupil present in the school.</span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.daysPresent || 198} Days</strong>
                </div>

                {/* 18. NCC Cadet */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">18.</span>
                  <span className="w-72 shrink-0">Whether NCC Cadet/ Boy Scout/ Girl Guide (details may be given)</span>
                  <span className="mr-2">:</span>
                  <strong>{selectedTc.nccCadet || 'No'}</strong>
                </div>

                {/* 19. Games / Co-curricular */}
                <div className="flex flex-col">
                  <div className="flex">
                    <span className="w-6 shrink-0 font-bold">19.</span>
                    <span className="w-72 shrink-0">Games played or extra curricular activities in which pupil took part</span>
                    <span className="mr-2">:</span>
                    <span className="font-medium">{selectedTc.extraCurricular || 'Participated in sports and co-curricular events'}</span>
                  </div>
                  <div className="pl-6 text-[10.5px] text-slate-600">
                    <span className="pl-1">(mention achievement level there in) : Commended for active participation</span>
                  </div>
                </div>

                {/* 20. General conduct */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">20.</span>
                  <span className="w-72 shrink-0">General conduct</span>
                  <span className="mr-2">:</span>
                  <strong className="uppercase font-bold">{selectedTc.generalConduct || 'Good'}</strong>
                </div>

                {/* 21. Date of application */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">21.</span>
                  <span className="w-72 shrink-0">Date of application for certificate</span>
                  <span className="mr-2">:</span>
                  <strong>{formatDateDMY(selectedTc.applicationDate || selectedTc.issueDate)}</strong>
                </div>

                {/* 22. Date of issue */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">22.</span>
                  <span className="w-72 shrink-0">Date of issue of certificate</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{formatDateDMY(selectedTc.issueDate)}</strong>
                </div>

                {/* 23. Reasons for leaving */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">23.</span>
                  <span className="w-72 shrink-0">Reasons for leaving the school</span>
                  <span className="mr-2">:</span>
                  <strong className="font-bold">{selectedTc.reasonLeaving || 'Parent Request / Relocation'}</strong>
                </div>

                {/* 24. Any other remarks */}
                <div className="flex">
                  <span className="w-6 shrink-0 font-bold">24.</span>
                  <span className="w-72 shrink-0">Any other remarks</span>
                  <span className="mr-2">:</span>
                  <span className="italic">{selectedTc.remarks || 'Character and conduct have been satisfactory.'}</span>
                </div>
              </div>

              {/* NOTE */}
              <p className="text-[10.5px] sm:text-xs font-bold text-center border-t border-b border-slate-300 py-1 my-3">
                NOTE : Certified that the above information is in accordance with the School Register .
              </p>

              {/* Signatures & Seal Footer */}
              <div className="pt-6 flex justify-between items-end text-xs">
                {/* Left: Date */}
                <div className="text-left space-y-1">
                  <p>Date : <strong className="font-bold">{formatDateDMY(selectedTc.issueDate)}</strong></p>
                  <p className="text-[10px] text-slate-500">Place: {schoolProfile?.place || 'Jaipur'}</p>
                </div>

                {/* Center: Clerk & Official Seal */}
                <div className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mb-1">
                    <img src={schoolStamp} alt="Official School Seal" className="w-full h-full object-contain" crossOrigin="anonymous" />
                  </div>
                  <div className="w-32 border-t border-slate-900 pt-1 font-bold">
                    Clerk
                  </div>
                </div>

                {/* Right: Signature of Principal */}
                <div className="text-center flex flex-col items-center">
                  <div className="h-10 flex items-center justify-center mb-1">
                    <img src={principalSig} alt="Principal Signature" className="h-9 max-w-[130px] object-contain" crossOrigin="anonymous" />
                  </div>
                  <div className="w-40 border-t border-slate-900 pt-1 font-bold">
                    Signature of Principal
                  </div>
                  <span className="text-[10px] text-slate-500 font-sans">(With Official Seal)</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions with Close & Print */}
            <div className="mt-4 flex items-center justify-end space-x-2.5 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#5c67f6] hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print TC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
