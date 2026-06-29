const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  faqId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faq', required: true },
  feedback: { type: String, enum: ['helpful', 'not_helpful'], required: true },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  page: { type: String, default: '' }
}, { timestamps: true });

// one vote per FAQ per IP
reviewSchema.index({ faqId: 1, ipAddress: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);