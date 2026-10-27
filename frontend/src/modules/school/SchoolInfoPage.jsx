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
  AlertTriangle,
  X,
  Home,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, ErpSection } from '../../components/erp/PagePrimitives';

export function SchoolInfoPage() {
  const { schoolId, schoolName } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [expandedSection, setExpandedSection] = useState('logo'); // 'logo', 'social', 'range', 'superAdmin'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null);
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
    logoUrl: initialProfile.logoUrl || '',
    brandingImages: initialProfile.brandingImages || (initialProfile.logoUrl ? { school_logo: initialProfile.logoUrl } : {})
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
      logoUrl: prof.logoUrl || prev.logoUrl,
      brandingImages: {
        ...(prev.brandingImages || {}),
        ...(prof.brandingImages || {}),
        ...(prof.logoUrl ? { school_logo: prof.logoUrl } : {})
      }
    }));

    fetch('/api/schools/profile', {
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
            receiptNotes: item.receiptNotes ?? prev.fee_receipt_notes,
            logoUrl: item.logoUrl ?? prev.logoUrl,
            brandingImages: {
              ...(prev.brandingImages || {}),
              ...(item.brandingImages || {}),
              ...(item.logoUrl ? { school_logo: item.logoUrl } : {})
            }
          }));
        }
      })
      .catch(() => {});
  }, [schoolId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e, slotId = 'school_logo', slotLabel = 'Logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size should not exceed 5MB');
      return;
    }

    setUploadingSlot(slotId);
    const toastId = toast.loading(`Uploading ${slotLabel}...`);

    try {
      const data = new FormData();
      data.append('logo', file);
      data.append('slotId', slotId);

      const res = await fetch('/api/schools/logo', {
        method: 'POST',
        headers: { 'x-school-id': schoolId || '' },
        body: data
      });

      const json = await res.json();
      if (json.success && json.logoUrl) {
        const uploadedUrl = json.logoUrl;
        setFormData(prev => ({
          ...prev,
          ...(slotId === 'school_logo' ? { logoUrl: uploadedUrl } : {}),
          brandingImages: {
            ...(prev.brandingImages || {}),
            [slotId]: uploadedUrl
          }
        }));

        const existingProfile = tenantStore.getSchoolProfile(schoolId);
        const updatedBranding = {
          ...(existingProfile.brandingImages || {}),
          [slotId]: uploadedUrl
        };
        tenantStore.updateSchoolProfile(schoolId, {
          ...(slotId === 'school_logo' ? { logoUrl: uploadedUrl } : {}),
          brandingImages: updatedBranding
        });

        toast.success(`${slotLabel} uploaded and applied!`, { id: toastId });
      } else {
        throw new Error(json.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('ImageKit/Backend upload failed, converting to local Base64:', err);

      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result;
        setFormData(prev => ({
          ...prev,
          ...(slotId === 'school_logo' ? { logoUrl: base64Url } : {}),
          brandingImages: {
            ...(prev.brandingImages || {}),
            [slotId]: base64Url
          }
        }));

        const existingProfile = tenantStore.getSchoolProfile(schoolId);
        const updatedBranding = {
          ...(existingProfile.brandingImages || {}),
          [slotId]: base64Url
        };
        tenantStore.updateSchoolProfile(schoolId, {
          ...(slotId === 'school_logo' ? { logoUrl: base64Url } : {}),
          brandingImages: updatedBranding
        });

        toast.success(`${slotLabel} saved locally (offline preview)!`, { id: toastId });
      };
      reader.onerror = () => {
        toast.error('Failed to read image file locally.', { id: toastId });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingSlot(null);
      e.target.value = '';
    }
  };

  const handleRemoveLogo = (slotId = 'school_logo', slotLabel = 'Logo', e) => {
    e.stopPropagation();
    setFormData(prev => {
      const updated = { ...(prev.brandingImages || {}) };
      delete updated[slotId];
      return {
        ...prev,
        ...(slotId === 'school_logo' ? { logoUrl: '' } : {}),
        brandingImages: updated
      };
    });

    const existingProfile = tenantStore.getSchoolProfile(schoolId);
    const updatedBranding = { ...(existingProfile.brandingImages || {}) };
    delete updatedBranding[slotId];

    tenantStore.updateSchoolProfile(schoolId, {
      ...(slotId === 'school_logo' ? { logoUrl: '' } : {}),
      brandingImages: updatedBranding
    });

    toast.success(`${slotLabel} removed`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      tenantStore.updateSchoolProfile(schoolId, {
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
        logoUrl: formData.brandingImages?.school_logo || formData.logoUrl || '',
        brandingImages: formData.brandingImages || {}
      });

      try {
        const payload = {
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
          logoUrl: formData.brandingImages?.school_logo || formData.logoUrl || '',
          brandingImages: formData.brandingImages || {}
        };
        const res = await fetch('/api/schools/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-school-id': schoolId || ''
          },
          body: JSON.stringify(payload)
        });
        await res.json();
      } catch (netErr) {
        // Proceed with tenant store
      }

      setSavedSuccess(true);
      toast.success('School profile and branding updated successfully!');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile changes');
    }
  };

  return (
    <div className="space-y-3 max-w-6xl mx-auto pt-0 pb-12 px-2 sm:px-4">
      {/* 1:1 Test Master Pro Page Header */}
      <PageHeader
        title="Edit School Profile"
        description="Configure school registration numbers, multi-slot branding assets, official contacts, and GPS geofence."
      >
        <button
          type="button"
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold px-4 py-2 shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Profile</span>
        </button>
      </PageHeader>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 text-xs shadow-2xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            School information and branding assets updated successfully!
          </div>
        </div>
      )}

      {/* Main Container Form */}
      <form onSubmit={handleSave} className="space-y-3">
        {/* Card 1: Core School Info (5-Column Grid) */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/30 to-white px-4 py-2.5 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                🏫
              </div>
              <h3 className="font-bold text-xs text-slate-900 tracking-tight">
                School General Details
              </h3>
            </div>
            <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 font-bold text-slate-600">
              ID: {schoolId || 'sch_jd_intl'}
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 text-xs">
              {/* School Name */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-slate-900"
                  required
                />
              </div>

              {/* School Code */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Code</label>
                <input
                  type="text"
                  name="school_code"
                  value={formData.school_code}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* UDISE No. */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">UDISE No.</label>
                <input
                  type="text"
                  name="udies_no"
                  value={formData.udies_no}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* School Affi. No. */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Affi. No.</label>
                <input
                  type="text"
                  name="school_affl_no"
                  value={formData.school_affl_no}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* School Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Category</label>
                <select
                  name="school_category"
                  value={formData.school_category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Semi-Government">Semi-Government</option>
                </select>
              </div>

              {/* School Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Type</label>
                <select
                  name="school_type"
                  value={formData.school_type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Senior Secondary">Senior Secondary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Middle">Middle</option>
                  <option value="Primary">Primary</option>
                </select>
              </div>

              {/* Place */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Place / City</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Campus Full Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Pin Code */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Phone No. 1 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone No. 1*</label>
                <input
                  type="text"
                  name="phone_num1"
                  value={formData.phone_num1}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono font-bold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Phone No. 2 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone No. 2</label>
                <input
                  type="text"
                  name="phone_num2"
                  value={formData.phone_num2}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="www.school.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="info@school.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* School Board */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Board</label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="C.B.S.E">C.B.S.E</option>
                  <option value="I.C.S.E">I.C.S.E</option>
                  <option value="Rajasthan Board">Rajasthan Board</option>
                  <option value="UP Board">UP Board</option>
                </select>
              </div>

              {/* School Motto / Tagline */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">School Motto / Tagline</label>
                <input
                  type="text"
                  name="school_tag_line_1"
                  value={formData.school_tag_line_1}
                  onChange={handleInputChange}
                  placeholder="e.g. Lead Kindly Light • Empowering Future Leaders"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Fee Receipt Notes */}
            <div className="pt-2 text-xs">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Fee Receipt Notes (Printed on computerized fee slips)
              </label>
              <textarea
                name="fee_receipt_notes"
                rows={2}
                value={formData.fee_receipt_notes}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Accordion 1 - LOGO / SIGNATURE / BRANDING ASSETS */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'logo' ? '' : 'logo')}
            className="w-full p-3.5 bg-gradient-to-r from-purple-50/80 via-indigo-50/30 to-white flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none border-b border-purple-100"
          >
            <span className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>LOGO &amp; OFFICIAL SIGNATURE SLOTS ({logoUploadSlots.length})</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedSection === 'logo' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'logo' && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 bg-white border-t border-slate-100">
              {logoUploadSlots.map((slot) => {
                const currentImg = formData.brandingImages?.[slot.id] || (slot.id === 'school_logo' ? formData.logoUrl : null);
                const isSlotUploading = uploadingSlot === slot.id;

                return (
                  <div
                    key={slot.id}
                    className="group relative border border-slate-200 rounded-xl p-3 flex flex-col items-center text-center space-y-2.5 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all"
                  >
                    <div className="relative w-full h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {isSlotUploading ? (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                          <span className="text-[10px] text-slate-500 font-medium">Uploading...</span>
                        </div>
                      ) : currentImg ? (
                        <>
                          <img
                            src={currentImg}
                            alt={slot.label}
                            className="w-full h-full object-contain p-1"
                          />
                          <button
                            type="button"
                            title={`Remove ${slot.label}`}
                            onClick={(e) => handleRemoveLogo(slot.id, slot.label, e)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity shadow-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-slate-300">
                          <ImageIcon className="w-7 h-7 stroke-1 text-slate-300" />
                          <span className="text-[9.5px] text-slate-400 mt-1 font-medium">No file</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] font-bold text-slate-800 truncate w-full" title={slot.label}>
                      {slot.label}
                    </div>

                    <label className={`cursor-pointer px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-md shadow-2xs transition-colors flex items-center space-x-1 ${isSlotUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-3 h-3" />
                      <span>{currentImg ? 'Change' : 'Upload'}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={isSlotUploading}
                        onChange={(e) => handleLogoUpload(e, slot.id, slot.label)}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Accordion 2 - SOCIAL MEDIA & APP LINKS */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'social' ? '' : 'social')}
            className="w-full p-3.5 bg-gradient-to-r from-amber-50/80 via-orange-50/30 to-white flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none border-b border-amber-100"
          >
            <span className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-amber-600" />
              <span>SOCIAL MEDIA &amp; MOBILE APP DOWNLOAD LINKS</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedSection === 'social' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'social' && (
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 bg-white border-t border-slate-100 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Youtube Channel</label>
                <input
                  type="text"
                  name="youtube_page"
                  value={formData.youtube_page}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Facebook Page</label>
                <input
                  type="text"
                  name="facebook_page"
                  value={formData.facebook_page}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Instagram Handle</label>
                <input
                  type="text"
                  name="twitter_page"
                  value={formData.twitter_page}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">App Fee Portal URL</label>
                <input
                  type="text"
                  name="app_fee_url"
                  value={formData.app_fee_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">App Windows URL</label>
                <input
                  type="text"
                  name="app_win_url"
                  value={formData.app_win_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">App Android PlayStore URL</label>
                <input
                  type="text"
                  name="app_andr_url"
                  value={formData.app_andr_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">App iOS AppStore URL</label>
                <input
                  type="text"
                  name="app_ios_url"
                  value={formData.app_ios_url}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Admission Seat Limit</label>
                <input
                  type="text"
                  name="admission_limit"
                  defaultValue="0"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white text-slate-800 font-mono text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Accordion 3 - RANGE ATTENDANCE (GEO-FENCING) */}
        <div className="bg-white rounded-xl shadow-2xs hover:shadow-xs border border-slate-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedSection(prev => prev === 'range' ? '' : 'range')}
            className="w-full p-3.5 bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none border-b border-emerald-100"
          >
            <span className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>STAFF ATTENDANCE GEOFENCE (GPS RANGE)</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedSection === 'range' ? 'rotate-180' : ''}`} />
          </button>

          {expandedSection === 'range' && (
            <div className="p-4 sm:p-5 space-y-4 bg-white border-t border-slate-100 text-xs">
              {/* Quick Actions & Live Detection Banner */}
              <div className="bg-gradient-to-r from-indigo-50/90 via-blue-50/60 to-slate-50 border border-indigo-100 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-2xs shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span>Automatic Campus GPS Coordinate Detection</span>
                      {locationStatus?.type === 'success' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                          <Check className="w-3 h-3" /> Live GPS Set
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Click while physically present on the school campus to automatically detect and store precise latitude and longitude coordinates.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    disabled={isLocating}
                    className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
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
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
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
                  className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Latitude <span className="text-slate-400 font-normal font-mono">(GPS Decimal)</span>
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 26.9124336"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Longitude <span className="text-slate-400 font-normal font-mono">(GPS Decimal)</span>
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="e.g. 75.7872709"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700">
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-slate-50/50 focus:bg-white font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Radius Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] font-bold text-slate-700">Quick Radius Presets:</span>
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
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      formData.attend_range === preset.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Guidance Note */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <div>
                  <strong className="text-slate-800">How Does Staff Attendance Geo-Fencing Work?</strong>
                  <p className="mt-0.5 text-slate-500 leading-relaxed">
                    When teachers or staff mark their check-in via mobile or kiosk, their device coordinates are verified. Attendance will only be marked when physically within this allowed radius ({formData.attend_range || 100} meters) of campus center.
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
            className="px-8 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save School Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
