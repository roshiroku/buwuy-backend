import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { createTag, getTags, getTag, updateTag, deleteTag } from '../controllers/tag.controller.js';

const router = Router();

// All routes are protected and require admin or moderator roles
router.use(protect);
router.use(authorize('admin', 'moderator'));

// @route   POST /api/tags
// @desc    Create a tag
// @access  Admin, Moderator
router.post('/', createTag);

// @route   GET /api/tags
// @desc    Get all tags
// @access  Admin, Moderator
router.get('/', getTags);

// @route   GET /api/tags/:id
// @desc    Get single tag
// @access  Admin, Moderator
router.get('/:id', getTag);

// @route   PUT /api/tags/:id
// @desc    Update tag
// @access  Admin, Moderator
router.put('/:id', updateTag);

// @route   DELETE /api/tags/:id
// @desc    Delete tag
// @access  Admin, Moderator
router.delete('/:id', deleteTag);

export default router;
