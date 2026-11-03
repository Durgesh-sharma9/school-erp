import React, { useState, useEffect } from 'react';
import {
  Cake,
  Search,
  Home,
  Printer,
  FileSpreadsheet,
  FileText,
  Calendar,
  Users,
  Check,
  X,
  Sparkles,
  Award,
  ChevronRight,
  Share2,
  Download
} from 'lucide-react';
import { tenantStore } from '../../../services/tenantStore';

const MONTHS = [
  'All',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }
  return dateStr;
}

export function BirthdayReportPage({ onNavigate }) {
  const [records, setRecords] = useState([]);
  const [selectedType, setSelectedType] = useState('Student');
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [greetingType, setGreetingType] = useState('All');
  const [format, setFormat] = useState('Format 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardTheme, setCardTheme] = useState('festive-gold'); // 'festive-gold', 'balloon-party', 'cbse-classic'

  // Fetch school info live from tenantStore and /api/schools/profile (/school-info)
  const [schoolProfile, setSchoolProfile] = useState(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      return tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl') || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const active = tenantStore?.getActiveSchool ? tenantStore.getActiveSchool() : null;
      const localProf = tenantStore.getSchoolProfile(active?.id || 'sch_jd_intl');
      if (localProf) setSchoolProfile(localProf);
    } catch {}

    fetch('/api/schools/profile')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) {
          const item = d.data;
          setSchoolProfile(prev => ({
            ...prev,
            ...item,
            schoolName: item.schoolName || prev.schoolName || 'J D International School',
            affiliationNo: item.affiliationNo || prev.affiliationNo || '1730619',
            place: item.place || prev.place || 'Jaipur',
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

  const fetchReport = () => {
    setLoading(true);
    const params = new URLSearchParams({
      type: selectedType,
      month: selectedMonth
    });
    fetch(`/api/sms/reports/birthdays?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          const list = d.data || [];
          setRecords(list);
          // By default, select all records
          setSelectedIds(list.map(r => r.id));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, [selectedType, selectedMonth]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (r.name || '').toLowerCase().includes(q) ||
      (r.admNo || '').toLowerCase().includes(q) ||
      (r.contactNo || '').includes(q) ||
      (r.className || '').toLowerCase().includes(q)
    );
  });

  // Group filtered records by Date for Format 1 / Table view (matching UAB layout)
  const groupedRecords = [];
  let currentDate = null;
  let currentGroup = [];

  filteredRecords.forEach(r => {
    const d = formatDisplayDate(r.dob);
    if (d === currentDate) {
      currentGroup.push(r);
    } else {
      if (currentGroup.length > 0) {
        groupedRecords.push({ date: currentDate, items: currentGroup });
      }
      currentDate = d;
      currentGroup = [r];
    }
  });
  if (currentGroup.length > 0) {
    groupedRecords.push({ date: currentDate, items: currentGroup });
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredRecords.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const exportCSV = () => {
    const headers = ['SR.NO.', 'ADM.NO.', 'NAME', 'CLASS', 'DATE', 'CONTACT NO.'];
    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      r.admNo || '',
      `"${r.name || ''}"`,
      `"${r.className || ''}"`,
      formatDisplayDate(r.dob),
      r.contactNo || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `birthday_report_${selectedMonth}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Get records for printable card
  const cardRecipients = selectedIds.length > 0
    ? filteredRecords.filter(r => selectedIds.includes(r.id))
    : filteredRecords;

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-card-area, #printable-card-area * {
            visibility: visible;
          }
          #printable-card-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break-card {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-after: always;
            break-after: page;
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* Top Header matching UAB: Title, Breadcrumb, Excel/Print/PDF Icons */}
      <div className="no-print flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Birthday Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> SMS
            </span>
            <span>&bull;</span>
            <span className="text-slate-600 font-medium">Birthday Report</span>
          </div>
        </div>

        {/* Top Right Action Buttons (Green Excel, Blue Print, Red PDF) */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={exportCSV}
            className="w-8 h-8 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
            title="Export Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="w-8 h-8 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="w-8 h-8 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
            title="Export / Print PDF"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Card matching UAB: Type, Month, Greeting Type, Format */}
      <div className="no-print bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700 font-medium"
              >
                <option value="All">All Types</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700 font-medium"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Greeting Type</label>
              <select
                value={greetingType}
                onChange={e => setGreetingType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700 font-medium"
              >
                <option value="All">All</option>
                <option value="Text">SMS (Text)</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Format</label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-700 font-medium"
              >
                <option value="Format 1">Format 1 (Standard)</option>
                <option value="Format 2">Format 2 (Printable Birthday Card)</option>
              </select>
            </div>
          </div>

          {/* Action Row: Blue Search Button + Pink Round Cake Button (Greeting Front Page) */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Search
            </button>

            {/* Circular Pink/Red Button with Birthday Cake Icon (Tooltip: Greeting Front Page) */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setShowCardModal(true)}
                className="w-10 h-10 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 flex items-center justify-center shadow-xs border border-rose-200 transition-all cursor-pointer"
                title="Greeting Front Page"
              >
                <Cake className="w-5 h-5 text-rose-500" />
              </button>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                <div className="bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-lg whitespace-nowrap">
                  Greeting Front Page {selectedIds.length > 0 && `(${selectedIds.length})`}
                </div>
              </div>
            </div>

            {/* Selection Status Badge */}
            <div className="text-xs text-slate-500 ml-auto">
              Total Celebrants: <span className="font-bold text-pink-600">{filteredRecords.length}</span>
              {selectedIds.length > 0 && (
                <span className="ml-2 font-semibold text-indigo-600">
                  ({selectedIds.length} selected for Birthday Card)
                </span>
              )}
            </div>
          </div>
        </form>

        {/* Search by name/adm filter */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name, class, contact no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {format === 'Format 2' && (
            <button
              onClick={() => setShowCardModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Cake className="w-4 h-4" /> Open Full Screen Cards
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORMAT 2 DIRECT EMBED: Printable Birthday Cards View                      */}
      {/* ========================================================================= */}
      {format === 'Format 2' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Cake className="w-5 h-5 text-rose-500" />
                Format 2: Printable Birthday Greeting Cards
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {cardRecipients.length} card(s) ready for color printing on A4 cardstock.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={cardTheme}
                onChange={e => setCardTheme(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 font-semibold"
              >
                <option value="festive-gold">Theme: Festive Royal Gold</option>
                <option value="balloon-party">Theme: Colorful Balloons Party</option>
                <option value="cbse-classic">Theme: CBSE School Classic</option>
              </select>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Birthday Cards
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div id="printable-card-area" className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {cardRecipients.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                No students selected or found for {selectedMonth}.
              </div>
            ) : (
              cardRecipients.map((r, idx) => (
                <div key={r.id || idx} className="page-break-card">
                  <BirthdayCardItem student={r} theme={cardTheme} schoolProfile={schoolProfile} />
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* FORMAT 1: TABLE VIEW: SR.NO. (1..) | [ ] ADM.NO. | NAME | CLASS | DATE | CONTACT */
        /* ========================================================================= */
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-300/80 border-b border-slate-300 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-16 border-r border-slate-300 text-center">SR.NO.</th>
                  <th className="py-3 px-3 w-32 border-r border-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={filteredRecords.length > 0 && selectedIds.length === filteredRecords.length}
                        onChange={handleSelectAll}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <span>ADM.NO.</span>
                    </label>
                  </th>
                  <th className="py-3 px-4 border-r border-slate-300">NAME</th>
                  <th className="py-3 px-4 border-r border-slate-300">CLASS</th>
                  <th className="py-3 px-3 w-28 border-r border-slate-300 text-center">DATE</th>
                  <th className="py-3 px-4">CONTACT NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                      {loading ? 'Loading celebrant records...' : `No birthday records found for ${selectedMonth} (${selectedType})`}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r, idx) => (
                    <tr
                      key={r.id || idx}
                      className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(r.id) ? 'bg-indigo-50/20' : ''}`}
                    >
                      {/* 1. SR.NO. (Starts from 1) */}
                      <td className="py-2.5 px-3 font-mono text-slate-800 font-bold border-r border-slate-200 text-center">
                        {idx + 1}
                      </td>

                      {/* 2. Checkbox + ADM.NO. */}
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(r.id)}
                            onChange={() => toggleSelectOne(r.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                          />
                          <span className="font-mono text-slate-800 font-semibold">{r.admNo || '-'}</span>
                        </label>
                      </td>

                      {/* 3. NAME */}
                      <td className="py-2.5 px-4 font-bold text-slate-800 uppercase tracking-tight border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Cake className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                          <span>{r.name}</span>
                        </div>
                      </td>

                      {/* 4. CLASS */}
                      <td className="py-2.5 px-4 text-slate-600 border-r border-slate-200 font-medium">
                        {r.className || '-'}
                      </td>

                      {/* 5. DATE */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 font-semibold border-r border-slate-200 text-center">
                        {formatDisplayDate(r.dob)}
                      </td>

                      {/* 6. CONTACT NO. */}
                      <td className="py-2.5 px-4 font-mono text-slate-700">
                        {r.contactNo || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE GREETING CARD MODAL (Opened by Pink Cake button or button click)*/}
      {/* ========================================================================= */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl animate-fadeIn flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="no-print p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <Cake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Printable Greeting Front Page ({cardRecipients.length} Student{cardRecipients.length > 1 ? 's' : ''})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Official CBSE School Birthday Cards ready to print on A4 / Cardstock paper
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={cardTheme}
                  onChange={e => setCardTheme(e.target.value)}
                  className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 font-semibold"
                >
                  <option value="festive-gold">Theme: Festive Royal Gold</option>
                  <option value="balloon-party">Theme: Colorful Balloons Party</option>
                  <option value="cbse-classic">Theme: CBSE School Classic</option>
                </select>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print All Cards
                </button>

                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body containing Printable Cards */}
            <div className="p-6 overflow-y-auto bg-slate-100/60 flex-1">
              <div id="printable-card-area" className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                {cardRecipients.map((r, idx) => (
                  <div key={r.id || idx} className="page-break-card">
                    <BirthdayCardItem student={r} theme={cardTheme} schoolProfile={schoolProfile} />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="no-print p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Paper Size: <strong>A4 Portrait (2 Cards per page)</strong> or individual cardstock</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-1.5 border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_SCHOOL_STAMP = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1kYXNoYXJyYXk9IjMsMyIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFlM2E4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWUzYThhIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBpZD0idFRvcCIgZD0iTSAyNCwxMDAgQSA3Niw3NiAwIDEsMSAxNzYsMTAwIiBmaWxsPSJub25lIi8+CiAgPHBhdGggaWQ9InRCb3R0b20iIGQ9Ik0gMTc2LDEwMCBBIDc2LDc2IDAgMCwxIDI0LDEwMCIgZmlsbD0ibm9uZSIvPgogIDx0ZXh0IGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFlM2E4YSIgbGV0dGVyLXNwYWNpbmc9IjEuNSI+CiAgICA8dGV4dFBhdGggaHJlZj0iI3RUb3AiIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKYhSBKIEQgSU5URVJOQVRJT05BTCBTQ0hPT0wg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPHRleHQgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMS41Ij4KICAgIDx0ZXh0UGF0aCBocmVmPSIjdEJvdHRvbSIgc3RhcnRPZmZzZXQ9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4piFIEpBSVBVUiAoUkFKLikg4piFPC90ZXh0UGF0aD4KICA8L3RleHQ+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAwLCAxMDApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDx0ZXh0IHk9Ii0yMiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiPkFGRklMSUFURUQgVE8gQ0JTRTwvdGV4dD4KICAgIDx0ZXh0IHk9Ii00IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiPvCfjpM8L3RleHQ+CiAgICA8dGV4dCB5PSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSIjMWUzYThhIiBsZXR0ZXItc3BhY2luZz0iMSI+T0ZGSUNJQUw8L3RleHQ+CiAgICA8dGV4dCB5PSIyNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjguNSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMxZTNhOGEiIGxldHRlci1zcGFjaW5nPSIxIj5TRUFMPC90ZXh0PgogIDwvZz4KPC9zdmc+';
const DEFAULT_PRINCIPAL_SIG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgNzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iNzAiPgogIDxwYXRoIGQ9Ik0gMjUsNTIgUSA0MCwxNSA1MCwzNSBRIDYwLDU1IDc1LDIyIFEgODUsNDUgMTAwLDI4IFEgMTE1LDEyIDEzNSwzOCBRIDE1MCw1MiAxNjUsMTggUSAxODAsNDUgMjA1LDIyIFEgMjIwLDEyIDIzMCwyOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGYyYjVjIiBzdHJva2Utd2lkdGg9IjIuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CiAgPHBhdGggZD0iTSAyMCw0NiBRIDY1LDM4IDEyNSw0MiBRIDE4NSw0NiAyMjUsNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBmMmI1YyIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IidCcnVzaCBTY3JpcHQgTVQnLCAnU2Vnb2UgU2NyaXB0JywgY3Vyc2l2ZSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwZjJiNWMiIGZvbnQtc3R5bGU9Iml0YWxpYyI+QWJoaWxhc2hhPC90ZXh0Pgo8L3N2Zz4=';

// =============================================================================
// PRINTABLE BIRTHDAY GREETING CARD COMPONENT (1:1 High Quality CBSE School Card)
// =============================================================================
function BirthdayCardItem({ student, theme, schoolProfile }) {
  const isGold = theme === 'festive-gold';
  const isParty = theme === 'balloon-party';

  // 1. Fetch Principal Signature strictly from /school-info brandingImages
  const principalSig =
    schoolProfile?.brandingImages?.principal_sig ||
    schoolProfile?.extraData?.brandingImages?.principal_sig ||
    schoolProfile?.principalSigUrl ||
    schoolProfile?.principal_sig ||
    DEFAULT_PRINCIPAL_SIG;

  // 2. School Stamp / Seal strictly from /school-info
  const schoolStamp =
    schoolProfile?.brandingImages?.school_stamp ||
    schoolProfile?.extraData?.brandingImages?.school_stamp ||
    schoolProfile?.schoolStampUrl ||
    schoolProfile?.school_stamp ||
    DEFAULT_SCHOOL_STAMP;

  // 3. School Logo strictly from /school-info
  const schoolLogo =
    schoolProfile?.brandingImages?.school_logo ||
    schoolProfile?.extraData?.brandingImages?.school_logo ||
    schoolProfile?.logoUrl ||
    '';

  const schoolName = (schoolProfile?.schoolName || 'J D INTERNATIONAL SCHOOL').toUpperCase();
  const schoolAddress = schoolProfile?.address || 'Jaishinghpura, Bhankrota, Jaipur • Affiliated to CBSE';
  const principalName = schoolProfile?.principalName || 'Abhilasha Bhatt';

  return (
    <div
      className={`w-[360px] h-[510px] rounded-2xl p-6 flex flex-col justify-between text-center relative overflow-hidden shadow-xl border-4 ${
        isGold
          ? 'bg-gradient-to-br from-amber-50 via-white to-amber-100/80 border-amber-400 text-slate-800'
          : isParty
          ? 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 border-white text-white'
          : 'bg-white border-indigo-700 text-slate-800'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Decorative Corner Ornaments */}
      <div className="absolute top-2 left-2 text-xs opacity-50 font-serif">✦</div>
      <div className="absolute top-2 right-2 text-xs opacity-50 font-serif">✦</div>
      <div className="absolute bottom-2 left-2 text-xs opacity-50 font-serif">✦</div>
      <div className="absolute bottom-2 right-2 text-xs opacity-50 font-serif">✦</div>

      {/* Outer Golden/Decorative Inset Border */}
      <div
        className={`absolute inset-2.5 rounded-xl border pointer-events-none ${
          isGold
            ? 'border-amber-300'
            : isParty
            ? 'border-white/30'
            : 'border-indigo-200'
        }`}
      />

      {/* Top: School Branding & Crest */}
      <div className="space-y-1 pt-1 z-10">
        <div className="flex items-center justify-center gap-2">
          {schoolLogo ? (
            <img
              src={schoolLogo}
              alt="School Logo"
              className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 shadow-xs border border-slate-200"
              crossOrigin="anonymous"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-xs border ${
                isParty
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-indigo-700 text-white border-indigo-800'
              }`}
            >
              🎓
            </div>
          )}
        </div>
        <h3
          className={`text-xs font-black tracking-widest uppercase mt-1 ${
            isParty ? 'text-white' : 'text-indigo-900'
          }`}
        >
          {schoolName}
        </h3>
        <p
          className={`text-[9.5px] font-semibold tracking-wider ${
            isParty ? 'text-pink-200' : 'text-slate-500'
          }`}
        >
          {schoolAddress}
        </p>
      </div>

      {/* Center: Celebrant Graphic & Name */}
      <div className="space-y-2 z-10 my-auto py-2">
        {/* Festive Cake / Balloon Icon */}
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl shadow-md border-2 ${
            isGold
              ? 'bg-amber-100 border-amber-300 text-amber-600'
              : isParty
              ? 'bg-white/25 backdrop-blur-xs border-white/60 text-white'
              : 'bg-rose-50 border-rose-200 text-rose-500'
          }`}
        >
          🎂
        </div>

        {/* Happy Birthday Banner */}
        <div>
          <span
            className={`text-[11px] font-black tracking-widest uppercase px-3 py-0.5 rounded-full inline-block ${
              isGold
                ? 'bg-amber-200/70 text-amber-900 border border-amber-300'
                : isParty
                ? 'bg-white/20 text-amber-200 border border-white/30'
                : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            ✦ Happy Birthday ✦
          </span>

          <h2
            className={`text-xl font-black uppercase tracking-tight mt-2 leading-tight ${
              isParty ? 'text-white' : 'text-slate-900'
            }`}
          >
            {student.name}
          </h2>

          <div
            className={`text-xs font-bold mt-1 ${
              isParty ? 'text-pink-100' : 'text-indigo-700'
            }`}
          >
            Class: {student.className || '-'}
          </div>

          <div
            className={`text-[10px] font-mono mt-0.5 ${
              isParty ? 'text-white/80' : 'text-slate-500'
            }`}
          >
            Adm. No: <span className="font-bold">{student.admNo || '-'}</span> | Sr. No: <span className="font-bold">{student.srNo || '-'}</span>
          </div>

          <div
            className={`text-[10px] font-bold mt-1 inline-block px-2.5 py-0.5 rounded ${
              isGold
                ? 'bg-amber-100 text-amber-800'
                : isParty
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Date of Birth: {formatDisplayDate(student.dob)}
          </div>
        </div>

        {/* Warm Blessing Message */}
        <p
          className={`text-[10.5px] leading-relaxed italic max-w-[280px] mx-auto px-2 ${
            isParty ? 'text-white/90' : 'text-slate-600'
          }`}
        >
          "On your special day, may God bless you with wisdom, joy, good health, and bright success in all your endeavours!"
        </p>
      </div>

      {/* Bottom: Official School Seal & Principal Signature strictly from /school-info (Class Teacher REMOVED) */}
      <div
        className={`w-full pt-3 z-10 border-t ${
          isParty ? 'border-white/20 text-white/90' : 'border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex justify-between items-end px-3 text-[10px]">
          {/* Left: Official School Seal / Stamp (from /school-info) */}
          <div className="flex items-center gap-2.5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={schoolStamp}
                alt="Official School Stamp / Seal"
                className="w-full h-full object-contain drop-shadow-xs"
                crossOrigin="anonymous"
              />
            </div>
            <div className="text-left hidden sm:block">
              <span className={`text-[8.5px] font-semibold block uppercase tracking-wider ${isParty ? 'text-white/70' : 'text-slate-400'}`}>
                Official Seal
              </span>
              <span className={`text-[10px] font-bold block ${isParty ? 'text-white' : 'text-slate-700'}`}>
                Management &amp; Staff
              </span>
            </div>
          </div>

          {/* Right: Principal Signature strictly fetched from /school-info */}
          <div className="text-right min-w-[120px]">
            <div className="h-8 flex items-end justify-end mb-1">
              {principalSig ? (
                <img
                  src={principalSig}
                  alt="Principal Signature"
                  className="h-8 max-w-[130px] object-contain drop-shadow-xs"
                  crossOrigin="anonymous"
                />
              ) : (
                <span
                  style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive, sans-serif" }}
                  className={`text-lg italic font-bold tracking-wide block -mb-0.5 ${
                    isParty ? 'text-amber-200' : 'text-indigo-800'
                  }`}
                >
                  {principalName}
                </span>
              )}
            </div>
            <div
              className={`border-t pt-0.5 font-bold text-[11px] uppercase tracking-wider ${
                isParty ? 'border-white/40 text-white' : 'border-slate-400/60 text-slate-800'
              }`}
            >
              Principal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BirthdayReportPage;
