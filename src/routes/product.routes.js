import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

// @route   POST /api/products
// @desc    Create a product
// @access  Admin, Moderator
router.post('/', protect, authorize('admin', 'moderator'), createProduct);

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
router.put('/:id', protect, authorize('admin', 'moderator'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin, Moderator
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteProduct);

export default router;
