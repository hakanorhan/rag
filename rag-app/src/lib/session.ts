import "server-only";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { cache } from "react";
import { AUTH_PROVIDER, auth } from "@/lib/auth";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export const getAccessToken = cache(async (): Promise<string | null> => {
  const requestHeaders = await headers();
  const session = await getSession();

  if (!session) {
    return null;
  }

  const accounts = await auth.api.listUserAccounts({ headers: requestHeaders });
  const keycloakAccount = accounts.find(
    (account) => account.providerId === AUTH_PROVIDER,
  );

  if (!keycloakAccount) {
    return null;
  }

  try {
    const { accessToken } = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { accountId: keycloakAccount.id },
    });

    return accessToken ?? null;
  } catch (error) {
    if (
      isAPIError(error) &&
      (error.status === "UNAUTHORIZED" ||
        error.body?.code === "FAILED_TO_GET_ACCESS_TOKEN")
    ) {
      return null;
    }

    throw error;
  }
});

type RealmAccess = {
  roles?: unknown;
};

function getRealmRoles(accessToken: string | null) {
  if (!accessToken) return new Set<string>();

  try {
    const payload: unknown = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString("utf8"),
    );
    if (!payload || typeof payload !== "object") return new Set<string>();
    const realmAccess = (payload as { realm_access?: RealmAccess })
      .realm_access;
    if (!Array.isArray(realmAccess?.roles)) return new Set<string>();
    return new Set(
      realmAccess.roles.filter(
        (role): role is string => typeof role === "string",
      ),
    );
  } catch {
    return new Set<string>();
  }
}

export const getUserNavigation = cache(async () => {
  const session = await getSession();
  if (!session) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      isUser: false,
      userName: null,
    };
  }

  const roles = getRealmRoles(await getAccessToken().catch(() => null));
  return {
    isAuthenticated: true,
    isAdmin: roles.has("admin"),
    isUser: roles.has("user"),
    userName: session.user.name || session.user.email,
  };
});

export function getLoginUrl(returnTo: string) {
  return `/api/login?${new URLSearchParams({ returnTo })}`;
}
