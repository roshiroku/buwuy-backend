import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { updateCart, getCart, clearCart } from '../controllers/cart.controller.js';

const router = Router();

// @route   GET /api/cart
// @desc    Get cart
// @access  User
router.get('/', protect, getCart);

// @route   PUT /api/cart
// @desc    Update cart
// @access  User
router.put('/', protect, updateCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  User
router.delete('/', protect, clearCart);

export default router;
