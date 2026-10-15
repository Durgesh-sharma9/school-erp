import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Home,
  X,
  Edit2,
  Trash2,
  FileDown,
  Clock
} from 'lucide-react';

const INITIAL_SHIFTS = [
  { id: '1', shiftName: 'Shift 1st', shiftCode: '100', shiftIn: '08:00', shiftOut: '14:00', hourAllow: '0.00', overTime: '0.00' },
  { id: '2', shiftName: 'Shift 2nd', shiftCode: '101', shiftIn: '14:00', shiftOut: '20:00', hourAllow: '0.00', overTime: '0.00' }
];

export function ShiftMasterPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_SHIFTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formIn, setFormIn] = useState('08:00');
  const [formOut, setFormOut] = useState('14:00');
  const [formHourAllow, setFormHourAllow] = useState('0.00');
  const [formOvertime, setFormOvertime] = useState('0.00');

  const filteredData = data.filter(item =>
    item.shiftName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.shiftCode.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCode((data.length + 100).toString());
    setFormIn('08:00');
    setFormOut('14:00');
    setFormHourAllow('0.00');
    setFormOvertime('0.00');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormName(item.shiftName);
    setFormCode(item.shiftCode);
    setFormIn(item.shiftIn);
    setFormOut(item.shiftOut);
    setFormHourAllow(item.hourAllow);
    setFormOvertime(item.overTime);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        shiftName: formName.trim(),
        shiftCode: formCode,
        shiftIn: formIn,
        shiftOut: formOut,
        hourAllow: formHourAllow,
        overTime: formOvertime
      } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        shiftName: formName.trim(),
        shiftCode: formCode || (data.length + 100).toString(),
        shiftIn: formIn,
        shiftOut: formOut,
        hourAllow: formHourAllow,
        overTime: formOvertime
      };
      setData(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Shift Name,Shift Code,Shift In,Shift Out,Hour Allow,Over Time"].concat(
        data.map((d, i) => `"${i + 1}","${d.shiftName}","${d.shiftCode}","${d.shiftIn}","${d.shiftOut}","${d.hourAllow}","${d.overTime}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shift_master.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Payroll Shift
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/shift-master')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Payroll Shift</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            title="Export CSV"
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Search Bar & FAB */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shift name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
            title="Add Shift"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Table View matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">Shift Name</th>
                  <th className="py-3 px-4 w-28 text-center">Shift Code</th>
                  <th className="py-3 px-4 w-28 text-center">Shift In</th>
                  <th className="py-3 px-4 w-28 text-center">Shift Out</th>
                  <th className="py-3 px-4 w-28 text-center">Hour Allow</th>
                  <th className="py-3 px-4 w-28 text-center">Over Time</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.shiftName}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-700">{item.shiftCode}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-emerald-700">{item.shiftIn}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-amber-700">{item.shiftOut}</td>
                    <td className="py-3.5 px-4 text-center text-slate-500">{item.hourAllow}</td>
                    <td className="py-3.5 px-4 text-center text-slate-500">{item.overTime}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-indigo-600"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setData(prev => prev.filter(d => d.id !== item.id))}
                          className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                          title="Delete"
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
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? 'Edit Shift' : 'Add Shift'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Shift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shift 1st (Morning)"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Shift Code</label>
                <input
                  type="text"
                  placeholder="e.g. 100"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Shift In Time</label>
                  <input
                    type="time"
                    value={formIn}
                    onChange={(e) => setFormIn(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Shift Out Time</label>
                  <input
                    type="time"
                    value={formOut}
                    onChange={(e) => setFormOut(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
