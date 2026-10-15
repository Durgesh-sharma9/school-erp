import React, { useState } from 'react';
import { Layers, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function FeeStructureReportPage() {
  const [reportType, setReportType] = useState('Fees Structure');
  const [selectedClass, setSelectedClass] = useState('All');
  const [applyFor, setApplyFor] = useState('Both');

  const [structures] = useState([
    {
      sNo: 1,
      className: 'NURSERY',
      tuitionFee: 12000,
      annualCharges: 3000,
      developmentFee: 1500,
      examFee: 1000,
      computerFee: 500,
      admissionFee: 2000,
      grandTotal: 20000,
      applyFor: 'Both'
    },
    {
      sNo: 2,
      className: 'L.K.G',
      tuitionFee: 12500,
      annualCharges: 3000,
      developmentFee: 1500,
      examFee: 1000,
      computerFee: 500,
      admissionFee: 2000,
      grandTotal: 20500,
      applyFor: 'Both'
    },
    {
      sNo: 3,
      className: 'U.K.G',
      tuitionFee: 13000,
      annualCharges: 3000,
      developmentFee: 1500,
      examFee: 1000,
      computerFee: 500,
      admissionFee: 2000,
      grandTotal: 21000,
      applyFor: 'Both'
    },
    {
      sNo: 4,
      className: 'CLASS 1',
      tuitionFee: 14000,
      annualCharges: 3500,
      developmentFee: 2000,
      examFee: 1200,
      computerFee: 1000,
      admissionFee: 2500,
      grandTotal: 24200,
      applyFor: 'Both'
    },
    {
      sNo: 5,
      className: 'CLASS X',
      tuitionFee: 18000,
      annualCharges: 4000,
      developmentFee: 2500,
      examFee: 2000,
      computerFee: 1500,
      admissionFee: 3000,
      grandTotal: 31000,
      applyFor: 'Both'
    }
  ]);

  const filteredStructures = structures.filter(s => {
    if (selectedClass !== 'All' && s.className !== selectedClass) return false;
    if (applyFor !== 'Both' && s.applyFor !== applyFor) return false;
    return true;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Class,Tuition Fee,Annual Charges,Development Fee,Exam Fee,Computer Fee,Admission Fee,Grand Total"].concat(
        filteredStructures.map(s => `${s.sNo},"${s.className}",${s.tuitionFee},${s.annualCharges},${s.developmentFee},${s.examFee},${s.computerFee},${s.admissionFee},${s.grandTotal}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Structure_Report.csv`);
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
            <Layers className="w-6 h-6 text-indigo-600" />
            Fee Structure Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Class-wise and Head-wise Fee Matrix</span>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Fees Structure">Fees Structure</option>
              <option value="Head Wise">Head Wise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Classes</option>
              <option value="NURSERY">NURSERY</option>
              <option value="L.K.G">L.K.G</option>
              <option value="U.K.G">U.K.G</option>
              <option value="CLASS 1">CLASS 1</option>
              <option value="CLASS X">CLASS X</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Apply For</label>
            <select value={applyFor} onChange={(e) => setApplyFor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="Both">Both (Old & New)</option>
              <option value="Old">Old Students</option>
              <option value="New">New Admissions</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Fee structure filtered')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Total Classes Configured</div>
            <div className="text-xl font-bold text-indigo-900 mt-1">{filteredStructures.length} Classes</div>
          </div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Average Annual Fee</div>
            <div className="text-xl font-bold text-emerald-900 mt-1">
              ₹{filteredStructures.length > 0 ? Math.round(filteredStructures.reduce((acc, s) => acc + s.grandTotal, 0) / filteredStructures.length).toLocaleString() : 0}
            </div>
          </div>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Highest Fee Class</div>
            <div className="text-xl font-bold text-purple-900 mt-1">CLASS X (₹31,000)</div>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6 text-right">TUITION FEE (₹)</th>
                <th className="py-3.5 px-6 text-right">ANNUAL CHARGES (₹)</th>
                <th className="py-3.5 px-6 text-right">DEV. FEE (₹)</th>
                <th className="py-3.5 px-6 text-right">EXAM FEE (₹)</th>
                <th className="py-3.5 px-6 text-right">COMPUTER FEE (₹)</th>
                <th className="py-3.5 px-6 text-right">ADMISSION FEE (₹)</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">GRAND TOTAL (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStructures.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{s.sNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{s.className}</td>
                  <td className="py-3.5 px-6 text-right font-mono">₹{s.tuitionFee.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono">₹{s.annualCharges.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono">₹{s.developmentFee.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono">₹{s.examFee.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono">₹{s.computerFee.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-mono">₹{s.admissionFee.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right font-bold text-indigo-700 font-mono">₹{s.grandTotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
