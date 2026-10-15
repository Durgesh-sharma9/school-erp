import React, { useState, useEffect } from 'react';
import { Bus, Plus, Search, Download, Printer, Edit2, Trash2, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportVehiclePage() {
  const [vehicles, setVehicles] = useState([
    { id: 1, vehicleType: 'Bus', vehicleNo: 'RJ02PA2762', capacity: 42, driver: 'SHAITAN SINGH', pucValidity: '2026-12-31', fitnessValidity: '2027-01-20', trackNo: 'GPS-RJ02-998' },
    { id: 2, vehicleType: 'Bus', vehicleNo: 'RJ14PC1019', capacity: 42, driver: 'HANSRAJ JAT', pucValidity: '2026-11-30', fitnessValidity: '2026-12-15', trackNo: 'GPS-RJ14-101' },
    { id: 3, vehicleType: 'Bus', vehicleNo: 'RJ14PC1037', capacity: 50, driver: 'PRAKASH CHOUDHARY', pucValidity: '2027-01-15', fitnessValidity: '2026-12-05', trackNo: 'GPS-RJ14-103' },
    { id: 4, vehicleType: 'Bus', vehicleNo: 'RJ14PC2278', capacity: 40, driver: 'SHYAM SUNDER', pucValidity: '2026-10-25', fitnessValidity: '2026-11-18', trackNo: 'GPS-RJ14-227' },
    { id: 5, vehicleType: 'Bus', vehicleNo: 'RJ14PC5938', capacity: 45, driver: 'NARESH', pucValidity: '2026-12-15', fitnessValidity: '2027-02-15', trackNo: 'GPS-RJ14-593' },
    { id: 6, vehicleType: 'Bus', vehicleNo: 'RJ14PC7878', capacity: 42, driver: 'BABU LAL', pucValidity: '2026-11-20', fitnessValidity: '2026-12-28', trackNo: 'GPS-RJ14-787' },
    { id: 7, vehicleType: 'Bus', vehicleNo: 'RJ14PE0832', capacity: 42, driver: 'RAMESH', pucValidity: '2026-12-05', fitnessValidity: '2027-03-10', trackNo: 'GPS-RJ14-083' },
    { id: 8, vehicleType: 'Bus', vehicleNo: 'RJ19PB7511', capacity: 42, driver: 'RAJU IPS', pucValidity: '2026-10-30', fitnessValidity: '2026-11-30', trackNo: 'GPS-RJ19-751' },
    { id: 9, vehicleType: 'Bus', vehicleNo: 'RJ20PA9932', capacity: 50, driver: 'BHARAT JANGID', pucValidity: '2027-02-10', fitnessValidity: '2027-04-15', trackNo: 'GPS-RJ20-993' },
    { id: 10, vehicleType: 'Bus', vehicleNo: 'RJ40PA1179', capacity: 42, driver: 'LALARAM', pucValidity: '2026-11-15', fitnessValidity: '2026-12-10', trackNo: 'GPS-RJ40-117' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    vehicleType: 'Bus',
    vehicleNo: '',
    driver: 'HANSRAJ JAT',
    capacity: 42,
    pucValidity: '',
    regCertValidity: '',
    fitnessValidity: '',
    insuranceValidity: '',
    permitValidity: '',
    trackNo: '',
    trackApi: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/transport/vehicles');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setVehicles(data.data);
      }
    } catch {
      // Fallback to local state
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleType: 'Bus',
      vehicleNo: '',
      driver: 'HANSRAJ JAT',
      capacity: 42,
      pucValidity: '',
      regCertValidity: '',
      fitnessValidity: '',
      insuranceValidity: '',
      permitValidity: '',
      trackNo: '',
      trackApi: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setFormData({ ...v });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNo) {
      toast.error('Vehicle No is required');
      return;
    }

    try {
      if (editingVehicle) {
        await fetch(`/api/transport/vehicles/${editingVehicle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...formData } : v));
        toast.success('Vehicle updated successfully');
      } else {
        const res = await fetch('/api/transport/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        const created = json.data || { id: Date.now(), ...formData };
        setVehicles(prev => [...prev, created]);
        toast.success('Vehicle added successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await fetch(`/api/transport/vehicles/${id}`, { method: 'DELETE' });
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Vehicle deleted');
    } catch {
      toast.error('Failed to delete vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Vehicle Type,Vehicle No.,Capacity,Driver,PUC Validity,Fitness Validity,Track No."].concat(
        filteredVehicles.map((v, i) => `${i + 1},"${v.vehicleType}","${v.vehicleNo}",${v.capacity},"${v.driver || ''}","${v.pucValidity || ''}","${v.fitnessValidity || ''}","${v.trackNo || ''}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Vehicles.csv");
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
            <span className="text-indigo-600 font-medium">Transport Vehicle</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bus className="w-6 h-6 text-indigo-600" />
            Transport Vehicle
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Pill */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle / driver..."
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

          {/* UAB Exact Mini FAB Button */}
          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 transition-transform active:scale-95"
            title="Add Vehicle"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Fleet Size</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{vehicles.length} Vehicles</div>
        </div>
        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase">Total Seating Capacity</div>
          <div className="text-xl font-bold text-indigo-900 mt-1">{vehicles.reduce((acc, v) => acc + (v.capacity || 0), 0)} Seats</div>
        </div>
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase">Active Drivers</div>
          <div className="text-xl font-bold text-emerald-900 mt-1">10 Assigned</div>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          <div className="text-[11px] font-semibold text-purple-600 uppercase">GPS Tracking</div>
          <div className="text-xl font-bold text-purple-900 mt-1">100% Enabled</div>
        </div>
      </div>

      {/* 1:1 Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">S.NO.</th>
                <th className="py-3.5 px-6">VEHICLE TYPE</th>
                <th className="py-3.5 px-6">VEHICLE NO.</th>
                <th className="py-3.5 px-6">CAPACITY</th>
                <th className="py-3.5 px-6">DRIVER</th>
                <th className="py-3.5 px-6">GPS / TRACK NO.</th>
                <th className="py-3.5 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((v, idx) => (
                <tr key={v.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {v.vehicleType}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold font-mono text-indigo-700">{v.vehicleNo}</td>
                  <td className="py-3.5 px-6 font-mono font-medium">{v.capacity} Seats</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-800">{v.driver || '-'}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">{v.trackNo || 'Active'}</td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(v)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Vehicle"
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

      {/* 1:1 UAB TRANSPORT VEHICLE Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {editingVehicle ? 'EDIT TRANSPORT VEHICLE' : 'TRANSPORT VEHICLE'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Van">Van</option>
                    <option value="Cab">Cab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RJ14PC1019"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Driver</label>
                  <select
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="HANSRAJ JAT">HANSRAJ JAT</option>
                    <option value="LALARAM">LALARAM</option>
                    <option value="SHAITAN SINGH">SHAITAN SINGH</option>
                    <option value="BHARAT JANGID">BHARAT JANGID</option>
                    <option value="BABU LAL">BABU LAL</option>
                    <option value="PRAKASH CHOUDHARY">PRAKASH CHOUDHARY</option>
                    <option value="RAJU IPS">RAJU IPS</option>
                    <option value="NARESH">NARESH</option>
                    <option value="SHYAM SUNDER">SHYAM SUNDER</option>
                    <option value="RAMESH">RAMESH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Capacity *</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PUC Validity Date</label>
                  <input
                    type="date"
                    value={formData.pucValidity}
                    onChange={(e) => setFormData({ ...formData, pucValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reg. Certificate Validity Date</label>
                  <input
                    type="date"
                    value={formData.regCertValidity}
                    onChange={(e) => setFormData({ ...formData, regCertValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fitness Validity Date</label>
                  <input
                    type="date"
                    value={formData.fitnessValidity}
                    onChange={(e) => setFormData({ ...formData, fitnessValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Validity Date</label>
                  <input
                    type="date"
                    value={formData.insuranceValidity}
                    onChange={(e) => setFormData({ ...formData, insuranceValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Permit Validity Date</label>
                  <input
                    type="date"
                    value={formData.permitValidity}
                    onChange={(e) => setFormData({ ...formData, permitValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Track No.</label>
                  <input
                    type="text"
                    placeholder="e.g. GPS-RJ14-101"
                    value={formData.trackNo}
                    onChange={(e) => setFormData({ ...formData, trackNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Track API</label>
                  <input
                    type="text"
                    placeholder="https://gps.tracking.in/api/v1/..."
                    value={formData.trackApi}
                    onChange={(e) => setFormData({ ...formData, trackApi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  {editingVehicle ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
