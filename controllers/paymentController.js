const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paisa/cents
      currency: 'inr',
      metadata: {
        orderId: orderId,
        userId: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Verify order
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order status
      order.paymentStatus = 'Paid';
      order.status = 'Confirmed';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        order: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/:id/status
// @access  Private
const getPaymentStatus = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);

    res.status(200).json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus
};