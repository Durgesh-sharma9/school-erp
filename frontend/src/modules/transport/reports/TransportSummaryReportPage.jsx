import React, { useState } from 'react';
import { Bus, Search, Download, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportSummaryReportPage() {
  const [selectedVehicle, setSelectedVehicle] = useState('All');
  const [selectedRoute, setSelectedRoute] = useState('All');

  const [records] = useState([
    { sNo: 1, vehicleNo: 'RJ02PA2762', capacity: 42, vehicleType: 'Bus', driver: 'SHAITAN SINGH', route: 'Jaisinghpura, Rampura', destination: 'Abhinandan Enclave Jaisinghpura', fare: 2550 },
    { sNo: 2, vehicleNo: 'RJ02PA2762', capacity: 42, vehicleType: 'Bus', driver: 'SHAITAN SINGH', route: 'Jaisinghpura, Rampura', destination: 'Anukriti Jaisinghpura', fare: 2550 },
    { sNo: 3, vehicleNo: 'RJ02PA2762', capacity: 42, vehicleType: 'Bus', driver: 'SHAITAN SINGH', route: 'Jaisinghpura, Rampura', destination: 'Brahmano ki Dhani Jaisinghpura', fare: 2700 },
    { sNo: 4, vehicleNo: 'RJ14PC1019', capacity: 42, vehicleType: 'Bus', driver: 'HANSRAJ JAT', route: 'Kalwara, Ajairajpura', destination: '7R Resort', fare: 2400 },
    { sNo: 5, vehicleNo: 'RJ14PC1019', capacity: 42, vehicleType: 'Bus', driver: 'HANSRAJ JAT', route: 'Kalwara, Ajairajpura', destination: 'Ajairajpura', fare: 3600 },
    { sNo: 6, vehicleNo: 'RJ14PC1019', capacity: 42, vehicleType: 'Bus', driver: 'HANSRAJ JAT', route: 'Kalwara, Ajairajpura', destination: 'Kalwara', fare: 3000 },
    { sNo: 7, vehicleNo: 'RJ14PC1037', capacity: 50, vehicleType: 'Bus', driver: 'PRAKASH CHOUDHARY', route: 'Mangalam Grand City', destination: 'Mangalam Grand City', fare: 2550 },
    { sNo: 8, vehicleNo: 'RJ14PC2278', capacity: 40, vehicleType: 'Bus', driver: 'SHYAM SUNDER', route: 'Bhankrota, Mojika, Hanging Gardens', destination: 'Bhankrota', fare: 2850 },
    { sNo: 9, vehicleNo: 'RJ14PC5938', capacity: 45, vehicleType: 'Bus', driver: 'NARESH', route: 'Aasra, J K Lakshmipat University', destination: 'J K Lakshmipat University', fare: 2700 },
    { sNo: 10, vehicleNo: 'RJ40PA1179', capacity: 42, vehicleType: 'Bus', driver: 'LALARAM', route: 'Thikriya, Vatika', destination: 'Thikariya', fare: 3600 }
  ]);

  const filteredRecords = records.filter(r => {
    if (selectedVehicle !== 'All' && r.vehicleNo !== selectedVehicle) return false;
    if (selectedRoute !== 'All' && r.route !== selectedRoute) return false;
    return true;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Vehicle No,Capacity,Vehicle Type,Driver,Route,Destination,Fare"].concat(
        filteredRecords.map(r => `${r.sNo},"${r.vehicleNo}",${r.capacity},"${r.vehicleType}","${r.driver}","${r.route}","${r.destination}",${r.fare}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Summary_Report.csv");
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
            <span className="text-indigo-600 font-medium">Transport Summary</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-6 h-6 text-indigo-600" />
            Transport Summary
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

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicles</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Vehicles</option>
              <option value="RJ02PA2762">RJ02PA2762</option>
              <option value="RJ14PC1019">RJ14PC1019</option>
              <option value="RJ14PC1037">RJ14PC1037</option>
              <option value="RJ14PC2278">RJ14PC2278</option>
              <option value="RJ14PC5938">RJ14PC5938</option>
              <option value="RJ40PA1179">RJ40PA1179</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Routes</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="All">All Routes</option>
              <option value="Kalwara, Ajairajpura">Kalwara, Ajairajpura</option>
              <option value="Thikriya, Vatika">Thikriya, Vatika</option>
              <option value="Jaisinghpura, Rampura">Jaisinghpura, Rampura</option>
              <option value="Mangalam Grand City">Mangalam Grand City</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => toast.success('Summary filtered')}
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
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Active Buses</div>
          <div className="text-xl font-bold text-slate-900 mt-1">10 Buses</div>
        </div>
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase">Total Seating Capacity</div>
          <div className="text-xl font-bold text-indigo-900 mt-1">437 Seats</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Operational Routes</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">10 Routes</div>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <div className="text-[11px] font-semibold text-purple-600 uppercase">Designated Stops</div>
          <div className="text-xl font-bold text-purple-900 mt-1">82 Destinations</div>
        </div>
      </div>

      {/* 1:1 Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">VEHICLE NO.</th>
                <th className="py-3.5 px-6">VEHICLE CAPACITY</th>
                <th className="py-3.5 px-6">VEHICLE TYPE</th>
                <th className="py-3.5 px-6">DRIVER</th>
                <th className="py-3.5 px-6">ROUTE</th>
                <th className="py-3.5 px-6">DESTINATION</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">FARE (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{r.sNo}</td>
                  <td className="py-3.5 px-6 font-mono font-bold text-indigo-700">{r.vehicleNo}</td>
                  <td className="py-3.5 px-6 font-mono">{r.capacity} Seats</td>
                  <td className="py-3.5 px-6">{r.vehicleType}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{r.driver}</td>
                  <td className="py-3.5 px-6 text-slate-700">{r.route}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-800">{r.destination}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-700">₹{r.fare.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
