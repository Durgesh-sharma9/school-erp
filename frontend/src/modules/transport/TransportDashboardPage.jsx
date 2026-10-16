import React, { useState } from 'react';
import {
  Bus,
  Route,
  MapPin,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  Compass,
  PhoneCall,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportDashboardPage({ onNavigate }) {
  const [filterRoute, setFilterRoute] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingModalBus, setTrackingModalBus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  // Comprehensive Fleet Dataset (Realistic School Fleet Data with authentic fares & occupancy)
  const fleetData = [
    {
      id: 1,
      vehicleNo: 'RJ14PC1019',
      type: 'Bus (42 Seater)',
      capacity: 42,
      occupied: 38,
      driver: 'HANSRAJ JAT',
      phone: '9829012345',
      route: 'Kalwara, Ajairajpura',
      destinationsCount: 4,
      status: 'En Route',
      speed: '42 km/h',
      currentLocation: 'Near 7R Resort, Kalwara Road',
      nextStop: 'Ajairajpura Chowk',
      eta: '8 mins',
      gpsId: 'GPS-RJ14-101',
      pucValidity: '2026-11-30',
      fitnessValidity: '2026-12-15',
      insuranceValidity: '2027-04-10',
      collection: { demand: 1140000, collected: 760000, due: 380000 }
    },
    {
      id: 2,
      vehicleNo: 'RJ40PA1179',
      type: 'Bus (42 Seater)',
      capacity: 42,
      occupied: 36,
      driver: 'LALARAM',
      phone: '9414054321',
      route: 'Thikriya, Vatika',
      destinationsCount: 3,
      status: 'En Route',
      speed: '38 km/h',
      currentLocation: 'Vatika Crossing',
      nextStop: 'Sidha Aangan Township',
      eta: '12 mins',
      gpsId: 'GPS-RJ40-117',
      pucValidity: '2026-11-15',
      fitnessValidity: '2026-12-10',
      insuranceValidity: '2027-03-25',
      collection: { demand: 1296000, collected: 864000, due: 432000 }
    },
    {
      id: 3,
      vehicleNo: 'RJ02PA2762',
      type: 'Bus (42 Seater)',
      capacity: 42,
      occupied: 40,
      driver: 'SHAITAN SINGH',
      phone: '8947919195',
      route: 'Jaisinghpura, Rampura',
      destinationsCount: 4,
      status: 'Reached School',
      speed: '0 km/h',
      currentLocation: 'Campus Parking Bay 3',
      nextStop: 'Trip Completed',
      eta: 'On Time',
      gpsId: 'GPS-RJ02-998',
      pucValidity: '2026-12-31',
      fitnessValidity: '2027-01-20',
      insuranceValidity: '2027-06-15',
      collection: { demand: 1122000, collected: 748000, due: 374000 }
    },
    {
      id: 4,
      vehicleNo: 'RJ20PA9932',
      type: 'Bus (50 Seater)',
      capacity: 50,
      occupied: 44,
      driver: 'BHARAT JANGID',
      phone: '9828884422',
      route: 'Auric City & Shub Nilay',
      destinationsCount: 3,
      status: 'En Route',
      speed: '45 km/h',
      currentLocation: 'Opposite Auric City Gate 2',
      nextStop: 'Shubh Nilay Sector 4',
      eta: '5 mins',
      gpsId: 'GPS-RJ20-993',
      pucValidity: '2027-02-10',
      fitnessValidity: '2027-04-15',
      insuranceValidity: '2027-05-20',
      collection: { demand: 1161600, collected: 774400, due: 387200 }
    },
    {
      id: 5,
      vehicleNo: 'RJ14PC7878',
      type: 'Bus (42 Seater)',
      capacity: 42,
      occupied: 32,
      driver: 'BABU LAL',
      phone: '9782110022',
      route: 'Manglam Aangan',
      destinationsCount: 2,
      status: 'En Route',
      speed: '35 km/h',
      currentLocation: 'Dream Avenue Gate',
      nextStop: 'Manglam Aangan Main Park',
      eta: '10 mins',
      gpsId: 'GPS-RJ14-787',
      pucValidity: '2026-11-20',
      fitnessValidity: '2026-12-28',
      insuranceValidity: '2027-01-18',
      collection: { demand: 897600, collected: 598400, due: 299200 }
    },
    {
      id: 6,
      vehicleNo: 'RJ14PC1037',
      type: 'Bus (50 Seater)',
      capacity: 50,
      occupied: 42,
      driver: 'PRAKASH CHOUDHARY',
      phone: '9660334411',
      route: 'Mangalam Grand City',
      destinationsCount: 3,
      status: 'Reached School',
      speed: '0 km/h',
      currentLocation: 'Campus Parking Bay 1',
      nextStop: 'Trip Completed',
      eta: 'On Time',
      gpsId: 'GPS-RJ14-103',
      pucValidity: '2027-01-15',
      fitnessValidity: '2026-12-05',
      insuranceValidity: '2027-07-22',
      collection: { demand: 1178100, collected: 785400, due: 392700 }
    },
    {
      id: 7,
      vehicleNo: 'RJ19PB7511',
      type: 'Bus (42 Seater)',
      capacity: 42,
      occupied: 35,
      driver: 'RAJU IPS',
      phone: '9982445566',
      route: 'Narsinghpura, Ramchandrapura',
      destinationsCount: 3,
      status: 'En Route',
      speed: '40 km/h',
      currentLocation: 'Ring Road Crossing',
      nextStop: 'Ramchandrapura Stand',
      eta: '15 mins',
      gpsId: 'GPS-RJ19-751',
      pucValidity: '2026-10-30', // Expiring in 14 days
      fitnessValidity: '2026-11-30',
      insuranceValidity: '2027-02-14',
      collection: { demand: 1097250, collected: 731500, due: 365750 }
    },
    {
      id: 8,
      vehicleNo: 'RJ14PC5938',
      type: 'Bus (45 Seater)',
      capacity: 45,
      occupied: 39,
      driver: 'NARESH',
      phone: '9414223344',
      route: 'Aasra, J K Lakshmipat University',
      destinationsCount: 3,
      status: 'En Route',
      speed: '32 km/h',
      currentLocation: 'Ashiyana Umang Phase 2',
      nextStop: 'JK Lakshmipat Gate',
      eta: '7 mins',
      gpsId: 'GPS-RJ14-593',
      pucValidity: '2026-12-15',
      fitnessValidity: '2027-02-15',
      insuranceValidity: '2027-08-10',
      collection: { demand: 1158300, collected: 772200, due: 386100 }
    },
    {
      id: 9,
      vehicleNo: 'RJ14PC2278',
      type: 'Bus (40 Seater)',
      capacity: 40,
      occupied: 34,
      driver: 'SHYAM SUNDER',
      phone: '9829556677',
      route: 'Bhankrota, Mojika, Hanging Gardens',
      destinationsCount: 3,
      status: 'En Route',
      speed: '44 km/h',
      currentLocation: 'Hanging Gardens Entrance',
      nextStop: 'Bhankrota Circle',
      eta: '9 mins',
      gpsId: 'GPS-RJ14-227',
      pucValidity: '2026-10-25', // Expiring in 9 days
      fitnessValidity: '2026-11-18',
      insuranceValidity: '2027-03-30',
      collection: { demand: 1065900, collected: 710600, due: 355300 }
    },
    {
      id: 10,
      vehicleNo: 'RJ14PE0832',
      type: 'Bus (42 Seater)',
      capacity: 42,
      occupied: 28,
      driver: 'RAMESH',
      phone: '9602441188',
      route: 'Khatwara',
      destinationsCount: 3,
      status: 'Maintenance',
      speed: '0 km/h',
      currentLocation: 'Authorized Service Center (Brake Inspection)',
      nextStop: 'Standby / Backup Ready',
      eta: 'Available tomorrow',
      gpsId: 'GPS-RJ14-083',
      pucValidity: '2026-12-05',
      fitnessValidity: '2027-03-10',
      insuranceValidity: '2027-09-05',
      collection: { demand: 785400, collected: 523600, due: 261800 }
    }
  ];

  // Upcoming Document Expiry Alerts
  const complianceAlerts = [
    { vehicleNo: 'RJ14PC2278', doc: 'PUC Certificate', date: '25 Oct 2026', daysLeft: 9, status: 'Urgent Renewal', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { vehicleNo: 'RJ19PB7511', doc: 'PUC Certificate', date: '30 Oct 2026', daysLeft: 14, status: 'Expiring Soon', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { vehicleNo: 'RJ40PA1179', doc: 'Fitness Certificate', date: '10 Dec 2026', daysLeft: 55, status: 'Active Watch', color: 'text-blue-700 bg-blue-50 border-blue-200' }
  ];

  // Aggregated Stats
  const totalVehicles = fleetData.length;
  const activeEnRoute = fleetData.filter(v => v.status === 'En Route').length;
  const reachedSchool = fleetData.filter(v => v.status === 'Reached School').length;
  const inMaintenance = fleetData.filter(v => v.status === 'Maintenance').length;

  const totalSeats = fleetData.reduce((acc, v) => acc + v.capacity, 0);
  const totalOccupied = fleetData.reduce((acc, v) => acc + v.occupied, 0);
  const occupancyPercentage = Math.round((totalOccupied / totalSeats) * 100);

  const totalDemand = fleetData.reduce((acc, v) => acc + v.collection.demand, 0);
  const totalCollected = fleetData.reduce((acc, v) => acc + v.collection.collected, 0);
  const totalDue = totalDemand - totalCollected;

  // Filtered dataset
  const filteredFleet = fleetData.filter(item => {
    const matchesRoute = filterRoute === 'All' || item.route === filterRoute;
    const matchesSearch =
      item.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
      toast.success('Live GPS coordinates & fleet status refreshed');
    }, 600);
  };

  return (
    <div className="p-3.5 sm:p-4 max-w-7xl mx-auto space-y-3.5">
      {/* 1:1 UAB Breadcrumb & Hero Header (Compact) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 px-4 rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-0.5">
            <span className="cursor-pointer hover:text-slate-600" onClick={() => onNavigate && onNavigate('/dashboard')}>Home</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-medium">Transport Dashboard</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Bus className="w-4 h-4" />
            </div>
            <span>Transport Dashboard & Fleet Operations</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time tracking, vehicle capacities, route assignments & transport fee health overview
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync GPS ({lastUpdated})</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/transport-vehicle')}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors"
          >
            <Bus className="w-3 h-3" />
            <span>Vehicles</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/transport-assign-routes')}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors"
          >
            <Route className="w-3 h-3" />
            <span>Routes</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate('/transport-due-report')}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <CreditCard className="w-3 h-3" />
            <span>Due Report</span>
          </button>
        </div>
      </div>

      {/* Top Key Metrics KPI Grid (Compact 4-Cols) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Fleet Overview */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fleet Status</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Bus className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-slate-900">{totalVehicles} Vehicles</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {activeEnRoute} En Route
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 text-[10px]">
                {reachedSchool} At Campus
              </span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Standby / Service:</span>
            <span className="font-bold text-amber-600">{inMaintenance} Bus</span>
          </div>
        </div>

        {/* KPI 2: Seating Capacity & Occupancy */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student Occupancy</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-slate-900">{totalOccupied} Students</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Total capacity: {totalSeats} seats</p>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
              <span className="text-slate-600">Capacity Utilization</span>
              <span className="text-indigo-600 font-bold">{occupancyPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 3: Transport Fee Collection */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transport Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-emerald-600">₹{totalCollected.toLocaleString('en-IN')}</div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
              <span>Total Demand:</span>
              <span className="font-bold text-slate-800">₹{totalDemand.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Pending Dues:</span>
            <span className="font-bold text-rose-600">₹{totalDue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* KPI 4: Compliance & Document Alerts */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Compliance & Health</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-amber-600">{complianceAlerts.length} Expiries</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Upcoming within 30-60 days</p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">GPS Live Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Online
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Warning Banner if any urgent items (Compact) */}
      {complianceAlerts.some(a => a.daysLeft <= 15) && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border border-amber-200 rounded-xl p-2.5 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Regulatory Compliance Alert</h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Vehicles <span className="font-mono font-bold">RJ14PC2278</span> and <span className="font-mono font-bold">RJ19PB7511</span> have PUC Certificates expiring within 14 days. Please renew promptly.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('/transport-vehicle')}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg whitespace-nowrap self-start sm:self-auto shadow-2xs cursor-pointer transition-colors"
          >
            Manage Documents
          </button>
        </div>
      )}

      {/* Main Interactive Fleet Grid / Operations View */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Header & Filter Controls (Compact) */}
        <div className="p-3 px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Live Fleet Operations & Route Status</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Real-time telemetry, driver contacts, ETA, passenger count, and route destinations
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search bus, driver, route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 w-48 outline-none"
              />
            </div>

            {/* Route Dropdown Filter */}
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Routes (10)</option>
              {Array.from(new Set(fleetData.map(f => f.route))).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bus Card Grid (Compact & High Information Density) */}
        <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFleet.map((bus) => {
            const isEnRoute = bus.status === 'En Route';
            const isAtSchool = bus.status === 'Reached School';

            return (
              <div
                key={bus.id}
                className="border border-slate-200 hover:border-indigo-300 rounded-xl p-3 transition-all duration-200 hover:shadow-xs bg-white flex flex-col justify-between space-y-2.5"
              >
                {/* Bus Title & Live Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isEnRoute ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      isAtSchool ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 text-xs">{bus.vehicleNo}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {bus.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-indigo-700 mt-0.5 flex items-center gap-1">
                        <Route className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[200px]">{bus.route}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    isEnRoute ? 'bg-emerald-100/80 text-emerald-800' :
                    isAtSchool ? 'bg-blue-100/80 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {isEnRoute && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>}
                    {bus.status}
                  </span>
                </div>

                {/* Telemetry & Stop Details */}
                <div className="grid grid-cols-2 gap-1.5 bg-slate-50/80 p-2.5 rounded-lg text-[11px] border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Current Location:</span>
                    <span className="font-semibold text-slate-800 truncate block" title={bus.currentLocation}>
                      {bus.currentLocation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Next Stop / ETA:</span>
                    <span className="font-semibold text-slate-800 block">
                      {bus.nextStop} ({bus.eta})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Driver:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <PhoneCall className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{bus.driver}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Occupancy:</span>
                    <span className="font-semibold text-slate-800 block">
                      {bus.occupied} / {bus.capacity} ({Math.round((bus.occupied / bus.capacity) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar of Occupancy */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Fill Rate</span>
                    <span>{Math.round((bus.occupied / bus.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-1 rounded-full ${
                        (bus.occupied / bus.capacity) > 0.9 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(bus.occupied / bus.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {bus.gpsId}
                    </span>
                    {isEnRoute && (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[11px]">
                        <Navigation className="w-2.5 h-2.5" /> {bus.speed}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTrackingModalBus(bus)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Navigation className="w-2.5 h-2.5" />
                      <span>Live GPS</span>
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('/transport-due-report')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition-colors text-[11px] cursor-pointer"
                    >
                      Fee Due
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route-Wise Financial Summary & Compliance Summary Side-by-Side (Compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left (2 Cols): Route-Wise Collection Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Route-Wise Fee Collection & Due Metrics</span>
              </h3>
              <p className="text-[11px] text-slate-500">Financial health across 10 active transport routes</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('/transport-due-report')}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              <span>Full Due Report</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2.5">Route Name</th>
                  <th className="py-2 px-2.5">Bus No.</th>
                  <th className="py-2 px-2.5 text-right">Demand (₹)</th>
                  <th className="py-2 px-2.5 text-right">Collected (₹)</th>
                  <th className="py-2 px-2.5 text-right">Due (₹)</th>
                  <th className="py-2 px-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {fleetData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-1.5 px-2.5 font-semibold text-slate-800">{item.route}</td>
                    <td className="py-1.5 px-2.5 font-mono font-bold text-indigo-700">{item.vehicleNo}</td>
                    <td className="py-1.5 px-2.5 text-right font-medium">₹{item.collection.demand.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-emerald-600">₹{item.collection.collected.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-rose-600">₹{item.collection.due.toLocaleString('en-IN')}</td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {Math.round((item.collection.collected / item.collection.demand) * 100)}% Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (1 Col): Vehicle Document Expiry Tracker */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Document Expiry Watch</span>
              </h3>
              <p className="text-[11px] text-slate-500">Upcoming vehicle fitness, PUC & permits</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('/transport-vehicle')}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {complianceAlerts.map((alert, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg border ${alert.color} space-y-0.5`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs">{alert.vehicleNo}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 shadow-2xs">
                    {alert.daysLeft} Days Left
                  </span>
                </div>
                <div className="text-[11px] font-semibold">{alert.doc}</div>
                <div className="flex items-center justify-between text-[10px] opacity-80 pt-0.5">
                  <span>Due Date: {alert.date}</span>
                  <span className="underline font-bold cursor-pointer" onClick={() => onNavigate && onNavigate('/transport-vehicle')}>Renew</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Info Box */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
            <div className="font-bold text-slate-800">Transport Help Desk</div>
            <p className="text-[11px] text-slate-500">
              Transport Incharge: <span className="font-semibold text-slate-700">Mr. Vikramaditya Singh</span>
              <br />Emergency Hotline: <span className="font-semibold text-slate-700">+91 98290-00123</span>
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Live GPS Map Modal */}
      {trackingModalBus && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <span>Live GPS Telemetry:</span>
                    <span className="font-mono text-indigo-600">{trackingModalBus.vehicleNo}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Route: {trackingModalBus.route} &bull; Device ID: {trackingModalBus.gpsId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrackingModalBus(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Map Simulation */}
            <div className="p-6 space-y-5">
              {/* Simulated Map Canvas */}
              <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
                {/* Visual Grid Lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Animated Bus Marker */}
                <div className="relative z-10 text-center space-y-2">
                  <div className="relative inline-block">
                    <span className="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping"></span>
                    <div className="w-14 h-14 rounded-full bg-emerald-600 border-4 border-white text-white flex items-center justify-center shadow-xl mx-auto">
                      <Bus className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 text-white text-xs shadow-lg">
                    <div className="font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Speed: {trackingModalBus.speed}
                    </div>
                    <div className="text-slate-300 mt-0.5">{trackingModalBus.currentLocation}</div>
                  </div>
                </div>

                {/* Compass HUD */}
                <div className="absolute top-3 right-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-300 font-mono">
                  LAT: 26.8392° N &bull; LON: 75.6499° E
                </div>
              </div>

              {/* Trip Metadata Cards */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Driver</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{trackingModalBus.driver}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">{trackingModalBus.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Next Stop</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{trackingModalBus.nextStop}</span>
                  <span className="text-[11px] text-indigo-600 font-semibold">ETA: {trackingModalBus.eta}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Onboard</span>
                  <span className="font-bold text-slate-900 block mt-0.5">
                    {trackingModalBus.occupied} Students
                  </span>
                  <span className="text-[11px] text-slate-500">Max {trackingModalBus.capacity} Seats</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Connected via AIS-140 Certified GPS Satellite Feed
              </span>
              <button
                onClick={() => setTrackingModalBus(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
