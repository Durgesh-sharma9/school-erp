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
  Calendar,
  User,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_ISSUES = [];

export function IssueBooksPage({ onNavigate }) {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [memberTypeFilter, setMemberTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for Issuing Book
  const [formData, setFormData] = useState({
    memberType: 'Student',
    srNo: '2062',
    memberName: 'ANSHUMAN JOSHI',
    className: 'Class VI-A',
    contactNo: '9414022222',
    bookNo: 'BK-1001',
    bookTitle: 'Mathematics Class X Exemplar',
    qty: 1,
    issueDate: new Date().toISOString().slice(0, 10),
    returnDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    remark: ''
  });

  useEffect(() => {
    fetch('/api/library/issues')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) setIssues(data.data);
      })
      .catch(() => {});
  }, []);

  const openAddModal = () => {
    setFormData({
      memberType: 'Student',
      srNo: '2062',
      memberName: 'ANSHUMAN JOSHI',
      className: 'Class VI-A',
      contactNo: '9414022222',
      bookNo: 'BK-1001',
      bookTitle: 'Mathematics Class X Exemplar',
      qty: 1,
      issueDate: new Date().toISOString().slice(0, 10),
      returnDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      remark: ''
    });
    setIsModalOpen(true);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!formData.memberName || !formData.bookTitle) {
      toast.error('Please fill all required fields');
      return;
    }

    const newIssue = {
      id: String(Date.now()),
      ...formData,
      status: 'Issued'
    };

    setIssues(prev => [newIssue, ...prev]);
    toast.success('Book issued successfully!');
    setIsModalOpen(false);

    // Save to backend
    fetch('/api/library/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue)
    }).catch(() => {});
  };

  const handleDirectReturn = (issue) => {
    if (window.confirm(`Mark "${issue.bookTitle}" returned by ${issue.memberName}?`)) {
      setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, status: 'Returned' } : i));
      toast.success('Book marked as returned successfully');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this issue record?')) {
      setIssues(prev => prev.filter(i => i.id !== id));
      toast.success('Record removed');
      fetch(`/api/library/issues/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const filteredIssues = issues.filter(i => {
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchesMemberType = memberTypeFilter === 'All' || i.memberType === memberTypeFilter;
    const matchesSearch =
      i.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.bookNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.srNo && i.srNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesMemberType && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['S.NO.', 'MEMBER TYPE', 'SR / ID', 'MEMBER NAME', 'CLASS / DEPT', 'BOOK NO', 'BOOK TITLE', 'QTY', 'ISSUE DATE', 'RETURN DATE', 'STATUS', 'CONTACT'];
    const rows = filteredIssues.map((item, idx) => [
      idx + 1,
      `"${item.memberType}"`,
      `"${item.srNo}"`,
      `"${item.memberName}"`,
      `"${item.className}"`,
      `"${item.bookNo}"`,
      `"${item.bookTitle}"`,
      item.qty,
      `"${item.issueDate}"`,
      `"${item.returnDate}"`,
      `"${item.status}"`,
      `"${item.contactNo || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Library_Issued_Books_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <span className="text-indigo-600 text-sm font-semibold">Issue Books</span>
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
            Issue Book
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search member, book title, SR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={memberTypeFilter}
              onChange={(e) => setMemberTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Members</option>
              <option value="Student">Students Only</option>
              <option value="Staff">Staff Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Issued">Active (Issued)</option>
              <option value="Overdue">Overdue Books</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <span className="text-xs text-slate-500">
            Showing {filteredIssues.length} of {issues.length} Records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 text-center w-12">S.NO.</th>
                <th className="py-3 px-3">SR / EMP NO</th>
                <th className="py-3 px-4">STUDENT / STAFF</th>
                <th className="py-3 px-3">CLASS / DEPT</th>
                <th className="py-3 px-4">BOOK TITLE (NO)</th>
                <th className="py-3 px-3 text-center">QTY</th>
                <th className="py-3 px-3">ISSUE DATE</th>
                <th className="py-3 px-3">RETURN DATE</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-3 text-center w-28">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.length > 0 ? (
                filteredIssues.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">{item.srNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{item.memberName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span className="font-medium text-indigo-600">{item.memberType}</span>
                        {item.contactNo && ` • ${item.contactNo}`}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.className}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{item.bookTitle}</div>
                      <span className="text-[11px] font-mono text-slate-400">{item.bookNo}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">{item.qty}</td>
                    <td className="py-3 px-3 text-slate-600">{item.issueDate}</td>
                    <td className="py-3 px-3">
                      <span className={item.status === 'Overdue' ? 'font-semibold text-rose-600' : 'text-slate-600'}>
                        {item.returnDate}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'Returned'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.status !== 'Returned' && (
                          <button
                            onClick={() => handleDirectReturn(item)}
                            className="px-2 py-1 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded border border-emerald-200 transition-colors"
                            title="Quick Return"
                          >
                            Return
                          </button>
                        )}
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
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No issue records match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue Book */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Issue Book to Student / Staff
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4">
              {/* Member Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Borrower Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="memberType"
                      checked={formData.memberType === 'Student'}
                      onChange={() => setFormData({ ...formData, memberType: 'Student', className: 'Class VI-A' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    Student
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="memberType"
                      checked={formData.memberType === 'Staff'}
                      onChange={() => setFormData({ ...formData, memberType: 'Staff', className: 'Teaching Staff' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    Staff Member
                  </label>
                </div>
              </div>

              {/* Member Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {formData.memberType === 'Student' ? 'Student SR No' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    value={formData.srNo}
                    onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Borrower Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.memberName}
                    onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Department</label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    value={formData.contactNo}
                    onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Book No</label>
                  <input
                    type="text"
                    value={formData.bookNo}
                    onChange={(e) => setFormData({ ...formData, bookNo: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Book Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bookTitle}
                    onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Dates & Qty */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Return Due Date</label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
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
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default IssueBooksPage;
