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

// All routes are protected and require admin or moderator roles
router.use(protect);
router.use(authorize('admin', 'moderator'));

// @route   POST /api/products
// @desc    Create a product
// @access  Admin, Moderator
router.post('/', createProduct);

// @route   GET /api/products
// @desc    Get all products
// @access  Admin, Moderator
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Admin, Moderator
router.get('/:id', getProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin, Moderator
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin, Moderator
router.delete('/:id', deleteProduct);

export default router;
