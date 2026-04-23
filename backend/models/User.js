const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\+91\d{10}$/.test(v);
      },
      message: 'Please enter a valid Indian phone number (+91XXXXXXXXXX)'
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  role: {
    type: String,
    enum: ['User', 'Staff', 'Admin'],
    default: 'User'
  },
  otp: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving (if we add password later)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // For now, OTP based, no password
  next();
});

// Instance method to check OTP
userSchema.methods.compareOtp = async function(candidateOtp) {
  return await bcrypt.compare(candidateOtp, this.otp);
};

module.exports = mongoose.model('User', userSchema);