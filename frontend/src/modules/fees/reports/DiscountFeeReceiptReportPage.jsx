import React, { useState } from 'react';
import { Tag, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { tenantStore } from '../../../services/tenantStore';

export function DiscountFeeReceiptReportPage() {
  const { schoolId } = useAuth();
  const [fromDate, setFromDate] = useState('2026-04-01');
  const [toDate, setToDate] = useState('2026-10-15');
  const [reportType, setReportType] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');

  const [discounts, setDiscounts] = useState([]);

  React.useEffect(() => {
    try {
      const concessions = tenantStore.getStudentConcessions(schoolId) || [];
      const mapped = concessions.map((c, idx) => ({
        sNo: idx + 1,
        admNo: c.admNo,
        srNo: c.srNo || c.admNo,
        name: c.studentName,
        className: c.className || 'Class I',
        recNo: `DISC-${c.admNo}`,
        recDate: new Date().toISOString().split('T')[0],
        discountType: c.concessionType,
        remark: `Concession approved by ${c.concessionBy}`,
        discountAmount: Number(c.amount || 0),
        authorizedBy: c.concessionBy || 'PRINCIPAL'
      }));
      setDiscounts(mapped);
    } catch (e) {
      console.error(e);
    }
  }, [schoolId]);

  const totalDiscount = discounts.reduce((sum, d) => sum + d.discountAmount, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Rec No,Rec Date,Discount Type,Remark,Discount Amount,Authorized By"].concat(
        discounts.map(d => `${d.sNo},"${d.admNo}","${d.srNo}","${d.name}","${d.className}","${d.recNo}","${d.recDate}","${d.discountType}","${d.remark}",${d.discountAmount},"${d.authorizedBy}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Fee_Discount_Receipt_Report.csv`);
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
            <Tag className="w-6 h-6 text-indigo-600" />
            Discount Fee Receipt Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fees &bull; <span className="text-indigo-600 font-medium">Receipt-Level Discounts & Waivers Register</span>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Discount Receipts</option>
              <option value="Sibling">Sibling Discount Only</option>
              <option value="Staff">Staff Ward Discount</option>
              <option value="Merit">Merit & Management</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <option value="All">All Classes</option>
              <option value="Nursery - PP3+">Nursery - PP3+</option>
              <option value="Class II">Class II</option>
              <option value="Class X">Class X</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button onClick={() => toast.success('Discount receipts report filtered')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Discounted Receipts</div>
            <div className="text-xl font-bold text-indigo-900 mt-1">{discounts.length} Receipts with Concession</div>
          </div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Total Discount Granted</div>
            <div className="text-xl font-bold text-emerald-900 mt-1">₹{totalDiscount.toLocaleString()}</div>
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
                <th className="py-3.5 px-6">ADM.NO.</th>
                <th className="py-3.5 px-6">SR.NO.</th>
                <th className="py-3.5 px-6">NAME</th>
                <th className="py-3.5 px-6">CLASS</th>
                <th className="py-3.5 px-6">REC.NO.</th>
                <th className="py-3.5 px-6">REC.DATE</th>
                <th className="py-3.5 px-6">DISCOUNT TYPE</th>
                <th className="py-3.5 px-6">REMARK</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">DISCOUNT AMT. (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {discounts.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{d.sNo}</td>
                  <td className="py-3.5 px-6 font-mono text-indigo-600">{d.admNo}</td>
                  <td className="py-3.5 px-6 font-mono">{d.srNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{d.name}</td>
                  <td className="py-3.5 px-6">{d.className}</td>
                  <td className="py-3.5 px-6 font-mono font-semibold text-indigo-600">{d.recNo}</td>
                  <td className="py-3.5 px-6 font-mono">{d.recDate}</td>
                  <td className="py-3.5 px-6"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">{d.discountType}</span></td>
                  <td className="py-3.5 px-6 italic text-[11px] text-slate-500">{d.remark}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700">₹{d.discountAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan="9" className="py-3.5 px-6 text-right text-xs">Total Discount Granted:</td>
                <td className="py-3.5 px-6 text-right font-mono text-emerald-700">₹{totalDiscount.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
