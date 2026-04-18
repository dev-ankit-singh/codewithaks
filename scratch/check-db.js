'use strict';
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Admin = require('../models/Admin');

const MONGO_URI = "mongodb+srv://ankitsinghse72_db_user:codewithaks123@cluster0.gjitan9.mongodb.net/adminankit";

async function check() {
    await mongoose.connect(MONGO_URI);
    console.log('DB:', mongoose.connection.name);
    
    const blogCount = await Blog.countDocuments();
    const contactCount = await Contact.countDocuments();
    const adminCount = await Admin.countDocuments();
    
    console.log('Blogs:', blogCount);
    console.log('Contacts:', contactCount);
    console.log('Admins:', adminCount);
    
    if (blogCount > 0) {
        const blogs = await Blog.find().limit(5);
        console.log('Sample Blogs:', blogs.map(b => ({ title: b.title, status: b.status })));
    }
    
    await mongoose.disconnect();
}

check().catch(console.error);
