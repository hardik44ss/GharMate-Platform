const mongoose = require('mongoose');

/**
 * Bid model — a contractor's bid on a project.
 * projectId ref: Project, contractorId ref: User
 * Bid status: PENDING, ACCEPTED, REJECTED
 */
const BidSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Contractor is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    estimatedDays: {
      type: Number,
      required: [true, 'Estimated days is required'],
      min: [1, 'Estimated days must be at least 1'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', BidSchema);