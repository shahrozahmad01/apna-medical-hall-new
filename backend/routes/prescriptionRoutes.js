const express = require('express');
const {
  uploadPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescriptionStatus,
  deletePrescription
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/prescriptions/upload
// @desc    Upload prescription
// @access  Private
router.post('/upload', protect, uploadPrescription);

// @route   GET /api/prescriptions
// @desc    Get prescriptions
// @access  Private
router.get('/', protect, getPrescriptions);

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
// @access  Private
router.get('/:id', protect, getPrescription);

// @route   PUT /api/prescriptions/:id/status
// @desc    Update prescription status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('Admin'), updatePrescriptionStatus);

// @route   DELETE /api/prescriptions/:id
// @desc    Delete prescription
// @access  Private
router.delete('/:id', protect, deletePrescription);

module.exports = router;