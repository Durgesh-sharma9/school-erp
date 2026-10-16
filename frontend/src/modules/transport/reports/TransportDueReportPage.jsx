import React, { useState } from 'react';
import { AlertCircle, Search, Download, Printer, CreditCard, X, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportDueReportPage() {
  const [reportType, setReportType] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [studentType, setStudentType] = useState('All Student');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForPass, setSelectedStudentForPass] = useState(null);

  const [records] = useState([
    { sNo: 1, admNo: '1621', srNo: '1621', name: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', fatherName: 'VIKRAM SINGH', contactNo: '8947919195', vehicle: 'RJ02PA2762', route: 'Jaisinghpura, Rampura', total: 28050, paid: 18700, balance: 9350 },
    { sNo: 2, admNo: '2059', srNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', fatherName: 'RAMESH CHOUDHARY', contactNo: '6377281034', vehicle: 'RJ14PC1019', route: 'Kalwara, Ajairajpura', total: 33000, paid: 21000, balance: 12000 },
    { sNo: 3, admNo: '1204', srNo: '1204', name: 'AARAV SHARMA', className: 'Class I-A', fatherName: 'RAJESH SHARMA', contactNo: '9876543210', vehicle: 'RJ14PC2278', route: 'Bhankrota, Mojika, Hanging Gardens', total: 31350, paid: 21000, balance: 10350 },
    { sNo: 4, admNo: '1245', srNo: '1245', name: 'BHAVYA VERMA', className: 'Class II-B', fatherName: 'MANISH VERMA', contactNo: '9829012345', vehicle: 'RJ14PC1037', route: 'Mangalam Grand City', total: 28050, paid: 18700, balance: 9350 },
    { sNo: 5, admNo: '1310', srNo: '1310', name: 'CHETAN MEENA', className: 'Class X-A', fatherName: 'RAMESHWAR MEENA', contactNo: '9414054321', vehicle: 'RJ40PA1179', route: 'Thikriya, Vatika', total: 39600, paid: 26400, balance: 13200 },
    { sNo: 6, admNo: '1455', srNo: '1455', name: 'KAVYA JANGID', className: 'Class II-A', fatherName: 'BHARAT JANGID', contactNo: '9828884422', vehicle: 'RJ20PA9932', route: 'Auric City & Shub Nilay', total: 26400, paid: 17600, balance: 8800 },
    { sNo: 7, admNo: '1532', srNo: '1532', name: 'MANVI RATHORE', className: 'Class III-B', fatherName: 'MAHENDRA RATHORE', contactNo: '9782110022', vehicle: 'RJ14PC7878', route: 'Manglam Aangan', total: 28050, paid: 18700, balance: 9350 },
    { sNo: 8, admNo: '1689', srNo: '1689', name: 'RIDDHI GURJAR', className: 'Class V-A', fatherName: 'RAJU GURJAR', contactNo: '9982445566', vehicle: 'RJ19PB7511', route: 'Narsinghpura, Ramchandrapura', total: 31350, paid: 21000, balance: 10350 },
    { sNo: 9, admNo: '1740', srNo: '1740', name: 'TANMAY SAINI', className: 'Class VIII-B', fatherName: 'NARESH SAINI', contactNo: '9414223344', vehicle: 'RJ14PC5938', route: 'Aasra, J K Lakshmipat University', total: 29700, paid: 19800, balance: 9900 },
    { sNo: 10, admNo: '1812', srNo: '1812', name: 'ZOYA KHAN', className: 'Class II-A', fatherName: 'ASLAM KHAN', contactNo: '9602441188', vehicle: 'RJ14PE0832', route: 'Khatwara', total: 28050, paid: 18700, balance: 9350 }
  ]);

  const filteredRecords = records.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admNo.includes(searchQuery)
  );

  const totalDemand = filteredRecords.reduce((sum, r) => sum + r.total, 0);
  const totalPaid = filteredRecords.reduce((sum, r) => sum + r.paid, 0);
  const totalBalance = filteredRecords.reduce((sum, r) => sum + r.balance, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Father Name,Contact No,Total,Paid,Balance"].concat(
        filteredRecords.map(r => `${r.sNo},"${r.admNo}","${r.srNo}","${r.name}","${r.className}","${r.fatherName}","${r.contactNo}",${r.total},${r.paid},${r.balance}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Transport_Due_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 UAB Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Student</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Transport Due Report</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-rose-600" />
            Transport Due Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
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
          <button
            onClick={() => setSelectedStudentForPass(filteredRecords[0])}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <CreditCard className="w-4 h-4" /> Bus Pass
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB: Report Type, Month, Student Type, Search, Bus Pass) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Students</option>
              <option value="Route">Route Wise</option>
              <option value="Vehicle">Vehicle Wise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Type</label>
            <select
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All Student">All Student</option>
              <option value="New">New Student</option>
              <option value="Old">Old Student</option>
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
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Transport Demand</div>
          <div className="text-xl font-bold text-slate-900 mt-1">₹{totalDemand.toLocaleString()}</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Total Collected</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">₹{totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Outstanding Transport Due</div>
          <div className="text-xl font-bold text-rose-900 mt-1">₹{totalBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., ADM.NO., SR.NO., NAME, CLASS, FATHER'S NAME, CONTACT NO., TOTAL, PAID, BAL.) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">S.NO.</th>
                <th className="py-3.5 px-4">ADM.NO.</th>
                <th className="py-3.5 px-4">SR.NO.</th>
                <th className="py-3.5 px-4">NAME</th>
                <th className="py-3.5 px-4">CLASS</th>
                <th className="py-3.5 px-4">FATHER'S NAME</th>
                <th className="py-3.5 px-4">CONTACT NO.</th>
                <th className="py-3.5 px-4 text-right">TOTAL (₹)</th>
                <th className="py-3.5 px-4 text-right">PAID (₹)</th>
                <th className="py-3.5 px-4 text-right font-bold text-rose-600">BAL. (₹)</th>
                <th className="py-3.5 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{r.admNo}</td>
                  <td className="py-3.5 px-4 font-mono">{r.srNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{r.name}</td>
                  <td className="py-3.5 px-4">{r.className}</td>
                  <td className="py-3.5 px-4">{r.fatherName}</td>
                  <td className="py-3.5 px-4 font-mono">{r.contactNo}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium">₹{r.total.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-emerald-700">₹{r.paid.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">₹{r.balance.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedStudentForPass(r)}
                      className="px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold border border-emerald-200 transition"
                    >
                      Bus Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/75 border-t border-slate-200 font-bold text-slate-900">
              <tr>
                <td colSpan="7" className="py-3.5 px-4 text-right text-xs">Total:</td>
                <td className="py-3.5 px-4 text-right font-mono">₹{totalDemand.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-700">₹{totalPaid.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right font-mono text-rose-600">₹{totalBalance.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bus Pass Preview Modal */}
      {selectedStudentForPass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                STUDENT TRANSPORT BUS PASS
              </h2>
              <button onClick={() => setSelectedStudentForPass(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* Bus Pass Card Design */}
              <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-white/20 pb-3 mb-3">
                  <div>
                    <h3 className="font-extrabold text-sm tracking-wide">J D INTERNATIONAL SCHOOL</h3>
                    <p className="text-[10px] text-indigo-200">Session 2026-2027 &bull; Student Bus Pass</p>
                  </div>
                  <div className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 uppercase tracking-wider">
                    {selectedStudentForPass.vehicle}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  <div className="col-span-2 space-y-1">
                    <div>
                      <span className="text-[10px] text-indigo-200 block">STUDENT NAME</span>
                      <span className="font-bold">{selectedStudentForPass.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-200 block">CLASS & ROLL</span>
                      <span className="font-medium">{selectedStudentForPass.className} | Adm: {selectedStudentForPass.admNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-200 block">ROUTE ALLOCATION</span>
                      <span className="font-medium">{selectedStudentForPass.route}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-2 border border-white/20">
                    <QrCode className="w-14 h-14 text-white" />
                    <span className="text-[9px] mt-1 font-mono">{selectedStudentForPass.admNo}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/20 text-indigo-200">
                  <span>Emergency: {selectedStudentForPass.contactNo}</span>
                  <span className="font-bold text-emerald-300">VALIDATED</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPass(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => { window.print(); toast.success('Bus pass printing'); }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
