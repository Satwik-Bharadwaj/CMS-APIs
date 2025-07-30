const axios = require("axios");
const { CLIENTS, KEYCLOAK_URL, REALM } = require("../config/keycloakConfig.js");
const tokenStore = require("../config/tokenStore.js");
const { authLogger } = require("../config/logger.js");

/**
 * Get access token from Keycloak using username/password
 */
exports.getToken = async (username, password, clientId = null) => {
  try {
    const clientConfig = CLIENTS.find((c) => c.CLIENT_ID === clientId) || CLIENTS[0];
    
    const params = new URLSearchParams();
    params.append("client_id", clientConfig.CLIENT_ID);
    params.append("client_secret", clientConfig.CLIENT_SECRET);
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);

    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
      params,
      { 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      }
    );

    if (response.status !== 200) {
      throw {
        response: {
          status: response.status,
          data: response.data
        }
      };
    }

    const tokenData = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      refresh_expires_in: response.data.refresh_expires_in,
      token_type: response.data.token_type || "bearer"
    };

    tokenStore.setToken(tokenData.access_token);
    return tokenData;
    
  } catch (error) {
    authLogger.error("Keycloak token error:", { 
      error: error.message,
      username: username 
    });
    return null;
  }
};

/**
 * Get current stored token
 */
exports.getCurrentToken = () => {
  return tokenStore.getToken();
};

/**
 * Logout user by invalidating refresh token
 */
exports.logoutUser = async (refresh_token, clientId = null) => {
  try {
    const clientConfig = CLIENTS.find((c) => c.CLIENT_ID === clientId) || CLIENTS[0];
    
    const params = new URLSearchParams();
    params.append("client_id", clientConfig.CLIENT_ID);
    params.append("client_secret", clientConfig.CLIENT_SECRET);
    params.append("refresh_token", refresh_token);

    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
      params,
      { 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: (status) => status < 500
      }
    );

    tokenStore.clearToken();
    
    if (response.status !== 204) {
      throw new Error(`Logout failed with status ${response.status}`);
    }
    
    return { message: "Logout successful" };
    
  } catch (error) {
    authLogger.error("Keycloak logout error:", { 
      error: error.message 
    });
    throw error;
  }
};

/**
 * Get user information from Keycloak using access token
 */
exports.getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(
      `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        validateStatus: (status) => status < 500
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`UserInfo request failed with status ${response.status}`);
    }
    
    return response.data;
    
  } catch (error) {
    authLogger.error("Keycloak userinfo error:", { 
      error: error.message 
    });
    throw error;
  }
};
