import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, optionalAuth, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);
router.get('/', protect, authorize('admin'), getAllOrders);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
