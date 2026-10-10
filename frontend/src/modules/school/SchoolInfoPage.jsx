import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  ChevronDown,
  Upload,
  Globe,
  Share2,
  MapPin,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

export function SchoolInfoPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedSection, setExpandedSection] = useState('logo'); // 'logo', 'social', 'range', 'superAdmin'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    name: 'J D International School',
    school_code: '10964',
    udies_no: '08121204312',
    school_affl_no: '1730619',
    school_category: 'Private',
    school_type: 'Senior Secondary',
    place: 'Jaipur',
    address: 'Mahapura, Ajmer Road',
    postal_code: '302026',
    phone_num1: '8947919195',
    phone_num2: '',
    fax: '',
    website: 'www.jdschooljaipur.com',
    email: '10964@cbseshiksha.in',
    board: 'C.B.S.E',
    tc_renewed_upto: '',
    students_min_age: '0',
    name_tc_title: '',
    fee_ac_closing_sms: '',
    school_tag_line_1: '',
    school_tag_line_2: '',
    fee_receipt_notes: 'Fees once paid is non-refundable. Please keep this computerized receipt for tax purposes.',
    fee_remainder_popup_from: 'Inactive',
    fee_remainder_popup_msg: '',
    youtube_page: 'https://youtube.com/@jdinternationalschool9765',
    facebook_page: 'https://www.facebook.com/DirectorNeha',
    twitter_page: 'https://www.instagram.com/j_d_international_school/',
    app_fee_url: '',
    app_win_url: '',
    app_andr_url: '',
    app_ios_url: '',
    latitude: '1.0000000',
    longitude: '1.0000000',
    attend_range: '0',
    paytm_merchant_id: '',
    paytm_merchant_key: '',
    study_material_url: '',
    logoUrl: 'https://temp.erichost.app/assets/schools/jdisjr_221/school/1_school_photo_1766831297_f7516d5fc58b9af84fb1.jpg'
  });

  const logoUploadSlots = [
    { id: 'school_logo', label: 'School Logo' },
    { id: 'board_logo', label: 'Board Logo' },
    { id: 'principal_sig', label: 'Principal Sig.' },
    { id: 'vice_principal_sig', label: 'Vice-Principal Sig.' },
    { id: 'headmistress_sig', label: 'Headmistress Sig.' },
    { id: 'manager_sig', label: 'Manager Sig.' },
    { id: 'exam_incharge_sig', label: 'Exam Incharge Sig.' },
    { id: 'school_stamp', label: 'School Stamp' },
    { id: 'fee_qr_img', label: 'Fee Qr Image' },
    { id: 'header_img', label: 'Header Image' },
    { id: 'fee_report_header', label: 'Fee Report Header Image' },
    { id: 'tc_header', label: 'Tc Header Image' },
    { id: 'report_card_header', label: 'Report Card Header Img' },
    { id: 'report_card_horizontal', label: 'Report Card Header Horizontal Img' }
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/schools/profile')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setFormData(prev => ({
            ...prev,
            name: d.data.schoolName || prev.name,
            school_code: d.data.schoolCode || prev.school_code,
            udies_no: d.data.udiseNo || prev.udies_no,
            school_affl_no: d.data.affiliationNo || prev.school_affl_no,
            phone_num1: d.data.phone1 || prev.phone_num1,
            email: d.data.email || prev.email,
            website: d.data.website || prev.website,
            address: d.data.address || prev.address,
            logoUrl: d.data.logoUrl || prev.logoUrl
          }));
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e, slotId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const fd = new FormData();
      fd.append('logo', file);

      const res = await fetch('http://localhost:5000/api/schools/upload-logo', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        if (slotId === 'school_logo') {
          setFormData(prev => ({ ...prev, logoUrl: data.data.url }));
        }
        alert(`${slotId} uploaded successfully to ImageKit!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/schools/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: formData.name,
          schoolCode: formData.school_code,
          udiseNo: formData.udies_no,
          affiliationNo: formData.school_affl_no,
          phone1: formData.phone_num1,
          email: formData.email,
          website: formData.website,
          address: formData.address,
          place: formData.place,
          pinCode: formData.postal_code,
          receiptNotes: formData.fee_receipt_notes,
          logoUrl: formData.logoUrl
        })
      });
      const data = await res.json();
      if (data.success) {
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
    <div className="bg-[#f3f4f6] min-h-screen p-3 space-y-3">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-800 text-sm">School</span>
          <span>&bull;</span>
          <span className="text-gray-400">School &bull; Edit School</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            School information and branding updated successfully!
          </div>
        </div>
      )}

      {/* Main Container Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Card 1: Core School Info (5-Column Grid 1:1 UAB) */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
            School General Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {/* School Name */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            {/* School Code */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Code</label>
              <input
                type="text"
                name="school_code"
                value={formData.school_code}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* UDISE No. */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">UDISE No.</label>
              <input
                type="text"
                name="udies_no"
                value={formData.udies_no}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* School Affi. No. */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Affi. No.</label>
              <input
                type="text"
                name="school_affl_no"
                value={formData.school_affl_no}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* School Category */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Category</label>
              <select
                name="school_category"
                value={formData.school_category}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Private">Private</option>
                <option value="Government">Government</option>
                <option value="Semi-Government">Semi-Government</option>
              </select>
            </div>

            {/* School Type */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Type</label>
              <select
                name="school_type"
                value={formData.school_type}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Senior Secondary">Senior Secondary</option>
                <option value="Secondary">Secondary</option>
                <option value="Middle">Middle</option>
                <option value="Primary">Primary</option>
              </select>
            </div>

            {/* Place */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Place</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Pin Code</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Phone No. 1 */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Phone No. 1*</label>
              <input
                type="text"
                name="phone_num1"
                value={formData.phone_num1}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Phone No. 2 */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Phone No. 2</label>
              <input
                type="text"
                name="phone_num2"
                value={formData.phone_num2}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Fax */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fax</label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* School Board */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Board</label>
              <select
                name="board"
                value={formData.board}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                <option value="C.B.S.E">C.B.S.E</option>
                <option value="I.C.S.E">I.C.S.E</option>
                <option value="Rajasthan Board">Rajasthan Board</option>
                <option value="UP Board">UP Board</option>
              </select>
            </div>

            {/* TC Renew UpTo */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">TC Renew UpTo</label>
              <input
                type="date"
                name="tc_renewed_upto"
                value={formData.tc_renewed_upto}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Student Min. Age */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Student Min. Age</label>
              <input
                type="number"
                name="students_min_age"
                value={formData.students_min_age}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* TC Title */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">TC Title</label>
              <input
                type="text"
                name="name_tc_title"
                value={formData.name_tc_title}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Fee A/c Closing SMS No. */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fee A/c Closing SMS No.</label>
              <input
                type="text"
                name="fee_ac_closing_sms"
                value={formData.fee_ac_closing_sms}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tag Line 1 */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Tag Line 1</label>
              <input
                type="text"
                name="school_tag_line_1"
                value={formData.school_tag_line_1}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tag Line 2 */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Tag Line 2</label>
              <input
                type="text"
                name="school_tag_line_2"
                value={formData.school_tag_line_2}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Fee Reminder From */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fee Reminder From</label>
              <select
                name="fee_remainder_popup_from"
                value={formData.fee_remainder_popup_from}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
            </div>

            {/* Fee Remainder Msg */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fee Remainder Msg</label>
              <input
                type="text"
                name="fee_remainder_popup_msg"
                value={formData.fee_remainder_popup_msg}
                onChange={handleInputChange}
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Fee Receipt Notes */}
          <div className="pt-2 text-xs">
            <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Fee Receipt Notes (Appears on printout)</label>
            <textarea
              name="fee_receipt_notes"
              rows={2}
              value={formData.fee_receipt_notes}
              onChange={handleInputChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>
        </div>

        {/* Card 2: Collapsible Accordion 1 - LOGO / SIGNATURE */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'logo' ? '' : 'logo')}
            className="w-full p-4 bg-slate-50 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>LOGO / SIGNATURE</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'logo' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'logo' && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 bg-white border-t border-slate-200">
              {logoUploadSlots.map((slot) => (
                <div key={slot.id} className="border border-slate-200 rounded-lg p-2.5 flex flex-col items-center text-center space-y-2 bg-slate-50/50">
                  <div className="w-full h-24 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden">
                    {slot.id === 'school_logo' && formData.logoUrl ? (
                      <img src={formData.logoUrl} alt={slot.label} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-slate-300">🖼️</span>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-slate-700 truncate w-full" title={slot.label}>
                    {slot.label}
                  </div>
                  <label className="cursor-pointer px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold rounded shadow-2xs">
                    <span>Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, slot.id)}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Collapsible Accordion 2 - SOCIAL MEDIA LINK (1:1 UAB Match) */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'social' ? '' : 'social')}
            className="w-full p-4 bg-slate-50 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>SOCIAL MEDIA LINK</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'social' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'social' && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white border-t border-slate-200 text-xs">
              {/* Row 1 */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Youtube</label>
                <input
                  type="text"
                  name="youtube_page"
                  value={formData.youtube_page}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Facebook</label>
                <input
                  type="text"
                  name="facebook_page"
                  value={formData.facebook_page}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Instagram</label>
                <input
                  type="text"
                  name="twitter_page"
                  value={formData.twitter_page}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">App Fee URL</label>
                <input
                  type="text"
                  name="app_fee_url"
                  value={formData.app_fee_url}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">App Win. URL</label>
                <input
                  type="text"
                  name="app_win_url"
                  value={formData.app_win_url}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">App Android URL</label>
                <input
                  type="text"
                  name="app_andr_url"
                  value={formData.app_andr_url}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">App IOS URL</label>
                <input
                  type="text"
                  name="app_ios_url"
                  value={formData.app_ios_url}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Online Adm Btn From Date</label>
                <input
                  type="text"
                  name="online_adm_btn_from"
                  defaultValue="27-Dec-2024 01:31:53 PM"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono text-[11px]"
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Online Adm Btn To Date</label>
                <input
                  type="text"
                  name="online_adm_btn_to"
                  defaultValue="27-Dec-2024 01:31:53 PM"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Admission Limit</label>
                <input
                  type="text"
                  name="admission_limit"
                  defaultValue="0"
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono text-[11px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Collapsible Accordion 3 - RANGE ATTENDANCE (Geo-Fencing) */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'range' ? '' : 'range')}
            className="w-full p-4 bg-slate-50 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>RANGE ATTENDANCE (GEO-FENCING)</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'range' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'range' && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border-t border-slate-200 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Allowed Radius (Meters)</label>
                <input
                  type="text"
                  name="attend_range"
                  value={formData.attend_range}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-2.5 rounded bg-[#4338ca] hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Modify</span>
          </button>
        </div>
      </form>
    </div>
  );
}
