const keycloakService = require("../services/keycloakService.js");
const jwt = require("jsonwebtoken");
const tokenStore = require("../config/tokenStore.js");
const keycloakConfig = require("../config/keycloakConfig.js");
const { authLogger, logger } = require("../config/logger.js");

/**
 * Login endpoint - supports both test users and Keycloak authentication
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      authLogger.warn("Login attempt with missing credentials");
      return res.status(400).json({ 
        error: "missing_credentials",
        error_description: "Username and password are required" 
      });
    }

    // Check for test users first (development mode)
    const testUser = keycloakConfig.TEST_USERS?.find(
      user => user.username === username && user.password === password
    );
    
    if (testUser) {
      authLogger.info(`Test user login successful: ${username}`, { 
        username, 
        roles: testUser.roles 
      });
      
      // Create mock JWT token
      const now = Math.floor(Date.now() / 1000);
      const mockToken = jwt.sign({
        sub: testUser.id,
        preferred_username: testUser.username,
        email: testUser.email,
        name: testUser.name,
        realm_access: { roles: testUser.roles },
        iat: now,
        exp: now + 3600 // 1 hour
      }, 'mock-secret', { algorithm: 'HS256' });
      
      // Store token
      tokenStore.setToken(mockToken);
      
      return res.status(200).json({
        access_token: mockToken,
        refresh_token: `refresh_${mockToken}`,
        token_type: "Bearer",
        expires_in: 3600
      });
    }

    // Try Keycloak authentication
    authLogger.info(`Keycloak authentication attempt: ${username}`);
    const result = await keycloakService.getToken(username, password);
    
    if (result && result.access_token) {
      tokenStore.setToken(result.access_token);
      authLogger.info(`Keycloak login successful: ${username}`);
      return res.status(200).json(result);
    }
    
    authLogger.warn(`Login failed for user: ${username}`);
    return res.status(401).json({ 
      error: "authentication_failed",
      error_description: "Invalid user credentials" 
    });
    
  } catch (error) {
    authLogger.error("Login error:", { error: error.message, stack: error.stack });
    return res.status(500).json({ 
      error: "server_error",
      error_description: "Internal server error during authentication" 
    });
  }
};

/**
 * Logout endpoint
 */
exports.logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (refresh_token) {
      authLogger.info("Processing logout with refresh token");
      await keycloakService.logoutUser(refresh_token);
    }
    
    // Clear stored token
    tokenStore.clearToken();
    authLogger.info("User logged out successfully");
    
    res.status(200).json({ 
      message: "Logout successful" 
    });
    
  } catch (error) {
    authLogger.error("Logout error:", { error: error.message, stack: error.stack });
    
    // Still clear token even if logout fails
    tokenStore.clearToken();
    
    res.status(200).json({ 
      message: "Logout completed" 
    });
  }
};

/**
 * Get user information endpoint
 */
exports.getUserInfo = async (req, res) => {
  try {
    const token = tokenStore.getToken();
    
    if (!token) {
      authLogger.warn("getUserInfo called without token");
      return res.status(401).json({ 
        error: "no_token",
        error_description: "No access token found" 
      });
    }

    let userInfo;
    
    // Try to get user info from Keycloak first
    try {
      userInfo = await keycloakService.getUserInfo();
      authLogger.debug("Retrieved user info from Keycloak");
    } catch (keycloakError) {
      authLogger.warn("Keycloak userinfo failed, using JWT data", { 
        error: keycloakError.message 
      });
      
      // Fall back to JWT token data
      const decodedToken = tokenStore.getDecodedToken();
      if (decodedToken) {
        authLogger.info("Using JWT data for user info");
        userInfo = {
          sub: decodedToken.sub,
          preferred_username: decodedToken.preferred_username,
          email: decodedToken.email,
          name: decodedToken.name,
          roles: decodedToken.realm_access?.roles || []
        };
      } else {
        throw new Error("No valid token data available");
      }
    }

    if (userInfo) {
      authLogger.debug("User info retrieved successfully", { 
        username: userInfo.preferred_username 
      });
      return res.status(200).json(userInfo);
    }
    
    authLogger.error("Failed to retrieve user information");
    return res.status(500).json({ 
      error: "user_info_error",
      error_description: "Failed to retrieve user information" 
    });
    
  } catch (error) {
    authLogger.error("Get user info error:", { error: error.message, stack: error.stack });
    return res.status(500).json({ 
      error: "server_error",
      error_description: "Internal server error while fetching user info" 
    });
  }
};
