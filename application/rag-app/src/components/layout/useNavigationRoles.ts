"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type NavigationRoles = {
  isAdmin: boolean;
  isUser: boolean;
};

const NO_ROLES: NavigationRoles = { isAdmin: false, isUser: false };

export default function useNavigationRoles() {
  const { data: session, isPending } = authClient.useSession();
  const [roles, setRoles] = useState(NO_ROLES);

  useEffect(() => {
    if (isPending || !session) {
      setRoles(NO_ROLES);
      return;
    }

    const controller = new AbortController();

    fetch("/api/navigation/roles", {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load navigation roles");
        return response.json() as Promise<NavigationRoles>;
      })
      .then(setRoles)
      .catch(() => {
        if (!controller.signal.aborted) setRoles(NO_ROLES);
      });

    return () => controller.abort();
  }, [isPending, session]);

  return roles;
}
