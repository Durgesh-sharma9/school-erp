import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Sliders,
  CheckCircle2,
  Save,
  Search,
  Building2,
  Radio,
  Compass,
  Navigation,
  Info,
  ShieldCheck,
  Check,
  Crosshair,
  Map,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const RANGE_PRESETS = [
  { label: '50m', value: 50, desc: 'School Gate Only' },
  { label: '100m', value: 100, desc: 'Main Academic Block' },
  { label: '200m', value: 200, desc: 'Full School Campus' },
  { label: '500m', value: 500, desc: 'Campus & Sports Grounds' },
  { label: '1,000m', value: 1000, desc: 'Extended Campus Zone' }
];

export function AttendanceGeofencePage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  // J D International School Jaipur default location: Jaisinghpura / Bhankrota
  const defaultLat = 26.850426;
  const defaultLng = 75.674293;

  // School Geofence Master Configuration State
  const [config, setConfig] = useState(() => {
    const saved = tenantStore.getGeofenceConfig(schoolId);
    if (saved && saved.schoolLatitude && saved.schoolLongitude) {
      return saved;
    }
    return {
      enabled: true,
      mode: 'strict', // 'strict' | 'warning' | 'disabled'
      punchMode: 'dual_punch', // 'dual_punch' | 'single_punch'
      schoolLatitude: defaultLat,
      schoolLongitude: defaultLng,
      allowedRangeMeters: 200,
      campusName: schoolName || 'J D International School Campus',
      address: 'Jaisinghpura, Bhankrota, Jaipur, Rajasthan'
    };
  });

  // Search Address state
  const [searchAddress, setSearchAddress] = useState('Jaisinghpura, Bhankrota, Jaipur');
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Map layer mode: 'street' | 'satellite'
  const [mapLayerType, setMapLayerType] = useState('street');

  // Leaflet map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const schoolMarkerRef = useRef(null);
  const geofenceCircleRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Sync config on school change
  useEffect(() => {
    const saved = tenantStore.getGeofenceConfig(schoolId);
    if (saved) {
      setConfig(saved);
    }
  }, [schoolId]);

  // ── Initialize Leaflet Map ──
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const lat = config.schoolLatitude || defaultLat;
    const lng = config.schoolLongitude || defaultLng;

    // Create Map centered directly on School Campus
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 17,
      zoomControl: true
    });

    // Street Tile Layer
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Custom School Center Pin Icon
    const schoolIcon = L.divIcon({
      className: 'school-pin',
      html: `<div style="background-color: #059669; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(5,150,105,0.5); border: 3px solid white; cursor: grab;">
        <span style="font-size: 22px;">🏫</span>
      </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    // Add Draggable School Marker
    const schoolMarker = L.marker([lat, lng], {
      icon: schoolIcon,
      draggable: true
    }).addTo(map);

    schoolMarker.bindTooltip(
      `<b>${config.campusName || 'School Campus'}</b><br/>Drag pin or click map to adjust exact school gate/building`,
      { permanent: true, direction: 'top', offset: [0, -24] }
    );

    // Add Geofence Perimeter Circle
    const circle = L.circle([lat, lng], {
      radius: config.allowedRangeMeters || 200,
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 0.22,
      weight: 2.5,
      dashArray: '6, 6'
    }).addTo(map);

    // Drag marker event
    schoolMarker.on('dragend', (e) => {
      const newPos = e.target.getLatLng();
      const roundLat = parseFloat(newPos.lat.toFixed(6));
      const roundLng = parseFloat(newPos.lng.toFixed(6));
      circle.setLatLng([roundLat, roundLng]);
      setConfig((prev) => ({
        ...prev,
        schoolLatitude: roundLat,
        schoolLongitude: roundLng
      }));
      toast.success(`School coordinates updated: ${roundLat}° N, ${roundLng}° E`);
    });

    // Click anywhere on map to move school pin
    map.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      const roundLat = parseFloat(clickLat.toFixed(6));
      const roundLng = parseFloat(clickLng.toFixed(6));
      schoolMarker.setLatLng([roundLat, roundLng]);
      circle.setLatLng([roundLat, roundLng]);
      setConfig((prev) => ({
        ...prev,
        schoolLatitude: roundLat,
        schoolLongitude: roundLng
      }));
    });

    mapInstanceRef.current = map;
    schoolMarkerRef.current = schoolMarker;
    geofenceCircleRef.current = circle;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Sync Map elements when coordinates or allowed radius change ──
  useEffect(() => {
    if (!mapInstanceRef.current || !schoolMarkerRef.current || !geofenceCircleRef.current) return;
    const lat = config.schoolLatitude;
    const lng = config.schoolLongitude;
    if (lat && lng) {
      schoolMarkerRef.current.setLatLng([lat, lng]);
      geofenceCircleRef.current.setLatLng([lat, lng]);
      geofenceCircleRef.current.setRadius(config.allowedRangeMeters || 200);
    }
  }, [config.schoolLatitude, config.schoolLongitude, config.allowedRangeMeters]);

  // ── Toggle Map Layer: Street Map vs Satellite View ──
  const toggleMapLayer = (type) => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    setMapLayerType(type);
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    if (type === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: '&copy; Esri World Imagery' }
      ).addTo(mapInstanceRef.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }
  };

  // ── Search School Location / Address with Nominatim ──
  const handleSearchAddress = async (e) => {
    e?.preventDefault();
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress + ' Rajasthan India'
        )}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const found = data[0];
        const newLat = parseFloat(parseFloat(found.lat).toFixed(6));
        const newLng = parseFloat(parseFloat(found.lon).toFixed(6));

        setConfig((prev) => ({
          ...prev,
          schoolLatitude: newLat,
          schoolLongitude: newLng,
          address: found.display_name
        }));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLat, newLng], 17, { duration: 1.5 });
        }
        toast.success(`School located: ${found.display_name.slice(0, 45)}...`);
      } else {
        toast.error('Location not found. Try searching with landmark or city (e.g. Bhankrota Jaipur).');
      }
    } catch {
      toast.error('Search request failed. Please check internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  // ── Auto-detect School GPS (If Admin is currently at the school campus) ──
  const handleUseCurrentLocationAsSchool = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        const newLat = parseFloat(pos.coords.latitude.toFixed(6));
        const newLng = parseFloat(pos.coords.longitude.toFixed(6));

        setConfig((prev) => ({
          ...prev,
          schoolLatitude: newLat,
          schoolLongitude: newLng
        }));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLat, newLng], 18, { duration: 1.2 });
        }
        toast.success(`School location set to current coordinates (${newLat}° N, ${newLng}° E)!`);
      },
      (err) => {
        setIsDetecting(false);
        toast.error(`GPS Error: ${err.message || 'Permission denied'}`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // ── Save School Geofence Configuration ──
  const handleSaveConfig = () => {
    tenantStore.saveGeofenceConfig(schoolId, config);
    toast.success('School campus location and allowed geofence range saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1700px] mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">School Campus Geofence & Boundary Setup</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Admin Master
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Set the official school GPS location and allowed check-in perimeter radius for faculty and staff attendance.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Allowed Perimeter:</p>
            <p className="text-sm font-black font-mono text-emerald-700">{config.allowedRangeMeters} Meters Radius</p>
          </div>
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Save className="w-4 h-4" /> Save School Geofence
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (5 cols) + Right Map (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── LEFT PANEL: ADMIN CONFIGURATION ── */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. School Location Setup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-emerald-600" />
              1. Official School Location (Center Point)
            </h2>

            {/* School Address Search */}
            <form onSubmit={handleSearchAddress} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search school area or city (e.g. Bhankrota, Jaipur)..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shrink-0"
              >
                {isSearching ? 'Locating...' : 'Locate on Map'}
              </button>
            </form>

            {/* School Campus Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">School / Campus Name</label>
                <input
                  type="text"
                  value={config.campusName}
                  onChange={(e) => setConfig({ ...config, campusName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">School Latitude (° N)</label>
                <input
                  type="number"
                  step="0.000001"
                  value={config.schoolLatitude}
                  onChange={(e) => setConfig({ ...config, schoolLatitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">School Longitude (° E)</label>
                <input
                  type="number"
                  step="0.000001"
                  value={config.schoolLongitude}
                  onChange={(e) => setConfig({ ...config, schoolLongitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            {/* If Admin is at school, 1-click set location */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleUseCurrentLocationAsSchool}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition"
              >
                <Crosshair className={`w-4 h-4 text-emerald-600 ${isDetecting ? 'animate-spin' : ''}`} />
                {isDetecting ? 'Detecting Coordinates...' : 'Set My Current Location as School Campus'}
              </button>
            </div>
          </div>

          {/* 2. Allowed Range / Radius Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                2. Allowed Check-in Range (Radius)
              </h2>
              <span className="text-base font-black font-mono text-emerald-700">
                {config.allowedRangeMeters} Meters
              </span>
            </div>

            {/* Quick Presets */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Preset Radii:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {RANGE_PRESETS.map((p) => {
                  const isSelected = config.allowedRangeMeters === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setConfig({ ...config, allowedRangeMeters: p.value })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="text-sm font-black font-mono">{p.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Range Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                <span>Custom Radius Slider:</span>
                <span className="font-mono text-slate-900 font-bold">
                  {config.allowedRangeMeters}m ({((config.allowedRangeMeters) / 1000).toFixed(2)} km)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="2000"
                step="10"
                value={config.allowedRangeMeters}
                onChange={(e) => setConfig({ ...config, allowedRangeMeters: parseInt(e.target.value, 10) || 200 })}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>20m (Gate)</span>
                <span>200m (Standard Campus)</span>
                <span>2,000m (2 km)</span>
              </div>
            </div>

            {/* Geofence Policy */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Staff Attendance Policy</label>
              <select
                value={config.mode}
                onChange={(e) => setConfig({ ...config, mode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="strict">Strict Enforcement (Staff mobile/portal blocks punch outside range)</option>
                <option value="warning">Warning Mode (Allow punch but flag as 'Out of Range')</option>
                <option value="disabled">Disabled (No GPS boundary check)</option>
              </select>
            </div>
          </div>

          {/* 3. Choose Attendance System Mode: Dual Punch vs Single Punch */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-emerald-600" />
              3. Attendance Punch System Mode
            </h2>

            <p className="text-xs text-slate-500 font-medium">
              Admin decides whether staff tracks both Arrival & Departure or only Daily Arrival:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Dual Punch */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, punchMode: 'dual_punch' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  (config.punchMode || 'dual_punch') === 'dual_punch'
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">Punch-In & Punch-Out</span>
                  {(config.punchMode || 'dual_punch') === 'dual_punch' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Morning <strong>Punch-In</strong> & Evening <strong>Punch-Out</strong> required. Tracks working hours & early departures.
                </p>
              </button>

              {/* Single Punch */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, punchMode: 'single_punch' })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  config.punchMode === 'single_punch'
                    ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs">Only Punch-In (Single Check-in)</span>
                  {config.punchMode === 'single_punch' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Only 1 punch per day. Staff is marked Present for the full day without requiring an evening punch.
                </p>
              </button>
            </div>
          </div>

          {/* 4. Role Permissions & Attendance Rules Guide */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-4 h-4 text-indigo-600" />
              4. Attendance Authority & Access Roles
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>👑 Admin Master Privilege:</span>
                </p>
                <p className="text-[11px] text-indigo-900 leading-relaxed">
                  Admin can mark/edit attendance for <strong>ANY staff member or student</strong>, for <strong>ANY past or present date</strong> without range/GPS restrictions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>👤 Teachers & Staff:</span>
                </p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Staff can only mark attendance for <strong>TODAY's date</strong> from their portal/phone, and MUST be physically inside the <strong>{config.allowedRangeMeters}m</strong> school geofence perimeter.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span>👨‍🏫 Student Attendance:</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Handled separately via <strong>Student Attendance</strong> by the Class Teacher or Attender class-wise with absent SMS alerts.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Master Policy Summary Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Active Campus Geofence Rule
            </h3>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              Teachers and staff logging in from their mobile phones or staff portal will only be allowed to mark attendance when their GPS is physically within <strong>{config.allowedRangeMeters} meters</strong> of the school building pin shown on the map.
            </p>
            <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-900 font-mono font-bold">
              <span>Center: {config.schoolLatitude}° N, {config.schoolLongitude}° E</span>
              <span className="bg-emerald-100 px-2 py-0.5 rounded-full uppercase">{config.mode} ACTIVE</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: REAL INTERACTIVE CAMPUS MAP (7 cols) ── */}
        <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[640px]">
          {/* Map Toolbar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                School Campus Boundary Map (Drag pin to adjust school center)
              </span>
            </div>

            {/* Street vs Satellite */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => toggleMapLayer('street')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  mapLayerType === 'street' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Street Map
              </button>
              <button
                type="button"
                onClick={() => toggleMapLayer('satellite')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                  mapLayerType === 'satellite' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Satellite View
              </button>
            </div>
          </div>

          {/* Leaflet Map Container */}
          <div className="relative flex-1 w-full rounded-xl overflow-hidden mt-3 border border-slate-200 min-h-[500px]">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

            {/* Map Legend Card */}
            <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5 max-w-[210px]">
              <p className="font-black text-slate-900 text-[11px] uppercase tracking-wider">Campus Legend</p>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[11px] text-white font-bold">
                  🏫
                </span>
                <span className="font-semibold text-[11px]">School Center Pin</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-4 h-4 rounded-full border-2 border-emerald-600 bg-emerald-100" />
                <span className="font-semibold text-[11px]">
                  {config.allowedRangeMeters}m Allowed Boundary
                </span>
              </div>
            </div>

            {/* Instruction Overlay at bottom */}
            <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] px-3.5 py-2 rounded-xl border border-slate-700 shadow-lg flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Click anywhere on map</strong> or <strong>drag the green school pin</strong> to place it accurately on your school building.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceGeofencePage;
