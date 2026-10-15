import { Router } from 'express';
import {
  getHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
  getFloors,
  createFloor,
  updateFloor,
  deleteFloor,
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getHostelReports
} from './hostel.controller.js';

const router = Router();

// Hostel Master
router.route('/hostels')
  .get(getHostels)
  .post(createHostel);

router.route('/hostels/:id')
  .put(updateHostel)
  .delete(deleteHostel);

// Block Master
router.route('/blocks')
  .get(getBlocks)
  .post(createBlock);

router.route('/blocks/:id')
  .put(updateBlock)
  .delete(deleteBlock);

// Floor Master
router.route('/floors')
  .get(getFloors)
  .post(createFloor);

router.route('/floors/:id')
  .put(updateFloor)
  .delete(deleteFloor);

// Room Type Master
router.route('/room-types')
  .get(getRoomTypes)
  .post(createRoomType);

router.route('/room-types/:id')
  .put(updateRoomType)
  .delete(deleteRoomType);

// Room Master
router.route('/rooms')
  .get(getRooms)
  .post(createRoom);

router.route('/rooms/:id')
  .put(updateRoom)
  .delete(deleteRoom);

// Reports
router.get('/reports', getHostelReports);

export default router;
