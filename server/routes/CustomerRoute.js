// routes/CustomerRoute.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const User = require('../models/Users');
const Feedback = require('../models/Feedback');
const Product = require('../models/Product');

// Get customer profile

// Get all products (for feedback form dropdown)
// GET customer's feedback history 

// POST submit feedback (your existing route)

module.exports = router;
