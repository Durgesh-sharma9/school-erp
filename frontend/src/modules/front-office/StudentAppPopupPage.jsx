import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Home,
  Plus,
  Printer,
  FileDown,
  X,
  Trash2,
  Video,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_POPUPS = [
  {
    id: '1',
    title: 'Diwali Festive Greetings & Holiday Assignment',
    fromDate: '2026-10-25',
    toDate: '2026-11-05',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Wish you and your family a very Happy and Prosperous Diwali! Complete your holiday creative projects on time.',
    imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=500&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Annual Sports Day Registration Open',
    fromDate: '2026-11-01',
    toDate: '2026-11-10',
    videoUrl: '',
    description: 'Select your track & field events through student portal or meet Physical Education teacher.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=80',
    status: 'Scheduled'
  }
];

export function StudentAppPopupPage({ onNavigate }) {
  const [popups, setPopups] = useState(INITIAL_POPUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    videoUrl: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=500&auto=format&fit=crop&q=80'
  });

  const openAddModal = () => {
    setFormData({
      title: '',
      fromDate: new Date().toISOString().slice(0, 10),
      toDate: new Date().toISOString().slice(0, 10),
      videoUrl: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=500&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter title');
      return;
    }
    const newPopup = {
      id: String(Date.now()),
      status: 'Active',
      ...formData
    };
    setPopups([newPopup, ...popups]);
    toast.success('App popup banner published');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this popup banner?')) {
      setPopups(popups.filter(p => p.id !== id));
      toast.success('Popup deleted');
    }
  };

  const filteredPopups = popups.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'TITLE', 'FROM DATE', 'TO DATE', 'VIDEO URL', 'DESCRIPTION', 'STATUS'];
    const rows = filteredPopups.map((p, i) => [
      i + 1,
      `"${p.title}"`,
      `"${p.fromDate}"`,
      `"${p.toDate}"`,
      `"${p.videoUrl}"`,
      `"${p.description}"`,
      `"${p.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Student_App_Popups_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <span>Student App Popup</span>
          </h1>
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home size={13} />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-slate-400">Front Office</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">Student App Popup</span>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <FileDown size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Search Bar & FAB */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 print:hidden">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search Popup Banners..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            title="Create App Popup Banner"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <th className="py-3 px-4 w-12 text-center">S.NO.</th>
                  <th className="py-3 px-4 w-28">POPUP BANNER</th>
                  <th className="py-3 px-4">TITLE</th>
                  <th className="py-3 px-4">FROM</th>
                  <th className="py-3 px-4">TO</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-right print:hidden">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPopups.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        onClick={() => setSelectedPreview(p)}
                        className="w-20 h-12 rounded object-cover border border-slate-200 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{p.title}</div>
                      {p.videoUrl && (
                        <div className="text-[10px] text-blue-600 flex items-center gap-1 mt-0.5">
                          <Video size={10} />
                          <span>Video Attached</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.fromDate}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{p.toDate}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm truncate" title={p.description}>
                      {p.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right print:hidden">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1:1 POPUP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide">POPUP</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate}
                    onChange={e => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate}
                    onChange={e => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Banner popup headline"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Video Url (Optional)</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Message to display to students/parents when app opens..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center">
            <div className="relative">
              <img src={selectedPreview.imageUrl} alt={selectedPreview.title} className="w-full h-48 object-cover" />
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-2 text-xs">
              <h3 className="font-bold text-sm text-slate-800">{selectedPreview.title}</h3>
              <p className="text-slate-600 leading-relaxed">{selectedPreview.description}</p>
              <div className="text-[10px] text-slate-400 font-mono pt-2">
                Visible from {selectedPreview.fromDate} to {selectedPreview.toDate}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
