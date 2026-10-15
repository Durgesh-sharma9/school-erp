// In-memory data store for Hostel module with realistic data
let hostels = [
  {
    id: 1,
    hostelName: 'Tagore Boys Hostel',
    type: 'Boys',
    wardenName: 'RAMESH CHANDRA SHARMA',
    contactNo: '9829012345',
    address: 'Campus West Wing, Jaipur',
    capacity: 120
  },
  {
    id: 2,
    hostelName: 'Sarojini Girls Hostel',
    type: 'Girls',
    wardenName: 'DR. SUNITA MEENA',
    contactNo: '9414054321',
    address: 'Campus East Wing, Jaipur',
    capacity: 100
  },
  {
    id: 3,
    hostelName: 'Kalam Senior Wing',
    type: 'Boys',
    wardenName: 'MUKESH JANGID',
    contactNo: '9876543210',
    address: 'Academic Block Ext., Jaipur',
    capacity: 80
  }
];

let blocks = [
  { id: 1, blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel', totalFloors: 3 },
  { id: 2, blockName: 'B-Block (Senior)', hostelName: 'Tagore Boys Hostel', totalFloors: 3 },
  { id: 3, blockName: 'Main Girls Block', hostelName: 'Sarojini Girls Hostel', totalFloors: 4 },
  { id: 4, blockName: 'Executive Wing', hostelName: 'Kalam Senior Wing', totalFloors: 2 }
];

let floors = [
  { id: 1, floorName: 'Ground Floor', blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel' },
  { id: 2, floorName: 'First Floor', blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel' },
  { id: 3, floorName: 'Second Floor', blockName: 'A-Block (Junior)', hostelName: 'Tagore Boys Hostel' },
  { id: 4, floorName: 'Ground Floor', blockName: 'Main Girls Block', hostelName: 'Sarojini Girls Hostel' },
  { id: 5, floorName: 'First Floor', blockName: 'Main Girls Block', hostelName: 'Sarojini Girls Hostel' }
];

let roomTypes = [
  { id: 1, typeName: 'Single Bed (AC)', fee: 85000, amenities: 'Attached Bath, Study Table, AC, Geyser' },
  { id: 2, typeName: 'Double Sharing (AC)', fee: 65000, amenities: 'Attached Bath, AC, Dual Wardrobe' },
  { id: 3, typeName: 'Triple Sharing (Non-AC)', fee: 45000, amenities: 'Common Bath, Cooler, Study Tables' },
  { id: 4, typeName: 'Dormitory (4 Bed)', fee: 35000, amenities: 'Common Bath, Locker, Study Area' }
];

let rooms = [
  {
    id: 1,
    roomNo: 'A-101',
    roomType: 'Double Sharing (AC)',
    floor: 'Ground Floor',
    block: 'A-Block (Junior)',
    hostel: 'Tagore Boys Hostel',
    capacity: 2,
    occupied: 2,
    status: 'Full'
  },
  {
    id: 2,
    roomNo: 'A-102',
    roomType: 'Double Sharing (AC)',
    floor: 'Ground Floor',
    block: 'A-Block (Junior)',
    hostel: 'Tagore Boys Hostel',
    capacity: 2,
    occupied: 1,
    status: 'Partially Occupied'
  },
  {
    id: 3,
    roomNo: 'A-103',
    roomType: 'Triple Sharing (Non-AC)',
    floor: 'First Floor',
    block: 'A-Block (Junior)',
    hostel: 'Tagore Boys Hostel',
    capacity: 3,
    occupied: 3,
    status: 'Full'
  },
  {
    id: 4,
    roomNo: 'A-104',
    roomType: 'Single Bed (AC)',
    floor: 'First Floor',
    block: 'A-Block (Junior)',
    hostel: 'Tagore Boys Hostel',
    capacity: 1,
    occupied: 0,
    status: 'Vacant'
  },
  {
    id: 5,
    roomNo: 'G-201',
    roomType: 'Double Sharing (AC)',
    floor: 'Ground Floor',
    block: 'Main Girls Block',
    hostel: 'Sarojini Girls Hostel',
    capacity: 2,
    occupied: 2,
    status: 'Full'
  },
  {
    id: 6,
    roomNo: 'G-202',
    roomType: 'Single Bed (AC)',
    floor: 'First Floor',
    block: 'Main Girls Block',
    hostel: 'Sarojini Girls Hostel',
    capacity: 1,
    occupied: 1,
    status: 'Full'
  }
];

let studentAllocations = [
  {
    id: 1,
    admNo: '1621',
    name: 'AADITYA SINGH CHOUDHARY',
    className: 'Class I-A',
    fatherName: 'VIKRAM SINGH',
    contactNo: '8947919195',
    hostel: 'Tagore Boys Hostel',
    block: 'A-Block (Junior)',
    floor: 'Ground Floor',
    roomNo: 'A-101',
    bedNo: 'Bed 1',
    roomType: 'Double Sharing (AC)',
    totalFee: 65000,
    paidFee: 45000,
    dueFee: 20000,
    allocatedDate: '2026-04-10'
  },
  {
    id: 2,
    admNo: '1204',
    name: 'AARAV SHARMA',
    className: 'Class I-A',
    fatherName: 'RAJESH SHARMA',
    contactNo: '9876543210',
    hostel: 'Tagore Boys Hostel',
    block: 'A-Block (Junior)',
    floor: 'Ground Floor',
    roomNo: 'A-101',
    bedNo: 'Bed 2',
    roomType: 'Double Sharing (AC)',
    totalFee: 65000,
    paidFee: 65000,
    dueFee: 0,
    allocatedDate: '2026-04-10'
  },
  {
    id: 3,
    admNo: '2059',
    name: 'AADHYA CHOUDHARY',
    className: 'Nursery - PP3+-A',
    fatherName: 'RAMESH CHOUDHARY',
    contactNo: '6377281034',
    hostel: 'Sarojini Girls Hostel',
    block: 'Main Girls Block',
    floor: 'Ground Floor',
    roomNo: 'G-201',
    bedNo: 'Bed 1',
    roomType: 'Double Sharing (AC)',
    totalFee: 65000,
    paidFee: 35000,
    dueFee: 30000,
    allocatedDate: '2026-04-12'
  },
  {
    id: 4,
    admNo: '1310',
    name: 'CHETAN MEENA',
    className: 'Class X-A',
    fatherName: 'RAMESHWAR MEENA',
    contactNo: '9414054321',
    hostel: 'Tagore Boys Hostel',
    block: 'A-Block (Junior)',
    floor: 'Ground Floor',
    roomNo: 'A-102',
    bedNo: 'Bed 1',
    roomType: 'Double Sharing (AC)',
    totalFee: 65000,
    paidFee: 40000,
    dueFee: 25000,
    allocatedDate: '2026-05-01'
  }
];

// --- HOSTEL MASTER ---
export const getHostels = (req, res) => {
  res.status(200).json({ success: true, count: hostels.length, data: hostels });
};

export const createHostel = (req, res) => {
  const { hostelName, type, wardenName, contactNo, address, capacity } = req.body;
  if (!hostelName) return res.status(400).json({ success: false, message: 'Hostel name is required' });
  const newHostel = {
    id: hostels.length > 0 ? Math.max(...hostels.map(h => h.id)) + 1 : 1,
    hostelName,
    type: type || 'Boys',
    wardenName: wardenName || '',
    contactNo: contactNo || '',
    address: address || '',
    capacity: Number(capacity) || 100
  };
  hostels.push(newHostel);
  res.status(201).json({ success: true, message: 'Hostel created successfully', data: newHostel });
};

export const updateHostel = (req, res) => {
  const { id } = req.params;
  const idx = hostels.findIndex(h => h.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Hostel not found' });
  hostels[idx] = { ...hostels[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Hostel updated', data: hostels[idx] });
};

export const deleteHostel = (req, res) => {
  const { id } = req.params;
  hostels = hostels.filter(h => h.id !== Number(id));
  res.status(200).json({ success: true, message: 'Hostel deleted' });
};

// --- BLOCK MASTER ---
export const getBlocks = (req, res) => {
  res.status(200).json({ success: true, count: blocks.length, data: blocks });
};

export const createBlock = (req, res) => {
  const { blockName, hostelName, totalFloors } = req.body;
  if (!blockName || !hostelName) return res.status(400).json({ success: false, message: 'Block and Hostel name required' });
  const newBlock = {
    id: blocks.length > 0 ? Math.max(...blocks.map(b => b.id)) + 1 : 1,
    blockName,
    hostelName,
    totalFloors: Number(totalFloors) || 1
  };
  blocks.push(newBlock);
  res.status(201).json({ success: true, message: 'Block created', data: newBlock });
};

export const updateBlock = (req, res) => {
  const { id } = req.params;
  const idx = blocks.findIndex(b => b.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Block not found' });
  blocks[idx] = { ...blocks[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Block updated', data: blocks[idx] });
};

export const deleteBlock = (req, res) => {
  const { id } = req.params;
  blocks = blocks.filter(b => b.id !== Number(id));
  res.status(200).json({ success: true, message: 'Block deleted' });
};

// --- FLOOR MASTER ---
export const getFloors = (req, res) => {
  res.status(200).json({ success: true, count: floors.length, data: floors });
};

export const createFloor = (req, res) => {
  const { floorName, blockName, hostelName } = req.body;
  if (!floorName || !blockName) return res.status(400).json({ success: false, message: 'Floor and Block required' });
  const newFloor = {
    id: floors.length > 0 ? Math.max(...floors.map(f => f.id)) + 1 : 1,
    floorName,
    blockName,
    hostelName: hostelName || ''
  };
  floors.push(newFloor);
  res.status(201).json({ success: true, message: 'Floor created', data: newFloor });
};

export const updateFloor = (req, res) => {
  const { id } = req.params;
  const idx = floors.findIndex(f => f.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Floor not found' });
  floors[idx] = { ...floors[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Floor updated', data: floors[idx] });
};

export const deleteFloor = (req, res) => {
  const { id } = req.params;
  floors = floors.filter(f => f.id !== Number(id));
  res.status(200).json({ success: true, message: 'Floor deleted' });
};

// --- ROOM TYPE MASTER ---
export const getRoomTypes = (req, res) => {
  res.status(200).json({ success: true, count: roomTypes.length, data: roomTypes });
};

export const createRoomType = (req, res) => {
  const { typeName, fee, amenities } = req.body;
  if (!typeName || !fee) return res.status(400).json({ success: false, message: 'Type name and Fee required' });
  const newType = {
    id: roomTypes.length > 0 ? Math.max(...roomTypes.map(rt => rt.id)) + 1 : 1,
    typeName,
    fee: Number(fee) || 0,
    amenities: amenities || ''
  };
  roomTypes.push(newType);
  res.status(201).json({ success: true, message: 'Room type created', data: newType });
};

export const updateRoomType = (req, res) => {
  const { id } = req.params;
  const idx = roomTypes.findIndex(rt => rt.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Room type not found' });
  roomTypes[idx] = { ...roomTypes[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Room type updated', data: roomTypes[idx] });
};

export const deleteRoomType = (req, res) => {
  const { id } = req.params;
  roomTypes = roomTypes.filter(rt => rt.id !== Number(id));
  res.status(200).json({ success: true, message: 'Room type deleted' });
};

// --- ROOM MASTER ---
export const getRooms = (req, res) => {
  res.status(200).json({ success: true, count: rooms.length, data: rooms });
};

export const createRoom = (req, res) => {
  const { roomNo, roomType, floor, block, hostel, capacity } = req.body;
  if (!roomNo || !roomType) return res.status(400).json({ success: false, message: 'Room number and Room type required' });
  const cap = Number(capacity) || 2;
  const newRoom = {
    id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
    roomNo,
    roomType,
    floor: floor || 'Ground Floor',
    block: block || 'A-Block (Junior)',
    hostel: hostel || 'Tagore Boys Hostel',
    capacity: cap,
    occupied: 0,
    status: 'Vacant'
  };
  rooms.push(newRoom);
  res.status(201).json({ success: true, message: 'Room created', data: newRoom });
};

export const updateRoom = (req, res) => {
  const { id } = req.params;
  const idx = rooms.findIndex(r => r.id === Number(id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Room not found' });
  rooms[idx] = { ...rooms[idx], ...req.body };
  res.status(200).json({ success: true, message: 'Room updated', data: rooms[idx] });
};

export const deleteRoom = (req, res) => {
  const { id } = req.params;
  rooms = rooms.filter(r => r.id !== Number(id));
  res.status(200).json({ success: true, message: 'Room deleted' });
};

// --- REPORTS ---
export const getHostelReports = (req, res) => {
  const { reportType, hostel, block, floor } = req.query;

  if (reportType === 'room-list' || reportType === 'status') {
    let list = rooms;
    if (hostel && hostel !== 'All') list = list.filter(r => r.hostel === hostel);
    if (block && block !== 'All') list = list.filter(r => r.block === block);
    if (floor && floor !== 'All') list = list.filter(r => r.floor === floor);
    return res.status(200).json({ success: true, data: list });
  }

  if (reportType === 'students') {
    let list = studentAllocations;
    if (hostel && hostel !== 'All') list = list.filter(s => s.hostel === hostel);
    return res.status(200).json({ success: true, data: list });
  }

  if (reportType === 'due') {
    let list = studentAllocations;
    if (hostel && hostel !== 'All') list = list.filter(s => s.hostel === hostel);
    return res.status(200).json({
      success: true,
      data: list.map((s, idx) => ({
        sNo: idx + 1,
        admNo: s.admNo,
        name: s.name,
        className: s.className,
        fatherName: s.fatherName,
        contactNo: s.contactNo,
        hostel: s.hostel,
        roomNo: s.roomNo,
        totalFee: s.totalFee,
        paidFee: s.paidFee,
        dueFee: s.dueFee
      }))
    });
  }

  res.status(200).json({ success: true, data: rooms });
};
