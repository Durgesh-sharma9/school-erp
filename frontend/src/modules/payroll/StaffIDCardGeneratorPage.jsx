import React, { useState } from 'react';
import {
  Users,
  Search,
  Home,
  Printer,
  FileDown,
  CreditCard,
  CheckSquare,
  Square,
  Building
} from 'lucide-react';

const INITIAL_STAFF = [
  { id: '1', code: '101', name: 'ABHILASHA BHATT', desig: 'Principal', dept: 'ADMINISTRATIVE & MANAGEMENT', mobile: '9672992836', dob: '15/07/1982', bloodGroup: 'B+', isSelected: true },
  { id: '2', code: '102', name: 'PRITI VERMA', desig: 'Administrator', dept: 'ADMINISTRATIVE & MANAGEMENT', mobile: '9079909813', dob: '20/04/1988', bloodGroup: 'O+', isSelected: true },
  { id: '3', code: '201', name: 'MONIKA RANI VERMA', desig: 'Teacher', dept: 'TEACHING', mobile: '9870943695', dob: '10/11/1992', bloodGroup: 'A+', isSelected: true },
  { id: '4', code: '202', name: 'SUNITA KUMARI', desig: 'Teacher', dept: 'TEACHING', mobile: '9511719644', dob: '05/03/1990', bloodGroup: 'AB+', isSelected: true },
  { id: '5', code: '501', name: 'BHARAT JANGID', desig: 'Driver', dept: 'TRANSPORT', mobile: '8107187618', dob: '12/08/1985', bloodGroup: 'B+', isSelected: false },
  { id: '6', code: '502', name: 'HANSRAJ JAT', desig: 'Driver', dept: 'TRANSPORT', mobile: '9636644293', dob: '01/01/1980', bloodGroup: 'O+', isSelected: false }
];

export function StaffIDCardGeneratorPage({ onNavigate }) {
  const [data, setData] = useState(INITIAL_STAFF);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDesig, setSelectedDesig] = useState('All');
  const [format, setFormat] = useState('Multiple');
  const [showPreview, setShowPreview] = useState(false);

  const allSelected = data.every(s => s.isSelected);

  const handleToggleAll = () => {
    const next = !allSelected;
    setData(prev => prev.map(s => ({ ...s, isSelected: next })));
  };

  const handleToggleOne = (id) => {
    setData(prev => prev.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

  const filteredData = data.filter(item => {
    const matchesDept = selectedDept === 'All' || item.dept === selectedDept;
    const matchesDesig = selectedDesig === 'All' || item.desig === selectedDesig;
    return matchesDept && matchesDesig;
  });

  const selectedStaff = data.filter(s => s.isSelected);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1:1 Secondary Top Header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-slate-800 pr-3 border-r border-slate-300">
            Staff ID Card Generator
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <button onClick={() => onNavigate?.('/')} className="hover:text-indigo-600 flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
            </button>
            <span>•</span>
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate?.('/payroll-registration')}>Payroll</span>
            <span>•</span>
            <span className="text-slate-800 font-medium">Staff ID Card Generator</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700"
          >
            {showPreview ? 'Hide Preview' : 'Show ID Card Cards'}
          </button>
          <button
            onClick={handlePrint}
            className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Print ID Cards"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print ID Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Filters Card matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs items-end">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Branches</option>
                <option value="Main Campus">J D International School</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Departments</option>
                <option value="TEACHING">TEACHING</option>
                <option value="ADMINISTRATIVE & MANAGEMENT">ADMINISTRATIVE & MANAGEMENT</option>
                <option value="TRANSPORT">TRANSPORT</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Designation</label>
              <select
                value={selectedDesig}
                onChange={(e) => setSelectedDesig(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="All">All Designations</option>
                <option value="Teacher">Teacher</option>
                <option value="Principal">Principal</option>
                <option value="Administrator">Administrator</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-semibold"
              >
                <option value="Multiple">Multiple (8 per A4 sheet)</option>
                <option value="Single">Single Card View</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ({selectedStaff.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selection Bar */}
        <div className="bg-slate-100 rounded-xl border border-slate-200 p-3 px-4 flex justify-between items-center text-xs font-bold text-slate-800 print:hidden">
          <button
            onClick={handleToggleAll}
            className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800"
          >
            {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            <span>Select All Staff ({selectedStaff.length} selected for print)</span>
          </button>
          <span>Total Staff: {filteredData.length}</span>
        </div>

        {/* Table View matching UAB 1:1 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Select</th>
                  <th className="py-3 px-4 w-16 text-center">S.No.</th>
                  <th className="py-3 px-4 w-32 font-mono">Employee Code</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredData.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={s.isSelected}
                        onChange={() => handleToggleOne(s.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{s.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{s.desig}</td>
                    <td className="py-3 px-4 text-slate-500">{s.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable ID Cards Grid */}
        {(showPreview || window.matchMedia('print').matches) && (
          <div className="pt-6">
            <div className="text-sm font-bold text-slate-800 mb-3 print:hidden">
              Printed Cards Preview ({selectedStaff.length} Cards):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-2 print:gap-4">
              {selectedStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="w-full max-w-[280px] mx-auto bg-white border-2 border-indigo-900 rounded-2xl overflow-hidden shadow-md flex flex-col text-center"
                >
                  {/* Top Card Header */}
                  <div className="bg-indigo-900 text-white p-3 py-2.5">
                    <h3 className="font-extrabold text-[12px] uppercase tracking-wide">
                      J D International School
                    </h3>
                    <p className="text-[9px] text-indigo-200">Staff Identity Card • 2026-2027</p>
                  </div>

                  {/* Photo & Details */}
                  <div className="p-4 flex-1 flex flex-col items-center">
                    <div className="w-18 h-18 rounded-full border-2 border-indigo-600 p-0.5 mb-2 bg-slate-100 flex items-center justify-center font-bold text-indigo-800 text-xl shadow-xs">
                      {staff.name.charAt(0)}
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{staff.name}</h4>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mt-1">
                      {staff.desig}
                    </span>

                    <div className="w-full mt-3 pt-3 border-t border-slate-200 text-left text-[10px] space-y-1">
                      <div><span className="text-slate-400 font-medium">Emp Code:</span> <span className="font-bold text-slate-800">{staff.code}</span></div>
                      <div><span className="text-slate-400 font-medium">Department:</span> <span className="font-bold text-slate-800">{staff.dept}</span></div>
                      <div><span className="text-slate-400 font-medium">Blood Group:</span> <span className="font-bold text-red-600">{staff.bloodGroup}</span></div>
                      <div><span className="text-slate-400 font-medium">Emergency:</span> <span className="font-bold text-slate-800">{staff.mobile}</span></div>
                    </div>
                  </div>

                  {/* Card Footer Signature */}
                  <div className="bg-slate-50 border-t border-slate-200 p-2 flex justify-between items-center text-[9px] font-bold text-slate-600 px-4">
                    <span>Authorized Sign</span>
                    <span className="text-indigo-900">Principal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
