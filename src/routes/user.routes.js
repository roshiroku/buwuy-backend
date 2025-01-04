import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

// @route   POST /api/users
// @desc    Create a user
// @access  Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadImage('uploads/users').single('avatar'),
  userController.createUser
);

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get('/', protect, authorize('admin'), userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Admin
router.get('/:id', protect, authorize('admin'), userController.getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadImage('uploads/users').single('avatar'),
  userController.updateUser
);

// @route   PUT /api/users/profile
// @desc    Update profile
// @access  Authenticated User
router.put(
  '/profile',
  protect,
  uploadImage('uploads/users').single('avatar'),
  userController.updateProfile
);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

export default router;
