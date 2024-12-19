import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { jsonFormData } from '../middleware/formData.middleware.js';

const router = Router();

// @route   POST /api/products
// @desc    Create a product
// @access  Admin, Moderator
router.post('/', protect, authorize('admin', 'moderator'), uploadImage('uploads/products').fields([
  { name: 'imageFiles', maxCount: 10 },
  { name: 'variantImageFiles', maxCount: 50 }
]), jsonFormData('images', 'variants', 'tags'), createProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Guest
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Guest
router.get('/:id', getProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin, Moderator
router.put('/:id', protect, authorize('admin', 'moderator'), uploadImage('uploads/products').fields([
  { name: 'imageFiles', maxCount: 10 },
  { name: 'variantImageFiles', maxCount: 50 }
]), jsonFormData('images', 'variants', 'tags'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin, Moderator
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteProduct);

export default router;
