const User = require('../models/User'); // Aapka User Schema
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Register Controller ---
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check agar user pehle se maujood hai
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Password Hash karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya User banana (Role ke sath)
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'employee' // Agar role nahi bheja toh default employee
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// --- Login Controller ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User ko dhundna
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Password match karna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // JWT Token banana (Payload mein role shamil karein)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'your_secret_key', 
            { expiresIn: '1d' }
        );

        // 🟢 Frontend ko Token aur Role dono bhejna
        res.json({
            token,
            role: user.role, // Ye bohat zaroori hai redirect ke liye
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};