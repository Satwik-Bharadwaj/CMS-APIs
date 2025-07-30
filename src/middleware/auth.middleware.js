const jwt = require('jsonwebtoken');
const tokenStore = require("../config/tokenStore");

/**
 * Middleware to extract and validate JWT tokens from requests
 */
const tokenMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      if (token) {
        // Set the token in our token store for downstream use
        tokenStore.setToken(token);
      }
    }

    next();
  } catch (error) {
    console.error('Error in token middleware:', error);
    next(); // Continue even if token processing fails
  }
};

/**
 * Middleware to require authentication for protected routes
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Store token for downstream middleware
    tokenStore.setToken(token);
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid access token'
    });
  }
};

/**
 * Optional authentication - don't fail if no token present
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      if (token) {
        tokenStore.setToken(token);
        req.token = token;
      }
    }

    next();
  } catch (error) {
    console.error('Error in optional auth middleware:', error);
    next(); // Continue regardless of auth status
  }
};

module.exports = {
  tokenMiddleware,
  requireAuth,
  optionalAuth
};
