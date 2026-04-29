const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// SIGNUP
// Inside your signup route
router.post('/signup', async (req, res) => {
    const { name, email, password, role, qualification, jobTitle } = req.body;
    try {
        const newUser = new User({ 
            name, 
            email, 
            password, // Remember to hash this with bcrypt!
            role, 
            qualification, 
            jobTitle 
        });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
// backend/routes/auth.js (Login Route)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // If you aren't using bcrypt yet, check plain text
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                name: user.name,
                role: user.role,
                qualification: user.qualification,
                jobTitle: user.jobTitle
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;