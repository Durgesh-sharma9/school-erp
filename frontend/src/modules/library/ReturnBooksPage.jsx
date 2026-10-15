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
  CheckCircle2,
  DollarSign,
  AlertCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_RETURNS = [
  {
    id: '1',
    studentName: 'ANSHUMAN JOSHI',
    className: 'Class VI-A',
    actualReturnDate: '2026-10-14',
    noOfBooks: 1,
    books: [
      {
        bookNo: 'BK-1001',
        bookTitle: 'Mathematics Class X Exemplar',
        issueDate: '2026-09-25',
        dueDate: '2026-10-09',
        overdueDays: 5,
        fineAmount: 25,
        discount: 5,
        paidFine: 20,
        returnStatus: 'Returned'
      }
    ],
    totalFine: 25,
    paidFine: 20
  },
  {
    id: '2',
    studentName: 'DEVENDRA SINGH',
    className: 'Class VIII-B',
    actualReturnDate: '2026-10-12',
    noOfBooks: 1,
    books: [
      {
        bookNo: 'BK-1004',
        bookTitle: 'Wings of Fire',
        issueDate: '2026-09-28',
        dueDate: '2026-10-12',
        overdueDays: 0,
        fineAmount: 0,
        discount: 0,
        paidFine: 0,
        returnStatus: 'Returned'
      }
    ],
    totalFine: 0,
    paidFine: 0
  }
];

const BORROWED_CANDIDATES = [
  {
    studentName: 'AADITYA SINGH CHOUDHARY',
    className: 'Class I-A',
    bookNo: 'BK-1001',
    bookTitle: 'Mathematics Class X Exemplar',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    overdueDays: 0,
    fine: 0
  },
  {
    studentName: 'ROHAN SHARMA',
    className: 'Class X-A',
    bookNo: 'BK-1004',
    bookTitle: 'Wings of Fire',
    issueDate: '2026-09-20',
    dueDate: '2026-10-04',
    overdueDays: 11,
    fine: 55
  },
  {
    studentName: 'PRIYA MEENA',
    className: 'Class IX-A',
    bookNo: 'BK-1005',
    bookTitle: 'Python & AI for Secondary Students',
    issueDate: '2026-10-10',
    dueDate: '2026-10-24',
    overdueDays: 0,
    fine: 0
  }
];

export function ReturnBooksPage({ onNavigate }) {
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(BORROWED_CANDIDATES[0].studentName);
  const [receiptModal, setReceiptModal] = useState(null);

  const [returnFormData, setReturnFormData] = useState({
    actualReturnDate: new Date().toISOString().slice(0, 10),
    discount: 0,
    paidFine: 0,
    remarks: ''
  });

  useEffect(() => {
    fetch('/api/library/returns')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setReturns(data.data);
      })
      .catch(() => {});
  }, []);

  const currentCandidate = BORROWED_CANDIDATES.find(c => c.studentName === selectedStudent) || BORROWED_CANDIDATES[0];

  const openAddModal = () => {
    setSelectedStudent(BORROWED_CANDIDATES[0].studentName);
    setReturnFormData({
      actualReturnDate: new Date().toISOString().slice(0, 10),
      discount: 0,
      paidFine: BORROWED_CANDIDATES[0].fine,
      remarks: ''
    });
    setIsModalOpen(true);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    const candidate = currentCandidate;
    const finalFine = Math.max(0, candidate.fine - Number(returnFormData.discount));

    const newReturn = {
      id: String(Date.now()),
      studentName: candidate.studentName,
      className: candidate.className,
      actualReturnDate: returnFormData.actualReturnDate,
      noOfBooks: 1,
      books: [
        {
          bookNo: candidate.bookNo,
          bookTitle: candidate.bookTitle,
          issueDate: candidate.issueDate,
          dueDate: candidate.dueDate,
          overdueDays: candidate.overdueDays,
          fineAmount: candidate.fine,
          discount: Number(returnFormData.discount),
          paidFine: Number(returnFormData.paidFine),
          returnStatus: 'Returned'
        }
      ],
      totalFine: candidate.fine,
      paidFine: Number(returnFormData.paidFine)
    };

    setReturns(prev => [newReturn, ...prev]);
    toast.success('Book returned successfully!');
    setIsModalOpen(false);

    // Persist to backend
    fetch('/api/library/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReturn)
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this return log?')) {
      setReturns(prev => prev.filter(r => r.id !== id));
      toast.success('Record removed');
    }
  };

  const filteredReturns = returns.filter(r =>
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['S.NO.', 'STUDENT NAME', 'CLASS', 'RETURN DATE', 'NO OF BOOKS', 'TOTAL FINE (₹)', 'PAID FINE (₹)'];
    const rows = filteredReturns.map((r, idx) => [
      idx + 1,
      `"${r.studentName}"`,
      `"${r.className}"`,
      `"${r.actualReturnDate}"`,
      r.noOfBooks,
      r.totalFine,
      r.paidFine
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Library_Book_Returns_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Return Books</span>
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
            Return Book
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
              placeholder="Search student name, class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredReturns.length} of {returns.length} Return Entries
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center w-16">S.NO.</th>
                <th className="py-3 px-4">STUDENT</th>
                <th className="py-3 px-4">CLASS</th>
                <th className="py-3 px-4">ACTUAL RETURN DATE</th>
                <th className="py-3 px-4 text-center">NO OF BOOK</th>
                <th className="py-3 px-4 text-right">TOTAL FINE (₹)</th>
                <th className="py-3 px-4 text-right">PAID FINE (₹)</th>
                <th className="py-3 px-4 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.studentName}</td>
                    <td className="py-3 px-4 text-slate-600">{r.className}</td>
                    <td className="py-3 px-4 text-slate-600">{r.actualReturnDate}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">{r.noOfBooks}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">₹{r.totalFine}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">₹{r.paidFine}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setReceiptModal(r)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
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
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No return records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Return Book */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Return Book & Calculate Fine
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Borrower (Currently Holding Books)
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                    const c = BORROWED_CANDIDATES.find(cand => cand.studentName === e.target.value);
                    if (c) {
                      setReturnFormData(prev => ({ ...prev, paidFine: c.fine }));
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  {BORROWED_CANDIDATES.map((cand, idx) => (
                    <option key={idx} value={cand.studentName}>
                      {cand.studentName} ({cand.className}) - {cand.bookTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book Details Card */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{currentCandidate.bookTitle}</span>
                  <span className="font-mono text-indigo-600 font-semibold">{currentCandidate.bookNo}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-500 pt-1 border-t border-slate-200/60">
                  <div>Issued: <strong className="text-slate-700">{currentCandidate.issueDate}</strong></div>
                  <div>Due: <strong className="text-slate-700">{currentCandidate.dueDate}</strong></div>
                  <div>Overdue Days: <strong className={currentCandidate.overdueDays > 0 ? 'text-rose-600' : 'text-emerald-600'}>{currentCandidate.overdueDays} Days</strong></div>
                  <div>Calculated Fine: <strong className="text-slate-800">₹{currentCandidate.fine}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Return Date</label>
                  <input
                    type="date"
                    value={returnFormData.actualReturnDate}
                    onChange={(e) => setReturnFormData({ ...returnFormData, actualReturnDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fine Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={returnFormData.discount}
                    onChange={(e) => {
                      const disc = Number(e.target.value);
                      const net = Math.max(0, currentCandidate.fine - disc);
                      setReturnFormData({ ...returnFormData, discount: disc, paidFine: net });
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Paid / Collected (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={returnFormData.paidFine}
                    onChange={(e) => setReturnFormData({ ...returnFormData, paidFine: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
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
                  Confirm Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Receipt Dialog */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">J D INTERNATIONAL SCHOOL</h4>
                <p className="text-[11px] text-slate-400">Library Book Return Acknowledgement</p>
              </div>
              <button onClick={() => setReceiptModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-slate-800">{receiptModal.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Class:</span>
                <span className="font-semibold text-slate-800">{receiptModal.className}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Return Date:</span>
                <span className="font-semibold text-slate-800">{receiptModal.actualReturnDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Books Returned:</span>
                <span className="font-semibold text-slate-800">{receiptModal.noOfBooks} Copy</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Fine Levied:</span>
                <span className="font-semibold text-slate-800">₹{receiptModal.totalFine}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-emerald-700 bg-emerald-50 px-2 rounded">
                <span>Fine Paid:</span>
                <span>₹{receiptModal.paidFine}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ReturnBooksPage;
