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
  FileText,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_BOOKS = [
  {
    id: '1',
    bookNo: 'BK-1001',
    barcode: '890123450001',
    title: 'Mathematics Class X Exemplar',
    author: 'R.D. Sharma',
    publication: 'Dhanpat Rai Publications',
    category: 'Mathematics',
    edition: '2026 Revised',
    volume: 'Vol 1',
    className: 'Class X',
    subject: 'Mathematics',
    openQty: 30,
    reOrderLevel: 5,
    rate: 450,
    remark: 'Standard curriculum reference textbook',
    eBooks: { pdfUrl: 'https://ncert.nic.in/exemplar/math-10.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 24,
    issuedQty: 5,
    damagedQty: 1
  },
  {
    id: '2',
    bookNo: 'BK-1002',
    barcode: '890123450002',
    title: 'Concepts of Physics Part 1',
    author: 'H.C. Verma',
    publication: 'Bharati Bhawan',
    category: 'Physics & Science',
    edition: '2025-26',
    volume: 'Part I',
    className: 'Class XI',
    subject: 'Physics',
    openQty: 25,
    reOrderLevel: 5,
    rate: 520,
    remark: 'Recommended for Senior Secondary physics',
    eBooks: { pdfUrl: 'https://bharatibhawan.in/hcv-part1.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 20,
    issuedQty: 4,
    damagedQty: 1
  },
  {
    id: '3',
    bookNo: 'BK-1003',
    barcode: '890123450003',
    title: 'Godaan (गोदान)',
    author: 'Munshi Premchand',
    publication: 'NCERT New Delhi',
    category: 'Literature & Fiction',
    edition: '2024 Classic Edition',
    volume: 'Complete',
    className: 'Class IX',
    subject: 'Hindi',
    openQty: 20,
    reOrderLevel: 4,
    rate: 180,
    remark: 'Hindi literature syllabus novel',
    eBooks: { pdfUrl: 'https://ncert.nic.in/hindi/godaan.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 16,
    issuedQty: 3,
    damagedQty: 1
  },
  {
    id: '4',
    bookNo: 'BK-1004',
    barcode: '890123450004',
    title: 'Wings of Fire',
    author: 'Dr. A.P.J. Abdul Kalam',
    publication: 'Penguin Random House',
    category: 'General Knowledge & Biography',
    edition: 'Special Illustrated',
    volume: 'Autobiography',
    className: 'Class VIII',
    subject: 'General Reading',
    openQty: 15,
    reOrderLevel: 3,
    rate: 299,
    remark: 'Inspirational biography for library reading corner',
    eBooks: { pdfUrl: 'https://penguin.co.in/wings-of-fire.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 12,
    issuedQty: 3,
    damagedQty: 0
  },
  {
    id: '5',
    bookNo: 'BK-1005',
    barcode: '890123450005',
    title: 'Python & AI for Secondary Students',
    author: 'Ruskin Bond',
    publication: 'Oxford University Press',
    category: 'Computer Science & AI',
    edition: '2026 Edition 2.0',
    volume: 'Vol 1',
    className: 'Class X',
    subject: 'Computer Applications',
    openQty: 35,
    reOrderLevel: 6,
    rate: 380,
    remark: 'Skill subject textbook with practical code labs',
    eBooks: { pdfUrl: 'https://oup.com/secondary/cs-ai.pdf', audioUrl: '', videoUrl: '' },
    availableQty: 31,
    issuedQty: 4,
    damagedQty: 0
  }
];

export function AddBooksPage({ onNavigate }) {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewBook, setViewBook] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    bookNo: '',
    barcode: '',
    title: '',
    author: 'R.D. Sharma',
    publication: 'Dhanpat Rai Publications',
    category: 'Mathematics',
    edition: '2026',
    volume: 'Vol 1',
    className: 'Class X',
    subject: 'Mathematics',
    openQty: 10,
    reOrderLevel: 3,
    rate: 350,
    remark: '',
    pdfUrl: '',
    audioUrl: '',
    videoUrl: ''
  });

  useEffect(() => {
    fetch('/api/library/books')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setBooks(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      bookNo: `BK-${1000 + books.length + 1}`,
      barcode: `89012345${String(books.length + 1).padStart(4, '0')}`,
      title: '',
      author: 'R.D. Sharma',
      publication: 'NCERT New Delhi',
      category: 'Mathematics',
      edition: '2026',
      volume: 'Vol 1',
      className: 'Class X',
      subject: 'Mathematics',
      openQty: 10,
      reOrderLevel: 3,
      rate: 350,
      remark: '',
      pdfUrl: '',
      audioUrl: '',
      videoUrl: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingId(book.id);
    setFormData({
      bookNo: book.bookNo,
      barcode: book.barcode,
      title: book.title,
      author: book.author,
      publication: book.publication,
      category: book.category,
      edition: book.edition,
      volume: book.volume,
      className: book.className,
      subject: book.subject,
      openQty: book.openQty,
      reOrderLevel: book.reOrderLevel,
      rate: book.rate,
      remark: book.remark || '',
      pdfUrl: book.eBooks?.pdfUrl || '',
      audioUrl: book.eBooks?.audioUrl || '',
      videoUrl: book.eBooks?.videoUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.bookNo || !formData.title) {
      toast.error('Book No and Title are required');
      return;
    }

    const payload = {
      bookNo: formData.bookNo,
      barcode: formData.barcode,
      title: formData.title,
      author: formData.author,
      publication: formData.publication,
      category: formData.category,
      edition: formData.edition,
      volume: formData.volume,
      className: formData.className,
      subject: formData.subject,
      openQty: Number(formData.openQty),
      reOrderLevel: Number(formData.reOrderLevel),
      rate: Number(formData.rate),
      remark: formData.remark,
      eBooks: {
        pdfUrl: formData.pdfUrl,
        audioUrl: formData.audioUrl,
        videoUrl: formData.videoUrl
      }
    };

    if (editingId) {
      setBooks(prev => prev.map(b => b.id === editingId ? {
        ...b,
        ...payload,
        availableQty: Number(formData.openQty) - (b.issuedQty || 0) - (b.damagedQty || 0)
      } : b));
      toast.success('Book details updated successfully');
    } else {
      const newBook = {
        id: String(Date.now()),
        ...payload,
        availableQty: Number(formData.openQty),
        issuedQty: 0,
        damagedQty: 0
      };
      setBooks(prev => [newBook, ...prev]);
      toast.success('Book registered successfully into catalog');

      // Also post to backend
      fetch('/api/library/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book from the catalog?')) {
      setBooks(prev => prev.filter(b => b.id !== id));
      toast.success('Book removed from catalog');
      fetch(`/api/library/books/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const categories = ['All', ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(b => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.publication.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCopies = books.reduce((sum, b) => sum + (Number(b.openQty) || 0), 0);
  const totalAvailable = books.reduce((sum, b) => sum + (Number(b.availableQty) || 0), 0);
  const totalIssued = books.reduce((sum, b) => sum + (Number(b.issuedQty) || 0), 0);
  const totalDamaged = books.reduce((sum, b) => sum + (Number(b.damagedQty) || 0), 0);

  const exportCSV = () => {
    const headers = ['S.NO.', 'BOOK NO', 'BARCODE', 'BOOK TITLE', 'AUTHOR', 'PUBLICATION', 'CATEGORY', 'EDITION', 'CLASS', 'SUBJECT', 'TOTAL QTY', 'AVAILABLE', 'ISSUED', 'RATE'];
    const rows = filteredBooks.map((b, idx) => [
      idx + 1,
      `"${b.bookNo}"`,
      `"${b.barcode}"`,
      `"${b.title}"`,
      `"${b.author}"`,
      `"${b.publication}"`,
      `"${b.category}"`,
      `"${b.edition}"`,
      `"${b.className}"`,
      `"${b.subject}"`,
      b.openQty,
      b.availableQty,
      b.issuedQty,
      b.rate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Library_Books_Catalog_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-800">
      {/* Top Breadcrumb */}
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
          <span className="text-indigo-600 text-sm font-semibold">Add Books</span>
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
            Add Book
          </button>
        </div>
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Catalog Titles</p>
            <h4 className="text-xl font-bold text-slate-800 mt-1">{books.length}</h4>
            <span className="text-[11px] text-slate-400">({totalCopies} total copies)</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Available In Library</p>
            <h4 className="text-xl font-bold text-emerald-600 mt-1">{totalAvailable}</h4>
            <span className="text-[11px] text-emerald-600 font-medium">Ready to issue</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Currently Issued</p>
            <h4 className="text-xl font-bold text-amber-600 mt-1">{totalIssued}</h4>
            <span className="text-[11px] text-slate-400">With students/staff</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Damaged / Written-off</p>
            <h4 className="text-xl font-bold text-rose-600 mt-1">{totalDamaged}</h4>
            <span className="text-[11px] text-rose-500 font-medium">Loss log</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Catalog Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search title, book no, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredBooks.length} of {books.length} Books
          </span>
        </div>

        {/* Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">BOOK NO</th>
                <th className="py-3 px-4">BOOK TITLE</th>
                <th className="py-3 px-3">AUTHOR</th>
                <th className="py-3 px-3">PUBLICATION</th>
                <th className="py-3 px-3">CATEGORY</th>
                <th className="py-3 px-3">EDITION</th>
                <th className="py-3 px-3 text-center">STOCK (AVAIL/TOTAL)</th>
                <th className="py-3 px-3 text-right">RATE (₹)</th>
                <th className="py-3 px-3 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px]">
                        {b.bookNo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{b.title}</div>
                      <div className="text-[11px] text-slate-400">Class: {b.className} • {b.subject}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{b.author}</td>
                    <td className="py-3 px-3 text-slate-500">{b.publication}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[11px]">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{b.edition}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold text-emerald-600">{b.availableQty}</span>
                      <span className="text-slate-400"> / {b.openQty}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800">
                      ₹{b.rate}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewBook(b)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No books found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                {editingId ? 'Edit Book Details' : 'Book Master - Add New Book'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Book No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bookNo}
                    onChange={(e) => setFormData({ ...formData, bookNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics & Science">Physics & Science</option>
                    <option value="Literature & Fiction">Literature & Fiction</option>
                    <option value="Social Studies & History">Social Studies & History</option>
                    <option value="General Knowledge & Biography">General Knowledge & Biography</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Book Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics Class X Exemplar"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication</label>
                  <input
                    type="text"
                    value={formData.publication}
                    onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Edition</label>
                  <input
                    type="text"
                    value={formData.edition}
                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Volume</label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Opening Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.openQty}
                    onChange={(e) => setFormData({ ...formData, openQty: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Re-order Level</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reOrderLevel}
                    onChange={(e) => setFormData({ ...formData, reOrderLevel: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rate / Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Digital E-Books Section */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Digital Material Links (E-Book / Media)</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="url"
                    placeholder="PDF Document URL"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Audio Lesson URL"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                  <input
                    type="url"
                    placeholder="Video Lecture URL"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remark</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or shelf location..."
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
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                >
                  {editingId ? 'Update Book' : 'Register Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book View Details Drawer / Modal */}
      {viewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Book Information: {viewBook.bookNo}
              </h3>
              <button
                onClick={() => setViewBook(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs">
              <div className="text-base font-bold text-slate-800">{viewBook.title}</div>
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100">
                <div><span className="text-slate-400">Author:</span> <strong className="text-slate-700">{viewBook.author}</strong></div>
                <div><span className="text-slate-400">Publisher:</span> <strong className="text-slate-700">{viewBook.publication}</strong></div>
                <div><span className="text-slate-400">Category:</span> <strong className="text-slate-700">{viewBook.category}</strong></div>
                <div><span className="text-slate-400">Edition / Vol:</span> <strong className="text-slate-700">{viewBook.edition} ({viewBook.volume})</strong></div>
                <div><span className="text-slate-400">Class & Subject:</span> <strong className="text-slate-700">{viewBook.className} • {viewBook.subject}</strong></div>
                <div><span className="text-slate-400">Unit Price:</span> <strong className="text-slate-700">₹{viewBook.rate}</strong></div>
              </div>

              <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-100 grid grid-cols-3 text-center">
                <div>
                  <div className="text-[11px] text-indigo-600">Total Copies</div>
                  <div className="text-base font-bold text-indigo-900">{viewBook.openQty}</div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-600">Available</div>
                  <div className="text-base font-bold text-emerald-700">{viewBook.availableQty}</div>
                </div>
                <div>
                  <div className="text-[11px] text-amber-600">Issued</div>
                  <div className="text-base font-bold text-amber-700">{viewBook.issuedQty}</div>
                </div>
              </div>

              {viewBook.eBooks?.pdfUrl && (
                <div className="pt-2">
                  <a
                    href={viewBook.eBooks.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Attached E-Book (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AddBooksPage;
