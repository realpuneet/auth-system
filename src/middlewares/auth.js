const { verifyToken } = require("../utils/jwt");
const userModel = require("../models/user.model");
const redisClient = require("../services/redisClient");
const logger = require("../utils/logger");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      logger.warn("Authentication attempt without token from %s", res.ip);
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    // Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.safeGet(`blacklist:${token}`);
    if (isBlacklisted) {
      logger.info('Blacklisted token used from %s', req.ip)
      return res.status(401).json({ msg: "Token has been revoked." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ msg: "Invalid token." });
    }
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
        logger.warn("Tokwn not found %s", decoded.id)
      return res.status(401).json({ msg: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error: %o", error);
    return res.status(401).json({ msg: "Invalid token." });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
        logger.warn("Unauthorized role access attempt: %s required=%o user=%o", req.path, roles, req.user.role)
      return res
        .status(403)
        .json({ msg: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
