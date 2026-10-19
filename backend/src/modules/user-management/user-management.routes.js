import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  updatePermissions,
  toggleUserStatus,
  deleteUser,
  getPrivilegeReport,
  bulkUserAction,
  getRolePrivileges,
  saveRolePrivileges
} from './user-management.controller.js';

const router = Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/users/bulk', bulkUserAction);
router.put('/users/:id', updateUser);
router.put('/users/:id/permissions', updatePermissions);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/privileges', getRolePrivileges);
router.post('/privileges', saveRolePrivileges);

router.get('/reports/privilege', getPrivilegeReport);

export default router;
