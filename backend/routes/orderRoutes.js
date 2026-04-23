const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get('/', protect, getOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, getOrder);

// @route   POST /api/orders
// @desc    Create order
// @access  Private
router.post('/', protect, createOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('Admin'), updateOrderStatus);

// @route   GET /api/orders/stats/overview
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats/overview', protect, authorize('Admin'), getOrderStats);

module.exports = router;