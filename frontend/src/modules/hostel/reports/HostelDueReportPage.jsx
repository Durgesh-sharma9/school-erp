import React, { useState } from 'react';
import { AlertCircle, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelDueReportPage() {
  const [selectedHostel, setSelectedHostel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [records] = useState([
    { sNo: 1, admNo: '1621', name: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', fatherName: 'VIKRAM SINGH', contactNo: '8947919195', hostel: 'Tagore Boys Hostel', roomNo: 'A-101', totalFee: 65000, paidFee: 45000, dueFee: 20000 },
    { sNo: 2, admNo: '1204', name: 'AARAV SHARMA', className: 'Class I-A', fatherName: 'RAJESH SHARMA', contactNo: '9876543210', hostel: 'Tagore Boys Hostel', roomNo: 'A-101', totalFee: 65000, paidFee: 65000, dueFee: 0 },
    { sNo: 3, admNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', fatherName: 'RAMESH CHOUDHARY', contactNo: '6377281034', hostel: 'Sarojini Girls Hostel', roomNo: 'G-201', totalFee: 65000, paidFee: 35000, dueFee: 30000 },
    { sNo: 4, admNo: '1310', name: 'CHETAN MEENA', className: 'Class X-A', fatherName: 'RAMESHWAR MEENA', contactNo: '9414054321', hostel: 'Tagore Boys Hostel', roomNo: 'A-102', totalFee: 65000, paidFee: 40000, dueFee: 25000 }
  ]);

  const filteredRecords = records.filter(r => {
    if (selectedHostel !== 'All' && r.hostel !== selectedHostel) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.admNo.includes(searchQuery)) return false;
    return true;
  });

  const totalDemand = filteredRecords.reduce((sum, r) => sum + r.totalFee, 0);
  const totalPaid = filteredRecords.reduce((sum, r) => sum + r.paidFee, 0);
  const totalDue = filteredRecords.reduce((sum, r) => sum + r.dueFee, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,Student Name,Class,Father Name,Contact No,Hostel,Room No,Total Fee,Paid Fee,Due Fee"].concat(
        filteredRecords.map(r => `${r.sNo},"${r.admNo}","${r.name}","${r.className}","${r.fatherName}","${r.contactNo}","${r.hostel}","${r.roomNo}",${r.totalFee},${r.paidFee},${r.dueFee}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Due_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Hostel</span>
            <span>&gt;</span>
            <span>Reports</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Hostel Due Report</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-600" />
            Hostel Fee Due & Outstanding Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search boarder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-52 outline-none"
            />
          </div>

          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel</label>
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Hostels</option>
              <option value="Tagore Boys Hostel">Tagore Boys Hostel</option>
              <option value="Sarojini Girls Hostel">Sarojini Girls Hostel</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Due report generated')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Hostel Demand</div>
          <div className="text-xl font-bold text-slate-900 mt-1">₹{totalDemand.toLocaleString()}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Total Received</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">₹{totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Outstanding Due</div>
          <div className="text-xl font-bold text-rose-900 mt-1">₹{totalDue.toLocaleString()}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">S.NO.</th>
                <th className="py-3.5 px-4">ADM.NO.</th>
                <th className="py-3.5 px-4">STUDENT NAME</th>
                <th className="py-3.5 px-4">CLASS</th>
                <th className="py-3.5 px-4">FATHER'S NAME</th>
                <th className="py-3.5 px-4">CONTACT NO.</th>
                <th className="py-3.5 px-4">HOSTEL</th>
                <th className="py-3.5 px-4">ROOM NO.</th>
                <th className="py-3.5 px-4 text-right">TOTAL (₹)</th>
                <th className="py-3.5 px-4 text-right">PAID (₹)</th>
                <th className="py-3.5 px-4 text-right font-bold text-rose-600">DUE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{r.admNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{r.name}</td>
                  <td className="py-3.5 px-4">{r.className}</td>
                  <td className="py-3.5 px-4">{r.fatherName}</td>
                  <td className="py-3.5 px-4 font-mono">{r.contactNo}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{r.hostel}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{r.roomNo}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium">₹{r.totalFee.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-emerald-700">₹{r.paidFee.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">₹{r.dueFee.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan="8" className="py-3.5 px-4 text-right text-xs">Total:</td>
                <td className="py-3.5 px-4 text-right font-mono">₹{totalDemand.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-700">₹{totalPaid.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right font-mono text-rose-600">₹{totalDue.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
