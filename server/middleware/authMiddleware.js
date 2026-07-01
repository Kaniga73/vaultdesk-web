const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Check if token exists in request headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verify token is genuine and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object (without password)
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };