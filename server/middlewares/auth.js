// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch {
    res.status(400).send('Invalid token');
  }
};
// This middleware checks for a valid JWT token in the request headers.
// If the token is valid, it decodes the user information and attaches it to the request
const protect = (req, res, next) => {
  // Check if the user's ID is stored in the session
  if (req.session && req.session.userId) {
    // If the user is authenticated, proceed to the next middleware/route handler
    next();
  } else {
    // If there is no session or userId, the user is not authorized
    res.status(401).json({ message: "Not authorized, please log in." });
  }
};

// Export the middleware function in an object so it can be destructured on import
module.exports = { protect };
