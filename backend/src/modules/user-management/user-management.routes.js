import { Router } from 'express';
import {
  getUsers,
  createUser,
  updatePermissions,
  toggleUserStatus,
  deleteUser,
  getPrivilegeReport
} from './user-management.controller.js';

const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id/permissions', updatePermissions);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/reports/privilege', getPrivilegeReport);

export default router;
