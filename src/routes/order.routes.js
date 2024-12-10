import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createOrder,
  getOrders,
  getUserOrders,
  getOrder,
  updateOrder,
  deleteOrder
} from '../controllers/order.controller.js';

const router = Router();

// @route   POST /api/orders
// @desc    Create an order
// @access  Authenticated Users
router.post('/', protect, createOrder);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Admin, Moderator
router.get('/', protect, authorize('admin', 'moderator'), getOrders);

// @route   GET /api/orders/user
// @desc    Get orders of the logged-in user
// @access  Authenticated Users
router.get('/user', protect, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Admin, Moderator or the user who placed the order
router.get('/:id', protect, getOrder);

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Admin, Moderator
router.put('/:id', protect, authorize('admin', 'moderator'), updateOrder);

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Admin, Moderator
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteOrder);

export default router;
