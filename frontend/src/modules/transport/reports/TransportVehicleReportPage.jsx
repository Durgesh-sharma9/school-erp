import React, { useState } from 'react';
import { ShieldCheck, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportVehicleReportPage() {
  const [reportType, setReportType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [records] = useState([
    { sNo: 1, driverName: 'HANSRAJ JAT', vehCap: 42, vehType: 'Bus', pucDate: '2026-11-30', fitnessDate: '2026-12-15', vehicle: 'RJ14PC1019' },
    { sNo: 2, driverName: 'LALARAM', vehCap: 42, vehType: 'Bus', pucDate: '2026-11-15', fitnessDate: '2026-12-10', vehicle: 'RJ40PA1179' },
    { sNo: 3, driverName: 'SHAITAN SINGH', vehCap: 42, vehType: 'Bus', pucDate: '2026-12-31', fitnessDate: '2027-01-20', vehicle: 'RJ02PA2762' },
    { sNo: 4, driverName: 'BHARAT JANGID', vehCap: 50, vehType: 'Bus', pucDate: '2027-02-10', fitnessDate: '2027-04-15', vehicle: 'RJ20PA9932' },
    { sNo: 5, driverName: 'BABU LAL', vehCap: 42, vehType: 'Bus', pucDate: '2026-11-20', fitnessDate: '2026-12-28', vehicle: 'RJ14PC7878' },
    { sNo: 6, driverName: 'PRAKASH CHOUDHARY', vehCap: 50, vehType: 'Bus', pucDate: '2027-01-15', fitnessDate: '2026-12-05', vehicle: 'RJ14PC1037' },
    { sNo: 7, driverName: 'RAJU IPS', vehCap: 42, vehType: 'Bus', pucDate: '2026-10-30', fitnessDate: '2026-11-30', vehicle: 'RJ19PB7511' },
    { sNo: 8, driverName: 'NARESH', vehCap: 45, vehType: 'Bus', pucDate: '2026-12-15', fitnessDate: '2027-02-15', vehicle: 'RJ14PC5938' },
    { sNo: 9, driverName: 'SHYAM SUNDER', vehCap: 40, vehType: 'Bus', pucDate: '2026-10-25', fitnessDate: '2026-11-18', vehicle: 'RJ14PC2278' },
    { sNo: 10, driverName: 'RAMESH', vehCap: 42, vehType: 'Bus', pucDate: '2026-12-05', fitnessDate: '2027-03-10', vehicle: 'RJ14PE0832' }
  ]);

  const filteredRecords = records.filter(r =>
    r.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Driver Name,Vehicle Capacity,Vehicle Type,PUC Date,Fitness Date,Vehicle No"].concat(
        filteredRecords.map(r => `${r.sNo},"${r.driverName}",${r.vehCap},"${r.vehType}","${r.pucDate}","${r.fitnessDate}","${r.vehicle}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Vehicle_Compliance_Report.csv");
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
            <span>Transport</span>
            <span>&gt;</span>
            <span>Reports</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Transport Vehicle Report</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            Transport Vehicle Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vehicle Fleet Compliance, PUC & Fitness Certificate Audit Log
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver / vehicle..."
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
              <option value="All">All Registered Fleet</option>
              <option value="Valid">Fitness Valid</option>
              <option value="Expiring">Expiring Next 60 Days</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Compliance report generated')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table (1:1 with UAB: S.NO., DRIVER NAME, VEH. CAP., VEH. TYPE, PUC DATE, FITNESS DATE, VEHICLE) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">DRIVER NAME</th>
                <th className="py-3.5 px-6">VEH. CAP.</th>
                <th className="py-3.5 px-6">VEH. TYPE</th>
                <th className="py-3.5 px-6">PUC DATE</th>
                <th className="py-3.5 px-6">FITNESS DATE</th>
                <th className="py-3.5 px-6 font-bold text-slate-900">VEHICLE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800">{r.driverName}</td>
                  <td className="py-3.5 px-6 font-mono font-medium">{r.vehCap} Seats</td>
                  <td className="py-3.5 px-6">{r.vehType}</td>
                  <td className="py-3.5 px-6 font-mono">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {r.pucDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {r.fitnessDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.vehicle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
