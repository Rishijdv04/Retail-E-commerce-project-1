import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Protect all admin routes: must be logged in with 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

export default router;
