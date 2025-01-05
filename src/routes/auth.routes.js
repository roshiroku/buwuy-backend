import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { register, login, auth, updateProfile } from '../controllers/auth.controller.js';

const router = Router();

// @route   GET /api/auth
// @desc    Auth user
// @access  User
router.get('/', protect, auth);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', uploadImage('uploads/users/avatars').single('avatar'), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   PUT /api/auth/profile
// @desc    Update profile
// @access  Authenticated User
router.put('/profile', protect, uploadImage('uploads/users').single('avatar'), updateProfile);

export default router;
