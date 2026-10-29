import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Compass,
  Crosshair,
  Save,
  RotateCcw,
  UserCheck,
  Building2,
  Layers,
  History,
  Info,
  Radio,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

// Haversine formula to compute distance between two GPS coordinates in meters
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371e3; // Earth radius in meters
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const RANGE_PRESETS = [
  { label: '50m', value: 50, desc: 'School Gate Only' },
  { label: '100m', value: 100, desc: 'Main Academic Block' },
  { label: '200m', value: 200, desc: 'Standard School Campus' },
  { label: '500m', value: 500, desc: 'Campus & Sports Grounds' },
  { label: '1,000m', value: 1000, desc: 'Extended Campus Zone' }
];

export function AttendanceGeofencePage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  // Active view tab
  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'live' | 'logs'

  // Geofence configuration state
  const [config, setConfig] = useState(() => {
    return (
      tenantStore.getGeofenceConfig(schoolId) || {
        enabled: true,
        mode: 'strict',
        schoolLatitude: 26.9124,
        schoolLongitude: 75.7873,
        allowedRangeMeters: 200,
        campusName: 'Main School Campus',
        requireSelfie: false
      }
    );
  });

  // Device GPS live state
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [distanceToSchool, setDistanceToSchool] = useState(null);

  // Staff simulation state
  const [selectedStaffName, setSelectedStaffName] = useState('Staff Member');
  const [punchLogs, setPunchLogs] = useState(() => tenantStore.getGeofencePunches(schoolId) || []);

  // Fetch current config on school switch
  useEffect(() => {
    const c = tenantStore.getGeofenceConfig(schoolId);
    if (c) setConfig(c);
    setPunchLogs(tenantStore.getGeofencePunches(schoolId) || []);
  }, [schoolId]);

  // Recalculate distance whenever device location or school location changes
  useEffect(() => {
    if (deviceLocation && config.schoolLatitude && config.schoolLongitude) {
      const d = calculateDistanceMeters(
        config.schoolLatitude,
        config.schoolLongitude,
        deviceLocation.latitude,
        deviceLocation.longitude
      );
      setDistanceToSchool(d);
    } else {
      setDistanceToSchool(null);
    }
  }, [deviceLocation, config.schoolLatitude, config.schoolLongitude]);

  // Request browser GPS position
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const loc = {
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy)
        };
        setDeviceLocation(loc);
        toast.success(`GPS Location detected (Accuracy: ±${loc.accuracy}m)`);
      },
      (err) => {
        setIsLocating(false);
        setGpsError(err.message || 'Unable to retrieve your location');
        toast.error(`GPS Error: ${err.message || 'Permission denied'}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Set current device coordinates as school campus center
  const setAsSchoolCenter = () => {
    if (!deviceLocation) {
      detectCurrentLocation();
      return;
    }
    setConfig((prev) => ({
      ...prev,
      schoolLatitude: deviceLocation.latitude,
      schoolLongitude: deviceLocation.longitude
    }));
    toast.success('School Campus location set to current coordinates!');
  };

  // Save settings
  const handleSaveConfig = () => {
    tenantStore.saveGeofenceConfig(schoolId, config);
    toast.success('Geofence & Allowed Range settings saved successfully!');
  };

  // Record a Punch In or Out with GPS validation
  const handlePunch = (punchType) => {
    if (!deviceLocation) {
      toast.error('Please detect your current GPS location first!');
      return;
    }

    const dist = calculateDistanceMeters(
      config.schoolLatitude,
      config.schoolLongitude,
      deviceLocation.latitude,
      deviceLocation.longitude
    );

    const isWithinRange = dist !== null && dist <= config.allowedRangeMeters;

    if (!isWithinRange && config.mode === 'strict' && config.enabled) {
      toast.error(`Punch Rejected! You are ${dist}m away (Max allowed: ${config.allowedRangeMeters}m)`);
      return;
    }

    const newPunch = {
      staffName: selectedStaffName,
      type: punchType,
      distanceMeters: dist,
      allowedRangeMeters: config.allowedRangeMeters,
      status: isWithinRange ? 'APPROVED' : config.mode === 'warning' ? 'OUT_OF_RANGE_LOGGED' : 'BLOCKED',
      accuracy: deviceLocation.accuracy,
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    const saved = tenantStore.addGeofencePunch(schoolId, newPunch);
    setPunchLogs(tenantStore.getGeofencePunches(schoolId));

    if (isWithinRange) {
      toast.success(`${punchType} Recorded! Within allowed range (${dist}m)`);
    } else {
      toast('Punch logged with Out-of-Range warning', { icon: '⚠️' });
    }
  };

  const isWithin = distanceToSchool !== null && distanceToSchool <= config.allowedRangeMeters;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Attendance Geofence & Range Settings</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                GPS Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Set school campus coordinates, choose allowed geofence perimeter radius, and verify staff check-ins.
            </p>
          </div>
        </div>

        {/* Quick Nav / Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'config' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Geofence Setup
          </button>
          <button
            onClick={() => {
              setActiveTab('live');
              if (!deviceLocation) detectCurrentLocation();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'live' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Range Verification
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'logs' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Punch Logs ({punchLogs.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: GEOFENCE CONFIGURATION ── */}
      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                1. School Campus Location (Center Point)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Campus Name</label>
                  <input
                    type="text"
                    value={config.campusName}
                    onChange={(e) => setConfig({ ...config, campusName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="e.g. Main Campus / J D International"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Geofence Status</label>
                  <select
                    value={config.mode}
                    onChange={(e) => setConfig({ ...config, mode: e.target.value, enabled: e.target.value !== 'disabled' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="strict">Strict Enforcement (Block if Outside Range)</option>
                    <option value="warning">Warning Mode (Allow but Flag Outside Range)</option>
                    <option value="disabled">Disabled (No GPS Boundary Check)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">School Latitude (° N)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={config.schoolLatitude}
                    onChange={(e) => setConfig({ ...config, schoolLatitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">School Longitude (° E)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={config.schoolLongitude}
                    onChange={(e) => setConfig({ ...config, schoolLongitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Auto-detect button */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  disabled={isLocating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  <Crosshair className={`w-4 h-4 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Detecting GPS...' : 'Detect Current GPS Location'}
                </button>

                {deviceLocation && (
                  <button
                    type="button"
                    onClick={setAsSchoolCenter}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Set Current GPS as School Center
                  </button>
                )}
              </div>
            </div>

            {/* Allowed Range Selection Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  2. Choose Allowed Range / Geofence Radius
                </h2>
                <span className="text-base font-black font-mono text-indigo-700">
                  {config.allowedRangeMeters} Meters
                </span>
              </div>

              {/* Preset Range Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Quick Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {RANGE_PRESETS.map((preset) => {
                    const isSelected = config.allowedRangeMeters === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setConfig({ ...config, allowedRangeMeters: preset.value })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 text-indigo-950 ring-2 ring-indigo-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <p className="text-sm font-black font-mono">{preset.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{preset.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Slider */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                  <span>Custom Range Slider:</span>
                  <span className="font-mono font-bold text-slate-900">{config.allowedRangeMeters}m ({((config.allowedRangeMeters)/1000).toFixed(2)} km)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  step="10"
                  value={config.allowedRangeMeters}
                  onChange={(e) => setConfig({ ...config, allowedRangeMeters: parseInt(e.target.value) || 200 })}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>20m (Strict Gate)</span>
                  <span>500m (Standard)</span>
                  <span>2,000m (Extended Area)</span>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <Save className="w-4 h-4" /> Save Geofence Settings
                </button>
              </div>
            </div>
          </div>

          {/* Side Info & Visual Radar Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                Geofence Perimeter Preview
              </h3>

              {/* Radar visualization graphic */}
              <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner p-4">
                {/* Radar Grid Circles */}
                <div className="absolute inset-4 rounded-full border border-emerald-500/20" />
                <div className="absolute inset-12 rounded-full border border-emerald-500/30" />
                <div className="absolute inset-20 rounded-full border border-emerald-500/40" />

                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.18)_0deg,transparent_60deg)] animate-[spin_4s_linear_infinite]" />

                {/* Center School Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/30">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 mt-1 uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    School Center
                  </span>
                </div>

                {/* Range Radius Indicator */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Radius: {config.allowedRangeMeters}m</span>
                  <span className="text-emerald-400 font-bold uppercase">{config.mode}</span>
                </div>
              </div>

              {/* Info Checklist */}
              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Only devices within <strong>{config.allowedRangeMeters}m</strong> can mark presence.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>High-accuracy HTML5 GPS prevents location spoofing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Coordinates and exact distance are saved with each punch.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: LIVE RANGE VERIFICATION & PUNCH SIMULATOR ── */}
      {activeTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Check Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Navigation className="w-4 h-4 text-emerald-600" />
              Live Device Location vs School Geofence
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">School Coordinates:</p>
                  <p className="font-mono font-bold text-slate-800">
                    {config.schoolLatitude}° N, {config.schoolLongitude}° E
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                  Allowed: {config.allowedRangeMeters}m
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Your Current Device Location:</p>
                  {deviceLocation ? (
                    <p className="font-mono font-bold text-slate-800">
                      {deviceLocation.latitude}° N, {deviceLocation.longitude}° E (±{deviceLocation.accuracy}m)
                    </p>
                  ) : (
                    <p className="text-amber-600 font-semibold italic">GPS Not Detected Yet</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={detectCurrentLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs transition"
                >
                  {isLocating ? 'Locating...' : 'Refresh GPS'}
                </button>
              </div>

              {/* Range Status Big Card */}
              {distanceToSchool !== null ? (
                <div
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    isWithin
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50/70 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="inline-flex p-3 rounded-full bg-white shadow-2xs mb-2">
                    {isWithin ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-rose-600" />
                    )}
                  </div>
                  <h3 className="text-base font-black tracking-tight">
                    {isWithin ? 'Within Allowed Geofence Range!' : 'Outside Allowed Geofence Range!'}
                  </h3>
                  <p className="text-xs font-semibold mt-1">
                    Distance to school: <span className="font-mono font-black text-sm">{distanceToSchool} Meters</span>{' '}
                    (Allowed: {config.allowedRangeMeters}m)
                  </p>
                  <p className="text-[11px] opacity-80 mt-1">
                    {isWithin
                      ? '✓ Staff can mark biometric/self attendance without any restriction.'
                      : config.mode === 'strict'
                      ? '✕ Attendance submission will be strictly BLOCKED from this location.'
                      : '⚠️ Attendance will be logged with an "Out of Range" flag.'}
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
                  <Crosshair className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  Click <strong>"Refresh GPS"</strong> above to calculate your real-time distance from the school campus.
                </div>
              )}
            </div>
          </div>

          {/* Live Punch Simulator Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Simulate Staff Check-In Punch
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Staff Member Name</label>
                <input
                  type="text"
                  value={selectedStaffName}
                  onChange={(e) => setSelectedStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePunch('PUNCH_IN')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <Clock className="w-4 h-4" /> Mark Punch In (GPS)
                </button>

                <button
                  type="button"
                  onClick={() => handlePunch('PUNCH_OUT')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <RotateCcw className="w-4 h-4" /> Mark Punch Out (GPS)
                </button>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" /> Geofence Rule Notice:
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  When a staff member opens their phone or staff app, the GPS coordinates are verified automatically
                  against the allowed <strong>{config.allowedRangeMeters}m</strong> range. Punches outside the range are
                  instantly rejected or flagged.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: GEOFENCE PUNCH LOGS ── */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Geofence Attendance Verification Logs</h2>
              <p className="text-xs text-slate-500">Live audit trail of staff punch-ins with GPS distance and range verification</p>
            </div>
            <span className="text-xs font-bold text-slate-600">Total Logs: {punchLogs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Staff Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Distance to School</th>
                  <th className="py-3 px-4">Allowed Range</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {punchLogs.length > 0 ? (
                  punchLogs.map((log, idx) => (
                    <tr key={log.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {log.date} {log.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.staffName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.type === 'PUNCH_IN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {log.distanceMeters !== null ? `${log.distanceMeters}m` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{log.allowedRangeMeters}m</td>
                      <td className="py-3 px-4 text-center">
                        {log.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Within Range
                          </span>
                        ) : log.status === 'OUT_OF_RANGE_LOGGED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Warning Logged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" /> Blocked Outside Range
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      No Geofenced attendance punches recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceGeofencePage;
