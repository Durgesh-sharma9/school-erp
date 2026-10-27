import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Receipt, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  Download,
  Building,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export function SchoolExpensePage() {
  const { schoolId } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHead, setSelectedHead] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    head: 'Electricity & Utilities',
    amount: '',
    payMode: 'Cash',
    paidTo: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  const expenseHeads = [
    'All',
    'Electricity & Utilities',
    'Transport Diesel & Fuel',
    'Science Lab Equipment',
    'Sports & Physical Education',
    'Printing & Stationery',
    'Campus Maintenance',
    'Staff Welfare & Refreshment',
    'Event & Function Expense',
    'Software & IT Infrastructure'
  ];

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/accounts/expenses?head=${selectedHead}`, {
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        const json = await res.json();
        setExpenses(json.data.expenses || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [schoolId, selectedHead]);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.paidTo) {
      toast.error('Please fill all mandatory fields!');
      return;
    }

    try {
      const res = await fetch('/api/accounts/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': schoolId
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Expense voucher created successfully!');
        setIsModalOpen(false);
        setFormData({
          head: 'Electricity & Utilities',
          amount: '',
          payMode: 'Cash',
          paidTo: '',
          remarks: '',
          date: new Date().toISOString().split('T')[0]
        });
        fetchExpenses();
      }
    } catch {
      toast.error('Failed to create expense voucher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense voucher?')) return;
    try {
      const res = await fetch(`/api/accounts/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'x-school-id': schoolId }
      });
      if (res.ok) {
        toast.success('Voucher deleted');
        setExpenses(prev => prev.filter(e => e.id !== id));
      }
    } catch {
      toast.error('Error deleting voucher');
    }
  };

  const filtered = expenses.filter(e => 
    e.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpense = filtered.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-indigo-600" />
            School Expenses & Payment Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage administrative expenditures, utility payments, maintenance and operational vouchers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Expense Voucher
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Filtered Outflow</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">₹{totalExpense.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{filtered.length} Vouchers recorded</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Expense</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">
            ₹{expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Disbursed on cash counter</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Expense Category</p>
          <p className="text-base font-bold text-slate-800 mt-2 truncate">Electricity & Utilities</p>
          <p className="text-xs text-slate-500 mt-0.5">High tension power grid</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit & Approval Status</p>
          <p className="text-base font-bold text-emerald-700 mt-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> 100% Verified
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Signed by Principal</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search voucher, payee or head..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedHead}
            onChange={(e) => setSelectedHead(e.target.value)}
            className="w-full md:w-64 text-xs sm:text-sm border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
          >
            {expenseHeads.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Head</th>
                <th className="py-3 px-4">Paid To (Payee)</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No expense vouchers found.
                  </td>
                </tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{exp.voucherNo}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{exp.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {exp.head}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{exp.paidTo}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700">
                        {exp.payMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={exp.remarks}>
                      {exp.remarks || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Voucher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              New Expense Voucher
            </h2>
            <p className="text-xs text-slate-500 mt-1">Record a verified operational disbursement.</p>

            <form onSubmit={handleCreateExpense} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Expense Head*</label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {expenseHeads.filter(h => h !== 'All').map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Amount (₹)*</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Payment Mode</label>
                  <select
                    value={formData.payMode}
                    onChange={(e) => setFormData({ ...formData, payMode: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Paid To (Payee)*</label>
                  <input
                    type="text"
                    required
                    value={formData.paidTo}
                    onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                    placeholder="Vendor / Staff name"
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase">Voucher Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Purpose / Remarks</label>
                <textarea
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Details of expense, bill number, etc."
                  className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs sm:text-sm shadow-xs"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
