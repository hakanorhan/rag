import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth, keycloak } from "better-auth/plugins";
import Database from "better-sqlite3";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Database(process.env.DATABASE_PATH ?? "./sqlite.db"),
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: process.env.CLIENT_ID as string,
          clientSecret: process.env.CLIENT_SECRET,
          issuer: process.env.ISSUER as string,
          postLogoutRedirectURI: process.env.BASE_URL,
        }),
      ],
    }),
    nextCookies(),
  ],
});
