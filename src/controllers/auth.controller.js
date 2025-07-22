const keycloakService = require("../services/keycloakService.js");
const jwt = require("jsonwebtoken");
const tokenStore = require("../config/tokenStore.js");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const tokenResponse = await keycloakService.getToken(username, password);
    console.log("Login successful - Token Response:");
    console.log("Access Token:", tokenResponse.access_token);
    console.log("Refresh Token:", tokenResponse.refresh_token);
    
    // Store the token
    tokenStore.setToken(tokenResponse.access_token);
    res.json(tokenResponse);
  } catch (err) {
    console.error("Login error:", err);
    const errorData = err.response?.data || { error: "Unknown error" };
    res.status(err.response?.status || 500).json(errorData);
  }
};

exports.logout = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const response = await keycloakService.logoutUser(refresh_token);
    res.json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ error: "Logout failed", message: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Access token required in Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  
  console.log("Raw JWT Token:", token);

  try {
    const decoded = jwt.decode(token);
    console.log("Decoded JWT Token:", decoded);
    if (!decoded || !decoded.sub) {
      return res.status(400).json({ error: "Invalid token" });
    }
    
    const roles = decoded?.realm_access?.roles || [];
    const scopes = decoded?.scope?.split(" ") || [];
    
    try {
      // Try to get user info from Keycloak
      const userInfo = await keycloakService.getUserInfo(token);
      console.log("UserInfo from Keycloak:", userInfo);
      
      // Add role-based permissions
      const permissions = {
        isClient: roles.includes('Client'),
        isUser: roles.includes('User'), 
        isAdmin: roles.includes('Admin'),
        // Add more role checks as needed
        canViewProjects: roles.includes('Client') || roles.includes('User') || roles.includes('Admin'),
        canCreateProjects: roles.includes('Client') || roles.includes('Admin'),
        canManageUsers: roles.includes('Admin'),
      };

      console.log("User logged in:", {
        username: userInfo.preferred_username,
        roles: roles,
        permissions: permissions
      });
      
      res.json({
        ...userInfo,
        roles,
        scope: scopes,
        permissions,
        username: userInfo.preferred_username,
        id: decoded.sub,
      });
    } catch (keycloakError) {
      // If Keycloak userinfo fails (403, etc.), fall back to JWT data
      console.log("Keycloak userinfo failed, using JWT data:", keycloakError.message);
      
      const userInfo = {
        id: decoded.sub,
        sub: decoded.sub,
        email: decoded.email,
        email_verified: decoded.email_verified,
        name: decoded.name || decoded.preferred_username,
        preferred_username: decoded.preferred_username,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        username: decoded.preferred_username,
        client_id: decoded.azp,
        // Add role-based permissions
        permissions: {
          isClient: roles.includes('Client'),
          isUser: roles.includes('User'), 
          isAdmin: roles.includes('Admin'),
          // Add more role checks as needed
          canViewProjects: roles.includes('Client') || roles.includes('User') || roles.includes('Admin'),
          canCreateProjects: roles.includes('Client') || roles.includes('Admin'),
          canManageUsers: roles.includes('Admin'),
        }
      };

      console.log("User logged in:", {
        username: userInfo.username,
        roles: roles,
        permissions: userInfo.permissions
      });
      
      res.json({
        ...userInfo,
        roles,
        scope: scopes,
      });
    }
  } catch (error) {
    console.error("UserInfo error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch user info", message: error.message });
  }
};
