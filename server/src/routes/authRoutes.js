import { Router } from 'express';
import {
  signup,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  saveAddress,
  removeAddress,
  requestReset,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/addresses', protect, saveAddress);
router.delete('/addresses/:id', protect, removeAddress);
router.post('/forgot-password', authLimiter, requestReset);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
