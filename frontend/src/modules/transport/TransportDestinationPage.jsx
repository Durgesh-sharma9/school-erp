import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Search, Download, Printer, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportDestinationPage() {
  const [destinations, setDestinations] = useState([
    { id: 1, destination: '7R Resort', distance: 12, fare: 2400 },
    { id: 2, destination: 'Aashirwad Hotel', distance: 14, fare: 2700 },
    { id: 3, destination: 'Aasra', distance: 14, fare: 2700 },
    { id: 4, destination: 'Abhinandan Enclave Jaisinghpura', distance: 13, fare: 2550 },
    { id: 5, destination: 'Ajairajpura', distance: 18, fare: 3600 },
    { id: 6, destination: 'Anantara', distance: 13, fare: 2550 },
    { id: 7, destination: 'Anukriti Jaisinghpura', distance: 13, fare: 2550 },
    { id: 8, destination: 'Ashiyana Umang', distance: 14, fare: 2700 },
    { id: 9, destination: 'Asian World School', distance: 13, fare: 2550 },
    { id: 10, destination: 'Auric City Homes', distance: 12, fare: 2400 },
    { id: 11, destination: 'Auric Villas Jaisinghpura', distance: 13, fare: 2550 },
    { id: 12, destination: 'Bachpan School', distance: 13, fare: 2550 },
    { id: 13, destination: 'Bhambhoriya', distance: 15, fare: 3000 },
    { id: 14, destination: 'Bhankrota', distance: 14, fare: 2850 },
    { id: 15, destination: 'Brahmano ki Dhani Jaisinghpura', distance: 14, fare: 2700 },
    { id: 16, destination: 'Century Park', distance: 12, fare: 2400 },
    { id: 17, destination: 'Kalwara', distance: 15, fare: 3000 },
    { id: 18, destination: 'Thikariya', distance: 18, fare: 3600 },
    { id: 19, destination: 'Vatika', distance: 18, fare: 3600 },
    { id: 20, destination: 'J K Lakshmipat University', distance: 14, fare: 2700 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [formData, setFormData] = useState({ destination: '', distance: '', fare: '' });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await fetch('/api/transport/destinations');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setDestinations(data.data);
      }
    } catch {
      // Fallback
    }
  };

  const openAddModal = () => {
    setEditingDest(null);
    setFormData({ destination: '', distance: '', fare: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (d) => {
    setEditingDest(d);
    setFormData({ destination: d.destination, distance: d.distance, fare: d.fare });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.destination.trim() || !formData.fare) {
      toast.error('Destination and Fare are required');
      return;
    }

    try {
      if (editingDest) {
        await fetch(`/api/transport/destinations/${editingDest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setDestinations(prev => prev.map(d => d.id === editingDest.id ? { ...d, ...formData, distance: Number(formData.distance), fare: Number(formData.fare) } : d));
        toast.success('Destination updated successfully');
      } else {
        const res = await fetch('/api/transport/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), ...formData, distance: Number(formData.distance), fare: Number(formData.fare) };
        setDestinations(prev => [...prev, created]);
        toast.success('Destination created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save destination');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await fetch(`/api/transport/destinations/${id}`, { method: 'DELETE' });
      setDestinations(prev => prev.filter(d => d.id !== id));
      toast.success('Destination deleted');
    } catch {
      toast.error('Failed to delete destination');
    }
  };

  const filteredDestinations = destinations.filter(d =>
    d.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Destination,Distance (Km),Fare (₹)"].concat(
        filteredDestinations.map((d, i) => `${i + 1},"${d.destination}",${d.distance},${d.fare}`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Destinations.csv");
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
            <span className="text-indigo-600 font-medium">Transport Destination</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-indigo-600" />
            Transport Destination
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination..."
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
            title="Add Destination"
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
                <th className="py-3.5 px-6">DESTINATION</th>
                <th className="py-3.5 px-6 text-center">DISTANCE (KM)</th>
                <th className="py-3.5 px-6 text-right font-bold text-slate-900">FARE (₹)</th>
                <th className="py-3.5 px-6 text-right w-32">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDestinations.map((d, idx) => (
                <tr key={d.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {d.destination}
                  </td>
                  <td className="py-3.5 px-6 text-center font-mono">{d.distance ? `${d.distance} km` : '-'}</td>
                  <td className="py-3.5 px-6 text-right font-mono font-bold text-indigo-700">₹{d.fare?.toLocaleString()}</td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(d)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Destination"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
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

      {/* 1:1 UAB TRANSPORT DESTINATION Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                TRANSPORT DESTINATION
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7R Resort"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Distance (Km)</label>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fare (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2400"
                  value={formData.fare}
                  onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
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
                  {editingDest ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
