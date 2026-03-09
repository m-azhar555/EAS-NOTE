const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const AuthRouters = require('./routes/Auth');
const ExpenseRouters = require('./routes/Expense'); // 👈 Yeh nayi line add karein
const AdminRouters = require('./routes/Admin');

const app = express();
const connectDB = require('./db/connect');
const cors = require('cors');
app.use(cors()); // Ye line app.use(express.json()) ke upar add karein
app.use(express.json());

app.use('/auth', AuthRouters);
app.use('/expenses', ExpenseRouters); // 👈 Yeh nayi line add karein
app.use('/admin', AdminRouters);

const port = process.env.PORT || 5000;

const start = async () => {
try {
await connectDB(process.env.MONGO_URI);
app.listen(port, () =>
console.log(`Server is listening on port ${port}...`)
);
} catch (error) {
console.log(error);
}
};

start();