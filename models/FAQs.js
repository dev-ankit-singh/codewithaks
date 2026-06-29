const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [String],
    slug: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        default: "Published"
    },
    breadcrumbSchema: {
        type: String,
        default: '[]'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Faq", faqSchema);