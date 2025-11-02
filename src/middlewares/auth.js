const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/user.model');
const redisClient = require('../services/redisClient');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }

    // Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.safeGet(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ msg: 'Token has been revoked.' });
    }

    const decoded = verifyToken(token);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ msg: 'Invalid token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };