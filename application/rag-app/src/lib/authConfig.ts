import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import Database from "better-sqlite3";

const issuer = process.env.ISSUER ?? "http://auth.localhost/realms/rag";
const internalRealmUrl = process.env.KEYCLOAK_INTERNAL_REALM_URI ?? issuer;
const baseURL = process.env.BETTER_AUTH_URL;
const database = new Database(process.env.DATABASE_PATH ?? "./sqlite.db");

database.pragma("journal_mode = WAL");
database.pragma("synchronous = FULL");
database.pragma("foreign_keys = ON");

export const AUTH_PROVIDER = "keycloak";

export function getAppUrl(fallback: string) {
  return new URL(baseURL ?? fallback);
}

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database,
  disabledPaths: ["/refresh-token"],
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: AUTH_PROVIDER,
          accountIssuer: issuer,
          clientId: process.env.CLIENT_ID as string,
          clientSecret: process.env.CLIENT_SECRET,
          discoveryUrl: `${internalRealmUrl}/.well-known/openid-configuration`,
          authorizationUrl: `${issuer}/protocol/openid-connect/auth`,
          tokenUrl: `${internalRealmUrl}/protocol/openid-connect/token`,
          userInfoUrl: `${internalRealmUrl}/protocol/openid-connect/userinfo`,
          endSessionEndpoint: `${issuer}/protocol/openid-connect/logout`,
          requireIdTokenVerification: true,
          scopes: ["openid", "profile", "email"],
          postLogoutRedirectURI: process.env.BASE_URL,
        },
      ],
    }),
    nextCookies(),
  ],
});
