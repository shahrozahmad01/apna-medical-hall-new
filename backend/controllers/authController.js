const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendSMS } = require('../utils/alerts');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone format
    if (!/^\+91\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid Indian phone number (+91XXXXXXXXXX)' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 12);

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        name: 'New User', // Will be updated during verification
        address: 'To be updated'
      });
    }

    // Save OTP
    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via SMS (in production)
    await sendSMS(phone, `Your Apna Medical Hall verification code is: ${otp}. Valid for 10 minutes.`);

    res.status(200).json({
      message: 'OTP sent successfully',
      phone: phone
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP and login
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name, address } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const user = await User.findOne({ phone }).select('+otp +otpExpires');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'OTP not found. Please request a new one' });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update user details if provided
    if (name) user.name = name;
    if (address) user.address = address;

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = signToken(user._id);

    // Set cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Failed to get user data' });
  }
};

// Logout
const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = {
  sendOtp,
  verifyOtp,
  getMe,
  logout
};