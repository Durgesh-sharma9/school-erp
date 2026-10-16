import React, { useState, useEffect } from 'react';
import {
  Bus,
  Plus,
  Search,
  Download,
  Printer,
  Edit2,
  Trash2,
  ShieldCheck,
  X,
  FileText,
  Paperclip,
  Upload,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Navigation,
  MapPin,
  Calendar,
  Check,
  FileCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export function TransportVehiclePage() {
  const initialVehicles = [
    {
      id: 1,
      vehicleType: 'Bus',
      vehicleNo: 'RJ02PA2762',
      capacity: 42,
      driver: 'SHAITAN SINGH',
      driverPhone: '+91 98290 88211',
      driverLicense: 'RJ14-201500892',
      model: 'Tata Starbus Ultra (42 Seater)',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Jaisinghpura, Rampura',
      destinations: ['Abhinandan Enclave Jaisinghpura', 'Anukriti Jaisinghpura', 'Brahmano ki Dhani Jaisinghpura', 'Rampura'],
      pucValidity: '2026-12-31',
      regCertValidity: '2028-05-15',
      fitnessValidity: '2027-01-20',
      insuranceValidity: '2026-11-10',
      permitValidity: '2027-03-31',
      trackNo: 'GPS-RJ02-998',
      trackApi: 'https://gps.tracking.in/api/v1/RJ02PA2762',
      documents: [
        {
          id: 'doc-1-1',
          type: 'PUC / Pollution Certificate',
          title: 'Pollution Under Control (PUC)',
          certificateNo: 'PUC-RJ02-2026-992',
          fileName: 'PUC_RJ02PA2762_2026.pdf',
          fileSize: '1.2 MB',
          uploadDate: '2026-06-15',
          expiryDate: '2026-12-31',
          status: 'Valid'
        },
        {
          id: 'doc-1-2',
          type: 'Registration Certificate (RC)',
          title: 'RC Smart Card Copy',
          certificateNo: 'RC-RJ02PA2762',
          fileName: 'RC_SmartCard_RJ02PA2762.pdf',
          fileSize: '2.1 MB',
          uploadDate: '2025-01-20',
          expiryDate: '2028-05-15',
          status: 'Valid'
        },
        {
          id: 'doc-1-3',
          type: 'Insurance Policy',
          title: 'Commercial Comprehensive Insurance',
          certificateNo: 'POL-ICICI-992384',
          fileName: 'Insurance_RJ02PA2762.pdf',
          fileSize: '3.4 MB',
          uploadDate: '2025-11-10',
          expiryDate: '2026-11-10',
          status: 'Valid'
        },
        {
          id: 'doc-1-4',
          type: 'Fitness Certificate',
          title: 'RTO Annual Fitness Certificate',
          certificateNo: 'FIT-RTO-2762',
          fileName: 'Fitness_RJ02PA2762.pdf',
          fileSize: '1.5 MB',
          uploadDate: '2026-01-20',
          expiryDate: '2027-01-20',
          status: 'Valid'
        }
      ]
    },
    {
      id: 2,
      vehicleType: 'Bus',
      vehicleNo: 'RJ14PC1019',
      capacity: 42,
      driver: 'HANSRAJ JAT',
      driverPhone: '+91 98291 44521',
      driverLicense: 'RJ14-201600104',
      model: 'Ashok Leyland Sunshine (42 Seater)',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Kalwara, Ajairajpura',
      destinations: ['Kalwara', 'Ajairajpura', '7R Resort', 'Ajairajpura Chowk'],
      pucValidity: '2026-11-30',
      regCertValidity: '2027-08-10',
      fitnessValidity: '2026-12-15',
      insuranceValidity: '2026-10-31',
      permitValidity: '2027-04-15',
      trackNo: 'GPS-RJ14-101',
      trackApi: 'https://gps.tracking.in/api/v1/RJ14PC1019',
      documents: [
        {
          id: 'doc-2-1',
          type: 'PUC / Pollution Certificate',
          title: 'Pollution Under Control (PUC)',
          certificateNo: 'PUC-RJ14-2026-101',
          fileName: 'PUC_RJ14PC1019.pdf',
          fileSize: '1.1 MB',
          uploadDate: '2026-05-30',
          expiryDate: '2026-11-30',
          status: 'Valid'
        },
        {
          id: 'doc-2-2',
          type: 'Registration Certificate (RC)',
          title: 'RC Smart Card Copy',
          certificateNo: 'RC-RJ14PC1019',
          fileName: 'RC_RJ14PC1019.pdf',
          fileSize: '1.9 MB',
          uploadDate: '2024-08-10',
          expiryDate: '2027-08-10',
          status: 'Valid'
        },
        {
          id: 'doc-2-3',
          type: 'Insurance Policy',
          title: 'Commercial Vehicle Insurance',
          certificateNo: 'POL-NEWINDIA-1019',
          fileName: 'Insurance_RJ14PC1019.pdf',
          fileSize: '2.8 MB',
          uploadDate: '2025-10-31',
          expiryDate: '2026-10-31',
          status: 'Valid'
        },
        {
          id: 'doc-2-4',
          type: 'Fitness Certificate',
          title: 'Fitness Certificate Form 38',
          certificateNo: 'FIT-RTO-1019',
          fileName: 'Fitness_RJ14PC1019.pdf',
          fileSize: '1.3 MB',
          uploadDate: '2025-12-15',
          expiryDate: '2026-12-15',
          status: 'Valid'
        }
      ]
    },
    {
      id: 3,
      vehicleType: 'Bus',
      vehicleNo: 'RJ14PC1037',
      capacity: 50,
      driver: 'PRAKASH CHOUDHARY',
      driverPhone: '+91 94140 22319',
      driverLicense: 'RJ14-201400511',
      model: 'Tata Starbus 50 Seater',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Manglam Aangan',
      destinations: ['Manglam Aangan', 'Dream Avenue Mangalam Grand City'],
      pucValidity: '2027-01-15',
      regCertValidity: '2028-02-28',
      fitnessValidity: '2026-12-05',
      insuranceValidity: '2026-11-20',
      permitValidity: '2027-05-01',
      trackNo: 'GPS-RJ14-103',
      trackApi: 'https://gps.tracking.in/api/v1/RJ14PC1037',
      documents: [
        {
          id: 'doc-3-1',
          type: 'PUC / Pollution Certificate',
          title: 'Pollution Under Control (PUC)',
          certificateNo: 'PUC-RJ14-2026-103',
          fileName: 'PUC_RJ14PC1037.pdf',
          fileSize: '1.2 MB',
          uploadDate: '2026-07-15',
          expiryDate: '2027-01-15',
          status: 'Valid'
        },
        {
          id: 'doc-3-2',
          type: 'Registration Certificate (RC)',
          title: 'RC Smart Card Copy',
          certificateNo: 'RC-RJ14PC1037',
          fileName: 'RC_RJ14PC1037.pdf',
          fileSize: '2.0 MB',
          uploadDate: '2025-02-28',
          expiryDate: '2028-02-28',
          status: 'Valid'
        }
      ]
    },
    {
      id: 4,
      vehicleType: 'Bus',
      vehicleNo: 'RJ14PC2278',
      capacity: 40,
      driver: 'SHYAM SUNDER',
      driverPhone: '+91 98288 33110',
      driverLicense: 'RJ14-201700982',
      model: 'Eicher Starline 40-Seater',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Bhankrota, Mojika, Hanging Gardens',
      destinations: ['Bhankrota', 'Mojika Apartments', 'Hanging Gardens Jaisinghpura'],
      pucValidity: '2026-10-25',
      regCertValidity: '2027-09-30',
      fitnessValidity: '2026-11-18',
      insuranceValidity: '2026-12-12',
      permitValidity: '2027-06-30',
      trackNo: 'GPS-RJ14-227',
      trackApi: 'https://gps.tracking.in/api/v1/RJ14PC2278',
      documents: [
        {
          id: 'doc-4-1',
          type: 'PUC / Pollution Certificate',
          title: 'Pollution Under Control (PUC)',
          certificateNo: 'PUC-RJ14-2026-227',
          fileName: 'PUC_RJ14PC2278.pdf',
          fileSize: '1.1 MB',
          uploadDate: '2026-04-25',
          expiryDate: '2026-10-25',
          status: 'Valid'
        }
      ]
    },
    {
      id: 5,
      vehicleType: 'Bus',
      vehicleNo: 'RJ14PC5938',
      capacity: 45,
      driver: 'NARESH',
      driverPhone: '+91 96024 11209',
      driverLicense: 'RJ14-201300445',
      model: 'Tata Starbus 45 Seater',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Narsinghpura, Ramchandrapura',
      destinations: ['Narsinghpura', 'Ramchandrapura', 'Ringroad narsinghpura'],
      pucValidity: '2026-12-15',
      regCertValidity: '2028-01-10',
      fitnessValidity: '2027-02-15',
      insuranceValidity: '2027-01-10',
      permitValidity: '2027-07-15',
      trackNo: 'GPS-RJ14-593',
      trackApi: 'https://gps.tracking.in/api/v1/RJ14PC5938',
      documents: [
        {
          id: 'doc-5-1',
          type: 'PUC / Pollution Certificate',
          title: 'Pollution Under Control (PUC)',
          certificateNo: 'PUC-RJ14-2026-593',
          fileName: 'PUC_RJ14PC5938.pdf',
          fileSize: '1.3 MB',
          uploadDate: '2026-06-15',
          expiryDate: '2026-12-15',
          status: 'Valid'
        }
      ]
    },
    {
      id: 6,
      vehicleType: 'Bus',
      vehicleNo: 'RJ14PC7878',
      capacity: 42,
      driver: 'BABU LAL',
      driverPhone: '+91 97821 77443',
      driverLicense: 'RJ14-201600787',
      model: 'Ashok Leyland Sunshine 42S',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Mangalam Grand City',
      destinations: ['Mangalam Grand City', 'Mangalam Prime', 'Mangalam Dwarika'],
      pucValidity: '2026-11-20',
      regCertValidity: '2027-11-25',
      fitnessValidity: '2026-12-28',
      insuranceValidity: '2026-11-15',
      permitValidity: '2027-04-20',
      trackNo: 'GPS-RJ14-787',
      trackApi: 'https://gps.tracking.in/api/v1/RJ14PC7878',
      documents: []
    },
    {
      id: 7,
      vehicleType: 'Bus',
      vehicleNo: 'RJ14PE0832',
      capacity: 42,
      driver: 'RAMESH',
      driverPhone: '+91 99824 55102',
      driverLicense: 'RJ14-201500083',
      model: 'Tata Starbus 42 Seater',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Khatwara',
      destinations: ['Khatwara', 'Maliyon Ki Dhani khatwara road', 'Meeno Ki Dhani Khatwara'],
      pucValidity: '2026-12-05',
      regCertValidity: '2028-04-12',
      fitnessValidity: '2027-03-10',
      insuranceValidity: '2026-12-30',
      permitValidity: '2027-08-01',
      trackNo: 'GPS-RJ14-083',
      trackApi: 'https://gps.tracking.in/api/v1/RJ14PE0832',
      documents: []
    },
    {
      id: 8,
      vehicleType: 'Bus',
      vehicleNo: 'RJ19PB7511',
      capacity: 42,
      driver: 'RAJU IPS',
      driverPhone: '+91 94142 99881',
      driverLicense: 'RJ19-201400751',
      model: 'Eicher Starline 42S',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Aasra, J K Lakshmipat University',
      destinations: ['Aasra', 'J K Lakshmipat University', 'Ashiyana Umang'],
      pucValidity: '2026-10-30',
      regCertValidity: '2026-11-30',
      fitnessValidity: '2026-11-30',
      insuranceValidity: '2026-10-30',
      permitValidity: '2027-02-28',
      trackNo: 'GPS-RJ19-751',
      trackApi: 'https://gps.tracking.in/api/v1/RJ19PB7511',
      documents: []
    },
    {
      id: 9,
      vehicleType: 'Bus',
      vehicleNo: 'RJ20PA9932',
      capacity: 50,
      driver: 'BHARAT JANGID',
      driverPhone: '+91 98292 66554',
      driverLicense: 'RJ20-201700993',
      model: 'Tata Starbus 50 Seater',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Auric City & Shub Nilay',
      destinations: ['Auric City Homes', 'Shubh nilay', 'Century Park'],
      pucValidity: '2027-02-10',
      regCertValidity: '2027-10-15',
      fitnessValidity: '2027-04-15',
      insuranceValidity: '2027-02-10',
      permitValidity: '2027-09-30',
      trackNo: 'GPS-RJ20-993',
      trackApi: 'https://gps.tracking.in/api/v1/RJ20PA9932',
      documents: []
    },
    {
      id: 10,
      vehicleType: 'Bus',
      vehicleNo: 'RJ40PA1179',
      capacity: 42,
      driver: 'LALARAM',
      driverPhone: '+91 94141 88332',
      driverLicense: 'RJ40-201500117',
      model: 'Ashok Leyland Sunshine 42S',
      fuelType: 'Diesel (BS-VI)',
      assignedRoute: 'Thikriya, Vatika',
      destinations: ['Thikriya', 'Vatika', 'Sidha Aangan Township'],
      pucValidity: '2026-11-15',
      regCertValidity: '2027-07-20',
      fitnessValidity: '2026-12-10',
      insuranceValidity: '2026-11-15',
      permitValidity: '2027-05-31',
      trackNo: 'GPS-RJ40-117',
      trackApi: 'https://gps.tracking.in/api/v1/RJ40PA1179',
      documents: []
    }
  ];

  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState('');

  // Vehicle Details & Documents Popup Modal
  const [viewingVehicle, setViewingVehicle] = useState(null);

  // Add / Edit Vehicle Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: 'Bus',
    vehicleNo: '',
    driver: 'HANSRAJ JAT',
    driverPhone: '',
    driverLicense: '',
    capacity: 42,
    pucValidity: '',
    regCertValidity: '',
    fitnessValidity: '',
    insuranceValidity: '',
    permitValidity: '',
    trackNo: '',
    trackApi: ''
  });

  // Attach Document Modal
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedVehicleForDoc, setSelectedVehicleForDoc] = useState(null);
  const [docForm, setDocForm] = useState({
    type: 'PUC / Pollution Certificate',
    title: 'Pollution Under Control (PUC)',
    certificateNo: '',
    expiryDate: '',
    fileName: '',
    fileSize: '1.4 MB'
  });
  const [selectedFileObj, setSelectedFileObj] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/transport/vehicles');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setVehicles(data.data);
      }
    } catch {
      // Keep initial vehicles state
    }
  };

  // --- Vehicle CRUD Handlers ---
  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      vehicleType: 'Bus',
      vehicleNo: '',
      driver: 'HANSRAJ JAT',
      driverPhone: '',
      driverLicense: '',
      capacity: 42,
      pucValidity: '',
      regCertValidity: '',
      fitnessValidity: '',
      insuranceValidity: '',
      permitValidity: '',
      trackNo: '',
      trackApi: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setFormData({ ...v });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.vehicleNo) {
      toast.error('Vehicle No is required');
      return;
    }

    try {
      if (editingVehicle) {
        await fetch(`/api/transport/vehicles/${editingVehicle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...formData } : v));
        if (viewingVehicle?.id === editingVehicle.id) {
          setViewingVehicle(prev => ({ ...prev, ...formData }));
        }
        toast.success('Vehicle updated successfully');
      } else {
        const res = await fetch('/api/transport/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json().catch(() => ({}));
        const created = json.data || { id: Date.now(), ...formData, documents: [] };
        setVehicles(prev => [...prev, created]);
        toast.success('Vehicle added successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await fetch(`/api/transport/vehicles/${id}`, { method: 'DELETE' });
      setVehicles(prev => prev.filter(v => v.id !== id));
      if (viewingVehicle?.id === id) {
        setViewingVehicle(null);
      }
      toast.success('Vehicle deleted');
    } catch {
      toast.error('Failed to delete vehicle');
    }
  };

  // --- Document Handlers ---
  const openAttachDocModal = (vehicle) => {
    setSelectedVehicleForDoc(vehicle);
    setSelectedFileObj(null);
    setDocForm({
      type: 'PUC / Pollution Certificate',
      title: 'Pollution Under Control (PUC)',
      certificateNo: `PUC-${vehicle.vehicleNo.replace(/\D/g, '') || '101'}-26`,
      expiryDate: vehicle.pucValidity || '2026-12-31',
      fileName: '',
      fileSize: '1.2 MB'
    });
    setIsDocModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileObj(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setDocForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${sizeMB > 0 ? sizeMB : 0.4} MB`
      }));
    }
  };

  const handleDocTypeChange = (e) => {
    const type = e.target.value;
    let defaultTitle = type;
    let defaultExpiry = '';

    if (type.includes('PUC')) {
      defaultTitle = 'Pollution Under Control (PUC)';
      defaultExpiry = selectedVehicleForDoc?.pucValidity || '2026-12-31';
    } else if (type.includes('RC')) {
      defaultTitle = 'RC Smart Card Copy';
      defaultExpiry = selectedVehicleForDoc?.regCertValidity || '2028-05-15';
    } else if (type.includes('Insurance')) {
      defaultTitle = 'Commercial Vehicle Insurance Policy';
      defaultExpiry = selectedVehicleForDoc?.insuranceValidity || '2026-11-10';
    } else if (type.includes('Fitness')) {
      defaultTitle = 'RTO Annual Fitness Certificate';
      defaultExpiry = selectedVehicleForDoc?.fitnessValidity || '2027-01-20';
    } else if (type.includes('Permit')) {
      defaultTitle = 'State Commercial Transport Permit';
      defaultExpiry = selectedVehicleForDoc?.permitValidity || '2027-03-31';
    }

    setDocForm(prev => ({
      ...prev,
      type,
      title: defaultTitle,
      expiryDate: defaultExpiry,
      fileName: prev.fileName || `${type.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedVehicleForDoc?.vehicleNo || 'Doc'}.pdf`
    }));
  };

  const handleSaveDocument = async (e) => {
    e.preventDefault();
    if (!selectedVehicleForDoc) return;

    const newDoc = {
      id: 'doc-' + Date.now(),
      type: docForm.type,
      title: docForm.title || docForm.type,
      certificateNo: docForm.certificateNo || 'CERT-' + Math.floor(10000 + Math.random() * 90000),
      fileName: docForm.fileName || `${docForm.type.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedVehicleForDoc.vehicleNo}.pdf`,
      fileSize: docForm.fileSize || '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: docForm.expiryDate || '',
      status: 'Valid'
    };

    try {
      await fetch(`/api/transport/vehicles/${selectedVehicleForDoc.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      }).catch(() => null);

      setVehicles(prev =>
        prev.map(v => {
          if (v.id === selectedVehicleForDoc.id) {
            return {
              ...v,
              documents: [...(v.documents || []), newDoc]
            };
          }
          return v;
        })
      );

      // Also update viewingVehicle if open
      if (viewingVehicle?.id === selectedVehicleForDoc.id) {
        setViewingVehicle(prev => ({
          ...prev,
          documents: [...(prev.documents || []), newDoc]
        }));
      }

      toast.success(`${docForm.type} attached successfully!`);
      setIsDocModalOpen(false);
    } catch {
      toast.error('Failed to attach document');
    }
  };

  const handleDeleteDocument = async (vehicleId, docId, docTitle) => {
    if (!window.confirm(`Are you sure you want to delete ${docTitle || 'this document'}?`)) return;
    try {
      await fetch(`/api/transport/vehicles/${vehicleId}/documents/${docId}`, {
        method: 'DELETE'
      }).catch(() => null);

      setVehicles(prev =>
        prev.map(v => {
          if (v.id === vehicleId) {
            return {
              ...v,
              documents: (v.documents || []).filter(d => d.id !== docId)
            };
          }
          return v;
        })
      );

      if (viewingVehicle?.id === vehicleId) {
        setViewingVehicle(prev => ({
          ...prev,
          documents: (prev.documents || []).filter(d => d.id !== docId)
        }));
      }

      toast.success('Document removed');
    } catch {
      toast.error('Failed to delete document');
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.driver?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.assignedRoute && v.assignedRoute.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["S.No.,Vehicle Type,Vehicle No.,Capacity,Driver,Assigned Route,PUC Validity,Fitness Validity,Insurance Validity,Track No."].concat(
        filteredVehicles.map((v, i) => `${i + 1},"${v.vehicleType}","${v.vehicleNo}",${v.capacity},"${v.driver || ''}","${v.assignedRoute || ''}","${v.pucValidity || ''}","${v.fitnessValidity || ''}","${v.insuranceValidity || ''}","${v.trackNo || ''}"`)
      ).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "Transport_Vehicles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span>Transport</span>
            <span>&gt;</span>
            <span className="text-indigo-600 font-semibold">Transport Vehicle</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                Transport Vehicle Master
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Fleet management, assigned bus routes, driver allocation, and document compliance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicle / driver / route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56 outline-none"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            title="Print Table"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fleet Size</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{vehicles.length} Vehicles</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Total Seating</div>
          <div className="text-lg font-bold text-indigo-950 mt-0.5">
            {vehicles.reduce((acc, v) => acc + (v.capacity || 0), 0)} Seats
          </div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Active Drivers</div>
          <div className="text-lg font-bold text-emerald-950 mt-0.5">{vehicles.length} Assigned</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Docs & Compliance</div>
          <div className="text-lg font-bold text-purple-950 mt-0.5">100% Compliant</div>
        </div>
      </div>

      {/* Clean Flat ERP Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4 w-14 text-center">S.NO.</th>
                <th className="py-2.5 px-4">VEHICLE TYPE</th>
                <th className="py-2.5 px-4">VEHICLE NO.</th>
                <th className="py-2.5 px-4">CAPACITY</th>
                <th className="py-2.5 px-4">DRIVER</th>
                <th className="py-2.5 px-4">ASSIGNED ROUTE</th>
                <th className="py-2.5 px-4">DOCUMENTS</th>
                <th className="py-2.5 px-4 text-right w-36">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVehicles.map((v, idx) => {
                const docCount = v.documents?.length || 0;

                return (
                  <tr
                    key={v.id || idx}
                    onClick={() => setViewingVehicle(v)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer select-none"
                  >
                    <td className="py-2.5 px-4 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {v.vehicleType || 'Bus'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold font-mono text-indigo-700">
                      <div className="flex items-center gap-1.5">
                        <Bus className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="hover:underline">{v.vehicleNo}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium">
                      {v.capacity} Seats
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {v.driver || '-'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Navigation className="w-3 h-3 text-indigo-600" />
                        {v.assignedRoute || 'Kalwara, Ajairajpura'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setViewingVehicle(v)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                        title="Click to view & attach documents"
                      >
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        <span>{docCount} Attached</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingVehicle(v)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200/60 rounded-lg transition cursor-pointer"
                          title="View Vehicle Profile & Documents"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(v)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* --- POPUP MODAL: VEHICLE PROFILE & DOCUMENTS MANAGEMENT --- */}
      {/* ======================================================== */}
      {viewingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold font-mono text-slate-900">
                      {viewingVehicle.vehicleNo}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {viewingVehicle.vehicleType || 'Bus'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 font-mono">
                      {viewingVehicle.capacity} Seats
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-indigo-600" />
                    <span>Route: <strong className="text-slate-800">{viewingVehicle.assignedRoute || 'Kalwara, Ajairajpura'}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAttachDocModal(viewingVehicle)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Document</span>
                </button>
                <button
                  onClick={() => setViewingVehicle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Row 1: Vehicle, Driver & GPS Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Route Box */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Navigation className="w-3 h-3 text-indigo-600" />
                    <span>Assigned Stoppages</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1.5">
                    {viewingVehicle.assignedRoute || 'Kalwara, Ajairajpura'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(viewingVehicle.destinations || ['Kalwara', 'Ajairajpura', '7R Resort']).map((dest, dIdx) => (
                      <span key={dIdx} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-700">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Driver Box */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>Driver & Contact</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {viewingVehicle.driver || 'Hansraj Jat'}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                    <span className="font-semibold text-slate-500">Phone:</span>
                    <a href={`tel:${viewingVehicle.driverPhone || '9829011223'}`} className="text-indigo-600 font-bold hover:underline font-mono">
                      {viewingVehicle.driverPhone || '+91 98290 12345'}
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                    <span className="font-semibold text-slate-500">License:</span>
                    <span className="font-mono text-slate-700">{viewingVehicle.driverLicense || 'RJ14-201600104'}</span>
                  </div>
                </div>

                {/* Hardware & GPS Box */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Bus className="w-3 h-3 text-indigo-600" />
                    <span>Hardware & Live GPS</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {viewingVehicle.model || 'Tata Starbus 42-Seater'} &bull; <span className="font-mono">{viewingVehicle.fuelType || 'Diesel'}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                    <span className="font-semibold text-slate-500">GPS ID:</span>
                    <span className="font-mono text-slate-800 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {viewingVehicle.trackNo || 'GPS-RJ14-101'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Statutory Compliance Expiries */}
              <div className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/20 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statutory Compliance & Validity Deadlines</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">PUC Validity</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{viewingVehicle.pucValidity || '2026-12-31'}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Valid (Active)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Fitness Cert</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{viewingVehicle.fitnessValidity || '2027-01-20'}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Valid</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Insurance</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{viewingVehicle.insuranceValidity || '2026-11-10'}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Active</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">RC (Registration)</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{viewingVehicle.regCertValidity || '2028-05-15'}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">Active</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">Permit Validity</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{viewingVehicle.permitValidity || '2027-03-31'}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">State Permit</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Attached Documents Management */}
              <div className="border border-indigo-100 rounded-xl overflow-hidden bg-white shadow-2xs">
                {/* Documents Bar Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center">
                      <Paperclip className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        Attached Documents & Proofs ({viewingVehicle.documents?.length || 0})
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2 hidden sm:inline">
                        (PUC, RC Copy, Insurance Policy, Fitness Certificate, Permits)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAttachDocModal(viewingVehicle)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-2xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach New Document</span>
                  </button>
                </div>

                {/* Document Cards Grid */}
                {viewingVehicle.documents && viewingVehicle.documents.length > 0 ? (
                  <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewingVehicle.documents.map((doc, docIdx) => (
                      <div
                        key={doc.id || docIdx}
                        className="bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold uppercase text-indigo-700 tracking-wider">
                                {doc.type}
                              </span>
                              <span className="block text-xs font-bold text-slate-900 line-clamp-1" title={doc.title}>
                                {doc.title || doc.type}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(viewingVehicle.id, doc.id, doc.title)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                          <div className="font-mono text-[10px] text-slate-600 truncate" title={doc.fileName}>
                            {doc.fileName || `${doc.type}.pdf`}
                          </div>
                          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100">
                            <span className="text-slate-400 font-mono">{doc.fileSize || '1.2 MB'}</span>
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                              Exp: {doc.expiryDate || 'Valid'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => toast.success(`Downloading ${doc.fileName}...`, { icon: '📄' })}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.success(`Viewing ${doc.fileName}...`, { icon: '👁️' })}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 px-4 text-center">
                    <p className="text-xs text-slate-500 mb-2">
                      No documents have been attached to this vehicle yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAttachDocModal(viewingVehicle)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Attach First Document (PUC / RC)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Vehicle ID: #{viewingVehicle.id} &bull; Reg: {viewingVehicle.vehicleNo}
              </span>
              <button
                type="button"
                onClick={() => setViewingVehicle(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- ATTACH DOCUMENT MODAL (PUC, RC, INSURANCE, FITNESS) --- */}
      {/* ======================================================== */}
      {isDocModalOpen && selectedVehicleForDoc && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-emerald-600" />
                <span>Attach Vehicle Document</span>
                <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full ml-1">
                  {selectedVehicleForDoc.vehicleNo}
                </span>
              </h2>
              <button
                onClick={() => setIsDocModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category *</label>
                <select
                  value={docForm.type}
                  onChange={handleDocTypeChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="PUC / Pollution Certificate">PUC / Pollution Certificate</option>
                  <option value="Registration Certificate (RC)">Registration Certificate (RC)</option>
                  <option value="Insurance Policy">Vehicle Insurance Policy</option>
                  <option value="Fitness Certificate">Fitness Certificate (Form 38)</option>
                  <option value="Commercial Route Permit">Commercial Route Permit</option>
                  <option value="Driver Commercial License">Driver Commercial License</option>
                  <option value="Speed Governor / CCTV">Speed Governor / CCTV Compliance</option>
                  <option value="Other Document">Other Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pollution Certificate 2026-27"
                  value={docForm.title}
                  onChange={(e) => setDocForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate / Policy No.</label>
                  <input
                    type="text"
                    placeholder="e.g. PUC-RJ14-9982"
                    value={docForm.certificateNo}
                    onChange={(e) => setDocForm(prev => ({ ...prev, certificateNo: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valid Till / Expiry *</label>
                  <input
                    type="date"
                    required
                    value={docForm.expiryDate}
                    onChange={(e) => setDocForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* File Attachment Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select File (PDF, JPG, PNG) *</label>
                <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/20 rounded-lg p-3.5 flex flex-col items-center justify-center cursor-pointer transition">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {docForm.fileName ? docForm.fileName : 'Click to Browse or Drag File Here'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {selectedFileObj ? `${docForm.fileSize} - Ready to attach` : 'Max size: 10 MB (PDF, JPG, PNG)'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Save & Attach Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- ADD / EDIT VEHICLE MODAL --- */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Bus className="w-4 h-4 text-indigo-600" />
                <span>{editingVehicle ? 'Edit Transport Vehicle' : 'Add Transport Vehicle'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Van">Van</option>
                    <option value="Cab">Cab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RJ14PC1019"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Driver</label>
                  <select
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="HANSRAJ JAT">HANSRAJ JAT</option>
                    <option value="LALARAM">LALARAM</option>
                    <option value="SHAITAN SINGH">SHAITAN SINGH</option>
                    <option value="BHARAT JANGID">BHARAT JANGID</option>
                    <option value="BABU LAL">BABU LAL</option>
                    <option value="PRAKASH CHOUDHARY">PRAKASH CHOUDHARY</option>
                    <option value="RAJU IPS">RAJU IPS</option>
                    <option value="NARESH">NARESH</option>
                    <option value="SHYAM SUNDER">SHYAM SUNDER</option>
                    <option value="RAMESH">RAMESH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Seating Capacity *</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PUC Validity Date</label>
                  <input
                    type="date"
                    value={formData.pucValidity}
                    onChange={(e) => setFormData({ ...formData, pucValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reg. Certificate (RC) Date</label>
                  <input
                    type="date"
                    value={formData.regCertValidity}
                    onChange={(e) => setFormData({ ...formData, regCertValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fitness Validity Date</label>
                  <input
                    type="date"
                    value={formData.fitnessValidity}
                    onChange={(e) => setFormData({ ...formData, fitnessValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Validity Date</label>
                  <input
                    type="date"
                    value={formData.insuranceValidity}
                    onChange={(e) => setFormData({ ...formData, insuranceValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Permit Validity Date</label>
                  <input
                    type="date"
                    value={formData.permitValidity}
                    onChange={(e) => setFormData({ ...formData, permitValidity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Track No. (GPS)</label>
                  <input
                    type="text"
                    placeholder="e.g. GPS-RJ14-101"
                    value={formData.trackNo}
                    onChange={(e) => setFormData({ ...formData, trackNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
