// routes/CustomerRoute.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const User = require('../models/Users');
const Feedback = require('../models/Feedback');
const Product = require('../models/Product');

// Get customer profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error getting profile' });
  }
});

// Get all products (for feedback form dropdown)
router.get('/products', authenticate, async (req, res) => {
  try {
    const products = await Product.find().select('name _id');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error getting products' });
  }
});

// GET customer's feedback history 
router.get('/feedback', authenticate, async (req, res) => {
  try {
    console.log('Fetching feedback history for user:', req.user.id); // Debug log
    
    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find feedback by email (since customers might submit feedback with email)
    const feedbacks = await Feedback.find({ email: user.email })
      .populate('productId', 'name') 
      .sort({ submittedAt: -1 }); 
    
    res.json(feedbacks);
    
  } catch (error) {
    console.error('Error fetching feedback history:', error);
    res.status(500).json({ message: 'Error getting feedback history' });
  }
});

// POST submit feedback (your existing route)
router.post('/feedback', authenticate, async (req, res) => {
  try {
    const { productId, rating, feedbackType, message, suggestions } = req.body;
    
    // Get user info
    const user = await User.findById(req.user.id);
    
    // Basic validation
    if (!rating || !message) {
      return res.status(400).json({ 
        message: 'Rating and message are required' 
      });
    }

    // Create feedback
    const feedback = new Feedback({
      customerName: user.name,
      email: user.email,
      productId: productId || null,
      rating: parseInt(rating),
      feedbackType: feedbackType || 'general',
      message: message,
      suggestions: suggestions || '',
      status: 'pending',
      submittedAt: new Date()
    });

    const savedFeedback = await feedback.save();
    
    res.json({ 
      message: 'Feedback submitted successfully',
      feedback: savedFeedback 
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});

module.exports = router;
