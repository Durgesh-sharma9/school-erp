import { Router } from 'express';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  getAssignedRoutes,
  saveAssignedRoute,
  getAssignedVehicles,
  saveAssignedVehicle,
  getStudentTransportFee,
  saveStudentTransportFee,
  getTransportReports
} from './transport.controller.js';

const router = Router();

// Vehicles
router.route('/vehicles')
  .get(getVehicles)
  .post(createVehicle);

router.route('/vehicles/:id')
  .put(updateVehicle)
  .delete(deleteVehicle);

// Routes
router.route('/routes')
  .get(getRoutes)
  .post(createRoute);

router.route('/routes/:id')
  .put(updateRoute)
  .delete(deleteRoute);

// Destinations
router.route('/destinations')
  .get(getDestinations)
  .post(createDestination);

router.route('/destinations/:id')
  .put(updateDestination)
  .delete(deleteDestination);

// Assign Routes & Vehicles
router.route('/assign-routes')
  .get(getAssignedRoutes)
  .post(saveAssignedRoute);

router.route('/assign-vehicles')
  .get(getAssignedVehicles)
  .post(saveAssignedVehicle);

// Student Transport Fee Adjustment
router.route('/student-fee')
  .get(getStudentTransportFee)
  .post(saveStudentTransportFee);

// Reports
router.get('/reports', getTransportReports);

export default router;
