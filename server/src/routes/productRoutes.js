import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin', 'vendor'), createProduct);
router.put('/:id', protect, authorize('admin', 'vendor'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
