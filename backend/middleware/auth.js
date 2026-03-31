const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and attach user info
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    // Attach user info to request
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

// Check if user is admin or organizer
exports.isAdminOrOrganizer = (req, res, next) => {
  if (!req.user || !['admin', 'organizer'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Admin or Organizer access required',
    });
  }
  next();
};

// Check if user is player
exports.isPlayer = (req, res, next) => {
  if (!req.user || req.user.role !== 'player') {
    return res.status(403).json({
      success: false,
      message: 'Player access required',
    });
  }
  next();
};

// Check if user can access resource (owner or admin)
exports.canAccess = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Authentication required',
      });
    }
    
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if user is the owner of the resource
    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  };
};
