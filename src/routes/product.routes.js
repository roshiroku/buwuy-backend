import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant
} from '../controllers/product.controller.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

// @route   POST /api/products
// @desc    Create a product
// @access  Admin, Moderator
router.post(
  '/',
  protect,
  authorize('admin', 'moderator'),
  uploadImage('uploads/products').any(),
  createProduct
);

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
router.put(
  '/:id',
  protect,
  authorize('admin', 'moderator'),
  uploadImage('uploads/products').any(),
  updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin, Moderator
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteProduct);

// @route   POST /api/products/:id/variants
// @desc    Create a variant
// @access  Admin, Moderator
router.post(
  '/:id/variants',
  protect,
  authorize('admin', 'moderator'),
  uploadImage('uploads/products/variants').any(),
  createVariant
);

// @route   PUT /api/products/:id/variants/:variant
// @desc    Update variant
// @access  Admin, Moderator
router.put(
  '/:id/variants/:variant',
  protect,
  authorize('admin', 'moderator'),
  uploadImage('uploads/products/variants').any(),
  updateVariant
);

// @route   DELETE /api/products/:id/variants/:variant
// @desc    Delete variant
// @access  Admin, Moderator
router.delete('/:id/variants/:variant', protect, authorize('admin', 'moderator'), deleteVariant);

export default router;
