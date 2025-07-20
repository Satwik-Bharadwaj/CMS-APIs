const axios = require("axios");
const { CLIENTS, KEYCLOAK_URL, REALM } = require("../config/keycloakConfig.js");
const tokenStore = require("../config/tokenStore");

exports.getToken = async (username, password, clientId = null) => {
  const clientConfig =
    CLIENTS.find((c) => c.CLIENT_ID === clientId) || CLIENTS[0];
  const params = new URLSearchParams();
  params.append("client_id", clientConfig.CLIENT_ID);
  params.append("client_secret", clientConfig.CLIENT_SECRET);
  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);

  const response = await axios.post(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const tokenData = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };

  // Store the token globally
  tokenStore.setToken(tokenData.access_token);

  return tokenData;
};

// Add a new helper function to get the current token
exports.getCurrentToken = () => {
  return tokenStore.getToken();
};

exports.logoutUser = async (refresh_token, clientId = null) => {
  const clientConfig =
    CLIENTS.find((c) => c.CLIENT_ID === clientId) || CLIENTS[0];
  const params = new URLSearchParams();
  params.append("client_id", clientConfig.CLIENT_ID);
  params.append("client_secret", clientConfig.CLIENT_SECRET);
  params.append("refresh_token", refresh_token);

  const response = await axios.post(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  tokenStore.clearToken();
  return response.data;
};

exports.getUserInfo = async (accessToken) => {
  const response = await axios.get(
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("UserInfo Response:", response.data);
  return response.data;
};
