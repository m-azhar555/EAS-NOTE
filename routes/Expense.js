const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const fetchuser = require('../middlewares/fetchuser');

// Route 1: Naya Expense Submit Karna (POST "/expenses/add")
router.post('/add', fetchuser, async (req, res) => {
try {
const { amount, purpose } = req.body;
if (!amount || !purpose) {
return res.status(400).json({ message: "Amount aur Purpose likhna lazmi hai." });
}
const newExpense = new Expense({
amount,
purpose,
employeeId: req.user.id,
status: 'Pending'
});
const savedExpense = await newExpense.save();
res.status(201).json({ message: "Expense Request Sent! ✅", expense: savedExpense });
} catch (error) {
res.status(500).json({ message: "Server Error", error: error.message });
}
});

// Route 2: Employee ka apna Expense History dekhna (GET "/expenses/my-expenses")
router.get('/my-expenses', fetchuser, async (req, res) => {
try {
const expenses = await Expense.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
res.json(expenses);
} catch (error) {
res.status(500).json({ message: "Server Error", error: error.message });
}
});

module.exports = router;