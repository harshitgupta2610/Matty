const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes'); // adjust path
const cors = require('cors');
const managerRoutes = require('./routes/managerRoutes'); // adjust path
const customerRoutes = require('./routes/CustomerRoute'); // adjust path
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/manager', managerRoutes);
app.use('/api/customer', customerRoutes); // Add this line
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
})
.catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});



