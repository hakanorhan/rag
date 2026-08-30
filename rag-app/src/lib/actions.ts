"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function login() {
  const result = await auth.api.signInSocial({
    headers: await headers(),
    body: {
      provider: "keycloak",
      callbackURL: "/",
    },
  });

  redirect(result.url as string);
}

export async function logout() {
  const result = await auth.api.signOut({
    headers: await headers(),
    body: {
      callbackURL: "/",
    },
  });

  redirect(result.url ?? "/");
}
