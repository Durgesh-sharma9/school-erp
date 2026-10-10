import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  UserPlus,
  Phone,
  Calendar,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

export function StudentPortfolioPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');

  const studentsList = [
    {
      id: '1',
      admNo: 'JD-2026-101',
      srNo: '10964/001',
      name: 'Aarav Sharma',
      gender: 'Boy',
      className: 'Class 10',
      section: 'A',
      fatherName: 'Rajesh Sharma',
      mobile: '9829012345',
      studentType: 'OLD',
      feeStatus: 'Paid',
      attendance: '96%'
    },
    {
      id: '2',
      admNo: 'JD-2026-102',
      srNo: '10964/002',
      name: 'Ananya Gupta',
      gender: 'Girl',
      className: 'Class 10',
      section: 'A',
      fatherName: 'Sanjay Gupta',
      mobile: '9829012346',
      studentType: 'OLD',
      feeStatus: 'Due ₹ 4,500',
      attendance: '98%'
    },
    {
      id: '3',
      admNo: 'JD-2026-103',
      srNo: '10964/003',
      name: 'Rohan Meena',
      gender: 'Boy',
      className: 'Class 8',
      section: 'B',
      fatherName: 'Vikram Meena',
      mobile: '9829012347',
      studentType: 'NEW',
      feeStatus: 'Paid',
      attendance: '92%'
    },
    {
      id: '4',
      admNo: 'JD-2026-104',
      srNo: '10964/004',
      name: 'Diya Choudhary',
      gender: 'Girl',
      className: 'Class 5',
      section: 'A',
      fatherName: 'Manoj Choudhary',
      mobile: '9829012348',
      studentType: 'OLD',
      feeStatus: 'Paid',
      attendance: '100%'
    },
    {
      id: '5',
      admNo: 'JD-2026-105',
      srNo: '10964/005',
      name: 'Kabir Verma',
      gender: 'Boy',
      className: 'Class 12',
      section: 'Sci',
      fatherName: 'Praveen Verma',
      mobile: '9829012349',
      studentType: 'OLD',
      feeStatus: 'Due ₹ 12,000',
      attendance: '94%'
    }
  ];

  const filtered = studentsList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.mobile.includes(searchQuery);
    const matchClass = selectedClass === 'All' || s.className === selectedClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Student Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Student Portfolio & Directory</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Total 928 Students
            </span>
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate && onNavigate('/student-registration')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ New Admission</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, admission no, mobile..."
            className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white font-medium"
          >
            <option value="All">All Classes</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 12">Class 12</option>
          </select>

          <button className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Students TanStack-Style Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Adm No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class / Sec</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4">Mobile No</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{s.admNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                      {s.gender === 'Boy' ? '👦' : '👧'}
                    </span>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{s.className} ({s.section})</td>
                  <td className="py-3 px-4 text-slate-600">{s.fatherName}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{s.mobile}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      s.studentType === 'NEW'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {s.studentType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      s.feeStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {s.feeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{s.attendance}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        title="View Full Profile"
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Edit Student"
                        onClick={() => onNavigate && onNavigate('/student-registration')}
                        className="p-1.5 rounded hover:bg-indigo-50 text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
