import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tenantStore } from '../../services/tenantStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Crosshair,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Save,
  RotateCcw,
  Search,
  Building2,
  Radio,
  Layers,
  Compass,
  Navigation,
  Info,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Haversine formula to compute exact distance in meters between two GPS coordinates
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
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
  { label: '200m', value: 200, desc: 'Full School Campus' },
  { label: '500m', value: 500, desc: 'Campus & Playgrounds' },
  { label: '1,000m', value: 1000, desc: 'Extended Area' }
];

export function AttendanceGeofencePage({ onNavigate }) {
  const { schoolId, schoolName } = useAuth();

  // School profile location default fallback: Jaipur Jaisinghpura / Bhankrota coords
  const defaultLat = 26.8524;
  const defaultLng = 75.6987;

  // Geofence configuration state
  const [config, setConfig] = useState(() => {
    return (
      tenantStore.getGeofenceConfig(schoolId) || {
        enabled: true,
        mode: 'strict', // 'strict' | 'warning' | 'disabled'
        schoolLatitude: defaultLat,
        schoolLongitude: defaultLng,
        allowedRangeMeters: 200,
        campusName: 'J D International School Campus'
      }
    );
  });

  // Device GPS Live Proximity state
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [distanceToSchool, setDistanceToSchool] = useState(null);

  // Address search query state
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Map layer mode: 'street' | 'satellite'
  const [mapLayerType, setMapLayerType] = useState('street');

  // Logs state
  const [punchLogs, setPunchLogs] = useState(() => tenantStore.getGeofencePunches(schoolId) || []);

  // Leaflet map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const schoolMarkerRef = useRef(null);
  const geofenceCircleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const distanceLineRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Initialize and sync config on school switch
  useEffect(() => {
    const c = tenantStore.getGeofenceConfig(schoolId);
    if (c) setConfig(c);
    setPunchLogs(tenantStore.getGeofencePunches(schoolId) || []);
  }, [schoolId]);

  // Recalculate distance
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

  // ── Initialize Leaflet Map ──
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    const initialLat = config.schoolLatitude || defaultLat;
    const initialLng = config.schoolLongitude || defaultLng;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: true
    });

    // Tile Layer: OpenStreetMap
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // School Marker Icon
    const schoolIcon = L.divIcon({
      className: 'school-pin',
      html: `<div style="background-color: #059669; color: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(5,150,105,0.45); border: 3px solid white; cursor: grab;">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
      </div>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    // Add Draggable School Marker
    const schoolMarker = L.marker([initialLat, initialLng], {
      icon: schoolIcon,
      draggable: true
    }).addTo(map);

    schoolMarker.bindTooltip(`<b>${config.campusName || 'School Campus'}</b><br/>Drag pin or click map to move`, {
      permanent: false,
      direction: 'top',
      offset: [0, -22]
    });

    // Add Geofence Radius Circle
    const circle = L.circle([initialLat, initialLng], {
      radius: config.allowedRangeMeters || 200,
      color: '#059669',
      fillColor: '#10b981',
      fillOpacity: 0.18,
      weight: 2.5,
      dashArray: '6, 6'
    }).addTo(map);

    // Event: Marker dragged
    schoolMarker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      const roundLat = parseFloat(lat.toFixed(6));
      const roundLng = parseFloat(lng.toFixed(6));
      circle.setLatLng([roundLat, roundLng]);
      setConfig((prev) => ({ ...prev, schoolLatitude: roundLat, schoolLongitude: roundLng }));
      toast.success(`School pin moved: ${roundLat}, ${roundLng}`);
    });

    // Event: Click on map to position school
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const roundLat = parseFloat(lat.toFixed(6));
      const roundLng = parseFloat(lng.toFixed(6));
      schoolMarker.setLatLng([roundLat, roundLng]);
      circle.setLatLng([roundLat, roundLng]);
      setConfig((prev) => ({ ...prev, schoolLatitude: roundLat, schoolLongitude: roundLng }));
    });

    mapInstanceRef.current = map;
    schoolMarkerRef.current = schoolMarker;
    geofenceCircleRef.current = circle;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Sync Map when Config (Latitude, Longitude, Radius) changes from UI ──
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

  // ── Toggle Map Layer: Street Map vs Satellite Imagery ──
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

  // ── Search Place / Address with OpenStreetMap Nominatim ──
  const handleSearchAddress = async (e) => {
    e?.preventDefault();
    if (!searchAddress.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress + ' India'
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
          campusName: searchAddress
        }));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLat, newLng], 17, { duration: 1.5 });
        }
        toast.success(`Found location: ${found.display_name.slice(0, 40)}...`);
      } else {
        toast.error('Location not found. Try searching with city name (e.g. Jaipur, Ajmer).');
      }
    } catch {
      toast.error('Search request failed. Please check internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  // ── Detect Live Device GPS Location ──
  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const loc = {
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy)
        };
        setDeviceLocation(loc);

        // Render user location marker on map
        if (mapInstanceRef.current) {
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([loc.latitude, loc.longitude]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-pin',
              html: `<div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 8px rgba(37,99,235,0.3); border: 2px solid white; font-size: 16px;">
                📍
              </div>`,
              iconSize: [34, 34],
              iconAnchor: [17, 17]
            });

            userMarkerRef.current = L.marker([loc.latitude, loc.longitude], { icon: userIcon }).addTo(
              mapInstanceRef.current
            );
            userMarkerRef.current.bindTooltip('<b>Your Live Device Location</b>', {
              permanent: true,
              direction: 'bottom',
              offset: [0, 16]
            });
          }

          // Draw dashed distance line connecting School and Device
          if (distanceLineRef.current) {
            distanceLineRef.current.setLatLngs([
              [config.schoolLatitude, config.schoolLongitude],
              [loc.latitude, loc.longitude]
            ]);
          } else {
            distanceLineRef.current = L.polyline(
              [
                [config.schoolLatitude, config.schoolLongitude],
                [loc.latitude, loc.longitude]
              ],
              {
                color: '#2563eb',
                weight: 2.5,
                dashArray: '5, 5'
              }
            ).addTo(mapInstanceRef.current);
          }

          // Fit bounds to show both school and user marker
          const bounds = L.latLngBounds([
            [config.schoolLatitude, config.schoolLongitude],
            [loc.latitude, loc.longitude]
          ]);
          mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
        }

        const d = calculateDistanceMeters(
          config.schoolLatitude,
          config.schoolLongitude,
          loc.latitude,
          loc.longitude
        );
        if (d <= config.allowedRangeMeters) {
          toast.success(`You are INSIDE allowed range (${d}m away)!`);
        } else {
          toast(`You are ${d}m away (Allowed: ${config.allowedRangeMeters}m)`, { icon: '⚠️' });
        }
      },
      (err) => {
        setIsLocating(false);
        toast.error(`GPS Error: ${err.message || 'Permission denied'}`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // ── Set Current GPS Location as School Center ──
  const setDeviceAsSchoolCenter = () => {
    if (!deviceLocation) {
      detectLiveLocation();
      return;
    }
    setConfig((prev) => ({
      ...prev,
      schoolLatitude: deviceLocation.latitude,
      schoolLongitude: deviceLocation.longitude
    }));
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([deviceLocation.latitude, deviceLocation.longitude], 17);
    }
    toast.success('School campus center set to your current device coordinates!');
  };

  // ── Save Configuration ──
  const handleSaveConfig = () => {
    tenantStore.saveGeofenceConfig(schoolId, config);
    toast.success('Geofence coordinates and allowed range saved successfully!');
  };

  // ── Test Attendance Punch ──
  const handleTestPunch = (type) => {
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

    const isWithin = dist != null && dist <= config.allowedRangeMeters;

    if (!isWithin && config.mode === 'strict') {
      toast.error(`Punch Rejected! You are ${dist}m away from school (Allowed: ${config.allowedRangeMeters}m).`);
      return;
    }

    const newPunch = {
      staffName: 'Admin / Faculty',
      type: type,
      distanceMeters: dist,
      allowedRangeMeters: config.allowedRangeMeters,
      status: isWithin ? 'APPROVED' : 'OUT_OF_RANGE',
      accuracy: deviceLocation.accuracy,
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    tenantStore.addGeofencePunch(schoolId, newPunch);
    setPunchLogs(tenantStore.getGeofencePunches(schoolId));

    if (isWithin) {
      toast.success(`${type} recorded successfully! (Within ${dist}m radius)`);
    } else {
      toast('Punch recorded with Out-of-Range warning', { icon: '⚠️' });
    }
  };

  const isWithin = distanceToSchool !== null && distanceToSchool <= config.allowedRangeMeters;

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
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Attendance Geofence & Allowed Range Setup</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Interactive Map
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag school pin on real map, adjust allowed radius boundary, and verify staff check-in proximity.
            </p>
          </div>
        </div>

        {/* Quick Save and Status */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">Allowed Perimeter:</p>
            <p className="text-sm font-black font-mono text-emerald-700">{config.allowedRangeMeters} Meters Radius</p>
          </div>
          <button
            onClick={handleSaveConfig}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Save className="w-4 h-4" /> Save Geofence Settings
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls (5 cols) + Right Real Map (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── LEFT PANEL: CONTROLS & RANGE SELECTOR ── */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Address Search & Location Setup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. School Location on Real Map
            </h2>

            {/* Address Search */}
            <form onSubmit={handleSearchAddress} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, school or address (e.g. Bhankrota, Jaipur)..."
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
                {isSearching ? 'Searching...' : 'Locate'}
              </button>
            </form>

            {/* School Campus Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Campus Name</label>
                <input
                  type="text"
                  value={config.campusName}
                  onChange={(e) => setConfig({ ...config, campusName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Latitude (° N)</label>
                <input
                  type="number"
                  step="0.000001"
                  value={config.schoolLatitude}
                  onChange={(e) => setConfig({ ...config, schoolLatitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Longitude (° E)</label>
                <input
                  type="number"
                  step="0.000001"
                  value={config.schoolLongitude}
                  onChange={(e) => setConfig({ ...config, schoolLongitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            {/* GPS Detection Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={detectLiveLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Acquiring GPS...' : 'Detect My Location'}
              </button>

              {deviceLocation && (
                <button
                  type="button"
                  onClick={setDeviceAsSchoolCenter}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Set as School Center
                </button>
              )}
            </div>
          </div>

          {/* 2. Allowed Range / Geofence Radius Picker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                2. Choose Allowed Range / Radius
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

            {/* Interactive Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                <span>Custom Range Slider:</span>
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
                <span>200m (Standard)</span>
                <span>2,000m (2 km)</span>
              </div>
            </div>

            {/* Enforcement Mode Selector */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Geofence Policy</label>
              <select
                value={config.mode}
                onChange={(e) => setConfig({ ...config, mode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="strict">Strict Enforcement (Block attendance if outside range)</option>
                <option value="warning">Warning Mode (Allow punch but flag as 'Out of Range')</option>
                <option value="disabled">Disabled (No GPS boundary check)</option>
              </select>
            </div>
          </div>

          {/* 3. Live Distance Check & Test Punch */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Proximity Status
            </h3>

            {distanceToSchool !== null ? (
              <div
                className={`p-4 rounded-xl border text-center transition-all ${
                  isWithin
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {isWithin ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <h4 className="font-black text-sm">
                    {isWithin ? 'Within Allowed Range!' : 'Outside Allowed Range!'}
                  </h4>
                </div>
                <p className="text-xs font-semibold">
                  Distance: <span className="font-mono font-black text-sm">{distanceToSchool} Meters</span> (Allowed:{' '}
                  {config.allowedRangeMeters}m)
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                Click <strong>"Detect My Location"</strong> above to test your live distance from the campus.
              </div>
            )}

            {/* Test Punch Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleTestPunch('PUNCH_IN')}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" /> Test Punch In
              </button>

              <button
                type="button"
                onClick={() => handleTestPunch('PUNCH_OUT')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Test Punch Out
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: REAL INTERACTIVE LEAFLET MAP (7 cols) ── */}
        <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[640px]">
          {/* Map Toolbar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                Interactive Campus Geofence Map (OpenStreetMap)
              </span>
            </div>

            {/* Map Layer Switcher: Street vs Satellite */}
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

          {/* Real Leaflet Map Container */}
          <div className="relative flex-1 w-full rounded-xl overflow-hidden mt-3 border border-slate-200 min-h-[500px]">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

            {/* Map Overlay Badge & Legend */}
            <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5 max-w-[210px]">
              <p className="font-black text-slate-900 text-[11px] uppercase tracking-wider">Map Legend</p>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold">
                  🏫
                </span>
                <span className="font-semibold text-[11px]">School Center Pin</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-600 bg-emerald-100" />
                <span className="font-semibold text-[11px]">
                  {config.allowedRangeMeters}m Allowed Radius
                </span>
              </div>
              {deviceLocation && (
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                    📍
                  </span>
                  <span className="text-[11px]">Your Live GPS Pin</span>
                </div>
              )}
            </div>

            {/* Instruction Callout at bottom */}
            <div className="absolute bottom-3 left-3 z-20 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-lg flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Tip: <strong>Drag the green school pin</strong> or click anywhere on the map to set campus center.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RECENT GEOFENCE PUNCH LOGS TABLE ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent GPS Proximity Punch Logs</h3>
            <p className="text-xs text-slate-500">Live audit record of staff check-in locations and allowed range verification</p>
          </div>
          <span className="text-xs font-bold text-slate-600">Total Punches: {punchLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Distance to Campus</th>
                <th className="py-3 px-4">Allowed Perimeter</th>
                <th className="py-3 px-4 text-center">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {punchLogs.length > 0 ? (
                punchLogs.map((log, i) => (
                  <tr key={log.id || i} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {log.date} {log.time}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.staffName}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{log.type}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.distanceMeters}m</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{log.allowedRangeMeters}m</td>
                    <td className="py-3 px-4 text-center">
                      {log.status === 'APPROVED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Within Range (Approved)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          ✕ Outside Range (Blocked)
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No GPS attendance punches logged yet. Click "Test Punch In" above to simulate check-in.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceGeofencePage;
