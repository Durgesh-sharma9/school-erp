import React, { useState, useEffect } from 'react';
import { Route, Plus, Search, Download, Printer, Edit2, CheckSquare, Square, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportAssignRoutesPage() {
  const [assignedRoutes, setAssignedRoutes] = useState([
    { id: 1, routeName: 'Kalwara, Ajairajpura', destinations: ['7R Resort', 'Ajairajpura', 'Kalwara', 'Ganatpura Kalwara'] },
    { id: 2, routeName: 'Thikriya, Vatika', destinations: ['Thikariya', 'Vatika', 'Sidha Aangan Township'] },
    { id: 3, routeName: 'Jaisinghpura, Rampura', destinations: ['Abhinandan Enclave Jaisinghpura', 'Anukriti Jaisinghpura', 'Brahmano ki Dhani Jaisinghpura', 'Rampura'] },
    { id: 4, routeName: 'Auric City & Shub Nilay', destinations: ['Auric City Homes', 'Shubh nilay', 'Century Park'] },
    { id: 5, routeName: 'Manglam Aangan', destinations: ['Manglam Aangan', 'Dream Avenue Mangalam Grand City'] },
    { id: 6, routeName: 'Mangalam Grand City', destinations: ['Mangalam Grand City', 'Mangalam Prime', 'Mangalam Dwarika'] },
    { id: 7, routeName: 'Narsinghpura, Ramchandrapura', destinations: ['Narsinghpura', 'Ramchandrapura', 'Ringroad narsinghpura'] },
    { id: 8, routeName: 'Aasra, J K Lakshmipat University', destinations: ['Aasra', 'J K Lakshmipat University', 'Ashiyana Umang'] },
    { id: 9, routeName: 'Bhankrota, Mojika, Hanging Gardens', destinations: ['Bhankrota', 'Mojika Apartments', 'Hanging Gardens Jaisinghpura'] },
    { id: 10, routeName: 'Khatwara', destinations: ['Khatwara', 'Maliyon Ki Dhani khatwara road', 'Meeno Ki Dhani Khatwara'] }
  ]);

  const allDestinationsList = [
    { name: '7R Resort', fare: 2400 },
    { name: 'Aashirwad Hotel', fare: 2700 },
    { name: 'Aasra', fare: 2700 },
    { name: 'Abhinandan Enclave Jaisinghpura', fare: 2550 },
    { name: 'Ajairajpura', fare: 3600 },
    { name: 'Anantara', fare: 2550 },
    { name: 'Anukriti Jaisinghpura', fare: 2550 },
    { name: 'Ashiyana Umang', fare: 2700 },
    { name: 'Asian World School', fare: 2550 },
    { name: 'Auric City Homes', fare: 2400 },
    { name: 'Auric Villas Jaisinghpura', fare: 2550 },
    { name: 'Bachpan School', fare: 2550 },
    { name: 'Bhambhoriya', fare: 3000 },
    { name: 'Bhankrota', fare: 2850 },
    { name: 'Brahmano ki Dhani Jaisinghpura', fare: 2700 },
    { name: 'Century Park', fare: 2400 },
    { name: 'Kalwara', fare: 3000 },
    { name: 'Thikariya', fare: 3600 },
    { name: 'Vatika', fare: 3600 },
    { name: 'J K Lakshmipat University', fare: 2700 },
    { name: 'Shubh nilay', fare: 2400 },
    { name: 'Manglam Aangan', fare: 2550 },
    { name: 'Mangalam Grand City', fare: 2550 },
    { name: 'Narsinghpura', fare: 2850 },
    { name: 'Khatwara', fare: 2550 }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('Kalwara, Ajairajpura');
  const [selectedDests, setSelectedDests] = useState([]);

  useEffect(() => {
    fetchAssignedRoutes();
  }, []);

  const fetchAssignedRoutes = async () => {
    try {
      const res = await fetch('/api/transport/assign-routes');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setAssignedRoutes(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openConfigModal = (r) => {
    const route = r || assignedRoutes[0];
    setSelectedRoute(route.routeName);
    setSelectedDests(route.destinations || []);
    setIsModalOpen(true);
  };

  const handleRouteChange = (rName) => {
    setSelectedRoute(rName);
    const existing = assignedRoutes.find(ar => ar.routeName === rName);
    setSelectedDests(existing ? existing.destinations : []);
  };

  const toggleDestination = (destName) => {
    setSelectedDests(prev =>
      prev.includes(destName) ? prev.filter(d => d !== destName) : [...prev, destName]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/transport/assign-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeName: selectedRoute, destinations: selectedDests })
      });
      setAssignedRoutes(prev =>
        prev.map(ar => ar.routeName === selectedRoute ? { ...ar, destinations: selectedDests } : ar)
      );
      toast.success('Route destinations updated successfully');
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save route assignments');
    }
  };

  const filteredRoutes = assignedRoutes.filter(r =>
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Assigned Routes,Stops / Destinations Count,Destinations"].concat(
        filteredRoutes.map((r, i) => `${i + 1},"${r.routeName}",${r.destinations.length},"${r.destinations.join('; ')}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Assigned_Routes.csv");
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
            <span className="text-indigo-600 font-medium">Assign Routes</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Route className="w-6 h-6 text-indigo-600" />
            Transport Assign Routes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assigned routes..."
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
            title="Assign Route Destinations"
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
                <th className="py-3.5 px-6">ASSIGNED ROUTES</th>
                <th className="py-3.5 px-6">ATTACHED DESTINATIONS / STOPS</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoutes.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800 whitespace-nowrap">
                    {r.routeName}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-xl">
                      {r.destinations.map((d, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => openConfigModal(r)}
                      className="px-3 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 font-semibold text-xs transition border border-indigo-200 inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modify Stops
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1:1 UAB ASSIGN ROUTES Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                ASSIGN ROUTES
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Route</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {assignedRoutes.map(ar => (
                    <option key={ar.id} value={ar.routeName}>{ar.routeName}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">Destinations (Select stops for this route)</label>
                  <span className="text-[11px] text-indigo-600 font-bold">{selectedDests.length} Selected</span>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 p-2">
                  {allDestinationsList.map((dest, idx) => {
                    const isChecked = selectedDests.includes(dest.name);
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDestination(dest.name)}
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
                          <span className="text-xs">{dest.name}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{dest.fare}/-</span>
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
