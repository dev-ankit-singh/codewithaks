const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Contact = require('./models/Contact');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect("mongodb+srv://ankitsinghse72_db_user:codewithaks123@cluster0.gjitan9.mongodb.net/adminankit")
.then(()=>console.log("MongoDB Atlas connected"))
.catch(err=>console.error("MongoDB connection error:", err));

// API Route for contact form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Simple validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();
        
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
