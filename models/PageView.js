const mongoose = require('mongoose');
const pageViewSchema = new mongoose.Schema({
    pageUrl: { type: String, required: true },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    visitedAt: { type: Date, default: Date.now }
});
pageViewSchema.index({ visitedAt: 1 });
pageViewSchema.index({ pageUrl: 1 });
module.exports = mongoose.model('PageView', pageViewSchema);
