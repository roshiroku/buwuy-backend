import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = Router();

// @route   POST /api/categories
// @desc    Create a category
// @access  Admin, Moderator
router.post('/', protect, authorize('admin', 'moderator'), createCategory);

// @route   GET /api/categories
// @desc    Get all categories
// @access  Guest
router.get('/', getCategories);

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Guest
router.get('/:id', getCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Admin, Moderator
router.put('/:id', protect, authorize('admin', 'moderator'), updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Admin, Moderator
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteCategory);

export default router;
