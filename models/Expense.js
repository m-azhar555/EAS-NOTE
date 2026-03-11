const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    documentUrl: { type: String } // Agar koi receipt upload kare
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);