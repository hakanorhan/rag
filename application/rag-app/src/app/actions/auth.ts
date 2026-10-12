"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadAuthConfig } from "@/lib/auth";
import { getLoginUrl } from "@/lib/loginUrl";

export async function login() {
  const returnTo = (await headers()).get("referer") ?? "/";
  redirect(getLoginUrl(returnTo));
}

export async function logout() {
  const { auth } = await loadAuthConfig();
  const result = await auth.api.signOut({
    headers: await headers(),
    body: { callbackURL: "/" },
  });
  redirect(result.url ?? "/");
}
