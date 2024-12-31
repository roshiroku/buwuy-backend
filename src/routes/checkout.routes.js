import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { startCheckout, finishCheckout, getCheckout } from '../controllers/checkout.controller.js';

const router = Router();

// @route   POST /api/checkout
// @desc    Start checkout
// @access  Guest
router.post('/', auth, startCheckout);

// @route   POST /api/checkout/:id
// @desc    Finish checkout
// @access  Guest or the user who placed the order
router.post('/:id', auth, finishCheckout);

// @route   GET /api/checkout/:id
// @desc    Get checkout
// @access  Guest or the user who placed the order
router.get('/:id', auth, getCheckout);

export default router;
