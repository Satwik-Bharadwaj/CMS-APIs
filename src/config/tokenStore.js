const jwt = require("jsonwebtoken");

// In-memory store for token and decoded data
let currentToken = null;
let decodedToken = null;

exports.setToken = (token) => {
  currentToken = token;
  //   console.log("Token set:", currentToken);
  if (token) {
    // Decode the token without verifying signature
    decodedToken = jwt.decode(token);
    console.log("Decoded Token (1):", decodedToken);
  } else {
    decodedToken = null;
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
    console.log("Decoded Token (2):", decodedToken);
    return decodedToken.scope || "";
  }
  return "";
};

// Get the full decoded token payload
exports.getDecodedToken = () => {
  return decodedToken;
};
