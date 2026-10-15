import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Plus,
  Trash2,
  Edit2,
  Printer,
  FileDown,
  X,
  Layers,
  Building,
  Tag,
  DollarSign,
  Save,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_AUTHORS = [
  { id: '1', name: 'R.D. Sharma', createdAt: '2026-01-10' },
  { id: '2', name: 'H.C. Verma', createdAt: '2026-01-12' },
  { id: '3', name: 'Munshi Premchand', createdAt: '2026-01-15' },
  { id: '4', name: 'William Shakespeare', createdAt: '2026-01-20' },
  { id: '5', name: 'Dr. A.P.J. Abdul Kalam', createdAt: '2026-02-01' },
  { id: '6', name: 'Ruskin Bond', createdAt: '2026-02-10' }
];

const INITIAL_PUBLICATIONS = [
  { id: '1', name: 'NCERT New Delhi', createdAt: '2026-01-10' },
  { id: '2', name: 'Dhanpat Rai Publications', createdAt: '2026-01-12' },
  { id: '3', name: 'Bharati Bhawan', createdAt: '2026-01-15' },
  { id: '4', name: 'Oxford University Press', createdAt: '2026-01-18' },
  { id: '5', name: 'Penguin Random House', createdAt: '2026-02-05' },
  { id: '6', name: 'S. Chand Publishing', createdAt: '2026-02-12' }
];

const INITIAL_CATEGORIES = [
  { id: '1', name: 'Mathematics', createdAt: '2026-01-10' },
  { id: '2', name: 'Physics & Science', createdAt: '2026-01-10' },
  { id: '3', name: 'Literature & Fiction', createdAt: '2026-01-15' },
  { id: '4', name: 'Social Studies & History', createdAt: '2026-01-15' },
  { id: '5', name: 'General Knowledge & Biography', createdAt: '2026-02-01' },
  { id: '6', name: 'Computer Science & AI', createdAt: '2026-02-10' }
];

export function LibraryMasterPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('author'); // 'author' | 'publication' | 'category' | 'fine'
  const [authors, setAuthors] = useState(INITIAL_AUTHORS);
  const [publications, setPublications] = useState(INITIAL_PUBLICATIONS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [fineSettings, setFineSettings] = useState({
    finePerDay: 5,
    gracePeriodDays: 2,
    maxFineLimit: 200
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');

  // Fetch initial data from backend if available
  useEffect(() => {
    fetch('/api/library/authors')
      .then(res => res.json())
      .then(data => { if (data.success && data.data?.length) setAuthors(data.data); })
      .catch(() => {});

    fetch('/api/library/publications')
      .then(res => res.json())
      .then(data => { if (data.success && data.data?.length) setPublications(data.data); })
      .catch(() => {});

    fetch('/api/library/categories')
      .then(res => res.json())
      .then(data => { if (data.success && data.data?.length) setCategories(data.data); })
      .catch(() => {});

    fetch('/api/library/fine-settings')
      .then(res => res.json())
      .then(data => { if (data.success && data.data) setFineSettings(data.data); })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setItemName('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      toast.error('Please enter name');
      return;
    }

    if (activeTab === 'author') {
      if (editingItem) {
        setAuthors(prev => prev.map(a => a.id === editingItem.id ? { ...a, name: itemName } : a));
        toast.success('Author updated');
      } else {
        const newItem = { id: String(Date.now()), name: itemName, createdAt: new Date().toISOString().slice(0, 10) };
        setAuthors(prev => [...prev, newItem]);
        toast.success('Author added');
      }
    } else if (activeTab === 'publication') {
      if (editingItem) {
        setPublications(prev => prev.map(p => p.id === editingItem.id ? { ...p, name: itemName } : p));
        toast.success('Publication updated');
      } else {
        const newItem = { id: String(Date.now()), name: itemName, createdAt: new Date().toISOString().slice(0, 10) };
        setPublications(prev => [...prev, newItem]);
        toast.success('Publication added');
      }
    } else if (activeTab === 'category') {
      if (editingItem) {
        setCategories(prev => prev.map(c => c.id === editingItem.id ? { ...c, name: itemName } : c));
        toast.success('Category updated');
      } else {
        const newItem = { id: String(Date.now()), name: itemName, createdAt: new Date().toISOString().slice(0, 10) };
        setCategories(prev => [...prev, newItem]);
        toast.success('Category added');
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    if (activeTab === 'author') {
      setAuthors(prev => prev.filter(a => a.id !== id));
      toast.success('Author deleted');
    } else if (activeTab === 'publication') {
      setPublications(prev => prev.filter(p => p.id !== id));
      toast.success('Publication deleted');
    } else if (activeTab === 'category') {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted');
    }
  };

  const handleSaveFineSettings = (e) => {
    e.preventDefault();
    fetch('/api/library/fine-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fineSettings)
    }).catch(() => {});
    toast.success('Library fine settings updated successfully');
  };

  const currentList = activeTab === 'author'
    ? authors
    : activeTab === 'publication'
    ? publications
    : categories;

  const filteredList = currentList.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const title = activeTab.toUpperCase();
    const headers = ['S.NO.', `${title} NAME`, 'CREATED DATE'];
    const rows = filteredList.map((item, idx) => [
      idx + 1,
      `"${item.name}"`,
      `"${item.createdAt || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Library_${title}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/dashboard')}
            className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 text-sm font-medium">Library</span>
          <span className="text-slate-400">/</span>
          <span className="text-indigo-600 text-sm font-semibold">Library Master</span>
        </div>

        {activeTab !== 'fine' && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-600" />
              CSV Export
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              Print
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        )}
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('author'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'author'
                ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Author ({authors.length})
          </button>
          <button
            onClick={() => { setActiveTab('publication'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'publication'
                ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            Publication ({publications.length})
          </button>
          <button
            onClick={() => { setActiveTab('category'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'category'
                ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            Category ({categories.length})
          </button>
          <button
            onClick={() => { setActiveTab('fine'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'fine'
                ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Set Fine
          </button>
        </div>

        {/* Tab Content: Author, Publication, Category */}
        {activeTab !== 'fine' ? (
          <div>
            {/* Search Filter Bar */}
            <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <span className="text-xs text-slate-500">
                Showing {filteredList.length} of {currentList.length} items
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">S.NO.</th>
                    <th className="py-3 px-4">{activeTab.toUpperCase()} NAME</th>
                    <th className="py-3 px-4 w-32">CREATED DATE</th>
                    <th className="py-3 px-4 w-28 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length > 0 ? (
                    filteredList.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center font-medium text-slate-500">{index + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-slate-500">{item.createdAt || '2026-01-15'}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No records found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Tab Content: Set Fine */
          <div className="p-6 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Configure Library Late Return Fine
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Specify the default fine rules charged to students and staff when books are returned past due date.
            </p>

            <form onSubmit={handleSaveFineSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Fine Per Day (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={fineSettings.finePerDay}
                    onChange={(e) => setFineSettings({ ...fineSettings, finePerDay: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Amount charged per book for each day overdue.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fineSettings.gracePeriodDays}
                  onChange={(e) => setFineSettings({ ...fineSettings, gracePeriodDays: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Days after due date before fine starts accumulating.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Maximum Fine Limit Per Book (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={fineSettings.maxFineLimit}
                    onChange={(e) => setFineSettings({ ...fineSettings, maxFineLimit: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Fine will not exceed this cap even for extended overdue.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Fine Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-800">
                {editingItem ? 'Edit' : 'Add New'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${activeTab} name...`}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default LibraryMasterPage;
