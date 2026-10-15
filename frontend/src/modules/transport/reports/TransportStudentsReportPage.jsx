import React, { useState } from 'react';
import { Users, Search, Download, Printer, MessageSquare, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportStudentsReportPage() {
  const [reportType, setReportType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState('Dear Parent, please note that School Bus RJ02PA2762 route timing is scheduled tomorrow at 07:15 AM. Thank you, J D International School.');

  const [students] = useState([
    { sNo: 1, admNo: '1621', srNo: '1621', name: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', fatherName: 'VIKRAM SINGH', contactNo: '8947919195', vehicle: 'RJ02PA2762', route: 'Jaisinghpura, Rampura', destination: 'Abhinandan Enclave Jaisinghpura', fare: 2550 },
    { sNo: 2, admNo: '2059', srNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', fatherName: 'RAMESH CHOUDHARY', contactNo: '6377281034', vehicle: 'RJ14PC1019', route: 'Kalwara, Ajairajpura', destination: 'Kalwara', fare: 3000 },
    { sNo: 3, admNo: '1204', srNo: '1204', name: 'AARAV SHARMA', className: 'Class I-A', fatherName: 'RAJESH SHARMA', contactNo: '9876543210', vehicle: 'RJ14PC2278', route: 'Bhankrota, Mojika, Hanging Gardens', destination: 'Bhankrota', fare: 2850 },
    { sNo: 4, admNo: '1245', srNo: '1245', name: 'BHAVYA VERMA', className: 'Class II-B', fatherName: 'MANISH VERMA', contactNo: '9829012345', vehicle: 'RJ14PC1037', route: 'Mangalam Grand City', destination: 'Mangalam Grand City', fare: 2550 },
    { sNo: 5, admNo: '1310', srNo: '1310', name: 'CHETAN MEENA', className: 'Class X-A', fatherName: 'RAMESHWAR MEENA', contactNo: '9414054321', vehicle: 'RJ40PA1179', route: 'Thikriya, Vatika', destination: 'Thikariya', fare: 3600 }
  ]);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admNo.includes(searchQuery) ||
    s.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,SR No,Student Name,Class,Father Name,Contact No,Vehicle,Route,Destination,Fare"].concat(
        filteredStudents.map(s => `${s.sNo},"${s.admNo}","${s.srNo}","${s.name}","${s.className}","${s.fatherName}","${s.contactNo}","${s.vehicle}","${s.route}","${s.destination}",${s.fare}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Students_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  const handleSendSms = (e) => {
    e.preventDefault();
    toast.success(`SMS broadcast sent to ${filteredStudents.length} transport students`);
    setIsSmsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 UAB Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Transport</span>
            <span>&gt;</span>
            <span>Reports</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Transport Students</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Transport Students
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student / vehicle..."
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
            onClick={() => setIsSmsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <MessageSquare className="w-4 h-4" /> Send SMS / Notification
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB: Report, Search) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Report</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Transport Students</option>
              <option value="Route-wise">Route-Wise Allocation</option>
              <option value="Vehicle-wise">Vehicle-Wise List</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Filtered transport students')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., ADM.NO., SR.NO., NAME, CLASS, FATHER'S NAME, CONTACT NO., VEHICLE, ROUTE, DEST./POINT, FARE) */}
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
                <th className="py-3.5 px-4">VEHICLE</th>
                <th className="py-3.5 px-4">ROUTE</th>
                <th className="py-3.5 px-4">DEST./POINT</th>
                <th className="py-3.5 px-4 text-right font-bold text-slate-900">FARE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{s.sNo}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{s.admNo}</td>
                  <td className="py-3.5 px-4 font-mono">{s.srNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{s.name}</td>
                  <td className="py-3.5 px-4">{s.className}</td>
                  <td className="py-3.5 px-4">{s.fatherName}</td>
                  <td className="py-3.5 px-4 font-mono">{s.contactNo}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{s.vehicle}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.route}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{s.destination}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">₹{s.fare.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send SMS Modal */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                SEND TRANSPORT NOTIFICATION
              </h2>
              <button onClick={() => setIsSmsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Count</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-indigo-700">
                  {filteredStudents.length} Students Selected
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSmsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
