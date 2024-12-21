import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadImage } from '../middleware/upload.middleware.js';
import { register, login, auth } from '../controllers/auth.controller.js';

const router = Router();

// @route   GET /api/auth
// @desc    Auth user
// @access  User
router.get('/', protect, auth);

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', uploadImage('uploads/users/avatar').single('avatar'), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

export default router;
