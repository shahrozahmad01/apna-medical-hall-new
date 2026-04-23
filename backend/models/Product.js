const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['General', 'Prescription', 'Wellness', 'Baby Care', 'Personal Care']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  manufacturer: {
    type: String,
    trim: true,
    maxlength: [100, 'Manufacturer name cannot exceed 100 characters']
  },
  batchNumber: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Threshold cannot be negative']
  }
}, {
  timestamps: true
});

// Index for efficient queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ stock: 1 });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'Out of Stock';
  if (this.stock <= this.lowStockThreshold) return 'Low Stock';
  return 'In Stock';
});

// Instance method to check if product is expiring soon
productSchema.methods.isExpiringSoon = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return this.expiryDate <= futureDate;
};

module.exports = mongoose.model('Product', productSchema);