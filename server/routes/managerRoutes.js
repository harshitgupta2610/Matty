// routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const Feedback = require('../models/Feedback');

// Check if user is manager
const checkManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ 
      message: 'Access denied. Manager role required.' 
    });
  }
  next();
};

// GET all feedback (for manager)
router.get('/feedback', authenticate, checkManager, async (req, res) => {
  try {
    console.log('Manager feedback route called'); // Debug log
    
    const feedbacks = await Feedback.find()
      .populate('productId', 'name')
      .sort({ submittedAt: -1 });
    
    console.log(`Found ${feedbacks.length} feedbacks`); // Debug log
    res.json(feedbacks);
    
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ 
      message: 'Error fetching feedbacks',
      error: error.message 
    });
  }
});
// Add this to your existing routes/managerRoutes.js

// Update feedback status
router.patch('/feedback/:id/status', authenticate, checkManager, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update the feedback status
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ 
      message: 'Status updated successfully',
      feedback: updatedFeedback 
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
});


module.exports = router;
