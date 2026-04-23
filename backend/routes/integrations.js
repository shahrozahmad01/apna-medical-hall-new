const express = require('express');
const {
  getAnalytics,
  sendNotification,
  exportData
} = require('../controllers/integrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/integrations/analytics
// @desc    Get business analytics
// @access  Private/Admin
router.get('/analytics', protect, authorize('Admin'), getAnalytics);

// @route   POST /api/integrations/notifications
// @desc    Send notification
// @access  Private/Admin
router.post('/notifications', protect, authorize('Admin'), sendNotification);

// @route   GET /api/integrations/export/:type
// @desc    Export data (products, orders, users)
// @access  Private/Admin
router.get('/export/:type', protect, authorize('Admin'), exportData);

module.exports = router;