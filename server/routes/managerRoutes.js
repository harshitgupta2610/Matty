const express = require('express');
const router = express.Router();
const { getManagerData, getAllUsers } = require('../controllers/managerController');
const { protect } = require('../middlewares/auth'); // Assuming you want to protect these routes

// Apply the 'protect' middleware to all manager routes
router.use(protect);

// Define the routes for the manager
router.get('/data', getManagerData);
router.get('/users', getAllUsers);

module.exports = router;
