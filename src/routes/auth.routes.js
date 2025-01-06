import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { register, login, auth, updateProfile, updateSettings } from '../controllers/auth.controller.js';

const router = Router();

// @route   GET /api/auth
// @desc    Auth user
// @access  User
router.get('/', protect, auth);

// @route   PUT /api/auth/
// @desc    Update profile
// @access  Authenticated User
router.put('/', protect, uploadImage('uploads/users').single('avatar'), updateProfile);

// @route   PATCH /api/auth/
// @desc    Update settings
// @access  Authenticated User
router.patch('/', protect, updateSettings);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', uploadImage('uploads/users/avatars').single('avatar'), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

export default router;
