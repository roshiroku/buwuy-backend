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

// All routes are protected and require admin or moderator roles
router.use(protect);
router.use(authorize('admin', 'moderator'));

// @route   POST /api/categories
// @desc    Create a category
// @access  Admin, Moderator
router.post('/', createCategory);

// @route   GET /api/categories
// @desc    Get all categories
// @access  Admin, Moderator
router.get('/', getCategories);

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Admin, Moderator
router.get('/:id', getCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Admin, Moderator
router.put('/:id', updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Admin, Moderator
router.delete('/:id', deleteCategory);

export default router;
