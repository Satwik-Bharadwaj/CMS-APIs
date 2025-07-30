const jwt = require("jsonwebtoken");
const { authLogger } = require("./logger");

// In-memory store for token and decoded data
let currentToken = null;
let decodedToken = null;

exports.setToken = (token) => {
  currentToken = token;
  if (token) {
    // Decode the token without verifying signature
    decodedToken = jwt.decode(token);
    authLogger.debug("Token decoded and stored", { 
      userId: decodedToken?.sub,
      username: decodedToken?.preferred_username,
      roles: decodedToken?.realm_access?.roles 
    });
  } else {
    decodedToken = null;
    authLogger.debug("Token cleared");
  }
};

exports.getToken = () => {
  return currentToken;
};

exports.clearToken = () => {
  currentToken = null;
  decodedToken = null;
};

// Get user roles from realm_access
exports.getUserRoles = () => {
  if (decodedToken && decodedToken.realm_access) {
    return decodedToken.realm_access.roles || [];
  }
  return [];
};

// Get user scope
exports.getScope = () => {
  if (decodedToken) {
    authLogger.debug("Retrieving token scope", { scope: decodedToken.scope });
    return decodedToken.scope || "";
  }
  return "";
};

// Get the full decoded token payload
exports.getDecodedToken = () => {
  return decodedToken;
};
