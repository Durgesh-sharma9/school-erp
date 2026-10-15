import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Home,
  Printer,
  FileDown,
  Building2,
  Phone,
  MapPin
} from 'lucide-react';

const INITIAL_SUPPLIERS = [
  {
    id: '1',
    name: 'GLOBAL BOOK DISTRIBUTORS',
    mobNo: '9876543210',
    city: 'Jaipur',
    state: 'Rajasthan',
    gst: '08AAAAA0000A1Z5',
    aadharNo: '1234 5678 9012',
    panNo: 'ABCDE1234F',
    address: 'Shop 14, Chaura Rasta, Jaipur',
    createdBy: 'Admin (Master)',
    updatedBy: 'Admin (Master)'
  },
  {
    id: '2',
    name: 'NAVNEET STATIONERS PVT LTD',
    mobNo: '9829012345',
    city: 'Ahmedabad',
    state: 'Gujarat',
    gst: '24BBBBB1111B1Z2',
    aadharNo: '2345 6789 0123',
    panNo: 'BCDEF2345G',
    address: 'GIDC Industrial Area, Vatva',
    createdBy: 'Principal',
    updatedBy: 'Principal'
  },
  {
    id: '3',
    name: 'ROYAL UNIFORMS & FABRICS',
    mobNo: '9414056789',
    city: 'Bhilwara',
    state: 'Rajasthan',
    gst: '08CCCCC2222C1Z9',
    aadharNo: '3456 7890 1234',
    panNo: 'CDEFG3456H',
    address: 'Textile Market, Gandhinagar, Bhilwara',
    createdBy: 'Store Incharge',
    updatedBy: 'Store Incharge'
  },
  {
    id: '4',
    name: 'CLASSIC PAPER MART',
    mobNo: '9828098765',
    city: 'Delhi',
    state: 'Delhi',
    gst: '07DDDDD3333D1Z1',
    aadharNo: '4567 8901 2345',
    panNo: 'DEFGH4567J',
    address: 'Nai Sarak, Chandni Chowk, New Delhi',
    createdBy: 'Admin (Master)',
    updatedBy: 'Admin (Master)'
  }
];

export function SupplierReportPage({ onNavigate }) {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  useEffect(() => {
    fetch('/api/stationary/suppliers')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          const mapped = data.data.map((item, idx) => ({
            id: item.id || String(idx + 1),
            name: item.supplierName || item.name || 'Supplier',
            mobNo: item.mobileNo || item.mobNo || '-',
            city: item.city || '-',
            state: item.state || '-',
            gst: item.gstNo || item.gst || '-',
            aadharNo: item.aadhaarNo || item.aadharNo || '-',
            panNo: item.panNo || '-',
            address: item.address || '-',
            createdBy: item.createdBy || 'Admin',
            updatedBy: item.updatedBy || 'Admin'
          }));
          setSuppliers(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const states = ['All', ...new Set(suppliers.map(s => s.state).filter(Boolean))];

  const filteredSuppliers = suppliers.filter(s => {
    const matchesState = selectedState === 'All' || s.state === selectedState;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobNo.includes(searchQuery) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.gst.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.panNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'S.NO.',
      'NAME.',
      'MOB NO',
      'CITY',
      'STATE',
      'GST',
      'AADHAR NO',
      'PAN NO',
      'ADDRESS',
      'CREATED BY',
      'UPDATED BY'
    ];
    const rows = filteredSuppliers.map((s, i) => [
      i + 1,
      `"${s.name}"`,
      s.mobNo,
      s.city,
      s.state,
      s.gst,
      s.aadharNo,
      s.panNo,
      `"${s.address}"`,
      s.createdBy,
      s.updatedBy
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `supplier_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen text-slate-800">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            Supplier Master Report
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span
              className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/')}
            >
              <Home className="w-3.5 h-3.5" /> Home
            </span>
            <span>/</span>
            <span
              className="hover:text-indigo-600 cursor-pointer"
              onClick={() => onNavigate && onNavigate('/stationary-reports')}
            >
              Stationary
            </span>
            <span>/</span>
            <span className="text-indigo-600 font-semibold">Supplier Report</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Export CSV"
          >
            <FileDown className="w-4 h-4" /> CSV Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition-all"
            title="Print Report"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search by supplier name, phone, city, GST, PAN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">State:</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {states.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <span className="text-xs text-slate-500 font-medium ml-2">
              Total Suppliers: <span className="font-semibold text-slate-800">{filteredSuppliers.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">S.NO.</th>
                <th className="py-2.5 px-3">NAME.</th>
                <th className="py-2.5 px-3">MOB NO</th>
                <th className="py-2.5 px-3">CITY</th>
                <th className="py-2.5 px-3">STATE</th>
                <th className="py-2.5 px-3">GST</th>
                <th className="py-2.5 px-3">AADHAR NO</th>
                <th className="py-2.5 px-3">PAN NO</th>
                <th className="py-2.5 px-3">ADDRESS</th>
                <th className="py-2.5 px-3">CREATED BY</th>
                <th className="py-2.5 px-3">UPDATED BY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400">
                    No supplier records found matching criteria
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s, index) => (
                  <tr key={s.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{index + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {s.name}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-600">{s.mobNo}</td>
                    <td className="py-2 px-3 text-slate-700">{s.city}</td>
                    <td className="py-2 px-3 text-slate-600">{s.state}</td>
                    <td className="py-2 px-3 font-mono text-indigo-600 text-[11px]">{s.gst}</td>
                    <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{s.aadharNo}</td>
                    <td className="py-2 px-3 font-mono text-slate-700 text-[11px]">{s.panNo}</td>
                    <td className="py-2 px-3 text-slate-600 max-w-xs truncate" title={s.address}>
                      {s.address}
                    </td>
                    <td className="py-2 px-3 text-slate-500">{s.createdBy}</td>
                    <td className="py-2 px-3 text-slate-500">{s.updatedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default SupplierReportPage;
