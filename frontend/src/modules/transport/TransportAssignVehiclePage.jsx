import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Download, Printer, Edit2, CheckSquare, Square, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportAssignVehiclePage() {
  const [assignedVehicles, setAssignedVehicles] = useState([
    { id: 1, type: 'Bus', number: 'RJ14PC1019', capacity: 42, driver: 'HANSRAJ JAT', conductor: 'MANJU DEVI (Nanny)', routes: ['Kalwara, Ajairajpura'] },
    { id: 2, type: 'Bus', number: 'RJ40PA1179', capacity: 42, driver: 'LALARAM', conductor: 'KAVITA SHARMA (Nanny)', routes: ['Thikriya, Vatika'] },
    { id: 3, type: 'Bus', number: 'RJ02PA2762', capacity: 42, driver: 'SHAITAN SINGH', conductor: 'SUNITA DEVI (Nanny)', routes: ['Jaisinghpura, Rampura'] },
    { id: 4, type: 'Bus', number: 'RJ20PA9932', capacity: 50, driver: 'BHARAT JANGID', conductor: 'RAMESH KUMAR (Conductor)', routes: ['Auric City & Shub Nilay'] },
    { id: 5, type: 'Bus', number: 'RJ14PC7878', capacity: 42, driver: 'BABU LAL', conductor: 'SANTOSH DEVI (Nanny)', routes: ['Manglam Aangan'] },
    { id: 6, type: 'Bus', number: 'RJ14PC1037', capacity: 50, driver: 'PRAKASH CHOUDHARY', conductor: 'MUKESH MEENA (Conductor)', routes: ['Mangalam Grand City'] },
    { id: 7, type: 'Bus', number: 'RJ19PB7511', capacity: 42, driver: 'RAJU IPS', conductor: 'GEETA BAI (Nanny)', routes: ['Narsinghpura, Ramchandrapura'] },
    { id: 8, type: 'Bus', number: 'RJ14PC5938', capacity: 45, driver: 'NARESH', conductor: 'KAMLESH DEVI (Nanny)', routes: ['Aasra, J K Lakshmipat University'] },
    { id: 9, type: 'Bus', number: 'RJ14PC2278', capacity: 40, driver: 'SHYAM SUNDER', conductor: 'DINESH VERMA (Conductor)', routes: ['Bhankrota, Mojika, Hanging Gardens'] },
    { id: 10, type: 'Bus', number: 'RJ14PE0832', capacity: 42, driver: 'RAMESH', conductor: 'PREM LATA (Nanny)', routes: ['Khatwara'] }
  ]);

  const allRoutesList = [
    'Kalwara, Ajairajpura',
    'Thikriya, Vatika',
    'Jaisinghpura, Rampura',
    'Auric City & Shub Nilay',
    'Manglam Aangan',
    'Mangalam Grand City',
    'Narsinghpura, Ramchandrapura',
    'Aasra, J K Lakshmipat University',
    'Bhankrota, Mojika, Hanging Gardens',
    'Khatwara'
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('RJ14PC1019');
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  useEffect(() => {
    fetchAssignedVehicles();
  }, []);

  const fetchAssignedVehicles = async () => {
    try {
      const res = await fetch('/api/transport/assign-vehicles');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setAssignedVehicles(data.data.map(v => ({
          id: v.id,
          type: v.type,
          number: v.vehicleNo || v.number,
          capacity: v.capacity,
          driver: v.driver,
          conductor: v.conductor || 'MANJU DEVI (Nanny)',
          routes: v.routes || []
        })));
      }
    } catch {
      // Fallback
    }
  };

  const openConfigModal = (v) => {
    const veh = v || assignedVehicles[0];
    setSelectedVehicle(veh.number);
    setSelectedRoutes(veh.routes || []);
    setIsModalOpen(true);
  };

  const handleVehicleChange = (vNumber) => {
    setSelectedVehicle(vNumber);
    const existing = assignedVehicles.find(av => av.number === vNumber);
    setSelectedRoutes(existing ? existing.routes : []);
  };

  const toggleRoute = (rName) => {
    setSelectedRoutes(prev =>
      prev.includes(rName) ? prev.filter(r => r !== rName) : [...prev, rName]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/transport/assign-vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNo: selectedVehicle, routes: selectedRoutes })
      });
      setAssignedVehicles(prev =>
        prev.map(av => av.number === selectedVehicle ? { ...av, routes: selectedRoutes } : av)
      );
      toast.success('Vehicle route assignments updated');
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save assignments');
    }
  };

  const filteredVehicles = assignedVehicles.filter(v =>
    v.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.conductor && v.conductor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    v.routes.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Type,Number,Capacity,Driver,Attendant (Nanny/Conductor),Assigned Routes"].concat(
        filteredVehicles.map((v, i) => `${i + 1},"${v.type}","${v.number}",${v.capacity},"${v.driver}","${v.conductor || ''}","${v.routes.join('; ')}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Assigned_Vehicles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1:1 UAB Breadcrumb & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <span>Transport</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Assign Vehicle</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            Transport Assign Vehicle
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle / driver / nanny..."
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
            onClick={() => openConfigModal(null)}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 transition-transform active:scale-95"
            title="Assign Vehicle to Route"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table (1:1 with UAB) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6 w-20">S.NO.</th>
                <th className="py-3.5 px-6">TYPE</th>
                <th className="py-3.5 px-6">NUMBER</th>
                <th className="py-3.5 px-6">CAPACITY</th>
                <th className="py-3.5 px-6">DRIVER & CREW (NANNY / CONDUCTOR)</th>
                <th className="py-3.5 px-6">ASSIGNED ROUTES</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((v, idx) => (
                <tr key={v.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {v.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold font-mono text-indigo-700">{v.number}</td>
                  <td className="py-3.5 px-6 font-mono font-medium">{v.capacity} Seats</td>
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{v.driver}</span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Driver
                      </span>
                    </div>
                    {v.conductor && (
                      <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                        <span className="text-slate-800 font-semibold">{v.conductor}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {v.routes.map((r, rIdx) => (
                        <span key={rIdx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => openConfigModal(v)}
                      className="px-3 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-semibold text-xs transition border border-indigo-200 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1:1 UAB ASSIGN VEHICLE Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                ASSIGN VEHICLE
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {assignedVehicles.map(av => (
                    <option key={av.id} value={av.number}>
                      {av.number} [{av.type}] [{av.capacity}] - Driver: {av.driver} {av.conductor ? `| Crew: ${av.conductor}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">Routes (Select routes covered by this vehicle)</label>
                  <span className="text-[11px] text-indigo-600 font-bold">{selectedRoutes.length} Selected</span>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 p-2">
                  {allRoutesList.map((routeName, idx) => {
                    const isChecked = selectedRoutes.includes(routeName);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRoute(routeName)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                          isChecked ? 'bg-indigo-50/80 font-semibold text-indigo-900' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-xs">{routeName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Modify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
