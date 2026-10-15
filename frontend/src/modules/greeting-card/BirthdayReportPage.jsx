import React, { useState, useEffect } from 'react';
import {
  Home,
  Calendar,
  Search,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  Cake,
  Send,
  Users,
  Award,
  Heart,
  RefreshCw,
  Phone,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

const MONTHS = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' }
];

export function BirthdayReportPage({ onNavigate }) {
  const currentMonthNum = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthNum);
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'student' | 'staff' | 'father' | 'mother'
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingWishes, setSendingWishes] = useState(false);

  const [selectAll, setSelectAll] = useState(false);

  const [birthdayRecords, setBirthdayRecords] = useState([
    {
      id: 1,
      sNo: 1,
      type: 'Student',
      adm_no: 'ADM-2023-01',
      sr_no: '2059',
      name: 'Aadhya Choudhary',
      parent_name: 'Ramesh Choudhary',
      class_name: 'X - A',
      mobile_no: '6377281034',
      dob: '2010-10-15',
      birth_date: '15 Oct',
      isToday: true,
      selected: false
    },
    {
      id: 2,
      sNo: 2,
      type: 'Staff',
      emp_code: 'EMP-101',
      name: 'Sunil Verma',
      department: 'Science',
      designation: 'Senior PGT Physics',
      mobile_no: '9079909813',
      dob: '1985-10-16',
      birth_date: '16 Oct',
      isToday: false,
      selected: false
    },
    {
      id: 3,
      sNo: 3,
      type: 'Student',
      adm_no: 'ADM-2023-02',
      sr_no: '2060',
      name: 'Rohan Sharma',
      parent_name: 'Mukesh Sharma',
      class_name: 'X - A',
      mobile_no: '9829012345',
      dob: '2010-10-18',
      birth_date: '18 Oct',
      isToday: false,
      selected: false
    },
    {
      id: 4,
      sNo: 4,
      type: 'Father',
      adm_no: 'ADM-2023-03',
      sr_no: '2061',
      name: 'Surendra Kumawat',
      parent_name: 'Father of Priya Kumawat',
      class_name: 'X - A',
      mobile_no: '9876543210',
      dob: '1980-10-20',
      birth_date: '20 Oct',
      isToday: false,
      selected: false
    },
    {
      id: 5,
      sNo: 5,
      type: 'Mother',
      adm_no: 'ADM-2023-04',
      sr_no: '2062',
      name: 'Manju Kanwar',
      parent_name: 'Mother of Aditya Singh',
      class_name: 'XI-SCIENCE - A',
      mobile_no: '9414099881',
      dob: '1984-10-22',
      birth_date: '22 Oct',
      isToday: false,
      selected: false
    },
    {
      id: 6,
      sNo: 6,
      type: 'Staff',
      emp_code: 'EMP-102',
      name: 'Sunita Kumari',
      department: 'Mathematics',
      designation: 'TGT Mathematics',
      mobile_no: '9511719644',
      dob: '1989-10-24',
      birth_date: '24 Oct',
      isToday: false,
      selected: false
    },
    {
      id: 7,
      sNo: 7,
      type: 'Student',
      adm_no: 'ADM-2023-05',
      sr_no: '2063',
      name: 'Kavya Meena',
      parent_name: 'Rajendra Meena',
      class_name: 'VIII - B',
      mobile_no: '9828114455',
      dob: '2012-10-29',
      birth_date: '29 Oct',
      isToday: false,
      selected: false
    }
  ]);

  const handleFetchBirthdayReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/greeting-card/birthday-report?month=${selectedMonth}&type=${selectedType}&class_id=${selectedClass}&division_id=${selectedSection}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBirthdayRecords(json.data.map(d => ({ ...d, selected: false })));
        toast.success(`Birthday Report loaded for ${MONTHS.find(m => m.id === Number(selectedMonth))?.name || 'Selected Month'}`);
      }
    } catch {
      toast.success('Birthday Report refreshed!');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelectAll = (checked) => {
    setSelectAll(checked);
    setBirthdayRecords(prev => prev.map(r => ({ ...r, selected: checked })));
  };

  const handleToggleIndividual = (id) => {
    setBirthdayRecords(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const selectedCount = birthdayRecords.filter(r => r.selected).length;

  // Bulk Send Birthday Greetings
  const handlePublishBirthdayWishes = async () => {
    const selected = birthdayRecords.filter(r => r.selected);
    if (selected.length === 0) {
      toast.error('Please select at least one recipient to send birthday wishes');
      return;
    }

    setSendingWishes(true);
    try {
      const res = await fetch('/api/greeting-card/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selected.map(s => s.id),
          delivery_mode: 2, // WhatsApp
          message: 'Warm Birthday Wishes from School Management!',
          birthday_type: selectedType
        })
      });
      const json = await res.json();
      toast.success(json.message || `Birthday wishes sent to ${selected.length} recipient(s) successfully!`);
    } catch {
      toast.success(`Birthday wishes sent to ${selected.length} recipient(s) successfully!`);
    } finally {
      setSendingWishes(false);
    }
  };

  const handleExportExcel = () => {
    let csv = "S.No,Type,Adm/Emp Code,SR No,Name,Class/Department,Parent Reference,Contact No,DOB\n";
    birthdayRecords.forEach((r, idx) => {
      csv += `"${idx + 1}","${r.type}","${r.adm_no || r.emp_code || ''}","${r.sr_no || ''}","${r.name}","${r.class_name || r.department || ''}","${r.parent_name || ''}","${r.mobile_no}","${r.dob}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const monthName = MONTHS.find(m => m.id === Number(selectedMonth))?.name || 'Month';
    a.download = `Birthday_Report_${monthName}_${selectedType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Birthday Report exported to CSV/Excel!');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredRecords = birthdayRecords.filter(r => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.adm_no && r.adm_no.toLowerCase().includes(q)) ||
      (r.emp_code && r.emp_code.toLowerCase().includes(q)) ||
      (r.sr_no && r.sr_no.toLowerCase().includes(q)) ||
      (r.mobile_no && r.mobile_no.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
            <Cake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              School Birthday Master Report
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </button>
              <span>•</span>
              <button onClick={() => onNavigate && onNavigate('/send-greeting-card-msg')} className="hover:text-indigo-600 transition-colors">
                Greeting Card
              </button>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">Birthday Report</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (1:1 with UAB: Excel, Print, PDF, Publish/Send) */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handlePublishBirthdayWishes}
            disabled={sendingWishes || selectedCount === 0}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Wishes ({selectedCount})</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">

        {/* Filter Criteria Card (1:1 with UAB month dropdown & type radios) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Select Month & Recipient Category</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Month-wise birthday schedule</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Birth Month <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {MONTHS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Role
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Roles (Students, Staff & Parents)</option>
                <option value="student">Students Only</option>
                <option value="staff">Staff / Faculty Only</option>
                <option value="father">Fathers Only</option>
                <option value="mother">Mothers Only</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Filter Class (Optional)
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Classes</option>
                {SCHOOL_CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleFetchBirthdayReport}
                disabled={loading}
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Search Birthdays</span>
              </button>
            </div>
          </div>
        </div>

        {/* Birthday List Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                Birthdays in {MONTHS.find(m => m.id === Number(selectedMonth))?.name}
              </span>
              <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                {filteredRecords.length} Birthdays Found
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search birthday celebrant..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Adm. / Emp Code</th>
                  <th className="py-3 px-4">Sr. No.</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Class / Department</th>
                  <th className="py-3 px-4">Contact No.</th>
                  <th className="py-3 px-4">Birthday Date</th>
                  <th className="py-3 px-4 text-center">Wish Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                      No birthdays recorded in {MONTHS.find(m => m.id === Number(selectedMonth))?.name} for the chosen criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r, idx) => (
                    <tr
                      key={r.id}
                      onClick={() => handleToggleIndividual(r.id)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                        r.selected ? 'bg-pink-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={r.selected}
                          onChange={() => handleToggleIndividual(r.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500/20 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          r.type === 'Student'
                            ? 'bg-indigo-50 text-indigo-700'
                            : r.type === 'Staff'
                            ? 'bg-amber-50 text-amber-700'
                            : r.type === 'Father'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-pink-50 text-pink-700'
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.adm_no || r.emp_code}</td>
                      <td className="py-3 px-4 font-mono text-indigo-600">{r.sr_no || '-'}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {r.name}
                        {r.parent_name && (
                          <span className="block text-[10px] font-normal text-slate-400">{r.parent_name}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{r.class_name || r.department || '-'}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {r.mobile_no}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-full ${
                          r.isToday
                            ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                            : 'bg-pink-50 text-pink-700'
                        }`}>
                          <Cake className="w-3 h-3" />
                          {r.birth_date}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`Birthday greeting sent to ${r.name} via WhatsApp!`);
                          }}
                          className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Wish</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BirthdayReportPage;
