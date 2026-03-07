const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Aapka Day 2 wala User model

const router = express.Router();

// 🟢 1. REGISTER API
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check karein ke user pehle se mojood toh nahi
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User is email se pehle hi mojood hai!" });

        // Password ko Hash (secure) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya User database mein save karna
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee' // Agar role nahi diya to default employee banega
        });
        await user.save();

        res.status(201).json({ message: "User Register ho gaya! 🎉" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 🔵 2. LOGIN API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // User ko database mein dhoondna
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

        // Password check karna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

        // JWT Token banana
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token 1 din ke liye valid hoga
        );

        res.json({
            message: "Login Successful!",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;