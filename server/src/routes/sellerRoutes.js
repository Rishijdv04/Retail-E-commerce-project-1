import { Router } from 'express';
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
} from '../controllers/sellerController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/apply', submitApplication);
router.get('/applications', protect, authorize('admin'), getApplications);
router.patch('/applications/:id/status', protect, authorize('admin'), updateApplicationStatus);

export default router;
