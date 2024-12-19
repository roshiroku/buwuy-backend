import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { uploadImage } from '../middleware/upload.middleware.js';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', uploadImage('uploads/users/avatar').single('avatar'), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

export default router;
