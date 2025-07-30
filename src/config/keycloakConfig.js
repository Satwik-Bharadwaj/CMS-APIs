module.exports = {
  KEYCLOAK_URL: "http://localhost:8080",
  REALM: "elva",
  CLIENTS: [
    {
      CLIENT_ID: "sbpatil",
      CLIENT_SECRET: "B7Xe3B2awgwVI99quW49yVFGmxcfSLDP",
    },
  ],
  // Test users for development (bypass Keycloak)
  TEST_USERS: [
    {
      username: "admin",
      password: "admin123",
      roles: ["Admin"]
    },
    {
      username: "user", 
      password: "user123",
      roles: ["User"]
    }
  ]
};
