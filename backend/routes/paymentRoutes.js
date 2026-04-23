const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-intent', protect, createPaymentIntent);

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', protect, confirmPayment);

// @route   GET /api/payments/:id/status
// @desc    Get payment status
// @access  Private
router.get('/:id/status', protect, getPaymentStatus);

module.exports = router;