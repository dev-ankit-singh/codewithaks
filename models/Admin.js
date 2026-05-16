'use strict';
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true   // Always stored as bcrypt hash – never plaintext
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin'
    }
}, { timestamps: true });

// Enforce single-admin: only one document allowed
adminSchema.statics.ensureSingleAdmin = async function () {
    const count = await this.countDocuments();
    return count === 0; // true = can create
};

module.exports = mongoose.model('Admin', adminSchema);
