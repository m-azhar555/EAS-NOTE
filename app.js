const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Security headers ke liye: npm install helmet
const connectDB = require('./db/connect');

// Routes Imports
const AuthRouters = require('./routes/Auth');
const ExpenseRouters = require('./routes/Expense'); 
const AdminRouters = require('./routes/Admin');

const app = express();

// 🟢 1. Production Security Middlewares
app.use(helmet()); // HTTP headers ko secure karta hai
app.use(express.json());

// 🟢 2. Advanced CORS Configuration
// Isse sirf hamara specific frontend hi API access kar sakega
const allowedOrigins = [
  'http://localhost:3000', // Development ke liye
  process.env.FRONTEND_URL  // Production (Vercel) URL ke liye
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 🟢 3. API Routes
app.use('/auth', AuthRouters);
app.use('/expenses', ExpenseRouters); 
app.use('/admin', AdminRouters);

// 🟢 4. Health Check Route (Deployment check ke liye zaroori hai)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is active and healthy! 🚀' });
});

// 🟢 5. Global Error Handling Middleware
// Agar kisi route mein error aata hai, toh server crash nahi hoga
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Something went wrong on the server!",
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// 🟢 6. Dynamic Port Allocation
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // DB Connection check
    console.log("Connecting to Database...");
    await connectDB(process.env.MONGO_URI);
    console.log("Database Connected Successfully! ✅");

    app.listen(port, () =>
      console.log(`Server is live on port ${port}... 🌍`)
    );
  } catch (error) {
    console.log("❌ Connection Error:", error);
    process.exit(1); // Exit process with failur='[p;\./<]
  }
};

start();