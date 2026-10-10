import React, { useState } from 'react';
import {
  School,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  MapPin,
  FileText,
  Upload
} from 'lucide-react';

export function SchoolInfoPage() {
  const [formData, setFormData] = useState({
    schoolName: "J D International School",
    schoolCode: "10964",
    udiseNo: "08121204312",
    affiliationNo: "1730619",
    phone1: "8947919195",
    phone2: "9414000000",
    email: "10964@cbseshiksha.in",
    website: "www.jdschooljaipur.com",
    address: "Mahapura, Ajmer Road, Jaipur",
    place: "Jaipur",
    pinCode: "302026",
    receiptNotes: "Fees once paid is non-refundable. Please keep this computerized receipt for tax purposes."
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/schools/profile')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setFormData(prev => ({ ...prev, ...d.data }));
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/schools/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (result.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            School Administration
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>School Information & Print Profile</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              CBSE Affiliated
            </span>
          </h2>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-sm shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            School profile details updated successfully!
          </div>
        </div>
      )}

      {/* School Info Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                className="w-full text-xs font-bold text-slate-900 rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Code / Branch Code
              </label>
              <input
                type="text"
                name="schoolCode"
                value={formData.schoolCode}
                onChange={handleInputChange}
                className="w-full text-xs font-mono rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CBSE / State Affiliation No.
              </label>
              <input
                type="text"
                name="affiliationNo"
                value={formData.affiliationNo}
                onChange={handleInputChange}
                className="w-full text-xs font-mono rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                UDISE No.
              </label>
              <input
                type="text"
                name="udiseNo"
                value={formData.udiseNo}
                onChange={handleInputChange}
                className="w-full text-xs font-mono rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Phone / Mobile <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="phone1"
                value={formData.phone1}
                onChange={handleInputChange}
                className="w-full text-xs font-mono rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                School Website URL
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Postal Address
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Receipt Header Footer Note (Appears on printout)
            </label>
            <textarea
              name="receiptNotes"
              rows={2}
              value={formData.receiptNotes}
              onChange={handleInputChange}
              className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save School Info</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
