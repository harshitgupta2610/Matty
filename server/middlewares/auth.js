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
