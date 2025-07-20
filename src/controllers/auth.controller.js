const keycloakService = require("../services/keycloakService.js");
const jwt = require("jsonwebtoken");
const tokenStore = require("../config/tokenStore");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const tokenResponse = await keycloakService.getToken(username, password);
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

  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const roles = decoded?.realm_access?.roles || [];
    const scopes = decoded?.scope?.split(" ") || [];
    const userInfo = await keycloakService.getUserInfo(token);
    console.log("UserInfo:", userInfo);
    res.json({
      ...userInfo,
      roles,
      scope: scopes,
    });
  } catch (error) {
    console.error("UserInfo error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch user info", message: error.message });
  }
};
