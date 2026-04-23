const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Prescription image is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: {
    type: String,
    maxlength: [200, 'Rejection reason cannot exceed 200 characters']
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  },
  extractedMedicines: [{
    name: String,
    dosage: String,
    quantity: Number
  }]
}, {
  timestamps: true
});

// Index for efficient queries
prescriptionSchema.index({ user: 1, createdAt: -1 });
prescriptionSchema.index({ status: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);