"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function login() {
  const returnTo = (await headers()).get("referer") ?? "/";
  redirect(`/api/login?${new URLSearchParams({ returnTo })}`);
}

export async function logout() {
  const result = await auth.api.signOut({
    headers: await headers(),
    body: { callbackURL: "/" },
  });
  redirect(result.url ?? "/");
}
