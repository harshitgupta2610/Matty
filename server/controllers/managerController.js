/**
 * @desc    Get manager-specific data (placeholder)
 * @route   GET /api/manager/data
 * @access  Private/Manager
 */
exports.getManagerData = async (req, res) => {
  // In a real application, you would fetch and return data relevant to a manager.
  res.json({
    message: "This is a protected manager route.",
    user: req.session.userId, // Example of accessing session data
  });
};

/**
 * @desc    Get all users (placeholder for manager functionality)
 * @route   GET /api/manager/users
 * @access  Private/Manager
 */
exports.getAllUsers = async (req, res) => {
  // This is where you might fetch all users from the User model
  res.json([
    { id: 1, name: "User One" },
    { id: 2, name: "User Two" },
  ]);
};
