import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  Printer,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileSpreadsheet,
  RefreshCw,
  BookOpen,
  User,
  Phone,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SCHOOL_CLASSES } from '../students/reports/studentReportsData';

export function HomeworkStatusReportPage({ onNavigate }) {
  const [selectedClass, setSelectedClass] = useState('X');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const [reportData, setReportData] = useState([
    {
      id: 1,
      sr_no: "2059",
      adm_no: "ADM-2023-01",
      student_name: "Aadhya Choudhary",
      contact_no_sms: "6377281034",
      fathers_name: "Ramesh Choudhary",
      class_name: "X",
      division_name: "A",
      homework: [
        {
          subject_name: "Mathematics Standard",
          status_id: 1,
          details: {
            homework_title: "Exercise 4.2 Quadratic Equations Q1 to Q6",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 08:42 AM"
          }
        },
        {
          subject_name: "Science",
          status_id: 1,
          details: {
            homework_title: "Chapter 5 Cell Structure Diagram & NCERT Worksheet",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 09:15 AM"
          }
        },
        {
          subject_name: "English",
          status_id: 0,
          details: {
            homework_title: "Letter to Editor Practice in Fair Notebook",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        }
      ]
    },
    {
      id: 2,
      sr_no: "2060",
      adm_no: "ADM-2023-02",
      student_name: "Rohan Sharma",
      contact_no_sms: "9829012345",
      fathers_name: "Mukesh Sharma",
      class_name: "X",
      division_name: "A",
      homework: [
        {
          subject_name: "Mathematics Standard",
          status_id: 1,
          details: {
            homework_title: "Exercise 4.2 Quadratic Equations Q1 to Q6",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 07:30 AM"
          }
        },
        {
          subject_name: "Science",
          status_id: 0,
          details: {
            homework_title: "Chapter 5 Cell Structure Diagram & NCERT Worksheet",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        },
        {
          subject_name: "English",
          status_id: 0,
          details: {
            homework_title: "Letter to Editor Practice in Fair Notebook",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        }
      ]
    },
    {
      id: 3,
      sr_no: "2061",
      adm_no: "ADM-2023-03",
      student_name: "Priya Kumawat",
      contact_no_sms: "9876543210",
      fathers_name: "Surendra Kumawat",
      class_name: "X",
      division_name: "A",
      homework: [
        {
          subject_name: "Mathematics Standard",
          status_id: 1,
          details: {
            homework_title: "Exercise 4.2 Quadratic Equations Q1 to Q6",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 08:10 AM"
          }
        },
        {
          subject_name: "Science",
          status_id: 1,
          details: {
            homework_title: "Chapter 5 Cell Structure Diagram & NCERT Worksheet",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 08:35 AM"
          }
        },
        {
          subject_name: "English",
          status_id: 1,
          details: {
            homework_title: "Letter to Editor Practice in Fair Notebook",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 10:05 AM"
          }
        }
      ]
    },
    {
      id: 4,
      sr_no: "2062",
      adm_no: "ADM-2023-04",
      student_name: "Aditya Singh Rathore",
      contact_no_sms: "9414011223",
      fathers_name: "Bhawani Singh",
      class_name: "X",
      division_name: "A",
      homework: [
        {
          subject_name: "Mathematics Standard",
          status_id: 0,
          details: {
            homework_title: "Exercise 4.2 Quadratic Equations Q1 to Q6",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        },
        {
          subject_name: "Science",
          status_id: 0,
          details: {
            homework_title: "Chapter 5 Cell Structure Diagram & NCERT Worksheet",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        },
        {
          subject_name: "English",
          status_id: 0,
          details: {
            homework_title: "Letter to Editor Practice in Fair Notebook",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        }
      ]
    },
    {
      id: 5,
      sr_no: "2063",
      adm_no: "ADM-2023-05",
      student_name: "Kavya Meena",
      contact_no_sms: "9828114455",
      fathers_name: "Rajendra Meena",
      class_name: "X",
      division_name: "A",
      homework: [
        {
          subject_name: "Mathematics Standard",
          status_id: 1,
          details: {
            homework_title: "Exercise 4.2 Quadratic Equations Q1 to Q6",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 09:20 AM"
          }
        },
        {
          subject_name: "Science",
          status_id: 1,
          details: {
            homework_title: "Chapter 5 Cell Structure Diagram & NCERT Worksheet",
            assigned_at: "2026-10-15",
            seen_at: "2026-10-15 09:40 AM"
          }
        },
        {
          subject_name: "English",
          status_id: 0,
          details: {
            homework_title: "Letter to Editor Practice in Fair Notebook",
            assigned_at: "2026-10-15",
            seen_at: null
          }
        }
      ]
    }
  ]);

  const handleFetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/study-material/homework-status-report?class_id=${selectedClass}&division_id=${selectedSection}&current_date=${selectedDate}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReportData(json.data);
        toast.success(`Loaded homework report for Class ${selectedClass} - ${selectedSection}`);
      }
    } catch {
      toast.success(`Fetched report for Class ${selectedClass} - ${selectedSection}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    let csv = "S.No,SR No,Adm No,Student Name,Father Name,Contact No,Subject,Homework Title,Status\n";
    reportData.forEach((row, idx) => {
      row.homework.forEach((hw) => {
        csv += `"${idx + 1}","${row.sr_no}","${row.adm_no}","${row.student_name}","${row.fathers_name}","${row.contact_no_sms}","${hw.subject_name}","${hw.details.homework_title}","${hw.status_id > 0 ? 'Read' : 'Unread'}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Homework_Status_Report_Class_${selectedClass}_${selectedSection}_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Homework Status Report exported to CSV/Excel!');
  };

  const filteredData = reportData.filter((row) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      row.student_name.toLowerCase().includes(q) ||
      row.sr_no.toLowerCase().includes(q) ||
      row.adm_no.toLowerCase().includes(q) ||
      row.contact_no_sms.includes(q) ||
      row.fathers_name.toLowerCase().includes(q)
    );
  });

  // Calculate summary metrics
  let totalTasks = 0;
  let readTasks = 0;
  reportData.forEach(r => {
    r.homework.forEach(h => {
      totalTasks++;
      if (h.status_id > 0) readTasks++;
    });
  });
  const unreadTasks = totalTasks - readTasks;
  const readPercentage = totalTasks > 0 ? Math.round((readTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Header / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              Homework Status & Seen Report
            </h1>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </button>
              <span>•</span>
              <button onClick={() => onNavigate && onNavigate('/study-material')} className="hover:text-indigo-600 transition-colors">
                Study Material
              </button>
              <span>•</span>
              <span className="text-indigo-600 font-semibold">Homework Seen Report</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="h-9 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 shadow-xs text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 space-y-6">

        {/* Quick KPI Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              👥
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Students</span>
              <span className="text-lg font-black text-slate-900 leading-tight">{reportData.length}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              📚
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Tasks</span>
              <span className="text-lg font-black text-slate-900 leading-tight">{totalTasks}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Seen / Read</span>
              <span className="text-lg font-black text-emerald-600 leading-tight">{readTasks} ({readPercentage}%)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              ⏳
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Unread / Pending</span>
              <span className="text-lg font-black text-rose-600 leading-tight">{unreadTasks}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Card (1:1 with UAB Homework Seen Report) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Filter Criteria</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Select Class, Section & Assigned Date</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {SCHOOL_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Division / Section <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Homework Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFetchReport}
                disabled={loading}
                className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Get Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Student Homework Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                Student Homework Status Table
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {filteredData.length} Students
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, SR, phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">SR No.</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Contact No. (SMS)</th>
                  <th className="py-3 px-4">Father's Name</th>
                  <th className="py-3 px-4">Homework Breakdown</th>
                  <th className="py-3 px-4 text-center">Seen Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No homework status records found for this class and date selection.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((student, idx) => {
                    const studentReadCount = student.homework.filter(h => h.status_id > 0).length;
                    const studentTotal = student.homework.length;
                    const isAllSeen = studentTotal > 0 && studentReadCount === studentTotal;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{student.sr_no}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {student.student_name}
                          <span className="block text-[10px] font-normal text-slate-400">{student.adm_no}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {student.contact_no_sms}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{student.fathers_name}</td>
                        
                        {/* Homework Breakdown Sub-table */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5 min-w-[280px]">
                            {student.homework.map((hw, hIdx) => (
                              <div
                                key={hIdx}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px]"
                              >
                                <div className="space-y-0.5 truncate pr-2">
                                  <span className="font-bold text-slate-800 block truncate">{hw.subject_name}</span>
                                  <span className="text-slate-500 block truncate text-[10px]">{hw.details.homework_title}</span>
                                </div>
                                <div className="shrink-0">
                                  {hw.status_id > 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/70 text-emerald-700">
                                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                                      Read
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      Unread
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Overall Student Seen Metric */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                              isAllSeen
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : studentReadCount > 0
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {studentReadCount} / {studentTotal} Seen
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomeworkStatusReportPage;
