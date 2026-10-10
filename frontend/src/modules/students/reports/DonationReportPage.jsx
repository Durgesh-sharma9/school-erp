import React, { useState } from 'react';
import { ReportHeader } from './ReportHeader';
import { MOCK_STUDENTS } from './studentReportsData';
import { Search, IndianRupee } from 'lucide-react';

export function DonationReportPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students who have donation records
  const donationRecords = MOCK_STUDENTS.filter(s => s.donationAmount > 0);

  const filtered = donationRecords.filter(r =>
    searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const totalAmount = donationRecords.reduce((acc, r) => acc + r.donationAmount, 0);
  const totalPaid = donationRecords.reduce((acc, r) => acc + r.donationPaid, 0);
  const totalDue = donationRecords.reduce((acc, r) => acc + r.donationDue, 0);

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['S.NO.,ADM.NO,SR.NO,STUDENT NAME,FATHER\'S NAME,MOBILE NO.,TOTAL AMOUNT,TOTAL PAID,TOTAL DUE']
        .concat(
          filtered.map(
            (r, i) =>
              `${i + 1},"${r.admNo}","${r.srNo}","${r.name}","${r.fatherName}","${r.contactNo}",${r.donationAmount},${r.donationPaid},${r.donationDue}`
          )
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'donation_report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <ReportHeader
        title="Donation Report"
        onNavigate={onNavigate}
        onPrint={() => window.print()}
        onExport={handleExport}
      />

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Donation</span>
              <p className="text-xl font-bold text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase">Total Paid</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-500 uppercase">Total Due</span>
              <p className="text-xl font-bold text-rose-600 mt-1">₹{totalDue.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              !
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Total Donation Records: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search donor student..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM.NO</th>
                  <th className="py-3 px-4">SR.NO</th>
                  <th className="py-3 px-4">STUDENT NAME</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">MOBILE NO.</th>
                  <th className="py-3 px-4 text-right">TOTAL AMOUNT</th>
                  <th className="py-3 px-4 text-right">TOTAL PAID</th>
                  <th className="py-3 px-4 text-right">TOTAL DUE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.length > 0 ? (
                  filtered.map((r, i) => (
                    <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                      <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4">{r.fatherName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{r.contactNo}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">₹{r.donationAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-600">₹{r.donationPaid.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-medium text-rose-600">₹{r.donationDue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-slate-400">
                      No Record Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
