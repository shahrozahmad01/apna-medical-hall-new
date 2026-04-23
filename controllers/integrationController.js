const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendSmsAlert } = require('../utils/alerts');

// @desc    Get business analytics
// @route   GET /api/integrations/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    // Order analytics
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Product analytics
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    // User analytics
    const totalUsers = await User.countDocuments();
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
          createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalProducts,
          totalUsers,
          lowStockProducts,
          recentUsers
        },
        trends: {
          monthlyRevenue
        }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// @desc    Send notification
// @route   POST /api/integrations/notifications
// @access  Private/Admin
const sendNotification = async (req, res) => {
  try {
    const { type, message, recipients } = req.body;

    if (!type || !message) {
      return res.status(400).json({ message: 'Type and message are required' });
    }

    let notificationRecipients = [];

    switch (type) {
      case 'all-users':
        const users = await User.find({}, 'phone');
        notificationRecipients = users.map(user => user.phone);
        break;
      case 'specific':
        if (!recipients || !Array.isArray(recipients)) {
          return res.status(400).json({ message: 'Recipients array is required for specific notifications' });
        }
        notificationRecipients = recipients;
        break;
      default:
        return res.status(400).json({ message: 'Invalid notification type' });
    }

    // Send SMS notifications
    const results = await Promise.allSettled(
      notificationRecipients.map(phone => sendSmsAlert(phone, message))
    );

    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failureCount = results.filter(result => result.status === 'rejected').length;

    res.status(200).json({
      success: true,
      message: `Notification sent to ${successCount} recipients, ${failureCount} failed`,
      data: {
        totalRecipients: notificationRecipients.length,
        successCount,
        failureCount
      }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};

// @desc    Export data
// @route   GET /api/integrations/export/:type
// @access  Private/Admin
const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json', startDate, endDate } = req.query;

    let data = [];
    let filename = '';

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    switch (type) {
      case 'products':
        data = await Product.find(dateFilter).populate('createdBy', 'name');
        filename = 'products-export';
        break;
      case 'orders':
        data = await Order.find(dateFilter)
          .populate('user', 'name phone')
          .populate('items.product', 'name price');
        filename = 'orders-export';
        break;
      case 'users':
        data = await User.find(dateFilter);
        filename = 'users-export';
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      res.send(csvData);
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
      res.json({
        exportDate: new Date(),
        type,
        count: data.length,
        data
      });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0].toObject ? data[0].toObject() : data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  data.forEach(item => {
    const values = headers.map(header => {
      const value = item[header] || '';
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

module.exports = {
  getAnalytics,
  sendNotification,
  exportData
};