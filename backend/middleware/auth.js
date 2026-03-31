const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
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
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user is organizer or admin
exports.isOrganizerOrAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    if (user.role !== 'admin' && user.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Organizer access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user is franchise owner or admin
exports.isFranchiseOwnerOrAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    if (user.role !== 'admin' && user.role !== 'franchise_owner') {
      return res.status(403).json({
        success: false,
        message: 'Franchise owner access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user is player
exports.isPlayer = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);

    if (user.role !== 'player') {
      return res.status(403).json({
        success: false,
        message: 'Player access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
