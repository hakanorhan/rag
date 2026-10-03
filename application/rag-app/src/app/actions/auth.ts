"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadAuthConfig } from "@/lib/auth";
import { getChatSession } from "@/lib/chatSession";

export async function login() {
  const returnTo = (await headers()).get("referer") ?? "/";
  redirect(`/api/login?${new URLSearchParams({ returnTo })}`);
}

export async function logout() {
  const { auth } = await loadAuthConfig();
  const result = await auth.api.signOut({
    headers: await headers(),
    body: { callbackURL: "/" },
  });
  (await getChatSession()).destroy();
  redirect(result.url ?? "/");
}
