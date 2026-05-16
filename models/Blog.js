const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    },
    content: {
        type: String, // Rich text content
        required: true
    },
    image: {
        type: String, // Filename only
        default: null
    },
    metaTitle: {
        type: String,
        trim: true
    },
    metaKeywords: {
        type: String,
        trim: true
    },
    metaDescription: {
        type: String,
        trim: true
    },
    // Schema Storage
    faqSchema: {
        type: String, // Stored as JSON string
        default: '[]'
    },
    breadcrumbSchema: {
        type: String, // Stored as JSON string
        default: '[]'
    },
    ratingValue: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
