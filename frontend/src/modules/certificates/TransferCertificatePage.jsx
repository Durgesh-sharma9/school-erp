import React, { useState } from 'react';
import { Home, Search, Printer, CheckCircle, X, AlertCircle } from 'lucide-react';
import { MOCK_STUDENTS } from '../students/reports/studentReportsData';

export function TransferCertificatePage({ onNavigate }) {
  const [tcList, setTcList] = useState([
    {
      sNo: 1,
      admNo: '1144',
      srNo: '1144',
      name: 'VANSH GUPTA',
      className: 'XI-NON-MEDICAL-A',
      fatherName: 'BHUPENDRA KUMAR GUPTA',
      tcNo: 'TC-2026/051',
      fbno: '0',
      issueDate: '2026-10-08',
      status: 'Pending'
    },
    {
      sNo: 2,
      admNo: '1448',
      srNo: '1448',
      name: 'RIDHIMA SINHA',
      className: 'II-A',
      fatherName: 'RAUNAK KUMAR SINHA',
      tcNo: 'TC-2026/052',
      fbno: '0',
      issueDate: '2026-10-09',
      status: 'Pending'
    },
    {
      sNo: 3,
      admNo: 'JD-2021-120',
      srNo: '1120',
      name: 'HARSH VARDHAN',
      className: 'VIII-A',
      fatherName: 'SURENDRA KUMAR',
      tcNo: 'TC-2026/041',
      fbno: 'FB-1120',
      issueDate: '2026-09-15',
      status: 'Issued'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTc, setSelectedTc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const filtered = tcList.filter(t =>
    !searchQuery ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fatherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssue = (sNo) => {
    setTcList(prev =>
      prev.map(t => t.sNo === sNo ? { ...t, status: 'Issued', issueDate: new Date().toISOString().split('T')[0] } : t)
    );
  };

  const handlePrint = (tc) => {
    setSelectedTc(tc);
    setShowPrintModal(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Generate TC
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <span className="text-slate-500">Student</span>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Generate TC</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              Transfer Certificates: <strong className="text-slate-900">{filtered.length}</strong>
            </span>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, adm no..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">S.NO.</th>
                  <th className="py-3 px-4">ADM.NO.</th>
                  <th className="py-3 px-4">SR.NO.</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">CLASS</th>
                  <th className="py-3 px-4">FATHER'S NAME</th>
                  <th className="py-3 px-4">TC NO.</th>
                  <th className="py-3 px-4">FBNO/M TC NO.</th>
                  <th className="py-3 px-4">ISSUE DATE</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r, i) => (
                  <tr key={r.sNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">{r.admNo}</td>
                    <td className="py-3 px-4 text-slate-600">{r.srNo}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                    <td className="py-3 px-4">{r.className}</td>
                    <td className="py-3 px-4">{r.fatherName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700">{r.tcNo || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{r.fbno || '—'}</td>
                    <td className="py-3 px-4 text-slate-600">{r.issueDate || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.status === 'Issued' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-1.5">
                      {r.status === 'Pending' ? (
                        <button
                          onClick={() => handleIssue(r.sNo)}
                          className="px-2.5 py-1 rounded bg-[#5c67f6] hover:bg-indigo-600 text-white text-[11px] font-medium shadow-2xs"
                        >
                          Approve & Issue
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePrint(r)}
                          className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-medium inline-flex items-center space-x-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintModal && selectedTc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="border-4 border-double border-slate-900 p-6 rounded-lg text-center space-y-3">
              <h2 className="text-xl font-black text-slate-900 uppercase">J D INTERNATIONAL SCHOOL</h2>
              <p className="text-xs text-slate-500">TRANSFER CERTIFICATE: {selectedTc.tcNo}</p>
              <div className="text-xs text-left space-y-2 py-4">
                <p>This certifies that <strong>{selectedTc.name}</strong>, ward of <strong>{selectedTc.fatherName}</strong>, studied in Class <strong>{selectedTc.className}</strong> and has been granted Transfer Certificate.</p>
                <p>All school dues have been cleared as of {selectedTc.issueDate}.</p>
              </div>
              <div className="pt-8 flex justify-between text-xs text-slate-600 border-t">
                <span>Class Teacher</span>
                <span>Principal</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#5c67f6] text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
