import { Router } from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { createTag, getTags, getTag, updateTag, deleteTag } from '../controllers/tag.controller.js';

const router = Router();

// @route   POST /api/tags
// @desc    Create a tag
// @access  Admin, Moderator
router.post('/', protect, authorize('admin', 'moderator'), multer().none(), createTag);

// @route   GET /api/tags
// @desc    Get all tags
// @access  Guest
router.get('/', getTags);

// @route   GET /api/tags/:id
// @desc    Get single tag
// @access  Guest
router.get('/:id', getTag);

// @route   PUT /api/tags/:id
// @desc    Update tag
// @access  Admin, Moderator
router.put('/:id', protect, authorize('admin', 'moderator'), multer().none(), updateTag);

// @route   DELETE /api/tags/:id
// @desc    Delete tag
// @access  Admin, Moderator
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteTag);

export default router;
