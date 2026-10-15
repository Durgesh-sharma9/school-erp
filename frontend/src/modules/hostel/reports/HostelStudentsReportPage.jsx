import React, { useState } from 'react';
import { Users, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelStudentsReportPage() {
  const [selectedHostel, setSelectedHostel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [students] = useState([
    { sNo: 1, admNo: '1621', name: 'AADITYA SINGH CHOUDHARY', className: 'Class I-A', fatherName: 'VIKRAM SINGH', contactNo: '8947919195', hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'Ground Floor', roomNo: 'A-101', bedNo: 'Bed 1', roomType: 'Double Sharing (AC)', allocatedDate: '2026-04-10' },
    { sNo: 2, admNo: '1204', name: 'AARAV SHARMA', className: 'Class I-A', fatherName: 'RAJESH SHARMA', contactNo: '9876543210', hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'Ground Floor', roomNo: 'A-101', bedNo: 'Bed 2', roomType: 'Double Sharing (AC)', allocatedDate: '2026-04-10' },
    { sNo: 3, admNo: '2059', name: 'AADHYA CHOUDHARY', className: 'Nursery - PP3+-A', fatherName: 'RAMESH CHOUDHARY', contactNo: '6377281034', hostel: 'Sarojini Girls Hostel', block: 'Main Girls Block', floor: 'Ground Floor', roomNo: 'G-201', bedNo: 'Bed 1', roomType: 'Double Sharing (AC)', allocatedDate: '2026-04-12' },
    { sNo: 4, admNo: '1310', name: 'CHETAN MEENA', className: 'Class X-A', fatherName: 'RAMESHWAR MEENA', contactNo: '9414054321', hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'Ground Floor', roomNo: 'A-102', bedNo: 'Bed 1', roomType: 'Double Sharing (AC)', allocatedDate: '2026-05-01' }
  ]);

  const filteredStudents = students.filter(s => {
    if (selectedHostel !== 'All' && s.hostel !== selectedHostel) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.admNo.includes(searchQuery)) return false;
    return true;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Adm No,Student Name,Class,Father Name,Contact No,Hostel,Block,Floor,Room No,Bed No,Room Type,Allocated Date"].concat(
        filteredStudents.map(s => `${s.sNo},"${s.admNo}","${s.name}","${s.className}","${s.fatherName}","${s.contactNo}","${s.hostel}","${s.block}","${s.floor}","${s.roomNo}","${s.bedNo}","${s.roomType}","${s.allocatedDate}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Boarders_List.csv");
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
            <span className="text-indigo-600 font-medium">Hostel Students</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Hostel Boarders & Bed Allocation Register
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student / adm..."
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
              <option value="Kalam Senior Wing">Kalam Senior Wing</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Boarders list filtered')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
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
                <th className="py-3.5 px-4">HOSTEL</th>
                <th className="py-3.5 px-4">BLOCK</th>
                <th className="py-3.5 px-4">ROOM NO.</th>
                <th className="py-3.5 px-4">BED NO.</th>
                <th className="py-3.5 px-4">ROOM TYPE</th>
                <th className="py-3.5 px-4">ALLOCATED DATE</th>
                <th className="py-3.5 px-4">GUARDIAN CONTACT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{s.sNo}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{s.admNo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{s.name}</td>
                  <td className="py-3.5 px-4">{s.className}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{s.hostel}</td>
                  <td className="py-3.5 px-4">{s.block}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{s.roomNo}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">{s.bedNo}</td>
                  <td className="py-3.5 px-4">{s.roomType}</td>
                  <td className="py-3.5 px-4 font-mono">{s.allocatedDate}</td>
                  <td className="py-3.5 px-4 font-mono">{s.contactNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
