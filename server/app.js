require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

// --- Import All Necessary Routes ---
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const customerRoutes = require('./routes/CustomerRoute');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. CORS Configuration ---
// This must come before any routes are registered.
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// --- 2. Body Parser Middleware ---
// To handle JSON data in requests.
app.use(express.json());

// --- 3. Session Configuration ---
// This is the critical fix. It must have a 'secret'.
app.use(session({
  secret: process.env.SESSION_SECRET, // Make sure SESSION_SECRET is in your .env file
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
}));

// --- 4. Register All API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// --- 5. Connect to MongoDB and Start Server ---
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
