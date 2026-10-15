import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Home,
  Plus,
  Trash2,
  Printer,
  FileDown,
  X,
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_DAMAGED = [
  {
    id: '1',
    bookNo: 'BK-1001',
    bookTitle: 'Mathematics Class X Exemplar',
    author: 'R.D. Sharma',
    publication: 'Dhanpat Rai Publications',
    damagedQty: 1,
    currentQty: 24,
    damageDate: '2026-09-28',
    reason: 'Water spill during monsoon library leakage',
    remark: 'Sent for binding restoration or scrap'
  },
  {
    id: '2',
    bookNo: 'BK-1002',
    bookTitle: 'Concepts of Physics Part 1',
    author: 'H.C. Verma',
    publication: 'Bharati Bhawan',
    damagedQty: 1,
    currentQty: 20,
    damageDate: '2026-10-02',
    reason: 'Pages 120-145 torn and spine detached',
    remark: 'Replaced with reserve stock'
  },
  {
    id: '3',
    bookNo: 'BK-1003',
    bookTitle: 'Godaan (गोदान)',
    author: 'Munshi Premchand',
    publication: 'NCERT New Delhi',
    damagedQty: 1,
    currentQty: 16,
    damageDate: '2026-10-06',
    reason: 'Cover page missing & ink stains',
    remark: 'Logged in damaged register'
  }
];

const AVAILABLE_BOOKS = [
  { bookNo: 'BK-1001', title: 'Mathematics Class X Exemplar', author: 'R.D. Sharma', publication: 'Dhanpat Rai Publications', availableQty: 24 },
  { bookNo: 'BK-1002', title: 'Concepts of Physics Part 1', author: 'H.C. Verma', publication: 'Bharati Bhawan', availableQty: 20 },
  { bookNo: 'BK-1003', title: 'Godaan (गोदान)', author: 'Munshi Premchand', publication: 'NCERT New Delhi', availableQty: 16 },
  { bookNo: 'BK-1004', title: 'Wings of Fire', author: 'Dr. A.P.J. Abdul Kalam', publication: 'Penguin Random House', availableQty: 12 },
  { bookNo: 'BK-1005', title: 'Python & AI for Secondary Students', author: 'Ruskin Bond', publication: 'Oxford University Press', availableQty: 31 }
];

export function DamagedBooksPage({ onNavigate }) {
  const [damagedList, setDamagedList] = useState(INITIAL_DAMAGED);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    selectedBookNo: AVAILABLE_BOOKS[0].bookNo,
    damagedQty: 1,
    damageDate: new Date().toISOString().slice(0, 10),
    reason: 'Torn pages and spine wear',
    remark: ''
  });

  useEffect(() => {
    fetch('/api/library/damaged-books')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setDamagedList(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setFormData({
      selectedBookNo: AVAILABLE_BOOKS[0].bookNo,
      damagedQty: 1,
      damageDate: new Date().toISOString().slice(0, 10),
      reason: 'Torn pages and spine wear',
      remark: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const bookObj = AVAILABLE_BOOKS.find(b => b.bookNo === formData.selectedBookNo) || AVAILABLE_BOOKS[0];

    const newDamaged = {
      id: String(Date.now()),
      bookNo: bookObj.bookNo,
      bookTitle: bookObj.title,
      author: bookObj.author,
      publication: bookObj.publication,
      damagedQty: Number(formData.damagedQty),
      currentQty: Math.max(0, bookObj.availableQty - Number(formData.damagedQty)),
      damageDate: formData.damageDate,
      reason: formData.reason,
      remark: formData.remark
    };

    setDamagedList(prev => [newDamaged, ...prev]);
    toast.success('Damaged book logged and stock deducted');
    setIsModalOpen(false);

    fetch('/api/library/damaged-books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDamaged)
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this damaged book log?')) {
      setDamagedList(prev => prev.filter(d => d.id !== id));
      toast.success('Record removed');
      fetch(`/api/library/damaged-books/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredDamaged = damagedList.filter(d =>
    d.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'BOOK NO', 'BOOK TITLE', 'AUTHOR', 'PUBLICATION', 'DAMAGED QTY', 'CURRENT STOCK', 'DAMAGE DATE', 'REASON', 'REMARK'];
    const rows = filteredDamaged.map((d, idx) => [
      idx + 1,
      `"${d.bookNo}"`,
      `"${d.bookTitle}"`,
      `"${d.author}"`,
      `"${d.publication}"`,
      d.damagedQty,
      d.currentQty,
      `"${d.damageDate}"`,
      `"${d.reason}"`,
      `"${d.remark || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Library_Damaged_Books_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Breadcrumb & Actions */}
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
          <span className="text-indigo-600 text-sm font-semibold">Damaged Books</span>
        </div>

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
            Add Damaged Book
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, book no, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredDamaged.length} of {damagedList.length} Damaged Entries
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">BOOK NO</th>
                <th className="py-3 px-4">BOOK TITLE</th>
                <th className="py-3 px-3">AUTHOR</th>
                <th className="py-3 px-3">PUBLICATION</th>
                <th className="py-3 px-3 text-center">DAMAGED QTY</th>
                <th className="py-3 px-3 text-center">CURRENT STOCK</th>
                <th className="py-3 px-3">DAMAGE DATE</th>
                <th className="py-3 px-4">REASON & REMARK</th>
                <th className="py-3 px-3 text-center w-20">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDamaged.length > 0 ? (
                filteredDamaged.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {d.bookNo}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{d.bookTitle}</td>
                    <td className="py-3 px-3 text-slate-600">{d.author}</td>
                    <td className="py-3 px-3 text-slate-500">{d.publication}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">{d.damagedQty}</td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700">{d.currentQty}</td>
                    <td className="py-3 px-3 text-slate-600">{d.damageDate}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{d.reason}</div>
                      {d.remark && <div className="text-[11px] text-slate-400">{d.remark}</div>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No damaged book logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Damaged Book */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Log Damaged Book
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Book <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.selectedBookNo}
                  onChange={(e) => setFormData({ ...formData, selectedBookNo: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  {AVAILABLE_BOOKS.map((b, idx) => (
                    <option key={idx} value={b.bookNo}>
                      {b.bookNo} - {b.title} ({b.author})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Damaged Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.damagedQty}
                    onChange={(e) => setFormData({ ...formData, damagedQty: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Damage Date</label>
                  <input
                    type="date"
                    value={formData.damageDate}
                    onChange={(e) => setFormData({ ...formData, damageDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Damage Reason</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Torn pages and spine wear">Torn pages and spine wear</option>
                  <option value="Water spill / Rain leakage damage">Water spill / Rain leakage damage</option>
                  <option value="Cover page missing / detached">Cover page missing / detached</option>
                  <option value="Ink and pen markings across pages">Ink and pen markings across pages</option>
                  <option value="Total structural loss / Written-off">Total structural loss / Written-off</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remark / Action Taken</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sent for rebinding or written off..."
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all"
                >
                  Log Damaged Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default DamagedBooksPage;
