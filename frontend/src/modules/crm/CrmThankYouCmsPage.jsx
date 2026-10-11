import React, { useState } from 'react';
import {
  Home,
  Save,
  CheckCircle,
  Eye,
  Sparkles,
  Phone,
  Mail,
  Clock,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DEFAULT_CMS_BANNER } from './crmData';

export function CrmThankYouCmsPage({ onNavigate }) {
  const [cmsConfig, setCmsConfig] = useState(DEFAULT_CMS_BANNER);
  const [newFeature, setNewFeature] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCmsConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setCmsConfig(prev => ({
      ...prev,
      featuresList: [...prev.featuresList, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    setCmsConfig(prev => ({
      ...prev,
      featuresList: prev.featuresList.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      alert('Enquiry banner and CMS settings saved successfully!');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Top Breadcrumb Toolbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <h1 className="text-base md:text-lg font-semibold text-slate-800">
            Enquiry Banner & Thank You Page CMS
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pl-3 border-l border-slate-200">
            <button onClick={() => onNavigate && onNavigate('/')} className="hover:text-indigo-600">
              <Home className="w-3.5 h-3.5" />
            </button>
            <span>•</span>
            <button onClick={() => onNavigate && onNavigate('/crm')} className="hover:text-indigo-600">
              CRM
            </button>
            <span>•</span>
            <span className="text-indigo-600 font-medium">Enquiry Banner</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="h-9 px-3.5 rounded-lg bg-[#5c67f6] hover:bg-indigo-600 text-white flex items-center space-x-1.5 shadow-xs text-xs font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Editor Form */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Banner & Confirmation Content</h3>
            <p className="text-xs text-slate-500">Configure what parents see immediately after submitting an admission enquiry.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Headline Text*</label>
              <input
                type="text"
                required
                name="headline"
                value={cmsConfig.headline}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Subheading / Season Notice</label>
              <input
                type="text"
                name="subheading"
                value={cmsConfig.subheading}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Thank You Confirmation Message*</label>
              <textarea
                rows="3"
                required
                name="thankYouMessage"
                value={cmsConfig.thankYouMessage}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Helpline Phone</label>
                <input
                  type="text"
                  name="helplinePhone"
                  value={cmsConfig.helplinePhone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Helpline Email</label>
                <input
                  type="email"
                  name="helplineEmail"
                  value={cmsConfig.helplineEmail}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Office Hours / Timings</label>
              <input
                type="text"
                name="officeTimings"
                value={cmsConfig.officeTimings}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Features / USPs List */}
            <div className="pt-2 border-t">
              <label className="block text-slate-700 font-semibold mb-1">School Highlights / USPs</label>
              <div className="space-y-1.5 mb-2">
                {cmsConfig.featuresList.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="text-slate-800 font-medium">• {f}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="text-rose-500 hover:text-rose-700 font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g. 100% CBSE Board Results 2026"
                  className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900"
                >
                  Add USP
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#5c67f6] hover:bg-indigo-600 text-white rounded-lg font-semibold shadow-xs"
              >
                Save CMS Configuration
              </button>
            </div>
          </form>
        </div>

        {/* Live Interactive Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                Live Confirmation Page Preview
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                Responsive View
              </span>
            </div>

            {/* Rendered Thank You Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{cmsConfig.headline}</h3>
                <p className="text-xs text-slate-500 mt-1">{cmsConfig.subheading}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
                {cmsConfig.thankYouMessage}
              </div>

              {/* Highlights */}
              <div className="text-left bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 space-y-2">
                <span className="font-bold text-xs text-indigo-900 block">Why J D International School?</span>
                <ul className="space-y-1 text-[11px] text-indigo-800">
                  {cmsConfig.featuresList.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact helpline */}
              <div className="border-t pt-3 space-y-1 text-xs text-slate-600">
                <p><strong>Admission Helpline:</strong> {cmsConfig.helplinePhone}</p>
                <p className="text-[11px] text-slate-500"><strong>Office Hours:</strong> {cmsConfig.officeTimings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
