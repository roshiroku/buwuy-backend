import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

router.use(protect, authorize('admin'));

// @route   POST /api/users
// @desc    Create a user
// @access  Admin
router.post('/', uploadImage('uploads/users').single('avatar'), userController.createUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Admin
router.get('/', userController.getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Admin
router.get('/:id', userController.getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Admin
router.put('/:id', uploadImage('uploads/users').single('avatar'), userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/:id', userController.deleteUser);

export default router;
