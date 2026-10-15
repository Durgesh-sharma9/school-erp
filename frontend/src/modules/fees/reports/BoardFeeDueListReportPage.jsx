import React, { useState } from 'react';
import { Award, Search, Download, Printer, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function BoardFeeDueListReportPage() {
  const [selectedClass, setSelectedClass] = useState('All');
  const [studentType, setStudentType] = useState('Due Student');

  const [candidates, setCandidates] = useState([
    { sNo: 1, admNo: '2060', name: 'ROHAN SHARMA', fatherName: 'MUKESH SHARMA', mobile: '9829012345', className: 'X-A', total: 3500, paid: 0, due: 3500 },
    { sNo: 2, admNo: '2070', name: 'KAVITA MEENA', fatherName: 'RAMESHWAR MEENA', mobile: '9414012233', className: 'XII-HUMANITIES-A', total: 3800, paid: 0, due: 3800 },
    { sNo: 3, admNo: '2072', name: 'HARSHIT JAIN', fatherName: 'SANJAY JAIN', mobile: '9876543210', className: 'XII-SCIENCE-A', total: 3800, paid: 1000, due: 2800 }
  ]);

  const totalDues = candidates.reduce((sum, c) => sum + c.due, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,Student Name,Father Name,Mobile,Class,Total,Paid,Due"].concat(
        candidates.map(c => `${c.sNo},"${c.admNo}","${c.name}","${c.fatherName}","${c.mobile}","${c.className}",${c.total},${c.paid},${c.due}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Board_Fee_Due_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            Board Fee Due List
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Board Examination Pending Dues Register</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Board Classes (X & XII)</option>
              <option value="X">Class X</option>
              <option value="XII-HUMANITIES">Class XII - Humanities</option>
              <option value="XII-SCIENCE">Class XII - Science</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Type</label>
            <select value={studentType} onChange={(e) => setStudentType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Due Student">Due Student Only</option>
              <option value="All">All Students</option>
            </select>
          </div>

          <div className="flex flex-col justify-end md:col-span-2">
            <button onClick={() => toast.success('Filtered board fee due list')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table (1:1 UAB columns) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">ADM.NO.</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6">FATHERS NAME</th>
                <th className="py-3.5 px-6">MOBILE NO.</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6 text-right">TOTAL</th>
                <th className="py-3.5 px-6 text-right">PAID</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">DUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map((c) => (
                <tr key={c.admNo} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-medium text-slate-800">{c.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{c.admNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{c.fatherName}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-600">{c.mobile}</td>
                  <td className="py-3.5 px-6 text-slate-700 font-medium">{c.className}</td>
                  <td className="py-3.5 px-6 text-right font-medium">₹{c.total}</td>
                  <td className="py-3.5 px-6 text-right font-medium text-emerald-700">₹{c.paid}</td>
                  <td className="py-3.5 px-6 text-right font-black text-rose-600">₹{c.due.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-200">
                <td colSpan="8" className="py-3.5 px-6 text-right uppercase tracking-wider text-slate-700">Total Outstanding Board Dues:</td>
                <td className="py-3.5 px-6 text-right font-black text-rose-600 text-sm">₹{totalDues.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
