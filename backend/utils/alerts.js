const Product = require('../models/Product');
const User = require('../models/User');

// Check for products expiring within 30 days
const checkExpiryAlerts = async () => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringProducts = await Product.find({
      expiryDate: { $lte: thirtyDaysFromNow },
      isActive: true
    }).select('name expiryDate stock');

    if (expiringProducts.length > 0) {
      console.log('🚨 EXPIRY ALERTS:');
      expiringProducts.forEach(product => {
        const daysUntilExpiry = Math.ceil((product.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`- ${product.name}: expires in ${daysUntilExpiry} days (${product.stock} in stock)`);
      });

      // In production, send email/SMS to admins
      // await sendExpiryAlertEmail(expiringProducts);
    }
  } catch (error) {
    console.error('Error checking expiry alerts:', error);
  }
};

// Check for low stock products
const checkLowStockAlerts = async () => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      stock: { $gt: 0 },
      isActive: true
    }).select('name stock lowStockThreshold');

    if (lowStockProducts.length > 0) {
      console.log('⚠️ LOW STOCK ALERTS:');
      lowStockProducts.forEach(product => {
        console.log(`- ${product.name}: ${product.stock} remaining (threshold: ${product.lowStockThreshold})`);
      });

      // In production, send email/SMS to admins
      // await sendLowStockAlertEmail(lowStockProducts);
    }
  } catch (error) {
    console.error('Error checking low stock alerts:', error);
  }
};

// Utility function to send SMS (placeholder - integrate with Twilio)
const sendSMS = async (phone, message) => {
  // Placeholder for SMS service integration
  console.log(`SMS to ${phone}: ${message}`);
  
  // In production:
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: phone
  // });
};

// Utility function to send email (placeholder)
const sendEmail = async (to, subject, body) => {
  // Placeholder for email service integration
  console.log(`Email to ${to}: ${subject} - ${body}`);
  
  // In production, integrate with SendGrid, Nodemailer, etc.
};

module.exports = {
  checkExpiryAlerts,
  checkLowStockAlerts,
  sendSMS,
  sendEmail
};