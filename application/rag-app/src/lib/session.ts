import "server-only";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { AUTH_PROVIDER, auth } from "@/lib/auth";

export async function getSession() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return null;
  }

  const accounts = await auth.api.listUserAccounts({ headers: requestHeaders });
  const keycloakAccount = accounts.find(
    (account) => account.providerId === AUTH_PROVIDER,
  );

  if (!keycloakAccount) {
    return { ...session, accessToken: null };
  }

  try {
    const { accessToken } = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { accountId: keycloakAccount.id },
    });

    return { ...session, accessToken: accessToken ?? null };
  } catch (error) {
    if (
      isAPIError(error) &&
      (error.status === "UNAUTHORIZED" ||
        error.body?.code === "FAILED_TO_GET_ACCESS_TOKEN")
    ) {
      return { ...session, accessToken: null };
    }

    throw error;
  }
}

type RealmAccess = {
  roles?: unknown;
};

export function getUserRoles(accessToken: string | null | undefined) {
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
