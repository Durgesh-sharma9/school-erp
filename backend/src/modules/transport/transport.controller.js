// In-memory data store for transport module with realistic UAB data
let vehicles = [
  {
    id: 1,
    vehicleType: 'Bus',
    vehicleNo: 'RJ02PA2762',
    capacity: 42,
    driver: 'SHAITAN SINGH',
    pucValidity: '2026-12-31',
    regCertValidity: '2028-05-15',
    fitnessValidity: '2027-01-20',
    insuranceValidity: '2026-11-10',
    permitValidity: '2027-03-31',
    trackNo: 'GPS-RJ02-998',
    trackApi: 'https://gps.tracking.in/api/v1/RJ02PA2762'
  },
  {
    id: 2,
    vehicleType: 'Bus',
    vehicleNo: 'RJ14PC1019',
    capacity: 42,
    driver: 'HANSRAJ JAT',
    pucValidity: '2026-11-30',
    regCertValidity: '2027-08-10',
    fitnessValidity: '2026-12-15',
    insuranceValidity: '2026-10-31',
    permitValidity: '2027-04-15',
    trackNo: 'GPS-RJ14-101',
    trackApi: 'https://gps.tracking.in/api/v1/RJ14PC1019'
  },
  {
    id: 3,
    vehicleType: 'Bus',
    vehicleNo: 'RJ14PC1037',
    capacity: 50,
    driver: 'PRAKASH CHOUDHARY',
    pucValidity: '2027-01-15',
    regCertValidity: '2028-02-28',
    fitnessValidity: '2026-12-05',
    insuranceValidity: '2026-11-20',
    permitValidity: '2027-05-01',
    trackNo: 'GPS-RJ14-103',
    trackApi: 'https://gps.tracking.in/api/v1/RJ14PC1037'
  },
  {
    id: 4,
    vehicleType: 'Bus',
    vehicleNo: 'RJ14PC2278',
    capacity: 40,
    driver: 'SHYAM SUNDER',
    pucValidity: '2026-10-25',
    regCertValidity: '2027-09-30',
    fitnessValidity: '2026-11-18',
    insuranceValidity: '2026-12-12',
    permitValidity: '2027-06-30',
    trackNo: 'GPS-RJ14-227',
    trackApi: 'https://gps.tracking.in/api/v1/RJ14PC2278'
  },
  {
    id: 5,
    vehicleType: 'Bus',
    vehicleNo: 'RJ14PC5938',
    capacity: 45,
    driver: 'NARESH',
    pucValidity: '2026-12-15',
    regCertValidity: '2028-01-10',
    fitnessValidity: '2027-02-15',
    insuranceValidity: '2027-01-10',
    permitValidity: '2027-07-15',
    trackNo: 'GPS-RJ14-593',
    trackApi: 'https://gps.tracking.in/api/v1/RJ14PC5938'
  },
  {
    id: 6,
    vehicleType: 'Bus',
    vehicleNo: 'RJ14PC7878',
    capacity: 42,
    driver: 'BABU LAL',
    pucValidity: '2026-11-20',
    regCertValidity: '2027-11-25',
    fitnessValidity: '2026-12-28',
    insuranceValidity: '2026-11-15',
    permitValidity: '2027-04-20',
    trackNo: 'GPS-RJ14-787',
    trackApi: 'https://gps.tracking.in/api/v1/RJ14PC7878'
  },
  {
    id: 7,
    vehicleType: 'Bus',
    vehicleNo: 'RJ14PE0832',
    capacity: 42,
    driver: 'RAMESH',
    pucValidity: '2026-12-05',
    regCertValidity: '2028-04-12',
    fitnessValidity: '2027-03-10',
    insuranceValidity: '2026-12-30',
    permitValidity: '2027-08-01',
    trackNo: 'GPS-RJ14-083',
    trackApi: 'https://gps.tracking.in/api/v1/RJ14PE0832'
  },
  {
    id: 8,
    vehicleType: 'Bus',
    vehicleNo: 'RJ19PB7511',
    capacity: 42,
    driver: 'RAJU IPS',
    pucValidity: '2026-10-30',
    regCertValidity: '2027-06-18',
    fitnessValidity: '2026-11-30',
    insuranceValidity: '2026-10-20',
    permitValidity: '2027-02-28',
    trackNo: 'GPS-RJ19-751',
    trackApi: 'https://gps.tracking.in/api/v1/RJ19PB7511'
  },
  {
    id: 9,
    vehicleType: 'Bus',
    vehicleNo: 'RJ20PA9932',
    capacity: 50,
    driver: 'BHARAT JANGID',
    pucValidity: '2027-02-10',
    regCertValidity: '2028-07-20',
    fitnessValidity: '2027-04-15',
    insuranceValidity: '2027-01-25',
    permitValidity: '2027-09-10',
    trackNo: 'GPS-RJ20-993',
    trackApi: 'https://gps.tracking.in/api/v1/RJ20PA9932'
  },
  {
    id: 10,
    vehicleType: 'Bus',
    vehicleNo: 'RJ40PA1179',
    capacity: 42,
    driver: 'LALARAM',
    pucValidity: '2026-11-15',
    regCertValidity: '2027-10-10',
    fitnessValidity: '2026-12-10',
    insuranceValidity: '2026-11-28',
    permitValidity: '2027-05-15',
    trackNo: 'GPS-RJ40-117',
    trackApi: 'https://gps.tracking.in/api/v1/RJ40PA1179'
  }
];

let routes = [
  { id: 1, routeName: 'Kalwara, Ajairajpura', destinationsCount: 12 },
  { id: 2, routeName: 'Thikriya, Vatika', destinationsCount: 8 },
  { id: 3, routeName: 'Jaisinghpura, Rampura', destinationsCount: 15 },
  { id: 4, routeName: 'Auric City & Shub Nilay', destinationsCount: 6 },
  { id: 5, routeName: 'Manglam Aangan', destinationsCount: 7 },
  { id: 6, routeName: 'Mangalam Grand City', destinationsCount: 9 },
  { id: 7, routeName: 'Narsinghpura, Ramchandrapura', destinationsCount: 11 },
  { id: 8, routeName: 'Aasra, J K Lakshmipat University', destinationsCount: 8 },
  { id: 9, routeName: 'Bhankrota, Mojika, Hanging Gardens', destinationsCount: 14 },
  { id: 10, routeName: 'Khatwara', destinationsCount: 6 }
];

let destinations = [
  { id: 1, destination: '7R Resort', distance: 12, fare: 2400 },
  { id: 2, destination: 'Aashirwad Hotel', distance: 14, fare: 2700 },
  { id: 3, destination: 'Aasra', distance: 14, fare: 2700 },
  { id: 4, destination: 'Abhinandan Enclave Jaisinghpura', distance: 13, fare: 2550 },
  { id: 5, destination: 'Ajairajpura', distance: 18, fare: 3600 },
  { id: 6, destination: 'Anantara', distance: 13, fare: 2550 },
  { id: 7, destination: 'Anukriti Jaisinghpura', distance: 13, fare: 2550 },
  { id: 8, destination: 'Ashiyana Umang', distance: 14, fare: 2700 },
  { id: 9, destination: 'Asian World School', distance: 13, fare: 2550 },
  { id: 10, destination: 'Auric City Homes', distance: 12, fare: 2400 },
  { id: 11, destination: 'Auric Villas Jaisinghpura', distance: 13, fare: 2550 },
  { id: 12, destination: 'Bachpan School', distance: 13, fare: 2550 },
  { id: 13, destination: 'Bhambhoriya', distance: 15, fare: 3000 },
  { id: 14, destination: 'Bhankrota', distance: 14, fare: 2850 },
  { id: 15, destination: 'Brahmano ki Dhani Jaisinghpura', distance: 14, fare: 2700 },
  { id: 16, destination: 'Century Park', distance: 12, fare: 2400 },
  { id: 17, destination: 'Kalwara', distance: 15, fare: 3000 },
  { id: 18, destination: 'Thikariya', distance: 18, fare: 3600 },
  { id: 19, destination: 'Vatika', distance: 18, fare: 3600 },
  { id: 20, destination: 'J K Lakshmipat University', distance: 14, fare: 2700 }
];

let assignedRoutes = [
  {
    id: 1,
    routeName: 'Kalwara, Ajairajpura',
    destinations: ['7R Resort', 'Ajairajpura', 'Kalwara', 'Ganatpura Kalwara']
  },
  {
    id: 2,
    routeName: 'Thikriya, Vatika',
    destinations: ['Thikariya', 'Vatika', 'Sidha Aangan Township']
  },
  {
    id: 3,
    routeName: 'Jaisinghpura, Rampura',
    destinations: ['Abhinandan Enclave Jaisinghpura', 'Anukriti Jaisinghpura', 'Brahmano ki Dhani Jaisinghpura', 'Rampura']
  },
  {
    id: 4,
    routeName: 'Auric City & Shub Nilay',
    destinations: ['Auric City Homes', 'Shubh nilay', 'Century Park']
  },
  {
    id: 5,
    routeName: 'Manglam Aangan',
    destinations: ['Manglam Aangan', 'Dream Avenue Mangalam Grand City']
  },
  {
    id: 6,
    routeName: 'Mangalam Grand City',
    destinations: ['Mangalam Grand City', 'Mangalam Prime', 'Mangalam Dwarika']
  },
  {
    id: 7,
    routeName: 'Narsinghpura, Ramchandrapura',
    destinations: ['Narsinghpura', 'Ramchandrapura', 'Ringroad narsinghpura']
  },
  {
    id: 8,
    routeName: 'Aasra, J K Lakshmipat University',
    destinations: ['Aasra', 'J K Lakshmipat University', 'Ashiyana Umang']
  },
  {
    id: 9,
    routeName: 'Bhankrota, Mojika, Hanging Gardens',
    destinations: ['Bhankrota', 'Mojika Apartments', 'Hanging Gardens Jaisinghpura']
  },
  {
    id: 10,
    routeName: 'Khatwara',
    destinations: ['Khatwara', 'Maliyon Ki Dhani khatwara road', 'Meeno Ki Dhani Khatwara']
  }
];

let assignedVehicles = [
  {
    id: 1,
    vehicleNo: 'RJ14PC1019',
    type: 'Bus',
    capacity: 42,
    driver: 'HANSRAJ JAT',
    routes: ['Kalwara, Ajairajpura']
  },
  {
    id: 2,
    vehicleNo: 'RJ40PA1179',
    type: 'Bus',
    capacity: 42,
    driver: 'LALARAM',
    routes: ['Thikriya, Vatika']
  },
  {
    id: 3,
    vehicleNo: 'RJ02PA2762',
    type: 'Bus',
    capacity: 42,
    driver: 'SHAITAN SINGH',
    routes: ['Jaisinghpura, Rampura']
  },
  {
    id: 4,
    vehicleNo: 'RJ20PA9932',
    type: 'Bus',
    capacity: 50,
    driver: 'BHARAT JANGID',
    routes: ['Auric City & Shub Nilay']
  },
  {
    id: 5,
    vehicleNo: 'RJ14PC7878',
    type: 'Bus',
    capacity: 42,
    driver: 'BABU LAL',
    routes: ['Manglam Aangan']
  },
  {
    id: 6,
    vehicleNo: 'RJ14PC1037',
    type: 'Bus',
    capacity: 50,
    driver: 'PRAKASH CHOUDHARY',
    routes: ['Mangalam Grand City']
  },
  {
    id: 7,
    vehicleNo: 'RJ19PB7511',
    type: 'Bus',
    capacity: 42,
    driver: 'RAJU IPS',
    routes: ['Narsinghpura, Ramchandrapura']
  },
  {
    id: 8,
    vehicleNo: 'RJ14PC5938',
    type: 'Bus',
    capacity: 45,
    driver: 'NARESH',
    routes: ['Aasra, J K Lakshmipat University']
  },
  {
    id: 9,
    vehicleNo: 'RJ14PC2278',
    type: 'Bus',
    capacity: 40,
    driver: 'SHYAM SUNDER',
    routes: ['Bhankrota, Mojika, Hanging Gardens']
  },
  {
    id: 10,
    vehicleNo: 'RJ14PE0832',
    type: 'Bus',
    capacity: 42,
    driver: 'RAMESH',
    routes: ['Khatwara']
  }
];

let studentTransportFees = [
  {
    studentId: '1621',
    admNo: '1621',
    srNo: '1621',
    name: 'AADITYA SINGH CHOUDHARY',
    className: 'Class I-A',
    fatherName: 'VIKRAM SINGH',
    contactNo: '8947919195',
    vehicleNo: 'RJ02PA2762',
    routeName: 'Jaisinghpura, Rampura',
    destination: 'Abhinandan Enclave Jaisinghpura',
    monthlyFare: 2550,
    schedule: [
      { month: 'April', fare: 2550, paid: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'May', fare: 2550, paid: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'July', fare: 2550, paid: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'August', fare: 2550, paid: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'September', fare: 2550, paid: 2550, balance: 0, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'October', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'November', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'December', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'January', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'February', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' },
      { month: 'March', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Abhinandan Enclave Jaisinghpura', vehicle: 'RJ02PA2762' }
    ]
  },
  {
    studentId: '2059',
    admNo: '2059',
    srNo: '2059',
    name: 'AADHYA CHOUDHARY',
    className: 'Nursery - PP3+-A',
    fatherName: 'RAMESH CHOUDHARY',
    contactNo: '6377281034',
    vehicleNo: 'RJ14PC1019',
    routeName: 'Kalwara, Ajairajpura',
    destination: 'Kalwara',
    monthlyFare: 3000,
    schedule: [
      { month: 'April', fare: 3000, paid: 3000, balance: 0, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'May', fare: 3000, paid: 3000, balance: 0, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'July', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'August', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'September', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'October', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'November', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'December', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'January', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'February', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' },
      { month: 'March', fare: 3000, paid: 0, balance: 3000, applied: true, destination: 'Kalwara', vehicle: 'RJ14PC1019' }
    ]
  }
];

// --- VEHICLES CONTROLLERS ---
export const getVehicles = (req, res) => {
  res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
};

export const createVehicle = (req, res) => {
  const { vehicleType, vehicleNo, capacity, driver, pucValidity, regCertValidity, fitnessValidity, insuranceValidity, permitValidity, trackNo, trackApi } = req.body;
  if (!vehicleNo) {
    return res.status(400).json({ success: false, message: 'Vehicle number is required' });
  }
  const newVehicle = {
    id: vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1,
    vehicleType: vehicleType || 'Bus',
    vehicleNo,
    capacity: Number(capacity) || 40,
    driver: driver || '',
    pucValidity: pucValidity || '',
    regCertValidity: regCertValidity || '',
    fitnessValidity: fitnessValidity || '',
    insuranceValidity: insuranceValidity || '',
    permitValidity: permitValidity || '',
    trackNo: trackNo || '',
    trackApi: trackApi || ''
  };
  vehicles.push(newVehicle);
  res.status(201).json({ success: true, message: 'Vehicle added successfully', data: newVehicle });
};

export const updateVehicle = (req, res) => {
  const { id } = req.params;
  const idx = vehicles.findIndex(v => v.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  vehicles[idx] = { ...vehicles[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Vehicle updated', data: vehicles[idx] });
};

export const deleteVehicle = (req, res) => {
  const { id } = req.params;
  vehicles = vehicles.filter(v => v.id !== Number(id));
  res.status(200).json({ success: true, message: 'Vehicle deleted' });
};

// --- ROUTES CONTROLLERS ---
export const getRoutes = (req, res) => {
  res.status(200).json({ success: true, count: routes.length, data: routes });
};

export const createRoute = (req, res) => {
  const { routeName } = req.body;
  if (!routeName) return res.status(400).json({ success: false, message: 'Route name is required' });
  const newRoute = {
    id: routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1,
    routeName,
    destinationsCount: 0
  };
  routes.push(newRoute);
  res.status(201).json({ success: true, message: 'Route added', data: newRoute });
};

export const updateRoute = (req, res) => {
  const { id } = req.params;
  const idx = routes.findIndex(r => r.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Route not found' });
  routes[idx] = { ...routes[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Route updated', data: routes[idx] });
};

export const deleteRoute = (req, res) => {
  const { id } = req.params;
  routes = routes.filter(r => r.id !== Number(id));
  res.status(200).json({ success: true, message: 'Route deleted' });
};

// --- DESTINATIONS CONTROLLERS ---
export const getDestinations = (req, res) => {
  res.status(200).json({ success: true, count: destinations.length, data: destinations });
};

export const createDestination = (req, res) => {
  const { destination, distance, fare } = req.body;
  if (!destination) return res.status(400).json({ success: false, message: 'Destination name is required' });
  const newDest = {
    id: destinations.length > 0 ? Math.max(...destinations.map(d => d.id)) + 1 : 1,
    destination,
    distance: Number(distance) || 0,
    fare: Number(fare) || 0
  };
  destinations.push(newDest);
  res.status(201).json({ success: true, message: 'Destination added', data: newDest });
};

export const updateDestination = (req, res) => {
  const { id } = req.params;
  const idx = destinations.findIndex(d => d.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Destination not found' });
  destinations[idx] = { ...destinations[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Destination updated', data: destinations[idx] });
};

export const deleteDestination = (req, res) => {
  const { id } = req.params;
  destinations = destinations.filter(d => d.id !== Number(id));
  res.status(200).json({ success: true, message: 'Destination deleted' });
};

// --- ASSIGNED ROUTES ---
export const getAssignedRoutes = (req, res) => {
  res.status(200).json({ success: true, count: assignedRoutes.length, data: assignedRoutes });
};

export const saveAssignedRoute = (req, res) => {
  const { routeName, destinations: destList } = req.body;
  const idx = assignedRoutes.findIndex(ar => ar.routeName === routeName);
  if (idx !== -1) {
    assignedRoutes[idx].destinations = destList || [];
  } else {
    assignedRoutes.push({
      id: assignedRoutes.length + 1,
      routeName,
      destinations: destList || []
    });
  }
  res.status(200).json({ success: true, message: 'Route destinations updated successfully' });
};

// --- ASSIGNED VEHICLES ---
export const getAssignedVehicles = (req, res) => {
  res.status(200).json({ success: true, count: assignedVehicles.length, data: assignedVehicles });
};

export const saveAssignedVehicle = (req, res) => {
  const { vehicleNo, routes: routeList } = req.body;
  const idx = assignedVehicles.findIndex(av => av.vehicleNo === vehicleNo);
  if (idx !== -1) {
    assignedVehicles[idx].routes = routeList || [];
  } else {
    const v = vehicles.find(veh => veh.vehicleNo === vehicleNo);
    assignedVehicles.push({
      id: assignedVehicles.length + 1,
      vehicleNo,
      type: v?.vehicleType || 'Bus',
      capacity: v?.capacity || 42,
      driver: v?.driver || '',
      routes: routeList || []
    });
  }
  res.status(200).json({ success: true, message: 'Vehicle routes updated successfully' });
};

// --- EDIT STUDENT TRANSPORT FEE ---
export const getStudentTransportFee = (req, res) => {
  const { studentId } = req.query;
  const record = studentTransportFees.find(s => s.admNo === studentId || s.studentId === studentId);
  if (record) {
    return res.status(200).json({ success: true, data: record });
  }
  // Fallback default
  res.status(200).json({
    success: true,
    data: {
      admNo: studentId || '1204',
      name: 'STUDENT SAMPLE',
      className: 'Class I-A',
      monthlyFare: 2550,
      schedule: [
        { month: 'April', fare: 2550, paid: 2550, balance: 0, applied: true, destination: 'Bhankrota', vehicle: 'RJ14PC2278' },
        { month: 'May', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Bhankrota', vehicle: 'RJ14PC2278' },
        { month: 'July', fare: 2550, paid: 0, balance: 2550, applied: true, destination: 'Bhankrota', vehicle: 'RJ14PC2278' }
      ]
    }
  });
};

export const saveStudentTransportFee = (req, res) => {
  const { admNo, schedule } = req.body;
  const idx = studentTransportFees.findIndex(s => s.admNo === admNo);
  if (idx !== -1) {
    studentTransportFees[idx].schedule = schedule;
  }
  res.status(200).json({ success: true, message: 'Transport fee schedule updated successfully' });
};

// --- REPORTS ---
export const getTransportReports = (req, res) => {
  const { reportType } = req.query;

  if (reportType === 'summary') {
    return res.status(200).json({
      success: true,
      data: assignedVehicles.flatMap(av => 
        (av.routes || []).map((r, rIdx) => ({
          sNo: rIdx + 1,
          vehicleNo: av.vehicleNo,
          vehicleCapacity: av.capacity,
          vehicleType: av.type,
          driver: av.driver,
          route: r,
          destination: 'Multiple Stops',
          fare: 2550
        }))
      )
    });
  }

  if (reportType === 'students') {
    return res.status(200).json({
      success: true,
      data: studentTransportFees.map((s, idx) => ({
        sNo: idx + 1,
        admNo: s.admNo,
        srNo: s.srNo,
        name: s.name,
        className: s.className,
        fatherName: s.fatherName,
        contactNo: s.contactNo,
        vehicle: s.vehicleNo,
        route: s.routeName,
        destination: s.destination,
        fare: s.monthlyFare
      }))
    });
  }

  if (reportType === 'due') {
    return res.status(200).json({
      success: true,
      data: studentTransportFees.map((s, idx) => {
        const total = s.schedule.reduce((acc, m) => acc + (m.applied ? m.fare : 0), 0);
        const paid = s.schedule.reduce((acc, m) => acc + (m.applied ? m.paid : 0), 0);
        return {
          sNo: idx + 1,
          admNo: s.admNo,
          srNo: s.srNo,
          name: s.name,
          className: s.className,
          fatherName: s.fatherName,
          contactNo: s.contactNo,
          total,
          paid,
          balance: total - paid
        };
      })
    });
  }

  if (reportType === 'vehicle-compliance') {
    return res.status(200).json({
      success: true,
      data: vehicles.map((v, idx) => ({
        sNo: idx + 1,
        driverName: v.driver,
        vehCap: v.capacity,
        vehType: v.vehicleType,
        pucDate: v.pucValidity,
        fitnessDate: v.fitnessValidity,
        vehicle: v.vehicleNo
      }))
    });
  }

  res.status(200).json({ success: true, data: [] });
};
