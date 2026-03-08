const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const fetchuser = require('../middlewares/fetchuser');

// AGAR AAPNE MIDDLEWARE FOLDER KA NAAM 'middlewares' RAKHA HAI TO YE LINE USE KAREIN:
const isManager = require('../middlewares/isManager');

// 1. Employee Route: Naya Expense Submit Karna
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

// 2. Employee Route: Apne Expenses Dekhna
router.get('/my-expenses', fetchuser, async (req, res) => {
try {
const expenses = await Expense.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
res.json(expenses);
} catch (error) {
res.status(500).json({ message: "Server Error", error: error.message });
}
});

// 3. Manager Route: Saare Pending Requests Dekhna
router.get('/all-pending', fetchuser, isManager, async (req, res) => {
try {
const pending = await Expense.find({ status: 'Pending' }).populate('employeeId', 'name email');
res.json(pending);
} catch (error) {
res.status(500).json({ message: "Server Error", error: error.message });
}
});

// 4. Manager Route: Status Update Karna (Approve/Reject)
router.put('/update-status/:id', fetchuser, isManager, async (req, res) => {
try {
const { status } = req.body;
if (!['Approved', 'Rejected'].includes(status)) {
return res.status(400).json({ message: "Invalid Status! Use Approved or Rejected." });
}
const expense = await Expense.findByIdAndUpdate(
req.params.id,
{ status: status },
{ new: true }
);
if (!expense) return res.status(404).json({ message: "Expense not found!" });
res.json({ message: `Expense request ${status} successfully!, expense` });
} catch (error) {
res.status(500).json({ message: "Server Error", error: error.message });
}
});

module.exports = router;