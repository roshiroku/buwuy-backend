import { Router } from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.middleware.js';
import { updateCart, getCart, clearCart } from '../controllers/cart.controller.js';

const router = Router();

// @route   GET /api/cart
// @desc    Get cart
// @access  User
router.get('/', protect, getCart);

// @route   POST /api/cart
// @desc    Create cart
// @access  User
router.post('/', protect, multer().none(), updateCart);

// @route   PUT /api/cart
// @desc    Update cart
// @access  User
router.put('/', protect, multer().none(), updateCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  User
router.delete('/', protect, clearCart);

export default router;
