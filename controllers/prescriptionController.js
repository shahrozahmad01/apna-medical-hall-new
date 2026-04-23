const Prescription = require('../models/Prescription');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/prescriptions');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc    Upload prescription
// @route   POST /api/prescriptions/upload
// @access  Private
const uploadPrescription = [
  upload.single('prescription'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Prescription file is required' });
      }

      const prescription = await Prescription.create({
        user: req.user.id,
        imageUrl: `/uploads/prescriptions/${req.file.filename}`
      });

      res.status(201).json({
        success: true,
        message: 'Prescription uploaded successfully',
        data: prescription
      });
    } catch (error) {
      console.error('Upload prescription error:', error);
      res.status(500).json({ message: 'Failed to upload prescription' });
    }
  }
];

// @desc    Get user's prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  try {
    let query = {};

    // Users see their own, admins see all
    if (req.user.role !== 'Admin') {
      query.user = req.user.id;
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const prescriptions = await Prescription.find(query)
      .populate('user', 'name phone')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Failed to fetch prescriptions' });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('user', 'name phone')
      .populate('approvedBy', 'name');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check ownership
    if (req.user.role !== 'Admin' && prescription.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Failed to fetch prescription' });
  }
};

// @desc    Approve/Reject prescription
// @route   PUT /api/prescriptions/:id/status
// @access  Private/Admin
const updatePrescriptionStatus = async (req, res) => {
  try {
    const { status, rejectionReason, notes, extractedMedicines } = req.body;

    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    prescription.status = status;
    prescription.approvedBy = req.user.id;

    if (status === 'Approved') {
      prescription.approvedAt = new Date();
      prescription.extractedMedicines = extractedMedicines || [];
    } else if (status === 'Rejected') {
      prescription.rejectedAt = new Date();
      prescription.rejectionReason = rejectionReason;
    }

    if (notes) {
      prescription.notes = notes;
    }

    await prescription.save();

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Update prescription status error:', error);
    res.status(500).json({ message: 'Failed to update prescription status' });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check ownership for non-admin users
    if (req.user.role !== 'Admin' && prescription.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this prescription' });
    }

    // Delete file from filesystem
    if (prescription.imageUrl) {
      const filePath = path.join(__dirname, '..', prescription.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prescription.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ message: 'Failed to delete prescription' });
  }
};

module.exports = {
  uploadPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescriptionStatus,
  deletePrescription
};