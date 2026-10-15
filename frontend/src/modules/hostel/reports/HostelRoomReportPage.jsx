import React, { useState } from 'react';
import { Bed, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function HostelRoomReportPage() {
  const [selectedHostel, setSelectedHostel] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedFloor, setSelectedFloor] = useState('All');

  const [rooms] = useState([
    { sNo: 1, hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'Ground Floor', roomNo: 'A-101', roomType: 'Double Sharing (AC)', capacity: 2, occupied: 2, vacant: 0, status: 'Full' },
    { sNo: 2, hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'Ground Floor', roomNo: 'A-102', roomType: 'Double Sharing (AC)', capacity: 2, occupied: 1, vacant: 1, status: 'Partially Occupied' },
    { sNo: 3, hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'First Floor', roomNo: 'A-103', roomType: 'Triple Sharing (Non-AC)', capacity: 3, occupied: 3, vacant: 0, status: 'Full' },
    { sNo: 4, hostel: 'Tagore Boys Hostel', block: 'A-Block (Junior)', floor: 'First Floor', roomNo: 'A-104', roomType: 'Single Bed (AC)', capacity: 1, occupied: 0, vacant: 1, status: 'Vacant' },
    { sNo: 5, hostel: 'Sarojini Girls Hostel', block: 'Main Girls Block', floor: 'Ground Floor', roomNo: 'G-201', roomType: 'Double Sharing (AC)', capacity: 2, occupied: 2, vacant: 0, status: 'Full' },
    { sNo: 6, hostel: 'Sarojini Girls Hostel', block: 'Main Girls Block', floor: 'First Floor', roomNo: 'G-202', roomType: 'Single Bed (AC)', capacity: 1, occupied: 1, vacant: 0, status: 'Full' }
  ]);

  const filteredRooms = rooms.filter(r => {
    if (selectedHostel !== 'All' && r.hostel !== selectedHostel) return false;
    if (selectedBlock !== 'All' && r.block !== selectedBlock) return false;
    if (selectedFloor !== 'All' && r.floor !== selectedFloor) return false;
    return true;
  });

  const totalCap = filteredRooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOcc = filteredRooms.reduce((sum, r) => sum + r.occupied, 0);
  const totalVac = filteredRooms.reduce((sum, r) => sum + r.vacant, 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Hostel,Block,Floor,Room No,Room Type,Capacity,Occupied,Vacant,Status"].concat(
        filteredRooms.map(r => `${r.sNo},"${r.hostel}","${r.block}","${r.floor}","${r.roomNo}","${r.roomType}",${r.capacity},${r.occupied},${r.vacant},"${r.status}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Hostel_Room_Report.csv");
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
            <span className="text-indigo-600 font-medium">Hostel Report</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bed className="w-6 h-6 text-indigo-600" />
            Hostel Room List & Occupancy Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Bar (1:1 with UAB: Hostel, Block, Select Floor, Search) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Block</label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Blocks</option>
              <option value="A-Block (Junior)">A-Block (Junior)</option>
              <option value="B-Block (Senior)">B-Block (Senior)</option>
              <option value="Main Girls Block">Main Girls Block</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Floors</option>
              <option value="Ground Floor">Ground Floor</option>
              <option value="First Floor">First Floor</option>
              <option value="Second Floor">Second Floor</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Hostel report filtered')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Rooms</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{filteredRooms.length} Rooms</div>
        </div>
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase">Total Bed Capacity</div>
          <div className="text-xl font-bold text-indigo-900 mt-1">{totalCap} Beds</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Occupied Beds</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">{totalOcc} Beds</div>
        </div>
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="text-[11px] font-semibold text-rose-600 uppercase">Available Vacancies</div>
          <div className="text-xl font-bold text-rose-900 mt-1">{totalVac} Beds Free</div>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., HOSTEL, BLOCK, FLOOR, ROOM NO., ROOM TYPE, CAPACITY, OCCUPIED, VACANT, STATUS) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">HOSTEL</th>
                <th className="py-3.5 px-6">BLOCK</th>
                <th className="py-3.5 px-6">FLOOR</th>
                <th className="py-3.5 px-6">ROOM NO.</th>
                <th className="py-3.5 px-6">ROOM TYPE</th>
                <th className="py-3.5 px-6 text-center">CAPACITY</th>
                <th className="py-3.5 px-6 text-center">OCCUPIED</th>
                <th className="py-3.5 px-6 text-center">VACANT</th>
                <th className="py-3.5 px-6 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{r.hostel}</td>
                  <td className="py-3.5 px-6 text-slate-700">{r.block}</td>
                  <td className="py-3.5 px-6 text-slate-600">{r.floor}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.roomNo}</td>
                  <td className="py-3.5 px-6">{r.roomType}</td>
                  <td className="py-3.5 px-6 text-center font-mono font-bold">{r.capacity}</td>
                  <td className="py-3.5 px-6 text-center font-mono text-emerald-700 font-bold">{r.occupied}</td>
                  <td className="py-3.5 px-6 text-center font-mono text-rose-600 font-bold">{r.vacant}</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      r.status === 'Full' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      r.status === 'Partially Occupied' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {r.status}
                    </span>
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
