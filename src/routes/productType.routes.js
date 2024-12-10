import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createProductType,
  getProductTypes,
  getProductType,
  updateProductType,
  deleteProductType
} from '../controllers/productType.controller.js';

const router = Router();

// All routes are protected and require admin or moderator roles
router.use(protect);
router.use(authorize('admin', 'moderator'));

// @route   POST /api/product-types
// @desc    Create a product type
// @access  Admin, Moderator
router.post('/', createProductType);

// @route   GET /api/product-types
// @desc    Get all product types
// @access  Admin, Moderator
router.get('/', getProductTypes);

// @route   GET /api/product-types/:id
// @desc    Get single product type
// @access  Admin, Moderator
router.get('/:id', getProductType);

// @route   PUT /api/product-types/:id
// @desc    Update product type
// @access  Admin, Moderator
router.put('/:id', updateProductType);

// @route   DELETE /api/product-types/:id
// @desc    Delete product type
// @access  Admin, Moderator
router.delete('/:id', deleteProductType);

export default router;
