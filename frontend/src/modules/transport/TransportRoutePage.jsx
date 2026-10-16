import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Plus, Search, Download, Printer, Edit2, Trash2, X, Route as RouteIcon, Bus, ChevronRight, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportRoutePage({ initialTab = 'routes' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [viewingRouteStops, setViewingRouteStops] = useState(null);

  // --- Initial Routes & Destinations Linked Data ---
  const initialRoutes = [
    { id: 1, routeName: 'Kalwara, Ajairajpura', vehicle: 'RJ14PC1019', destinations: ['Kalwara', 'Ajairajpura', '7R Resort', 'Ajairajpura Chowk'] },
    { id: 2, routeName: 'Thikriya, Vatika', vehicle: 'RJ40PA1179', destinations: ['Thikriya', 'Vatika', 'Sidha Aangan Township'] },
    { id: 3, routeName: 'Jaisinghpura, Rampura', vehicle: 'RJ02PA2762', destinations: ['Abhinandan Enclave Jaisinghpura', 'Anukriti Jaisinghpura', 'Brahmano ki Dhani Jaisinghpura', 'Rampura'] },
    { id: 4, routeName: 'Auric City & Shub Nilay', vehicle: 'RJ20PA9932', destinations: ['Auric City Homes', 'Shubh nilay', 'Century Park'] },
    { id: 5, routeName: 'Manglam Aangan', vehicle: 'RJ14PC1037', destinations: ['Manglam Aangan', 'Dream Avenue Mangalam Grand City'] },
    { id: 6, routeName: 'Mangalam Grand City', vehicle: 'RJ14PC7878', destinations: ['Mangalam Grand City', 'Mangalam Prime', 'Mangalam Dwarika'] },
    { id: 7, routeName: 'Narsinghpura, Ramchandrapura', vehicle: 'RJ14PC5938', destinations: ['Narsinghpura', 'Ramchandrapura', 'Ringroad narsinghpura'] },
    { id: 8, routeName: 'Aasra, J K Lakshmipat University', vehicle: 'RJ19PB7511', destinations: ['Aasra', 'J K Lakshmipat University', 'Ashiyana Umang'] },
    { id: 9, routeName: 'Bhankrota, Mojika, Hanging Gardens', vehicle: 'RJ14PC2278', destinations: ['Bhankrota', 'Mojika Apartments', 'Hanging Gardens Jaisinghpura'] },
    { id: 10, routeName: 'Khatwara', vehicle: 'RJ14PE0832', destinations: ['Khatwara', 'Maliyon Ki Dhani khatwara road', 'Meeno Ki Dhani Khatwara'] }
  ];

  const initialDestinations = [
    { id: 1, destination: '7R Resort', routeName: 'Kalwara, Ajairajpura', distance: 12, fare: 2400 },
    { id: 2, destination: 'Kalwara', routeName: 'Kalwara, Ajairajpura', distance: 15, fare: 3000 },
    { id: 3, destination: 'Ajairajpura', routeName: 'Kalwara, Ajairajpura', distance: 18, fare: 3600 },
    { id: 4, destination: 'Ajairajpura Chowk', routeName: 'Kalwara, Ajairajpura', distance: 16, fare: 3200 },
    { id: 5, destination: 'Thikriya', routeName: 'Thikriya, Vatika', distance: 18, fare: 3600 },
    { id: 6, destination: 'Vatika', routeName: 'Thikriya, Vatika', distance: 18, fare: 3600 },
    { id: 7, destination: 'Sidha Aangan Township', routeName: 'Thikriya, Vatika', distance: 15, fare: 3000 },
    { id: 8, destination: 'Abhinandan Enclave Jaisinghpura', routeName: 'Jaisinghpura, Rampura', distance: 13, fare: 2550 },
    { id: 9, destination: 'Anukriti Jaisinghpura', routeName: 'Jaisinghpura, Rampura', distance: 13, fare: 2550 },
    { id: 10, destination: 'Brahmano ki Dhani Jaisinghpura', routeName: 'Jaisinghpura, Rampura', distance: 14, fare: 2700 },
    { id: 11, destination: 'Rampura', routeName: 'Jaisinghpura, Rampura', distance: 12, fare: 2400 },
    { id: 12, destination: 'Auric City Homes', routeName: 'Auric City & Shub Nilay', distance: 12, fare: 2400 },
    { id: 13, destination: 'Shubh nilay', routeName: 'Auric City & Shub Nilay', distance: 14, fare: 2700 },
    { id: 14, destination: 'Century Park', routeName: 'Auric City & Shub Nilay', distance: 12, fare: 2400 },
    { id: 15, destination: 'Manglam Aangan', routeName: 'Manglam Aangan', distance: 13, fare: 2550 },
    { id: 16, destination: 'Dream Avenue Mangalam Grand City', routeName: 'Manglam Aangan', distance: 14, fare: 2700 },
    { id: 17, destination: 'Mangalam Grand City', routeName: 'Mangalam Grand City', distance: 15, fare: 2800 },
    { id: 18, destination: 'Mangalam Prime', routeName: 'Mangalam Grand City', distance: 16, fare: 2900 },
    { id: 19, destination: 'Mangalam Dwarika', routeName: 'Mangalam Grand City', distance: 15, fare: 2800 },
    { id: 20, destination: 'Narsinghpura', routeName: 'Narsinghpura, Ramchandrapura', distance: 14, fare: 2700 },
    { id: 21, destination: 'Ramchandrapura', routeName: 'Narsinghpura, Ramchandrapura', distance: 15, fare: 2850 },
    { id: 22, destination: 'Aasra', routeName: 'Aasra, J K Lakshmipat University', distance: 14, fare: 2700 },
    { id: 23, destination: 'J K Lakshmipat University', routeName: 'Aasra, J K Lakshmipat University', distance: 14, fare: 2700 },
    { id: 24, destination: 'Ashiyana Umang', routeName: 'Aasra, J K Lakshmipat University', distance: 14, fare: 2700 },
    { id: 25, destination: 'Bhankrota', routeName: 'Bhankrota, Mojika, Hanging Gardens', distance: 14, fare: 2850 },
    { id: 26, destination: 'Mojika Apartments', routeName: 'Bhankrota, Mojika, Hanging Gardens', distance: 15, fare: 3000 },
    { id: 27, destination: 'Khatwara', routeName: 'Khatwara', distance: 16, fare: 3100 }
  ];

  const [routes, setRoutes] = useState(initialRoutes);
  const [destinations, setDestinations] = useState(initialDestinations);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [destRouteFilter, setDestRouteFilter] = useState('All');

  // Modals
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [routeForm, setRouteForm] = useState({ routeName: '', vehicle: '' });

  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destPresetRoute, setDestPresetRoute] = useState('');
  const [destForm, setDestForm] = useState({ destination: '', routeName: '', distance: '', fare: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [routesRes, destsRes] = await Promise.all([
        fetch('/api/transport/routes').then(r => r.json()).catch(() => null),
        fetch('/api/transport/destinations').then(r => r.json()).catch(() => null)
      ]);
      if (routesRes?.success && routesRes.data?.length > 0) {
        setRoutes(routesRes.data);
      }
      if (destsRes?.success && destsRes.data?.length > 0) {
        setDestinations(destsRes.data);
      }
    } catch {
      // Fallback to presets
    }
  };

  // --- Route Handlers ---
  const openAddRouteModal = () => {
    setEditingRoute(null);
    setRouteForm({ routeName: '', vehicle: 'RJ14PC1019' });
    setIsRouteModalOpen(true);
  };

  const openEditRouteModal = (r) => {
    setEditingRoute(r);
    setRouteForm({ routeName: r.routeName, vehicle: r.vehicle || 'RJ14PC1019' });
    setIsRouteModalOpen(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!routeForm.routeName.trim()) {
      toast.error('Route name is required');
      return;
    }

    try {
      if (editingRoute) {
        await fetch(`/api/transport/routes/${editingRoute.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routeForm)
        });
        setRoutes(prev => prev.map(r => r.id === editingRoute.id ? { ...r, ...routeForm } : r));
        toast.success('Route updated successfully');
      } else {
        const res = await fetch('/api/transport/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(routeForm)
        });
        const json = await res.json().catch(() => ({}));
        const newRoute = json.data || { id: Date.now(), ...routeForm, destinations: [] };
        setRoutes(prev => [...prev, newRoute]);
        toast.success('Route created successfully');
      }
      setIsRouteModalOpen(false);
    } catch {
      toast.error('Failed to save route');
    }
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await fetch(`/api/transport/routes/${id}`, { method: 'DELETE' });
      setRoutes(prev => prev.filter(r => r.id !== id));
      toast.success('Route deleted');
    } catch {
      toast.error('Failed to delete route');
    }
  };

  // --- Destination Handlers ---
  const openAddDestModal = (presetRouteName = '') => {
    setEditingDest(null);
    setDestPresetRoute(presetRouteName);
    setDestForm({
      destination: '',
      routeName: presetRouteName || routes[0]?.routeName || '',
      distance: '',
      fare: ''
    });
    setIsDestModalOpen(true);
  };

  const openEditDestModal = (d, presetRouteName = '') => {
    setEditingDest(d);
    setDestPresetRoute(presetRouteName || d.routeName || '');
    setDestForm({
      destination: d.destination,
      routeName: d.routeName || presetRouteName || '',
      distance: String(d.distance || ''),
      fare: String(d.fare || '')
    });
    setIsDestModalOpen(true);
  };

  const handleSaveDest = async (e) => {
    e.preventDefault();
    if (!destForm.destination.trim() || !destForm.fare) {
      toast.error('Destination name and fare are required');
      return;
    }

    const payload = {
      ...destForm,
      distance: Number(destForm.distance) || 0,
      fare: Number(destForm.fare) || 0
    };

    try {
      if (editingDest) {
        await fetch(`/api/transport/destinations/${editingDest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setDestinations(prev => prev.map(d => d.id === editingDest.id ? { ...d, ...payload } : d));
        toast.success('Destination updated successfully');
      } else {
        const res = await fetch('/api/transport/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        const newDest = json.data || { id: Date.now(), ...payload };
        setDestinations(prev => [...prev, newDest]);

        // Keep routes stoppage list updated
        if (payload.routeName) {
          setRoutes(prev => prev.map(r => {
            if (r.routeName === payload.routeName && !r.destinations?.includes(payload.destination)) {
              return { ...r, destinations: [...(r.destinations || []), payload.destination] };
            }
            return r;
          }));
        }

        toast.success('Destination added successfully');
      }
      setIsDestModalOpen(false);
    } catch {
      toast.error('Failed to save destination');
    }
  };

  const handleDeleteDest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await fetch(`/api/transport/destinations/${id}`, { method: 'DELETE' });
      const targetDest = destinations.find(d => d.id === id);
      setDestinations(prev => prev.filter(d => d.id !== id));
      if (targetDest?.routeName) {
        setRoutes(prev => prev.map(r => {
          if (r.routeName === targetDest.routeName) {
            return {
              ...r,
              destinations: (r.destinations || []).filter(name => name !== targetDest.destination)
            };
          }
          return r;
        }));
      }
      toast.success('Destination deleted');
    } catch {
      toast.error('Failed to delete destination');
    }
  };

  // Filtered Lists
  const filteredRoutes = routes.filter(r =>
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.vehicle && r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDestinations = destinations.filter(d => {
    const matchesRoute = destRouteFilter === 'All' || d.routeName === destRouteFilter;
    const matchesSearch =
      d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.routeName && d.routeName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRoute && matchesSearch;
  });

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === 'routes') {
      csvContent += ["S.No.,Route Name,Assigned Vehicle,Total Stoppages"].concat(
        filteredRoutes.map((r, i) => `${i + 1},"${r.routeName}","${r.vehicle || ''}",${r.destinations?.length || 0}`)
      ).join("\n");
    } else {
      csvContent += ["S.No.,Destination / Stoppage,Assigned Route,Distance (KM),Monthly Fare (₹)"].concat(
        filteredDestinations.map((d, i) => `${i + 1},"${d.destination}","${d.routeName || ''}",${d.distance || 0},${d.fare || 0}`)
      ).join("\n");
    }
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", activeTab === 'routes' ? "Transport_Routes.csv" : "Transport_Destinations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-3.5 sm:p-4 max-w-7xl mx-auto space-y-3.5">
      {/* 1:1 UAB Breadcrumb & Unified Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-0.5">
            <span>Transport</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Route & Destination Master</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <span>Transport Route & Destination Master</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Single unified hub for school bus routes, destination stoppages, and monthly fare schedules
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'routes' ? 'Search route...' : 'Search stop or route...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 w-44 outline-none"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

          {/* Dynamic Add Button */}
          <button
            onClick={activeTab === 'routes' ? openAddRouteModal : () => openAddDestModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'routes' ? 'Add Route' : 'Add Destination'}</span>
          </button>
        </div>
      </div>

      {/* Segmented Switcher & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/70">
          <button
            onClick={() => { setActiveTab('routes'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'routes'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bus Routes ({routes.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('destinations'); setSearchQuery(''); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Destinations & Stoppages ({destinations.length})</span>
          </button>
        </div>

        {/* Quick Route Filter for Destinations */}
        {activeTab === 'destinations' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Filter by Route:</span>
            <select
              value={destRouteFilter}
              onChange={(e) => setDestRouteFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Routes ({routes.length})</option>
              {routes.map(r => (
                <option key={r.id} value={r.routeName}>{r.routeName}</option>
              ))}
            </select>
          </div>
        )}

        {/* Summary Badges for Routes */}
        {activeTab === 'routes' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 text-[11px]">
              {routes.length} Active Routes
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
              {destinations.length} Stoppages Mapped
            </span>
          </div>
        )}
      </div>

      {/* --- TAB 1: BUS ROUTES TABLE --- */}
      {activeTab === 'routes' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 w-14 text-center">S.NO.</th>
                  <th className="py-2.5 px-4">ROUTE NAME</th>
                  <th className="py-2.5 px-4">MAPPED STOPPAGES / DESTINATIONS</th>
                  <th className="py-2.5 px-4">ASSIGNED VEHICLE</th>
                  <th className="py-2.5 px-4 text-right w-44">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoutes.map((r, idx) => {
                  const routeDests = destinations.filter(d => d.routeName === r.routeName);
                  return (
                    <tr
                      key={r.id || idx}
                      onClick={() => setViewingRouteStops(r)}
                      className="hover:bg-indigo-50/40 transition-colors cursor-pointer select-none"
                    >
                      <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="hover:text-indigo-600 transition-colors">{r.routeName}</span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.2 rounded font-normal">
                            {routeDests.length} {routeDests.length === 1 ? 'stop' : 'stops'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {routeDests.slice(0, 3).map((d, dIdx) => (
                            <span key={dIdx} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                              <MapPin className="w-2.5 h-2.5 text-slate-500" />
                              {d.destination}
                            </span>
                          ))}
                          {routeDests.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                              +{routeDests.length - 3} more
                            </span>
                          )}
                          {routeDests.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">No stoppages mapped</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <Bus className="w-3 h-3 text-indigo-600" />
                          {r.vehicle || 'RJ14PC1019'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingRouteStops(r)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200/60 transition cursor-pointer shadow-2xs"
                            title="View Stoppages & Fare"
                          >
                            <RouteIcon className="w-3 h-3" />
                            <span>Stoppages ({routeDests.length})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditRouteModal(r)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                            title="Edit Route"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoute(r.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Route"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: DESTINATIONS & STOPPAGES TABLE --- */}
      {activeTab === 'destinations' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4 w-16 text-center">S.NO.</th>
                  <th className="py-2.5 px-4">DESTINATION / STOPPAGE</th>
                  <th className="py-2.5 px-4">ASSIGNED ROUTE</th>
                  <th className="py-2.5 px-4 text-right">DISTANCE (KM)</th>
                  <th className="py-2.5 px-4 text-right">MONTHLY FARE (₹)</th>
                  <th className="py-2.5 px-4 text-right w-24">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDestinations.map((d, idx) => (
                  <tr key={d.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{d.destination}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded text-[11px]">
                        {d.routeName || 'General Route'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-medium text-slate-700">
                      {d.distance || 12} km
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{Number(d.fare || 2500).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditDestModal(d)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Edit Destination"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDest(d.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Destination"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600" />
                <span>{editingRoute ? 'Edit Transport Route' : 'Add New Transport Route'}</span>
              </h2>
              <button onClick={() => setIsRouteModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Route Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalwara, Ajairajpura"
                  value={routeForm.routeName}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, routeName: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Vehicle</label>
                <select
                  value={routeForm.vehicle}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, vehicle: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="RJ14PC1019">RJ14PC1019 (Bus - 42 Seats)</option>
                  <option value="RJ40PA1179">RJ40PA1179 (Bus - 42 Seats)</option>
                  <option value="RJ02PA2762">RJ02PA2762 (Bus - 42 Seats)</option>
                  <option value="RJ20PA9932">RJ20PA9932 (Bus - 50 Seats)</option>
                  <option value="RJ14PC1037">RJ14PC1037 (Bus - 42 Seats)</option>
                  <option value="RJ14PC7878">RJ14PC7878 (Bus - 45 Seats)</option>
                  <option value="RJ14PC5938">RJ14PC5938 (Bus - 45 Seats)</option>
                  <option value="RJ19PB7511">RJ19PB7511 (Bus - 45 Seats)</option>
                  <option value="RJ14PC2278">RJ14PC2278 (Bus - 40 Seats)</option>
                  <option value="RJ14PE0832">RJ14PE0832 (Bus - 42 Seats)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                >
                  {editingRoute ? 'Update Route' : 'Save Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destination Modal */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{editingDest ? 'Edit Destination' : 'Add New Destination'}</span>
                {destPresetRoute && (
                  <span className="text-[11px] font-semibold normal-case text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full ml-1">
                    Route: {destPresetRoute}
                  </span>
                )}
              </h2>
              <button onClick={() => setIsDestModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDest} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination / Stoppage Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalwara Stand"
                  value={destForm.destination}
                  onChange={(e) => setDestForm(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              {!destPresetRoute && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Belongs To Route *</label>
                  <select
                    value={destForm.routeName}
                    onChange={(e) => setDestForm(prev => ({ ...prev, routeName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">-- Select Route --</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.routeName}>{r.routeName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={destForm.distance}
                    onChange={(e) => setDestForm(prev => ({ ...prev, distance: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3000"
                    value={destForm.fare}
                    onChange={(e) => setDestForm(prev => ({ ...prev, fare: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                >
                  {editingDest ? 'Update Destination' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL: ROUTE STOPPAGES & FARE SCHEDULE --- */}
      {viewingRouteStops && (() => {
        const routeDests = destinations.filter(d => d.routeName === viewingRouteStops.routeName);
        const fares = routeDests.map(d => Number(d.fare) || 0).filter(f => f > 0);
        const minFare = fares.length ? Math.min(...fares) : 0;
        const maxFare = fares.length ? Math.max(...fares) : 0;
        const maxDistance = routeDests.length ? Math.max(...routeDests.map(d => Number(d.distance) || 0)) : 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                        {viewingRouteStops.routeName}
                      </h2>
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-indigo-700 text-[10px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        <Bus className="w-3 h-3 text-indigo-600" />
                        {viewingRouteStops.vehicle || 'RJ14PC1019'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Route Stoppages, Pick-up Points & Monthly Fare Schedule
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAddDestModal(viewingRouteStops.routeName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stoppage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingRouteStops(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Metric Highlights Strip */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/60 border-b border-slate-100 text-center py-2.5 px-4 shrink-0">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Stoppages</div>
                  <div className="text-sm font-black text-slate-800 mt-0.5">{routeDests.length} Stops</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Max Distance</div>
                  <div className="text-sm font-black text-indigo-700 font-mono mt-0.5">{maxDistance} km</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Fare Range</div>
                  <div className="text-sm font-black text-emerald-700 font-mono mt-0.5">
                    {fares.length > 0 ? (minFare === maxFare ? `₹${minFare.toLocaleString()}` : `₹${minFare.toLocaleString()} - ₹${maxFare.toLocaleString()}`) : '₹0'}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">/mo</span>
                  </div>
                </div>
              </div>

              {/* Scrollable Stoppages Table */}
              <div className="flex-1 overflow-y-auto p-4">
                {routeDests.length > 0 ? (
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-3.5 w-12 text-center">#</th>
                          <th className="py-2.5 px-4">STOPPAGE / DESTINATION</th>
                          <th className="py-2.5 px-4">DISTANCE FROM SCHOOL</th>
                          <th className="py-2.5 px-4">MONTHLY TRANSPORT FARE</th>
                          <th className="py-2.5 px-4 text-right w-24">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {routeDests.map((dest, dIdx) => (
                          <tr key={dest.id || dIdx} className="hover:bg-indigo-50/30 transition-colors">
                            <td className="py-2.5 px-3.5 text-center font-mono text-[11px] text-slate-400">
                              {dIdx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{dest.destination}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium font-mono">
                                {dest.distance || 0} km
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              <span className="text-emerald-700 font-semibold font-mono">
                                ₹{Number(dest.fare || 0).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal ml-1">/ month</span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditDestModal(dest, viewingRouteStops.routeName)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                                  title="Edit Stoppage"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDest(dest.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete Stoppage"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 px-4 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-2.5">
                      <RouteIcon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      No stoppages mapped for {viewingRouteStops.routeName}
                    </p>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Add student pick-up points and monthly fare amounts for this route.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAddDestModal(viewingRouteStops.routeName)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Stoppage</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100 shrink-0">
                <span className="text-[11px] text-slate-500">
                  Tip: All updates reflect immediately in Transport Route and Student Allocation lists.
                </span>
                <button
                  type="button"
                  onClick={() => setViewingRouteStops(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
