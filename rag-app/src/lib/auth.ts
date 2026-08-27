import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { genericOAuth, keycloak } from "better-auth/plugins";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: "rag-next",
          clientSecret: "FteWqr4hnG1gi0dCeUVY8wv6nOJ8xUW9nTtCWcqGtga1LUQ9TpCKYa272dw03bQL8EoWPaV9Qm4GOVDwf5WSQI",
          issuer: "http://auth.localhost/realms/rag",
          postLogoutRedirectURI: "http://localhost",
        }),
      ],
    }),
  ],
});