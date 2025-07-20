const tokenStore = require("../config/tokenStore");

exports.tokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    // Set the token in our token store
    tokenStore.setToken(token);
  }

  next();
};
