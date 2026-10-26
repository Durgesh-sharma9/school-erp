import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  Save,
  CheckCircle2,
  ChevronDown,
  Upload,
  Globe,
  Share2,
  MapPin,
  ShieldCheck,
  Building2,
  Image as ImageIcon,
  Navigation,
  Crosshair,
  ExternalLink,
  Loader2,
  Check,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SchoolInfoPage() {
  const { schoolId, schoolName } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedSection, setExpandedSection] = useState('logo'); // 'logo', 'social', 'range', 'superAdmin'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null); // { type: 'success' | 'error' | 'loading', message: string, accuracy?: number }

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      setLocationStatus({
        type: 'error',
        message: 'Geolocation is not supported by your browser.'
      });
      return;
    }

    setIsLocating(true);
    setLocationStatus({
      type: 'loading',
      message: 'Accessing device GPS sensors to fetch live coordinates...'
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(7);
        const lng = position.coords.longitude.toFixed(7);
        const accuracy = Math.round(position.coords.accuracy);

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          attend_range: (!prev.attend_range || prev.attend_range === '0') ? '100' : prev.attend_range
        }));

        setIsLocating(false);
        setLocationStatus({
          type: 'success',
          message: `GPS location detected: ${lat}, ${lng} (Accuracy: ±${accuracy}m)`,
          accuracy
        });
        toast.success(`GPS Location fetched: ${lat}, ${lng} (±${accuracy}m)`);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Failed to fetch GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Please allow location access in your browser address bar.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information unavailable. Please turn on device GPS / Wi-Fi.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        setLocationStatus({
          type: 'error',
          message: errorMsg
        });
        toast.error(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  const initialProfile = tenantStore.getSchoolProfile(schoolId);
  const [formData, setFormData] = useState({
    name: initialProfile.schoolName || schoolName || '',
    school_code: initialProfile.schoolCode || '',
    udies_no: initialProfile.udiseNo || '',
    school_affl_no: initialProfile.affiliationNo || '',
    school_category: 'Private',
    school_type: 'Senior Secondary',
    place: initialProfile.place || '',
    address: initialProfile.address || '',
    postal_code: initialProfile.pinCode || '',
    phone_num1: initialProfile.phone1 || '',
    phone_num2: initialProfile.phone2 || '',
    fax: '',
    website: initialProfile.website || '',
    email: initialProfile.email || '',
    board: 'C.B.S.E',
    tc_renewed_upto: '',
    students_min_age: '0',
    name_tc_title: '',
    fee_ac_closing_sms: '',
    school_tag_line_1: '',
    school_tag_line_2: '',
    fee_receipt_notes: initialProfile.receiptNotes || 'Fees once paid is non-refundable. Please keep this computerized receipt for tax purposes.',
    fee_remainder_popup_from: 'Inactive',
    fee_remainder_popup_msg: '',
    youtube_page: 'https://youtube.com',
    facebook_page: 'https://facebook.com',
    twitter_page: 'https://instagram.com',
    app_fee_url: '',
    app_win_url: '',
    app_andr_url: '',
    app_ios_url: '',
    latitude: initialProfile.latitude || '1.0000000',
    longitude: initialProfile.longitude || '1.0000000',
    attend_range: initialProfile.attend_range || '100',
    paytm_merchant_id: '',
    paytm_merchant_key: '',
    study_material_url: '',
    logoUrl: initialProfile.logoUrl || ''
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
    const prof = tenantStore.getSchoolProfile(schoolId);
    setFormData(prev => ({
      ...prev,
      name: prof.schoolName || prev.name,
      school_code: prof.schoolCode || prev.school_code,
      udies_no: prof.udiseNo || prev.udies_no,
      school_affl_no: prof.affiliationNo || prev.school_affl_no,
      phone_num1: prof.phone1 || prev.phone_num1,
      phone_num2: prof.phone2 || prev.phone_num2,
      email: prof.email || prev.email,
      website: prof.website || prev.website,
      address: prof.address || prev.address,
      place: prof.place || prev.place,
      postal_code: prof.pinCode || prev.postal_code,
      logoUrl: prof.logoUrl || prev.logoUrl
    }));

    fetch('http://localhost:5000/api/schools/profile', {
      headers: { 'x-school-id': schoolId || '' }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          const item = d.data;
          setFormData(prev => ({
            ...prev,
            ...item,
            name: item.schoolName ?? item.name ?? prev.name,
            school_code: item.schoolCode ?? item.school_code ?? prev.school_code,
            udies_no: item.udiseNo ?? item.udies_no ?? prev.udies_no,
            school_affl_no: item.affiliationNo ?? item.school_affl_no ?? prev.school_affl_no,
            phone_num1: item.phone1 ?? item.phone_num1 ?? prev.phone_num1,
            phone_num2: item.phone2 ?? item.phone_num2 ?? prev.phone_num2,
            email: item.email ?? prev.email,
            website: item.website ?? prev.website,
            address: item.address ?? prev.address,
            place: item.place ?? prev.place,
            postal_code: item.pinCode ?? item.postal_code ?? prev.postal_code,
            fee_receipt_notes: item.receiptNotes ?? item.fee_receipt_notes ?? prev.fee_receipt_notes,
            logoUrl: item.logoUrl ?? prev.logoUrl
          }));
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [schoolId]);

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
      const payload = {
        ...formData,
        schoolName: formData.name,
        schoolCode: formData.school_code,
        udiseNo: formData.udies_no,
        affiliationNo: formData.school_affl_no,
        phone1: formData.phone_num1,
        phone2: formData.phone_num2,
        email: formData.email,
        website: formData.website,
        address: formData.address,
        place: formData.place,
        pinCode: formData.postal_code,
        receiptNotes: formData.fee_receipt_notes,
        logoUrl: formData.logoUrl,
        latitude: formData.latitude,
        longitude: formData.longitude,
        attend_range: formData.attend_range
      };

      // 1. Persist strictly in active tenant store
      tenantStore.updateSchoolProfile(schoolId, payload);

      // 2. Put to backend with tenant boundary header
      try {
        const res = await fetch('http://localhost:5000/api/schools/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId || 'sch_jd_intl'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
      } catch (netErr) {
        // Proceed with tenant store
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
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

            {/* Website */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="www.school.com"
                className="w-full rounded border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Official Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="info@school.com"
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

            {/* School Motto / Tagline (Combined) */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">School Motto / Tagline</label>
              <input
                type="text"
                name="school_tag_line_1"
                value={formData.school_tag_line_1}
                onChange={handleInputChange}
                placeholder="e.g. Lead Kindly Light &bull; Empowering Future Leaders"
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

        {/* Card 4: Collapsible Accordion 3 - RANGE ATTENDANCE (GEO-FENCING) */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'range' ? '' : 'range')}
            className="w-full p-4 bg-slate-50 flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer select-none"
          >
            <span className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>RANGE ATTENDANCE (GEO-FENCING)</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'range' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'range' && (
            <div className="p-4 space-y-3.5 bg-white border-t border-slate-200 text-xs">
              {/* Quick Actions & Live Detection Banner */}
              <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/60 to-slate-50 border border-indigo-100 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-2xs shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>Automatic GPS Coordinate Detection</span>
                      {locationStatus?.type === 'success' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <Check className="w-3 h-3" /> Live GPS Set
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Click this button while on the school campus to automatically detect and populate the exact latitude and longitude coordinates.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    disabled={isLocating}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Detecting...</span>
                      </>
                    ) : (
                      <>
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>📍 Fetch My Location (GPS)</span>
                      </>
                    )}
                  </button>

                  {Number(formData.latitude) !== 0 && Number(formData.latitude) !== 1 && (
                    <a
                      href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      title="Verify pinned location on Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Google Maps</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Message Display */}
              {locationStatus && (
                <div
                  className={`p-2.5 rounded text-[11px] font-medium flex items-center gap-2 ${
                    locationStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : locationStatus.type === 'loading'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {locationStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : locationStatus.type === 'loading' ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{locationStatus.message}</span>
                </div>
              )}

              {/* Coordinates & Radius Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Latitude <span className="text-slate-400 font-normal font-mono">(GPS Decimal)</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 26.9124336"
                    className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Longitude <span className="text-slate-400 font-normal font-mono">(GPS Decimal)</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 75.7872709"
                    className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-medium text-slate-600">
                      Allowed Radius (Meters)
                    </label>
                    <span className="text-[10px] text-slate-400">Around school center</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    name="attend_range"
                    value={formData.attend_range}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    className="w-full rounded border border-slate-300 px-3 py-2 bg-white font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Radius Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] font-semibold text-slate-600">Quick Radius Presets:</span>
                {[
                  { label: '50m (Main Gate)', value: '50' },
                  { label: '100m (Standard School)', value: '100' },
                  { label: '200m (Campus)', value: '200' },
                  { label: '500m (Wide Grounds)', value: '500' }
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, attend_range: preset.value }))}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                      formData.attend_range === preset.value
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Guidance Note */}
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <span className="text-sm">💡</span>
                <div>
                  <strong className="text-slate-800">How Does Range Attendance (Geo-Fencing) Work?</strong>
                  <p className="mt-0.5 text-slate-500">
                    When staff members or teachers mark their attendance via the mobile app, the system verifies their device GPS coordinates in real time. Attendance will only be marked if they are physically within this permitted radius (e.g. {formData.attend_range || 100} meters) of the school campus center.
                  </p>
                </div>
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
