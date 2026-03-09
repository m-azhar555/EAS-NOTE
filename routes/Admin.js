const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Expense = require('../models/Expense');
const fetchuser = require('../middlewares/fetchuser');
const isAdmin = require('../middlewares/isAdmin');

// System ki summary dekhne ke liye
router.get('/stats', fetchuser, isAdmin, async (req, res) => {
try {
const totalUsers = await User.countDocuments();
const totalExpenses = await Expense.countDocuments();
const pendingExpenses = await Expense.countDocuments({ status: 'Pending' });
res.json({ totalUsers, totalExpenses, pendingExpenses });
} catch (error) {
res.status(500).json({ message: "Server Error" });
}
});

// Saare users dekhne ke liye
router.get('/users', fetchuser, isAdmin, async (req, res) => {
try {
const users = await User.find().select('-password');
res.json(users);
} catch (error) {
res.status(500).json({ message: "Server Error" });
}
});

module.exports = router;