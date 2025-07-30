const keycloakService = require("../services/keycloakService.js");
const jwt = require("jsonwebtoken");
const tokenStore = require("../config/tokenStore.js");
const keycloakConfig = require("../config/keycloakConfig.js");

/**
 * Login endpoint - supports both test users and Keycloak authentication
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
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
      console.log(`Test user login: ${username}`);
      
      // Create mock JWT token
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        sub: `test-user-${username}`,
        preferred_username: username,
        email: `${username}@test.com`,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        realm_access: { roles: testUser.roles },
        exp: now + 3600, // 1 hour
        iat: now
      };
      
      const secret = process.env.JWT_SECRET || 'development-secret-key';
      const token = jwt.sign(payload, secret);
      
      const mockToken = {
        access_token: token,
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
        refresh_expires_in: 86400,
        token_type: "bearer"
      };
      
      tokenStore.setToken(mockToken.access_token);
      return res.json(mockToken);
    }
    
    // Try Keycloak authentication
    console.log(`Keycloak authentication attempt: ${username}`);
    const tokenResponse = await keycloakService.getToken(username, password);
    
    tokenStore.setToken(tokenResponse.access_token);
    return res.json(tokenResponse);
    
  } catch (error) {
    console.error("Login error:", error.message);
    
    // Handle Keycloak-specific errors
    if (error.response?.data) {
      return res.status(error.response.status || 401).json(error.response.data);
    }
    
    // Generic error
    return res.status(500).json({ 
      error: "authentication_failed",
      error_description: "Authentication service unavailable" 
    });
  }
};

/**
 * Logout endpoint - handles both mock and real tokens
 */
exports.logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ 
        error: "missing_token",
        error_description: "Refresh token is required" 
      });
    }

    // Handle mock refresh tokens
    if (refresh_token === "mock-refresh-token") {
      tokenStore.clearToken();
      return res.json({ message: "Successfully logged out" });
    }
    
    // Handle real Keycloak tokens
    await keycloakService.logoutUser(refresh_token);
    tokenStore.clearToken();
    return res.json({ message: "Successfully logged out" });
    
  } catch (error) {
    console.error("Logout error:", error.message);
    
    // Clear token locally even if Keycloak logout fails
    tokenStore.clearToken();
    return res.json({ 
      message: "Logged out locally",
      warning: "Remote logout may have failed" 
    });
  }
};

/**
 * Get user information from token
 */
exports.getUserInfo = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "missing_token",
        error_description: "Access token required in Authorization header" 
      });
    }

    const token = authHeader.split(" ")[1];
    
    // Decode JWT token
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(400).json({ 
        error: "invalid_token",
        error_description: "Token is malformed or expired" 
      });
    }
    
    const roles = decoded?.realm_access?.roles || [];
    
    // Define permissions based on roles
    const permissions = {
      isClient: roles.includes('Client'),
      isUser: roles.includes('User'), 
      isAdmin: roles.includes('Admin'),
      canViewProjects: roles.includes('Client') || roles.includes('User') || roles.includes('Admin'),
      canCreateProjects: roles.includes('Client') || roles.includes('Admin'),
      canManageUsers: roles.includes('Admin'),
    };

    try {
      // Try to get user info from Keycloak for real tokens
      const userInfo = await keycloakService.getUserInfo(token);
      
      return res.json({
        username: userInfo.preferred_username || decoded.preferred_username,
        email: userInfo.email || decoded.email,
        name: userInfo.name || decoded.name,
        roles,
        permissions
      });
      
    } catch (keycloakError) {
      // Fallback to JWT data for test users
      console.log("Using JWT data for user info");
      
      return res.json({
        username: decoded.preferred_username,
        email: decoded.email,
        name: decoded.name,
        roles,
        permissions
      });
    }
    
  } catch (error) {
    console.error("Get user info error:", error.message);
    return res.status(500).json({ 
      error: "server_error",
      error_description: "Failed to retrieve user information" 
    });
  }
};
