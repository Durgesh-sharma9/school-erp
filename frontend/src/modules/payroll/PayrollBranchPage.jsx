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
  Building
} from 'lucide-react';

const INITIAL_BRANCHES = [
  { id: '1', name: 'J D INTERNATIONAL SCHOOL', type: 'Secondary', address: 'Main Campus, Jaipur', phone: '9672992836' }
];

export function PayrollBranchPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_BRANCHES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Secondary');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormType('Secondary');
    setFormAddress('');
    setFormPhone('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormType(item.type);
    setFormAddress(item.address || '');
    setFormPhone(item.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        name: formName.trim(),
        type: formType,
        address: formAddress.trim(),
        phone: formPhone.trim()
      } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: formName.trim(),
        type: formType,
        address: formAddress.trim(),
        phone: formPhone.trim()
      };
      setData(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No,Branch Name,Type,Address,Phone"].concat(
        data.map((d, i) => `"${i + 1}","${d.name}","${d.type}","${d.address}","${d.phone}"`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payroll_branches.csv");
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
            Branch Master
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/payroll-branch')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Branch Master</span>
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
              placeholder="Search branch name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
            title="Add Branch"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4 w-40 text-center">Type</th>
                  <th className="py-3 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.type}
                      </span>
                    </td>
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
                {editingItem ? 'Edit Branch' : 'Add Branch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. J D INTERNATIONAL SCHOOL"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Branch Type *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
                >
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Main Campus">Main Campus</option>
                  <option value="Branch Campus">Branch Campus</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Campus address"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                />
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
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
