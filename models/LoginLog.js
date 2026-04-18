const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    location: {
        type: Object, // Will store geoip-lite output
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LoginLog', loginLogSchema);
