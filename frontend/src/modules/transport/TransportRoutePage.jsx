import React, { useState, useEffect } from 'react';
import { Navigation, Plus, Search, Download, Printer, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportRoutePage() {
  const [routes, setRoutes] = useState([
    { id: 1, routeName: 'Kalwara, Ajairajpura' },
    { id: 2, routeName: 'Thikriya, Vatika' },
    { id: 3, routeName: 'Jaisinghpura, Rampura' },
    { id: 4, routeName: 'Auric City & Shub Nilay' },
    { id: 5, routeName: 'Manglam Aangan' },
    { id: 6, routeName: 'Mangalam Grand City' },
    { id: 7, routeName: 'Narsinghpura, Ramchandrapura' },
    { id: 8, routeName: 'Aasra, J K Lakshmipat University' },
    { id: 9, routeName: 'Bhankrota, Mojika, Hanging Gardens' },
    { id: 10, routeName: 'Khatwara' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [routeNameInput, setRouteNameInput] = useState('');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/transport/routes');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setRoutes(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingRoute(null);
    setRouteNameInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingRoute(r);
    setRouteNameInput(r.routeName);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!routeNameInput.trim()) {
      toast.error('Route name is required');
      return;
    }

    try {
      if (editingRoute) {
        await fetch(`/api/transport/routes/${editingRoute.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routeName: routeNameInput })
        });
        setRoutes(prev => prev.map(r => r.id === editingRoute.id ? { ...r, routeName: routeNameInput } : r));
        toast.success('Route updated successfully');
      } else {
        const res = await fetch('/api/transport/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ routeName: routeNameInput })
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), routeName: routeNameInput };
        setRoutes(prev => [...prev, created]);
        toast.success('Route created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save route');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await fetch(`/api/transport/routes/${id}`, { method: 'DELETE' });
      setRoutes(prev => prev.filter(r => r.id !== id));
      toast.success('Route deleted');
    } catch {
      toast.error('Failed to delete route');
    }
  };

  const filteredRoutes = routes.filter(r =>
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Route Name"].concat(
        filteredRoutes.map((r, i) => `${i + 1},"${r.routeName}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Routes.csv");
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
            <span className="text-indigo-600 font-medium">Transport Route</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Navigation className="w-6 h-6 text-indigo-600" />
            Transport Route
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search route..."
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
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 transition-transform active:scale-95"
            title="Add Route"
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
                <th className="py-3.5 px-6 w-24">S.NO.</th>
                <th className="py-3.5 px-6">ROUTE NAME</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoutes.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800 flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                    {r.routeName}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(r)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Route"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Route"
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

      {/* 1:1 UAB TRANSPORT ROUTE Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                TRANSPORT ROUTE
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Transport Route *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kalwara, Ajairajpura"
                  value={routeNameInput}
                  onChange={(e) => setRouteNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
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
                  {editingRoute ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
